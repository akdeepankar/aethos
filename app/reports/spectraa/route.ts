import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "SpectraA_IPO_Deep_Dive_HTML_Code.txt");
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return new Response("Report not found", { status: 404 });
  }
}
