import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "../../_components/site-chrome";
import { findIpo, ipos } from "../../_lib/content";
import { getReportHtml } from "../../_lib/report-reader";
import DynamicReportView from "../../_components/dynamic-report-view";

export async function generateStaticParams() {
  return ipos.filter((ipo) => ipo.deepDive).map((ipo) => ({ slug: ipo.slug }));
}

export default async function IpoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ipo = findIpo(slug);
  if (!ipo?.deepDive) notFound();

  // Check if there is an automated .txt / .html report in public/
  const rawReportHtml = getReportHtml(slug);
  if (rawReportHtml) {
    return (
      <DynamicReportView
        htmlContent={rawReportHtml}
        backUrl="/ipos"
        backLabel="Back to IPO Intelligence"
        pdfUrl={ipo.pdfUrl}
      />
    );
  }

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/ipos"
          className="dash-card-link"
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to IPO Intelligence
        </Link>
        {ipo.pdfUrl && (
          <a
            href={ipo.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dash-card-link"
            style={{
              fontSize: "11px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid var(--gold-light)",
            }}
          >
            Download PDF Report <ArrowUpRight />
          </a>
        )}
      </div>

      <div className="dash-card" style={{ overflow: "hidden", background: "#ffffff" }}>
        <div
          className="dash-card-head"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            padding: "24px 28px",
            borderBottom: "1px solid var(--gold-light)",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#065f46",
                background: "#ecfdf5",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.05em",
              }}
            >
              IPO Underwriting Note
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {ipo.sector} · {ipo.type}
            </span>
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "4px 0", lineHeight: "1.2", color: "var(--ink)" }}>
            {ipo.company}
          </h1>

          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.5", maxWidth: "800px" }}>
            {ipo.deck}
          </p>
        </div>

        {/* Offer Data Grid */}
        <div style={{ padding: "18px 28px", background: "#fafafa", borderBottom: "1px solid var(--gold-light)" }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Bidding Period</th>
                  <th>Price Band</th>
                  <th>Issue Size</th>
                  <th>Lot Size</th>
                  <th>Listing Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "600" }}>{ipo.period}</td>
                  <td style={{ fontWeight: "600" }}>{ipo.price}</td>
                  <td style={{ fontWeight: "600" }}>{ipo.issueSize}</td>
                  <td style={{ fontWeight: "600" }}>{ipo.lotSize}</td>
                  <td style={{ fontWeight: "600" }}>{ipo.listing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Content Body rendered directly as native text */}
        <div className="dash-card-body" style={{ padding: "32px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "780px" }}>
            {ipo.sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                  {section.heading}
                </h2>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#333333" }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
