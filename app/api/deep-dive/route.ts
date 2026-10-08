import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, TablesDB } from "node-appwrite";
import { getReportHtml } from "../../_lib/report-reader";
import { findIpo, ipos as defaultIpos, findReport, reports as defaultReports, findPost } from "../../_lib/content";

export const dynamic = "force-dynamic";

function getAppwriteClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "aethos-wealth";
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

function cleanSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug") || searchParams.get("fileId") || searchParams.get("id") || "";
    
    if (!rawSlug) {
      return NextResponse.json({ success: false, error: "Missing slug or fileId parameter" }, { status: 400 });
    }

    // Extract clean target string
    let slug = rawSlug.trim();
    
    // If it's a direct URL to storage, extract fileId
    const fileIdMatch = slug.match(/\/files\/([^\/]+)\/(view|download)/);
    let explicitFileId: string | null = null;
    if (fileIdMatch && fileIdMatch[1]) {
      explicitFileId = fileIdMatch[1];
    } else if (slug.startsWith("file_") || slug.endsWith("-html") || slug.includes("_deep_dive_")) {
      explicitFileId = slug;
    }

    const appwrite = getAppwriteClient();

    // 1. Direct File ID Lookup if explicit
    if (explicitFileId && appwrite) {
      try {
        const fileMeta = await appwrite.storage.getFile(appwrite.bucketId, explicitFileId).catch(() => null);
        if (fileMeta) {
          const isPdf = fileMeta.name?.toLowerCase().endsWith(".pdf") || fileMeta.mimeType === "application/pdf";
          if (isPdf) {
            return NextResponse.json({
              success: true,
              type: "pdf",
              title: fileMeta.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " "),
              fileName: fileMeta.name,
              pdfUrl: `/api/appwrite/media?fileId=${fileMeta.$id}`,
              fileId: fileMeta.$id,
            });
          } else {
            const fileBytes = await appwrite.storage.getFileDownload(appwrite.bucketId, fileMeta.$id);
            const htmlContent = Buffer.from(fileBytes).toString("utf-8");
            return NextResponse.json({
              success: true,
              type: "html",
              title: fileMeta.name.replace(/\.html$/i, "").replace(/[-_]+/g, " "),
              fileName: fileMeta.name,
              htmlContent,
              fileId: fileMeta.$id,
            });
          }
        }
      } catch (fErr) {
        console.warn("Direct fileId fetch failed:", fErr);
      }
    }

    // 2. Search Appwrite Storage Bucket for best matching PDF or HTML
    if (appwrite) {
      try {
        const listRes = await appwrite.storage.listFiles(appwrite.bucketId);
        const files = listRes.files || [];
        const normalizedTarget = cleanSlug(slug);

        // A. Look for matching PDF file first
        const matchingPdf = files.find((f) => {
          const fn = f.name.toLowerCase();
          const fid = f.$id.toLowerCase();
          const isPdf = fn.endsWith(".pdf") || f.mimeType === "application/pdf";
          if (!isPdf) return false;
          const cleanName = cleanSlug(fn);
          const cleanFid = cleanSlug(fid);
          return (
            cleanName === normalizedTarget ||
            cleanFid === normalizedTarget ||
            (normalizedTarget.length >= 3 && (cleanName.includes(normalizedTarget) || normalizedTarget.includes(cleanName)))
          );
        });

        if (matchingPdf) {
          return NextResponse.json({
            success: true,
            type: "pdf",
            title: matchingPdf.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " "),
            fileName: matchingPdf.name,
            pdfUrl: `/api/appwrite/media?fileId=${matchingPdf.$id}`,
            fileId: matchingPdf.$id,
          });
        }

        // B. Look for matching HTML file
        const matchingHtml = files.find((f) => {
          const fn = f.name.toLowerCase();
          const fid = f.$id.toLowerCase();
          const isHtml = fn.endsWith(".html") || f.mimeType === "text/html";
          if (!isHtml) return false;
          const cleanName = cleanSlug(fn);
          const cleanFid = cleanSlug(fid);
          return (
            cleanName === normalizedTarget ||
            cleanFid === normalizedTarget ||
            (normalizedTarget.length >= 3 && (cleanName.includes(normalizedTarget) || normalizedTarget.includes(cleanName)))
          );
        });

        if (matchingHtml) {
          const fileBytes = await appwrite.storage.getFileDownload(appwrite.bucketId, matchingHtml.$id);
          const htmlContent = Buffer.from(fileBytes).toString("utf-8");
          return NextResponse.json({
            success: true,
            type: "html",
            title: matchingHtml.name.replace(/\.html$/i, "").replace(/[-_]+/g, " "),
            fileName: matchingHtml.name,
            htmlContent,
            fileId: matchingHtml.$id,
          });
        }
      } catch (sErr) {
        console.warn("Storage scan failed:", sErr);
      }

      // 3. Search Appwrite DB Tables (ipos, ipo_deep_dives, reports, ideas)
      try {
        for (const table of ["ipos", "ipo_deep_dives", "reports", "ideas"]) {
          try {
            const rowRes = await appwrite.tablesDB.listRows(appwrite.databaseId, table);
            const matchedRow = (rowRes.rows || []).find((r: any) => {
              const rSlug = cleanSlug(r.slug || r.$id || r.company || r.title || "");
              const target = cleanSlug(slug);
              return rSlug === target || (target.length >= 3 && (rSlug.includes(target) || target.includes(rSlug)));
            });

            if (matchedRow) {
              if (matchedRow.pdfUrl && typeof matchedRow.pdfUrl === "string") {
                let pUrl = matchedRow.pdfUrl;
                const m = pUrl.match(/\/files\/([^\/]+)\/(view|download)/);
                if (m && m[1]) {
                  pUrl = `/api/appwrite/media?fileId=${m[1]}`;
                }
                return NextResponse.json({
                  success: true,
                  type: "pdf",
                  title: matchedRow.company || matchedRow.title || slug,
                  pdfUrl: pUrl,
                  data: matchedRow,
                });
              }

              if (matchedRow.htmlContent && typeof matchedRow.htmlContent === "string" && matchedRow.htmlContent.trim()) {
                return NextResponse.json({
                  success: true,
                  type: "html",
                  title: matchedRow.company || matchedRow.title || slug,
                  htmlContent: matchedRow.htmlContent,
                  data: matchedRow,
                });
              }

              if (matchedRow.sections || matchedRow.deck) {
                return NextResponse.json({
                  success: true,
                  type: "structured",
                  title: matchedRow.company || matchedRow.title || slug,
                  data: matchedRow,
                });
              }
            }
          } catch {}
        }
      } catch (dbErr) {
        console.warn("DB search failed:", dbErr);
      }
    }

    // 4. Local Public Directory Files Lookup
    const localHtml = getReportHtml(slug);
    if (localHtml && localHtml.trim()) {
      return NextResponse.json({
        success: true,
        type: "html",
        title: slug.replace(/[-_]+/g, " "),
        htmlContent: localHtml,
      });
    }

    // 5. Default Hardcoded Content Lookup (SpectraA, Gulf Lloyds, etc.)
    const staticIpo = defaultIpos.find((i) => cleanSlug(i.slug) === cleanSlug(slug) || cleanSlug(i.company).includes(cleanSlug(slug)));
    if (staticIpo) {
      if (staticIpo.pdfUrl) {
        return NextResponse.json({
          success: true,
          type: "pdf",
          title: staticIpo.company,
          pdfUrl: staticIpo.pdfUrl,
          data: staticIpo,
        });
      }
      return NextResponse.json({
        success: true,
        type: "structured",
        title: staticIpo.company,
        data: staticIpo,
      });
    }

    return NextResponse.json({ success: false, error: `No deep dive report found for "${slug}"` }, { status: 404 });
  } catch (err: any) {
    console.error("Deep dive API error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}
