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
  pdfUrl: string;
  tag: string;
  readTime: string;
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
      {/* Top Action Bar */}
      <div style={{ marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/ideas"
          className="dash-card-link"
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to Aethos Ideas
        </Link>
        <a
          href={idea.pdfUrl}
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
          Open in new tab <ArrowUpRight />
        </a>
      </div>

      {/* Main Document Card */}
      <div className="dash-card" style={{ overflow: "hidden", background: "#ffffff" }}>
        {/* Compact Header */}
        <div
          className="dash-card-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
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
              {idea.tag}
            </span>
            <h1 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "var(--ink)" }}>
              {idea.company}
            </h1>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {idea.ticker} · {idea.sector} · {idea.readTime}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Mcap: <strong style={{ color: "var(--ink)" }}>{idea.mcap}</strong>
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: returnPct >= 0 ? "#10b981" : "#ef4444",
                background: returnPct >= 0 ? "#ecfdf5" : "#fef2f2",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {returnPct >= 0 ? "+" : ""}
              {returnPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Embedded PDF without toolbars or control bars */}
        <div style={{ width: "100%", height: "85vh", minHeight: "850px", background: "#ffffff" }}>
          <iframe
            src={`${idea.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            title={idea.company}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
