import fs from "fs";
import path from "path";

/**
 * Reads any .txt or .html report file from the public/ directory.
 * If exact fileName is not provided, it tries matching known patterns.
 */
export function getReportHtml(fileNameOrSlug: string): string | null {
  const publicDir = path.join(process.cwd(), "public");

  // 1. Direct file lookup
  const directPath = path.join(publicDir, fileNameOrSlug);
  if (fs.existsSync(directPath)) {
    try {
      return fs.readFileSync(directPath, "utf-8");
    } catch {
      return null;
    }
  }

  // 2. Lookup with common extensions
  const candidates = [
    `${fileNameOrSlug}.txt`,
    `${fileNameOrSlug}.html`,
    "SpectraA_IPO_Deep_Dive_HTML_Code.txt",
    "SpectraA_IPO_Deep_Dive_Website.html",
  ];

  for (const candidate of candidates) {
    const candPath = path.join(publicDir, candidate);
    if (fs.existsSync(candPath)) {
      try {
        return fs.readFileSync(candPath, "utf-8");
      } catch {
        // continue
      }
    }
  }

  // 3. Fallback: Search in public folder for .txt or .html files matching slug keywords
  try {
    const files = fs.readdirSync(publicDir);
    const keywords = fileNameOrSlug.toLowerCase().split("-").filter((k) => k.length > 2);
    for (const file of files) {
      if (file.endsWith(".txt") || file.endsWith(".html")) {
        const lowerFile = file.toLowerCase();
        const matches = keywords.some((k) => lowerFile.includes(k));
        if (matches) {
          return fs.readFileSync(path.join(publicDir, file), "utf-8");
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}
