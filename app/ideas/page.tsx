"use client";

import { useState, useEffect } from "react";
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
  reportTitle?: string;
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
    reportTitle: "RACL Geartech Limited — Institutional Research Note",
  },
  {
    id: "spectra-a-tech",
    ticker: "SPECTRA",
    company: "SpectraA Technology Solutions",
    sector: "Industrial Automation & Engineering",
    mcap: "1450cr",
    sharedPrice: 420,
    currentPrice: 588,
    sharedDate: "02 Feb 2026",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    reportTitle: "SpectraA Technology Solutions — IPO Deep Dive Note",
  },
];

export default function IdeasPage() {
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (!selectedPdf) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPdf(null);
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedPdf]);

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
                        {idea.pdfUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPdf({
                                url: idea.pdfUrl!,
                                title: idea.reportTitle || `${idea.company} — Research Report`,
                              })
                            }
                            className="dash-card-link"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              fontFamily: "inherit",
                            }}
                          >
                            PDF <ArrowUpRight />
                          </button>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Embedded PDF Modal */}
      {selectedPdf && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPdf.title}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 15, 17, 0.75)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPdf(null);
          }}
        >
          <div
            style={{
              width: "min(95vw, 1150px)",
              height: "90vh",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: "1px solid var(--gold-light)",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}
                >
                  PDF
                </span>
                <div style={{ minWidth: 0 }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--ink)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedPdf.title}
                  </h4>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Aethos Stock Ideas Report</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dash-card-link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "#ffffff",
                    border: "1px solid var(--gold-light)",
                    textDecoration: "none",
                  }}
                >
                  Open in new tab <ArrowUpRight />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  aria-label="Close modal"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid var(--gold-light)",
                    background: "#ffffff",
                    color: "var(--ink)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body with embedded iframe */}
            <div style={{ flex: 1, backgroundColor: "#525659", position: "relative" }}>
              <iframe
                src={selectedPdf.url}
                title={selectedPdf.title}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
