import { NextRequest, NextResponse } from "next/server";
import { Client, TablesDB, Databases, Storage, Query } from "node-appwrite";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getAppwriteClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

  if (!apiKey) {
    return null;
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
    const appwriteObj = getAppwriteClient();

    if (!appwriteObj) {
      return NextResponse.json({
        success: true,
        databaseId: "aethos_db",
        data: { reports: [], ideas: [], ipos: [], journal: [], users_meta: [], media: [] },
        note: "APPWRITE_API_KEY environment variable is not configured",
      });
    }

    const { tablesDB, storage, databaseId } = appwriteObj;

    if (table) {
      if (searchParams.get("action") === "sync-ipos" || table === "sync-ipos") {
        try {
          const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
          const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
          const functionId = process.env.APPWRITE_FUNCTION_ID_GET_IPOS || process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_GET_IPOS || "get-ipos";

          let fnExecuted = false;
          let fnOutput: any = null;

          // 1. Try triggering deployed Appwrite Cloud Function via Functions SDK
          try {
            const { Functions } = await import("node-appwrite");
            const functions = new Functions(appwriteObj.client);
            const execution = await functions.createExecution(functionId, "", false);
            if (execution.status === "completed" && execution.responseBody) {
              fnExecuted = true;
              fnOutput = JSON.parse(execution.responseBody);
            }
          } catch (fnErr) {
            console.warn("Appwrite Functions SDK execution skipped/failed:", fnErr);
          }

          // 2. Fetch live market data (Try Upstox API first, fallback to Indian API)
          let fetchedListings: any[] = [];
          if (fnOutput?.data && Array.isArray(fnOutput.data)) {
            fetchedListings = fnOutput.data;
          } else {
            const upstoxToken = process.env.UPSTOX_ACCESS_TOKEN;
            if (upstoxToken) {
              try {
                const apiRes = await fetch("https://api.upstox.com/v2/ipos", {
                  headers: {
                    "Authorization": `Bearer ${upstoxToken}`,
                    "Accept": "application/json",
                  },
                  cache: "no-store",
                });
                if (apiRes.ok) {
                  const json = await apiRes.json();
                  const rawList = Array.isArray(json?.data) ? json.data : [];
                  for (const item of rawList) {
                    let rhpUrl = null;
                    let lotSize = item.lot_size;
                    let listingDate = null;

                    if (item.id) {
                      try {
                        const detailRes = await fetch(`https://api.upstox.com/v2/ipos/${item.id}`, {
                          headers: {
                            "Authorization": `Bearer ${upstoxToken}`,
                            "Accept": "application/json",
                          },
                          cache: "no-store",
                        });
                        if (detailRes.ok) {
                          const detailJson = await detailRes.json();
                          const d = detailJson?.data || {};
                          rhpUrl = d.rhp_url || d.drhp_url || null;
                          lotSize = d.lot_size || lotSize;
                          listingDate = d.timeline?.listing_date || null;
                        }
                      } catch { }
                    }

                    let normalizedStatus = "active";
                    if (item.status === "open") normalizedStatus = "active";
                    else if (item.status === "upcoming" || item.status === "pre_apply") normalizedStatus = "pre_apply";
                    else if (item.status === "listed") normalizedStatus = "listed";
                    else if (item.status === "closed") normalizedStatus = "closed";

                    fetchedListings.push({
                      symbol: item.symbol || item.id,
                      name: item.name ? item.name.replace(/\s+IPO$/i, "").trim() : item.symbol,
                      status: normalizedStatus,
                      is_sme: item.issue_type === "sme",
                      min_price: item.minimum_price,
                      max_price: item.maximum_price,
                      issue_price: item.maximum_price || item.minimum_price,
                      bidding_start_date: item.bidding_start_date,
                      bidding_end_date: item.bidding_end_date,
                      listing_date: listingDate,
                      lot_size: lotSize,
                      total_subscription_rate: item.total_subscription,
                      document_url: rhpUrl,
                    });
                  }
                }
              } catch (uErr) {
                console.warn("Upstox fetch error:", uErr);
              }
            }
          }

          // Fetch existing rows from Appwrite DB table "ipos" & permanent "ipo_deep_dives"
          const existingRes = await tablesDB.listRows(databaseId, "ipos").catch(() => ({ rows: [] }));
          const existingRows = existingRes.rows || [];
          const existingMap = new Map<string, any>();
          existingRows.forEach((r: any) => {
            if (r.slug) existingMap.set(r.slug.toLowerCase(), r);
          });

          const deepDivesRes = await tablesDB.listRows(databaseId, "ipo_deep_dives").catch(() => ({ rows: [] }));
          const deepDivesList = deepDivesRes.rows || [];
          const deepDiveMap = new Map<string, any>();
          deepDivesList.forEach((dd: any) => {
            if (dd.slug) deepDiveMap.set(dd.slug.toLowerCase(), dd);
            if (dd.company) deepDiveMap.set(dd.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"), dd);
            if (dd.$id) deepDiveMap.set(dd.$id.toLowerCase(), dd);
          });

          let addedCount = 0;
          let updatedCount = 0;

          for (const item of fetchedListings) {
            const rawBase = (item.action_slug || item.symbol || item.name || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

            let monthYearSuffix = "";
            const dateRef = item.bidding_start_date || item.listing_date;
            if (dateRef) {
              const parsedDate = new Date(dateRef);
              if (!isNaN(parsedDate.getTime())) {
                const m = parsedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toLowerCase().replace(/[^a-z0-9]+/g, "-");
                monthYearSuffix = `-ipo-${m}`;
              }
            }
            if (!monthYearSuffix) {
              const currentM = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toLowerCase().replace(/[^a-z0-9]+/g, "-");
              monthYearSuffix = `-ipo-${currentM}`;
            }

            const slug = rawBase.includes("-ipo-") ? rawBase : `${rawBase}${monthYearSuffix}`;

            if (!slug) continue;

            const existing = existingMap.get(slug);

            // Cross-check ipo_deep_dives by unique identifier
            const archivedDeepDive = deepDiveMap.get(slug.toLowerCase()) ||
              deepDiveMap.get(rawBase.toLowerCase()) ||
              deepDiveMap.get(item.symbol?.toLowerCase());

            const pdfUrl = existing?.pdfUrl || archivedDeepDive?.pdfUrl || "";
            const deck = existing?.deck || archivedDeepDive?.deck || item.additional_text || "";

            const hasReport = Boolean(
              pdfUrl ||
              existing?.hasReport ||
              existing?.deepDive ||
              archivedDeepDive ||
              item.has_aethos_notes
            );
            const rowData = {
              slug,
              company: item.name || item.symbol,
              sector: item.sector || (item.is_sme ? "SME Segment" : "Mainboard Segment"),
              period: item.bidding_start_date ? `${item.bidding_start_date} - ${item.bidding_end_date || "TBA"}` : "Schedule TBA",
              price: item.issue_price ? `₹${item.issue_price}` : item.min_price ? `₹${item.min_price} - ₹${item.max_price}` : "TBA",
              type: item.is_sme ? "SME" : "Mainboard",
              deepDive: hasReport,
              hasReport: hasReport,
              deck,
              issueSize: item.total_subscription_rate ? `${item.total_subscription_rate}x Subscribed` : existing?.issueSize || "—",
              lotSize: item.lot_size ? `${item.lot_size} shares` : existing?.lotSize || "—",
              listing: item.listing_date || existing?.listing || "TBA",
              externalId: String(item.symbol || slug),
              status: String(item.status || "active"),
              isSme: Boolean(item.is_sme),
              additionalText: item.additional_text ? String(item.additional_text).slice(0, 500) : "",
              pdfUrl,
              documentUrl: item.document_url || existing?.documentUrl || "",
              lastSyncedAt: new Date().toISOString(),
              closedAt: item.bidding_end_date ? new Date(item.bidding_end_date).toISOString() : undefined,
            };

            const rowId = slug.length <= 36 ? slug : slug.slice(0, 36);

            try {
              if (existing) {
                await tablesDB.updateRow(databaseId, "ipos", rowId, rowData);
                updatedCount++;
              } else {
                await tablesDB.createRow(databaseId, "ipos", rowId, rowData);
                addedCount++;
              }
            } catch (wErr) {
              console.warn(`Could not sync IPO document ${slug}:`, wErr);
            }
          }

          // Fetch final updated rows from Appwrite DB table ipos
          const finalRes = await tablesDB.listRows(databaseId, "ipos");
          return NextResponse.json({
            success: true,
            action: "sync-ipos",
            addedCount,
            updatedCount,
            totalFetched: fetchedListings.length,
            rows: finalRes.rows,
          });
        } catch (syncErr) {
          console.error("IPO server sync error:", syncErr);
          return NextResponse.json(
            { success: false, error: syncErr instanceof Error ? syncErr.message : String(syncErr) },
            { status: 500 }
          );
        }
      }
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

      const res = await tablesDB.listRows(databaseId, table, [Query.limit(200)]);
      if (table === "ideas") {
        const rowsWithHtml = res.rows.map((r: any) => ({
          ...r,
          htmlUrl: r.htmlUrl || (r.slug ? `/${r.slug}.html` : (r.$id ? `/${r.$id}.html` : `/${r.ticker?.toLowerCase()}.html`)),
        }));
        return NextResponse.json({ success: true, table, total: res.total, rows: rowsWithHtml });
      }

      if (table === "ipos") {
        let liveApiIpos: any[] = [];

        // Merge and normalize Appwrite DB ipos with live API dataset
        const dbRows = (res.rows || []).map((r: any) => {
          let minPrice: number | null = null;
          let maxPrice: number | null = null;
          if (r.price) {
            const nums = r.price.replace(/[^0-9.-]+/g, " ").trim().split(/\s+/).map(Number).filter((n: number) => !isNaN(n) && n > 0);
            if (nums.length >= 2) {
              minPrice = nums[0];
              maxPrice = nums[1];
            } else if (nums.length === 1) {
              minPrice = nums[0];
              maxPrice = nums[0];
            }
          }

          let biddingStart: string | null = null;
          let biddingEnd: string | null = null;
          if (r.period && r.period.includes(" - ")) {
            const parts = r.period.split(" - ").map((p: string) => p.trim());
            biddingStart = parts[0] || null;
            biddingEnd = parts[1] || null;
          } else if (r.period) {
            biddingStart = r.period;
          }

          const rawSector = (r.sector && !r.sector.includes("Segment")) ? r.sector : (r.isSme || r.type === "SME" ? "SME Segment" : "Mainboard Segment");
          const companyName = r.company || r.name || (r.externalId ? String(r.externalId) : r.slug);

          const liveMatch = liveApiIpos.find((item: any) => {
            const itemSymbol = (item.symbol || item.name || "").toLowerCase();
            const rSlug = (r.slug || r.externalId || "").toLowerCase();
            return itemSymbol && rSlug && (rSlug.includes(itemSymbol) || itemSymbol.includes(rSlug));
          });
          const rhpDocUrl = r.documentUrl || r.document_url || liveMatch?.document_url || liveMatch?.documentUrl || null;

          return {
            ...r,
            symbol: r.externalId || r.slug?.toUpperCase() || r.$id?.toUpperCase(),
            name: companyName,
            sector: rawSector,
            status: r.status || "active",
            is_sme: Boolean(r.isSme ?? (r.type === "SME")),
            min_price: minPrice,
            max_price: maxPrice,
            issue_price: minPrice || maxPrice,
            latest_price: maxPrice || minPrice,
            bidding_start_date: biddingStart,
            bidding_end_date: biddingEnd,
            listing_date: r.listing && r.listing !== "TBA" ? r.listing : (r.period || "TBA"),
            lot_size: r.lotSize ? parseInt(r.lotSize) || null : null,
            hasReport: Boolean(r.hasReport || r.deepDive || r.htmlContent || r.pdfUrl || (r.htmlUrl && !r.htmlUrl.startsWith("/"))),
            has_aethos_notes: Boolean(r.hasReport || r.deepDive || r.htmlContent || r.pdfUrl || (r.htmlUrl && !r.htmlUrl.startsWith("/"))),
            document_url: rhpDocUrl,
            documentUrl: rhpDocUrl || "",
            action_slug: r.slug,
          };
        });

        return NextResponse.json(
          {
            success: true,
            table: "ipos",
            total: dbRows.length || liveApiIpos.length,
            rows: dbRows,
            liveApiIpos,
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          }
        );
      }

      return NextResponse.json({ success: true, table, total: res.total, rows: res.rows });
    }

    // Return overview of all tables
    const allTables = ["reports", "ideas", "ipos", "journal", "users_meta", "ipo_deep_dives"];
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

    return NextResponse.json(
      { success: true, databaseId, data: results },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
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
    "hasReport",
    "deck",
    "issueSize",
    "lotSize",
    "listing",
    "pdfUrl",
    "documentUrl",
    "sections",
    "externalId",
    "status",
    "isSme",
    "additionalText",
    "lastSyncedAt",
    "closedAt",
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
  ipo_deep_dives: [
    "slug",
    "company",
    "sector",
    "pdfUrl",
    "deck",
    "createdAt",
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

    const appwriteObj = getAppwriteClient();
    if (!appwriteObj) {
      return NextResponse.json(
        { success: false, error: "APPWRITE_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const { tablesDB, databases, storage, databaseId } = appwriteObj;

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

    // Default required fields for table 'ipos'
    if (table === "ipos") {
      payload.company = payload.company || rawPayload.company || "";
      payload.slug = payload.slug || rawPayload.slug || "";
      payload.pdfUrl = payload.pdfUrl !== undefined ? payload.pdfUrl : rawPayload.pdfUrl || "";
      payload.deepDive = Boolean(payload.pdfUrl || payload.deepDive || rawPayload.deepDive);
      payload.hasReport = Boolean(payload.pdfUrl || payload.hasReport || rawPayload.hasReport);

      // Manage ipo_deep_dives collection for permanent archive access or deletion
      if ((payload.deepDive || payload.pdfUrl) && payload.pdfUrl !== "") {
        try {
          const deepDivePayload = {
            slug: String(payload.slug),
            company: String(payload.company),
            sector: String(rawPayload.sector || "IPO Deep Dive"),
            pdfUrl: String(payload.pdfUrl || ""),
            deck: String(rawPayload.deck || "").slice(0, 2000),
            createdAt: new Date().toISOString(),
          };
          try {
            await tablesDB.updateRow(databaseId, "ipo_deep_dives", rowId, deepDivePayload);
          } catch {
            await tablesDB.createRow(databaseId, "ipo_deep_dives", rowId, deepDivePayload);
          }
        } catch (archErr) {
          console.warn("Could not save copy to ipo_deep_dives collection:", archErr);
        }
      } else {
        // If deep dive / PDF report has been removed, delete the row from ipo_deep_dives
        try {
          await tablesDB.deleteRow(databaseId, "ipo_deep_dives", rowId);
        } catch (delErr) {
          // Ignore if row did not exist in ipo_deep_dives
        }
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
            databases.createStringAttribute(databaseId, table, unknownAttr, 1000, false).catch(() => { });
          } catch { }
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

    const appwriteObj = getAppwriteClient();
    if (!appwriteObj) {
      return NextResponse.json(
        { success: false, error: "APPWRITE_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const { tablesDB, storage, databaseId } = appwriteObj;
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
        if (table === "ipos") {
          try {
            await tablesDB.deleteRow(databaseId, "ipo_deep_dives", rowId);
          } catch { }
        }
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
