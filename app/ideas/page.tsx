import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";
import { IconIdeas } from "../_components/dashboard-layout";

type StockIdea = {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  mcap: string;
  sharedPrice: number;
  currentPrice: number;
  sharedDate: string;
  pdfUrl?: string;
};

const ideasList: StockIdea[] = [
  {
    id: "racl-geartech",
    ticker: "RACLGEAR",
    company: "RACL Geartech Limited",
    sector: "Automobile and Auto Components",
    mcap: "2030cr",
    sharedPrice: 1340,
    currentPrice: 1895,
    sharedDate: "14 Jan 2026",
    pdfUrl: "/RACL GEARTECH LIMITED.pdf",
  },
  {
    id: "spectra-a-tech",
    ticker: "SPECTRA",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Automation & Engineering",
    mcap: "1450cr",
    sharedPrice: 420,
    currentPrice: 588,
    sharedDate: "02 Feb 2026",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
  },
];

export default function IdeasPage() {
  return (
    <div className="dash-overview-page">
      {/* Welcome Banner */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h1 style={{ margin: 0 }}>Aethos Ideas</h1>
          </div>
          <p>Curated, high-conviction investment ideas and thematic opportunities in Indian markets.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Active Ideas: {ideasList.length}</span>
          <span className="meta-chip">Approach: Quality & Long-Term Compounding</span>
        </div>
      </div>

      {/* Ideas Table Card */}
      <div className="dash-card">
        <div className="dash-card-head">
          <h3 className="dash-card-title">
            <IconIdeas /> High Conviction Stock Ideas
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Updated Live</span>
        </div>

        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Sector</th>
                  <th>Mcap</th>
                  <th>Return % (from shared date)</th>
                  <th>Stock Ideas Sample Report</th>
                </tr>
              </thead>
              <tbody>
                {ideasList.map((idea) => {
                  const returnPct = ((idea.currentPrice - idea.sharedPrice) / idea.sharedPrice) * 100;

                  return (
                    <tr key={idea.id}>
                      <td>
                        <div className="company-cell">
                          <span className="company-name">{idea.company}</span>
                          <span className="company-sector">{idea.ticker}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: "500" }}>
                          {idea.sector}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink)" }}>
                          {idea.mcap}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
                          <span style={{ fontSize: "10px", color: "var(--muted)" }}>
                            ₹{idea.sharedPrice} → ₹{idea.currentPrice} ({idea.sharedDate})
                          </span>
                        </div>
                      </td>
                      <td>
                        <Link href={`/ideas/${idea.id}`} className="dash-card-link">
                          Read Report <ArrowUpRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
