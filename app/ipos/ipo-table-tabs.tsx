"use client";

import { useState } from "react";
import Link from "next/link";
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

  const mainboardIpos = ipos.filter((ipo) => !ipo.is_sme);
  const smeIpos = ipos.filter((ipo) => ipo.is_sme);

  const displayList = activeTab === "mainboard" ? mainboardIpos : smeIpos;

  return (
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
                    <Link
                      href="/ipos/spectraa-technology-solutions"
                      className="dash-card-link"
                    >
                      PDF <ArrowUpRight />
                    </Link>
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
  );
}
