import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "../../_components/site-chrome";

type IdeaDetail = {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  mcap: string;
  sharedPrice: number;
  currentPrice: number;
  sharedDate: string;
  pdfUrl?: string;
  tag: string;
  readTime: string;
  deck: string;
};

const ideasData: Record<string, IdeaDetail> = {
  "racl-geartech": {
    id: "racl-geartech",
    ticker: "RACLGEAR",
    company: "RACL Geartech Limited",
    sector: "Automobile and Auto Components",
    mcap: "2030cr",
    sharedPrice: 1340,
    currentPrice: 1895,
    sharedDate: "14 Jan 2026",
    pdfUrl: "/RACL GEARTECH LIMITED.pdf",
    tag: "Company Deep Dive",
    readTime: "18 min read",
    deck: "An in-depth underwriting memo on export market moat, customer concentration with premium European OEMs, and long-term operating leverage.",
  },
  "spectra-a-tech": {
    id: "spectra-a-tech",
    ticker: "SPECTRA",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Automation & Engineering",
    mcap: "1450cr",
    sharedPrice: 420,
    currentPrice: 588,
    sharedDate: "02 Feb 2026",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    tag: "IPO Deep Dive",
    readTime: "24 min read",
    deck: "Granular breakdown of business operations, addressable market, supply chain positioning, valuation band, and financial sustainability.",
  },
};

export async function generateStaticParams() {
  return Object.keys(ideasData).map((slug) => ({ slug }));
}

export default async function IdeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idea = ideasData[slug];
  if (!idea) notFound();

  const returnPct = ((idea.currentPrice - idea.sharedPrice) / idea.sharedPrice) * 100;

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/ideas"
          className="dash-card-link"
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to Aethos Ideas
        </Link>
        {idea.pdfUrl && (
          <a
            href={idea.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dash-card-link"
            style={{
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid var(--gold-light)",
            }}
          >
            Open in new tab <ArrowUpRight />
          </a>
        )}
      </div>

      <div className="dash-card">
        <div
          className="dash-card-head"
          style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px", padding: "24px" }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#065f46",
                background: "#ecfdf5",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              {idea.tag}
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Shared {idea.sharedDate} · {idea.readTime}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "4px 0", lineHeight: "1.2" }}>
            {idea.company}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.5" }}>
            {idea.deck}
          </p>
        </div>

        {/* Offer & Metrics Strip */}
        <div style={{ padding: "16px 24px", background: "#fafafa", borderBottom: "1px solid var(--gold-light)" }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Market Cap</th>
                  <th>Shared Price</th>
                  <th>Current Price</th>
                  <th>Return %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "600" }}>{idea.sector}</td>
                  <td style={{ fontWeight: "600" }}>{idea.mcap}</td>
                  <td style={{ fontWeight: "600" }}>₹{idea.sharedPrice}</td>
                  <td style={{ fontWeight: "600" }}>₹{idea.currentPrice}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: returnPct >= 0 ? "#10b981" : "#ef4444",
                      }}
                    >
                      {returnPct >= 0 ? "+" : ""}
                      {returnPct.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded PDF Viewer in page */}
        {idea.pdfUrl ? (
          <div style={{ width: "100%", height: "85vh", minHeight: "750px", background: "#f4f4f5" }}>
            <iframe
              src={idea.pdfUrl}
              title={`${idea.company} — Research Report`}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        ) : (
          <div className="dash-card-body" style={{ padding: "28px 32px" }}>
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>Research report note in preparation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
