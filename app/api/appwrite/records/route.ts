import { NextRequest, NextResponse } from "next/server";
import { Client, TablesDB, Databases, Storage } from "node-appwrite";
import fs from "node:fs";
import path from "node:path";

function getAppwriteClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

  if (!apiKey) {
    throw new Error("Missing APPWRITE_API_KEY in environment");
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const tablesDB = new TablesDB(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  return { client, tablesDB, databases, storage, databaseId: process.env.APPWRITE_DATABASE_ID || "aethos_db" };
}

// GET /api/appwrite/records?table=reports
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const { tablesDB, storage, databaseId } = getAppwriteClient();

    if (table) {
      if (table === "media") {
        try {
          const storageRes = await storage.listFiles("aethos_pdfs");
          const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
          const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

          const files = storageRes.files.map((f) => ({
            id: f.$id,
            name: f.name,
            size: f.sizeOriginal,
            type: f.mimeType || "application/octet-stream",
            url: `${endpoint}/storage/buckets/aethos_pdfs/files/${f.$id}/view?project=${projectId}`,
            uploadedAt: new Date(f.$createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            category: f.name.endsWith(".html") ? "Report HTML" : f.name.endsWith(".pdf") ? "Research PDF" : "General",
          }));
          return NextResponse.json({ success: true, table: "media", total: storageRes.total, rows: files, files });
        } catch (sErr) {
          console.warn("Could not list files from Appwrite Storage:", sErr);
          return NextResponse.json({ success: true, table: "media", total: 0, rows: [], files: [] });
        }
      }

      const res = await tablesDB.listRows(databaseId, table);
      if (table === "ideas") {
        const rowsWithHtml = res.rows.map((r: any) => ({
          ...r,
          htmlUrl: r.htmlUrl || (r.slug ? `/${r.slug}.html` : (r.$id ? `/${r.$id}.html` : `/${r.ticker?.toLowerCase()}.html`)),
        }));
        return NextResponse.json({ success: true, table, total: res.total, rows: rowsWithHtml });
      }
      return NextResponse.json({ success: true, table, total: res.total, rows: res.rows });
    }

    // Return overview of all tables
    const allTables = ["reports", "ideas", "ipos", "journal", "users_meta"];
    const results: Record<string, unknown> = {};

    for (const t of allTables) {
      try {
        const res = await tablesDB.listRows(databaseId, t);
        if (t === "ideas") {
          results[t] = res.rows.map((r: any) => ({
            ...r,
            htmlUrl: r.htmlUrl || (r.slug ? `/${r.slug}.html` : (r.$id ? `/${r.$id}.html` : `/${r.ticker?.toLowerCase()}.html`)),
          }));
        } else {
          results[t] = res.rows;
        }
      } catch (err) {
        console.warn(`Could not list rows for table ${t}:`, err);
        results[t] = [];
      }
    }

    // Also include live files from Appwrite Storage bucket
    try {
      const storageRes = await storage.listFiles("aethos_pdfs");
      const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

      results["media"] = storageRes.files.map((f) => ({
        id: f.$id,
        name: f.name,
        size: f.sizeOriginal,
        type: f.mimeType || "application/octet-stream",
        url: `${endpoint}/storage/buckets/aethos_pdfs/files/${f.$id}/view?project=${projectId}`,
        uploadedAt: new Date(f.$createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        category: f.name.endsWith(".html") ? "Report HTML" : f.name.endsWith(".pdf") ? "Research PDF" : "General",
      }));
    } catch (storageErr) {
      console.warn("Could not list files from Appwrite storage:", storageErr);
      results["media"] = [];
    }

    return NextResponse.json({ success: true, databaseId, data: results });
  } catch (error: unknown) {
    console.error("Error fetching from Appwrite:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

const TABLE_SCHEMAS: Record<string, string[]> = {
  reports: [
    "slug",
    "title",
    "tag",
    "tabCategory",
    "deck",
    "readTime",
    "date",
    "free",
    "className",
    "sections",
    "pdfUrl",
    "imageUrl",
    "researchType",
    "sector",
    "company",
    "isNew",
    "htmlUrl",
  ],
  ideas: [
    "ticker",
    "company",
    "sector",
    "mcap",
    "sharedPrice",
    "currentPrice",
    "sharedDate",
    "pdfUrl",
    "htmlUrl",
    "thesis",
  ],
  ipos: [
    "slug",
    "company",
    "sector",
    "period",
    "price",
    "type",
    "deepDive",
    "deck",
    "issueSize",
    "lotSize",
    "listing",
    "pdfUrl",
    "htmlUrl",
    "sections",
  ],
  journal: [
    "slug",
    "category",
    "title",
    "date",
    "deck",
    "className",
    "sections",
  ],
  users_meta: [
    "userId",
    "email",
    "name",
    "role",
    "status",
    "joinedAt",
  ],
};

function toSafeRowId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^[^a-zA-Z0-9]+/, "") || "doc";
  if (cleaned.length <= 36) return cleaned;
  const hash = Math.abs(id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(36);
  return `${cleaned.slice(0, 36 - hash.length - 1)}-${hash}`.slice(0, 36);
}

// POST /api/appwrite/records
// Body: { table: "reports", id: "my-slug", data: { ... } }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, id, data } = body;

    if (!table || !id || !data) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: table, id, data" },
        { status: 400 }
      );
    }

    const { tablesDB, databases, storage, databaseId } = getAppwriteClient();

    // Clean raw payload
    const rawPayload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        if (k === "sections" && typeof v !== "string") {
          rawPayload[k] = JSON.stringify(v);
        } else {
          rawPayload[k] = v;
        }
      }
    }

    const rowId = toSafeRowId(id);
    const slug = (typeof rawPayload.slug === "string" && rawPayload.slug.trim()) ? rawPayload.slug.trim() : id;

    // Handle HTML content for reports or documents - Persist exclusively to Appwrite Storage
    if (typeof rawPayload.htmlContent === "string" && rawPayload.htmlContent.trim()) {
      const fullHtml = rawPayload.htmlContent;
      try {
        const fileId = toSafeRowId(`${slug}-html`);
        const { InputFile } = await import("node-appwrite/file");
        try {
          await storage.deleteFile("aethos_pdfs", fileId);
        } catch {
          // ignore if doesn't exist
        }
        await storage.createFile("aethos_pdfs", fileId, InputFile.fromBuffer(Buffer.from(fullHtml, "utf-8"), `${slug}.html`));
        const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
        const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
        rawPayload.htmlUrl = `${endpoint}/storage/buckets/aethos_pdfs/files/${fileId}/view?project=${projectId}`;
      } catch (storageErr) {
        console.warn("Upload to Appwrite Storage failed:", storageErr);
      }
    }

    // Filter strictly to allowed table attributes to prevent Appwrite schema mismatch rejections
    const allowedKeys = TABLE_SCHEMAS[table];
    const payload: Record<string, unknown> = {};

    if (allowedKeys) {
      for (const key of allowedKeys) {
        if (rawPayload[key] !== undefined) {
          payload[key] = rawPayload[key];
        }
      }
    } else {
      Object.assign(payload, rawPayload);
    }

    // Default required fields for table 'reports'
    if (table === "reports") {
      payload.slug = payload.slug || slug;
      payload.title = payload.title || slug;
      payload.tag = payload.tag || "RESEARCH NOTE";
      payload.readTime = payload.readTime || "10 min read";
      payload.date = payload.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      payload.free = Boolean(payload.free);
      payload.isNew = Boolean(payload.isNew);
      if (typeof payload.deck === "string" && payload.deck.length > 2000) {
        payload.deck = payload.deck.slice(0, 2000);
      }
      if (typeof payload.sections === "string" && payload.sections.length > 50000) {
        payload.sections = payload.sections.slice(0, 50000);
      }
    }

    // Default required fields for table 'ideas'
    if (table === "ideas") {
      payload.ticker = payload.ticker || rawPayload.ticker || "";
      payload.company = payload.company || rawPayload.company || "";
      payload.sector = payload.sector || rawPayload.sector || "Auto components";
      payload.mcap = payload.mcap || rawPayload.mcap || "";
      payload.sharedPrice = Number(payload.sharedPrice ?? rawPayload.sharedPrice ?? rawPayload.refPrice ?? 0);
      payload.currentPrice = Number(payload.currentPrice ?? rawPayload.currentPrice ?? rawPayload.latestPrice ?? 0);
      payload.sharedDate = payload.sharedDate || rawPayload.sharedDate || rawPayload.published || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      payload.htmlUrl = payload.htmlUrl || rawPayload.htmlUrl || `/${slug}.html`;
      payload.thesis = payload.thesis || rawPayload.thesis || rawPayload.studying || "";
    }

    const activePayload = { ...payload };

    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        try {
          const updated = await tablesDB.updateRow(databaseId, table, rowId, activePayload);
          return NextResponse.json({ success: true, action: "updated", row: updated });
        } catch (updateErr: any) {
          const updateMsg = updateErr?.message || String(updateErr);
          if (updateMsg.includes("Unknown attribute")) {
            throw updateErr;
          }
          const created = await tablesDB.createRow(databaseId, table, rowId, activePayload);
          return NextResponse.json({ success: true, action: "created", row: created });
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const match = errMsg.match(/Unknown attribute: ["'\\]*([^"'\s\\/]+)["'\\]*/i);
        if (match && match[1] && activePayload[match[1]] !== undefined) {
          const unknownAttr = match[1];
          delete activePayload[unknownAttr];
          // Try to create the missing attribute in Appwrite database for future writes
          try {
            databases.createStringAttribute(databaseId, table, unknownAttr, 1000, false).catch(() => {});
          } catch {}
          continue;
        }

        console.error(`Error saving to Appwrite table [${table}] row [${rowId}]:`, err);
        return NextResponse.json(
          { success: false, error: errMsg },
          { status: 400 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Error saving to Appwrite DB:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/appwrite/records?table=reports&id=my-slug
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const id = searchParams.get("id");

    if (!table || !id) {
      return NextResponse.json(
        { success: false, error: "Missing required query params: table, id" },
        { status: 400 }
      );
    }

    const { tablesDB, storage, databaseId } = getAppwriteClient();
    const rowId = toSafeRowId(id);

    // 1. Try to read existing row to extract any stored file URLs before deletion
    let existingRow: Record<string, any> | null = null;
    if (table !== "media") {
      try {
        existingRow = await tablesDB.getRow(databaseId, table, rowId);
      } catch {
        // row might not exist in database
      }
    }

    // 2. Delete the row from TablesDB
    if (table !== "media") {
      try {
        await tablesDB.deleteRow(databaseId, table, rowId);
      } catch (dbErr) {
        console.warn(`Could not delete row ${rowId} from table ${table}:`, dbErr);
      }
    }

    // 3. Delete associated files from Appwrite Storage (aethos_pdfs bucket)
    const paramHtmlUrl = searchParams.get("htmlUrl");
    const paramPdfUrl = searchParams.get("pdfUrl");
    const paramSlug = searchParams.get("slug");

    const slug = existingRow?.slug || paramSlug || id;
    const storageFileIds = new Set<string>();

    if (table === "media") {
      storageFileIds.add(id);
    } else {
      // Research report or document HTML file IDs
      storageFileIds.add(toSafeRowId(`${slug}-html`));
      storageFileIds.add(toSafeRowId(`${id}-html`));
      storageFileIds.add(toSafeRowId(slug));
      storageFileIds.add(toSafeRowId(id));

      // Check if htmlUrl has a file ID
      const htmlUrls = [existingRow?.htmlUrl, paramHtmlUrl].filter(Boolean);
      for (const hUrl of htmlUrls) {
        if (typeof hUrl === "string") {
          const match = hUrl.match(/files\/([^/?]+)/);
          if (match && match[1]) {
            storageFileIds.add(match[1]);
          }
        }
      }

      // Check if pdfUrl has a file ID
      const pdfUrls = [existingRow?.pdfUrl, paramPdfUrl].filter(Boolean);
      for (const pUrl of pdfUrls) {
        if (typeof pUrl === "string") {
          const match = pUrl.match(/files\/([^/?]+)/);
          if (match && match[1]) {
            storageFileIds.add(match[1]);
          }
        }
      }

      // Scan bucket files to find matching files by name
      try {
        const listRes = await storage.listFiles("aethos_pdfs");
        if (listRes && Array.isArray(listRes.files)) {
          const targetSlug = slug.toLowerCase();
          const targetId = id.toLowerCase();
          for (const file of listRes.files) {
            const fn = file.name.toLowerCase();
            if (
              fn === `${targetSlug}.html` ||
              fn === `${targetId}.html` ||
              fn === `${targetSlug}.pdf` ||
              fn === `${targetId}.pdf` ||
              file.$id === targetSlug ||
              file.$id === targetId ||
              file.$id === `${targetSlug}-html` ||
              file.$id === `${targetId}-html`
            ) {
              storageFileIds.add(file.$id);
            }
          }
        }
      } catch (listErr) {
        console.warn("Could not list files for deletion scan:", listErr);
      }
    }

    for (const fileId of storageFileIds) {
      try {
        await storage.deleteFile("aethos_pdfs", fileId);
      } catch {
        // Ignore if file doesn't exist under this candidate name
      }
    }

    // 4. Delete local HTML file from public directory
    try {
      const publicDir = path.join(process.cwd(), "public");
      const filesToDelete = new Set<string>();

      filesToDelete.add(path.join(publicDir, `${slug}.html`));
      filesToDelete.add(path.join(publicDir, `${id}.html`));

      if (existingRow?.htmlUrl && typeof existingRow.htmlUrl === "string") {
        const rawPath = existingRow.htmlUrl.split("?")[0];
        const baseName = path.basename(rawPath);
        if (baseName && baseName.endsWith(".html")) {
          filesToDelete.add(path.join(publicDir, baseName));
        }
      }

      for (const filePath of filesToDelete) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (fsErr) {
      console.warn("Error cleaning up local files on delete:", fsErr);
    }

    return NextResponse.json({ success: true, action: "deleted", table, id, rowId });
  } catch (error: unknown) {
    console.error("Error deleting from Appwrite DB:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
