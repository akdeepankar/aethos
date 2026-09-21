"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "../_components/site-chrome";

export type ApiIpo = {
  symbol: string;
  name: string;
  status: string;
  is_sme: boolean;
  additional_text: string;
  min_price: number | null;
  max_price: number | null;
  issue_price: number | null;
  bidding_start_date: string | null;
  bidding_end_date: string | null;
  listing_price: number | null;
  listing_gains: number | null;
  allotment_date: string | null;
  listing_date: string | null;
  lot_size: number | null;
  total_subscription_rate: number | null;
  document_url: string | null;
};

function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return "TBA";
  if (!end) {
    const s = new Date(start!).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    return `Starts ${s}`;
  }
  const sDate = new Date(start!);
  const eDate = new Date(end!);
  const sDay = sDate.toLocaleDateString("en-GB", { day: "2-digit" });
  const eDay = eDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  return `${sDay} — ${eDay}`;
}

function formatPrice(min: number | null, max: number | null, issue: number | null) {
  if (issue) return `₹${issue}`;
  if (min && max) return `₹${min} — ${max}`;
  if (min) return `₹${min}`;
  return "—";
}

export default function IpoTableTabs({ ipos }: { ipos: ApiIpo[] }) {
  const [activeTab, setActiveTab] = useState<"mainboard" | "sme">("mainboard");
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

  const mainboardIpos = ipos.filter((ipo) => !ipo.is_sme);
  const smeIpos = ipos.filter((ipo) => ipo.is_sme);

  const displayList = activeTab === "mainboard" ? mainboardIpos : smeIpos;

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-head" style={{ borderBottom: "none", paddingBottom: "12px" }}>
          <h3 className="dash-card-title">Live & Upcoming IPO Tracker</h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
            Showing {displayList.length} {activeTab === "mainboard" ? "Mainboard" : "SME"} offers
          </span>
        </div>

        {/* Tabs navigation */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "0 20px",
            borderBottom: "1px solid var(--gold-light)",
            background: "#fafafa",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("mainboard")}
            style={{
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: "600",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: activeTab === "mainboard" ? "2px solid var(--ink)" : "2px solid transparent",
              color: activeTab === "mainboard" ? "var(--ink)" : "var(--muted)",
              transition: "all 0.15s ease",
            }}
          >
            Mainboard IPOs
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 7px",
                borderRadius: "10px",
                background: activeTab === "mainboard" ? "#e4e4e7" : "#f4f4f5",
                color: activeTab === "mainboard" ? "var(--ink)" : "var(--muted)",
              }}
            >
              {mainboardIpos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sme")}
            style={{
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: "600",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: activeTab === "sme" ? "2px solid var(--ink)" : "2px solid transparent",
              color: activeTab === "sme" ? "var(--ink)" : "var(--muted)",
              transition: "all 0.15s ease",
            }}
          >
            SME IPOs
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 7px",
                borderRadius: "10px",
                background: activeTab === "sme" ? "#e4e4e7" : "#f4f4f5",
                color: activeTab === "sme" ? "var(--ink)" : "var(--muted)",
              }}
            >
              {smeIpos.length}
            </span>
          </button>
        </div>

        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Company & Segment</th>
                  <th>Status</th>
                  <th>Bidding Schedule</th>
                  <th>Price Band</th>
                  <th>Deep Dive</th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((ipo) => (
                  <tr key={ipo.symbol}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{ipo.name}</span>
                        <span className="company-sector">
                          {ipo.symbol} · {!ipo.is_sme ? "MAINBOARD" : "SME"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          ...(ipo.status === "active"
                            ? { color: "#065f46", backgroundColor: "#ecfdf5" }
                            : ipo.status === "pre_apply"
                            ? { color: "#92400e", backgroundColor: "#fffbeb" }
                            : { color: "var(--muted)", backgroundColor: "#f4f4f5" }),
                        }}
                      >
                        {ipo.status === "active"
                          ? "Open"
                          : ipo.status === "pre_apply"
                          ? "Upcoming"
                          : ipo.status === "listed"
                          ? "Listed"
                          : "Closed"}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", fontWeight: "600" }}>
                      {formatPeriod(ipo.bidding_start_date, ipo.bidding_end_date)}
                    </td>
                    <td style={{ fontSize: "12px", fontWeight: "600" }}>
                      {formatPrice(ipo.min_price, ipo.max_price, ipo.issue_price)}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPdf({
                            url: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
                            title: `${ipo.name} — IPO Deep Dive`,
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
                    </td>
                  </tr>
                ))}
                {displayList.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "32px 24px", color: "var(--muted)", fontSize: "13px" }}
                    >
                      No active {activeTab === "mainboard" ? "Mainboard" : "SME"} IPO data available.
                    </td>
                  </tr>
                )}
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
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Aethos Institutional Deep Dive</span>
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
    </>
  );
}
