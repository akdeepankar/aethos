import { NextRequest, NextResponse } from "next/server";
import { getReportHtml } from "../../../_lib/report-reader";
import { Client, Storage, TablesDB } from "node-appwrite";
import fs from "node:fs";
import path from "node:path";

function toSafeRowId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^[^a-zA-Z0-9]+/, "") || "doc";
  if (cleaned.length <= 36) return cleaned;
  const hash = Math.abs(id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(36);
  return `${cleaned.slice(0, 36 - hash.length - 1)}-${hash}`.slice(0, 36);
}

function getAppwriteClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
  if (!apiKey) return null;
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return {
    client,
    storage: new Storage(client),
    tablesDB: new TablesDB(client),
    databaseId: process.env.APPWRITE_DATABASE_ID || "aethos_db",
    bucketId: process.env.APPWRITE_BUCKET_ID || "aethos_pdfs",
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    // 1. Check local public directory
    const localHtml = getReportHtml(slug);
    if (localHtml && localHtml.trim()) {
      return NextResponse.json({ found: true, html: localHtml });
    }

    // 2. Query Appwrite Storage bucket for cloud-persisted report HTML
    const appwrite = getAppwriteClient();
    if (appwrite) {
      const { storage, tablesDB, databaseId, bucketId } = appwrite;

      // Candidate file IDs to try directly
      const candidateFileIds = [
        toSafeRowId(`${slug}-html`),
        toSafeRowId(slug),
        `${slug}.html`,
        slug,
      ];

      for (const fileId of candidateFileIds) {
        try {
          const fileBuffer = await storage.getFileDownload(bucketId, fileId);
          if (fileBuffer) {
            const html = Buffer.from(fileBuffer).toString("utf-8");
            if (html && html.trim()) {
              // Cache locally in public/
              try {
                const publicPath = path.join(process.cwd(), "public", `${slug}.html`);
                fs.writeFileSync(publicPath, html, "utf-8");
              } catch {}
              return NextResponse.json({ found: true, html });
            }
          }
        } catch {
          // Continue to next candidate
        }
      }

      // If direct IDs failed, search storage files by name
      try {
        const storageList = await storage.listFiles(bucketId);
        const matchedFile = storageList.files.find((f) => {
          const lowerName = f.name.toLowerCase();
          const lowerSlug = slug.toLowerCase();
          return (
            lowerName === `${lowerSlug}.html` ||
            lowerName === `${lowerSlug}.md` ||
            lowerName === `${lowerSlug}.txt` ||
            lowerName.replace(/[^a-z0-9]/g, "").includes(lowerSlug.replace(/[^a-z0-9]/g, ""))
          );
        });

        if (matchedFile) {
          const fileBuffer = await storage.getFileDownload(bucketId, matchedFile.$id);
          if (fileBuffer) {
            const html = Buffer.from(fileBuffer).toString("utf-8");
            if (html && html.trim()) {
              try {
                const publicPath = path.join(process.cwd(), "public", `${slug}.html`);
                fs.writeFileSync(publicPath, html, "utf-8");
              } catch {}
              return NextResponse.json({ found: true, html });
            }
          }
        }
      } catch (sErr) {
        console.warn("Storage search error:", sErr);
      }

      // 3. Check Appwrite Database reports table
      try {
        const rowId = toSafeRowId(slug);
        let row: Record<string, any> | null = null;
        for (const table of ["reports", "ideas"]) {
          try {
            row = await tablesDB.getRow(databaseId, table, rowId);
            if (row) break;
          } catch {
            try {
              row = await tablesDB.getRow(databaseId, table, slug);
              if (row) break;
            } catch {}
          }
        }

        if (row) {
          // If row has inline htmlContent
          if (row.htmlContent && typeof row.htmlContent === "string" && row.htmlContent.trim()) {
            return NextResponse.json({ found: true, html: row.htmlContent });
          }

          // If row has an external htmlUrl, fetch it
          if (row.htmlUrl && typeof row.htmlUrl === "string" && row.htmlUrl.startsWith("http")) {
            try {
              const extRes = await fetch(row.htmlUrl);
              if (extRes.ok) {
                const extText = await extRes.text();
                if (extText && extText.trim()) {
                  return NextResponse.json({ found: true, html: extText });
                }
              }
            } catch {}
          }

          // If row has sections or deck, generate a formatted report
          let sections: any[] = [];
          if (typeof row.sections === "string") {
            try {
              sections = JSON.parse(row.sections);
            } catch {}
          } else if (Array.isArray(row.sections)) {
            sections = row.sections;
          }

          if (sections.length > 0 || row.deck) {
            const fallbackHtml = `<article class="report-content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.65; max-width: 900px; margin: 0 auto; padding: 24px 20px;">
  <header style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 28px;">
    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; background: #eff6ff; padding: 4px 8px; borderRadius: 4px;">${row.tag || "RESEARCH NOTE"}</span>
    <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 14px 0 10px 0; line-height: 1.25;">${row.title || slug}</h1>
    <p style="font-size: 15px; color: #475569; margin: 0 0 14px 0; line-height: 1.6;">${row.deck || ""}</p>
    <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">Published: ${row.date || "Recent"} · ${row.readTime || "10 min read"}</div>
  </header>
  ${sections.map((s: any, idx: number) => `
  <section style="margin-bottom: 32px;">
    <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; border-left: 3px solid #2563eb; padding-left: 10px;">${idx + 1}. ${s.heading || s.title || `Section ${idx + 1}`}</h2>
    <div style="font-size: 14.5px; color: #334155; line-height: 1.75;">${s.body || s.content || ""}</div>
  </section>
  `).join("")}
</article>`;
            return NextResponse.json({ found: true, html: fallbackHtml });
          }
        }
      } catch (dbErr) {
        console.warn("DB fallback check error:", dbErr);
      }
    }

    return NextResponse.json({ found: false, html: null });
  } catch (error) {
    console.error("Error reading report HTML:", error);
    return NextResponse.json({ found: false, error: "Internal server error" }, { status: 500 });
  }
}
