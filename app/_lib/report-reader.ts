import fs from "fs";
import path from "path";

const KNOWN_SLUG_MAP: Record<string, string[]> = {
  "racl-geartech": [
    "RACL_Geartech_Growth_Triggers_Exact.html",
    "RACL_Geartech_Deep_Dive_HTML_Code.txt",
    "RACL_Geartech_Growth_Triggers.html",
    "RACL GEARTECH LIMITED.html",
  ],
  "spectra-a-tech": [
    "SpectraA_IPO_Deep_Dive_HTML_Code.txt",
    "SpectraA_IPO_Deep_Dive_Website.html",
    "SpectraA_Technology_Solutions_IPO_Deep_Dive.html",
  ],
  "spectraa-technology-solutions": [
    "SpectraA_IPO_Deep_Dive_HTML_Code.txt",
    "SpectraA_IPO_Deep_Dive_Website.html",
    "SpectraA_Technology_Solutions_IPO_Deep_Dive.html",
  ],
};

/**
 * Reads any .txt or .html report file from the public/ directory.
 * Matches known slug mappings first, then direct file names, then fuzzy keyword search.
 */
export function getReportHtml(fileNameOrSlug: string): string | null {
  const publicDir = path.join(process.cwd(), "public");

  // 1. Check known slug map
  const mappedFiles = KNOWN_SLUG_MAP[fileNameOrSlug];
  if (mappedFiles) {
    for (const file of mappedFiles) {
      const p = path.join(publicDir, file);
      if (fs.existsSync(p)) {
        try {
          return fs.readFileSync(p, "utf-8");
        } catch {
          // continue
        }
      }
    }
  }

  // 2. Direct file lookup
  const directPath = path.join(publicDir, fileNameOrSlug);
  if (fs.existsSync(directPath)) {
    try {
      return fs.readFileSync(directPath, "utf-8");
    } catch {
      return null;
    }
  }

  // 3. Lookup with extensions
  const extensions = [".html", ".txt"];
  for (const ext of extensions) {
    const p = path.join(publicDir, `${fileNameOrSlug}${ext}`);
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p, "utf-8");
      } catch {
        // continue
      }
    }
  }

  // 4. Dynamic keyword search in public/ for any future .txt or .html files
  try {
    const files = fs.readdirSync(publicDir);
    const keywords = fileNameOrSlug
      .toLowerCase()
      .split(/[-_\s]+/)
      .filter((k) => k.length > 2);

    let bestFile: string | null = null;
    let maxMatches = 0;

    for (const file of files) {
      if (file.endsWith(".txt") || file.endsWith(".html")) {
        const lowerFile = file.toLowerCase();
        const matchCount = keywords.filter((k) => lowerFile.includes(k)).length;
        if (matchCount > maxMatches) {
          maxMatches = matchCount;
          bestFile = file;
        }
      }
    }

    if (bestFile && maxMatches > 0) {
      return fs.readFileSync(path.join(publicDir, bestFile), "utf-8");
    }
  } catch {
    return null;
  }

  return null;
}
