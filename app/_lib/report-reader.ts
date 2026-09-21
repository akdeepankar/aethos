import fs from "fs";
import path from "path";
import { marked } from "marked";

const KNOWN_SLUG_MAP: Record<string, string[]> = {
  "racl-geartech": [
    "RACL_Geartech_Growth_Triggers.md",
    "RACL_Geartech_Growth_Triggers_Exact.html",
    "RACL_Geartech_Deep_Dive_HTML_Code.txt",
    "RACL_Geartech_Growth_Triggers.html",
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

function processFileContent(filePath: string): string | null {
  try {
    let raw = fs.readFileSync(filePath, "utf-8");
    if (filePath.endsWith(".md")) {
      // Strip frontmatter
      if (raw.startsWith("---")) {
        const endIdx = raw.indexOf("---", 3);
        if (endIdx !== -1) {
          raw = raw.slice(endIdx + 3).trim();
        }
      }
      return marked.parse(raw) as string;
    }
    return raw;
  } catch {
    return null;
  }
}

/**
 * Reads any .md, .txt or .html report file from the public/ directory.
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
        const content = processFileContent(p);
        if (content) return content;
      }
    }
  }

  // 2. Direct file lookup
  const directPath = path.join(publicDir, fileNameOrSlug);
  if (fs.existsSync(directPath)) {
    return processFileContent(directPath);
  }

  // 3. Lookup with extensions (.md, .html, .txt)
  const extensions = [".md", ".html", ".txt"];
  for (const ext of extensions) {
    const p = path.join(publicDir, `${fileNameOrSlug}${ext}`);
    if (fs.existsSync(p)) {
      const content = processFileContent(p);
      if (content) return content;
    }
  }

  // 4. Dynamic keyword search in public/ for any future .md, .txt or .html files
  try {
    const files = fs.readdirSync(publicDir);
    const keywords = fileNameOrSlug
      .toLowerCase()
      .split(/[-_\s]+/)
      .filter((k) => k.length > 2);

    let bestFile: string | null = null;
    let maxMatches = 0;

    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".txt") || file.endsWith(".html")) {
        const lowerFile = file.toLowerCase();
        const matchCount = keywords.filter((k) => lowerFile.includes(k)).length;
        if (matchCount > maxMatches) {
          maxMatches = matchCount;
          bestFile = file;
        }
      }
    }

    if (bestFile && maxMatches > 0) {
      return processFileContent(path.join(publicDir, bestFile));
    }
  } catch {
    return null;
  }

  return null;
}
