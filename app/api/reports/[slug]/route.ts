import { NextRequest, NextResponse } from "next/server";
import { getReportHtml } from "../../../_lib/report-reader";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    const html = getReportHtml(slug);
    if (!html) {
      return NextResponse.json({ found: false, html: null });
    }

    return NextResponse.json({ found: true, html });
  } catch (error) {
    console.error("Error reading report HTML:", error);
    return NextResponse.json({ found: false, error: "Internal server error" }, { status: 500 });
  }
}
