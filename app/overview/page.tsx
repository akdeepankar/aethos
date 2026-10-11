"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "../_lib/admin-store";
import { reports as defaultReports, ipos as defaultIpos } from "../_lib/content";

// Icons
function IconBookmarkOutline() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="1.6">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconBookmarkFilled() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#c59b27" stroke="#c59b27" strokeWidth="1.6">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconNote() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <line x1="14" y1="2" x2="14" y2="8" />
      <line x1="14" y1="8" x2="20" y2="8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="18" fill="#94a3b8">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

export default function OverviewPage() {
  const [timeFilter, setTimeFilter] = useState("Since your last visit");

  // Dynamic store data with fallbacks
  const { reports: storeReports, ipos: storeIpos } = useAdminStore();

  const activeReports = storeReports && storeReports.length > 0 ? storeReports : defaultReports;
  const latestResearch = activeReports[0] || {
    slug: "indias-transmission-opportunity",
    title: "Power equipment: following the capacity cycle",
    deck: "Capacity is expanding. Our new study examines execution, working capital and demand visibility.",
    tag: "Sector study",
    sector: "Electrical equipment",
    readTime: "12 min read",
    imageUrl: "/electrical-substation.jpg",
  };

  const activeIpos = storeIpos && storeIpos.length > 0 ? storeIpos : defaultIpos;
  const latestIpoDeepDive = activeIpos.find((item) => item.deepDive) || activeIpos[0] || {
    slug: "spectraa-technology-solutions",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Automation & Engineering",
    deck: "An institutional underwriting note on high-gravity process engineering & distillery automation.",
    period: "18 — 22 Sep 2026",
  };

  return (
    <div
      style={{
        background: "#FAF8F5",
        minHeight: "100vh",
        color: "#0f172a",
        padding: "32px 36px 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Top Header Title Section ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.18em",
              color: "#c59b27",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            OVERVIEW
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 3.8vw, 48px)",
              fontWeight: "800",
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#0f172a",
              lineHeight: "1.1",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Your research, in perspective.
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: "8px 0 0" }}>
            Pick up where you left off. Discover what changed.
          </p>
        </div>

        {/* Right Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <IconCalendar />
            <span>24 Sep 2026</span>
          </button>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#334155",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="Since your last visit">Since your last visit</option>
            <option value="Past 7 days">Past 7 days</option>
            <option value="Past 30 days">Past 30 days</option>
          </select>
        </div>
      </div>

      {/* ── Top Metrics Banner (3 Cards) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        {/* Card 1 */}
        <Link
          href="/research"
          style={{
            background: "#ffffff",
            border: "1px solid #eae6df",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textDecoration: "none",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#faf5eb", padding: "8px", borderRadius: "6px" }}>
              <IconNote />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                {activeReports.length}
              </span>
              <span style={{ fontSize: "13.5px", color: "#475569", fontWeight: "500" }}>
                New research notes
              </span>
            </div>
          </div>
          <span style={{ color: "#c59b27", fontSize: "16px", fontWeight: "600" }}>›</span>
        </Link>

        {/* Card 2 */}
        <Link
          href="/ideas"
          style={{
            background: "#ffffff",
            border: "1px solid #eae6df",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textDecoration: "none",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#faf5eb", padding: "8px", borderRadius: "6px" }}>
              <IconStar />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>3</span>
              <span style={{ fontSize: "13.5px", color: "#475569", fontWeight: "500" }}>
                Watchlist companies updated
              </span>
            </div>
          </div>
          <span style={{ color: "#c59b27", fontSize: "16px", fontWeight: "600" }}>›</span>
        </Link>

        {/* Card 3 */}
        <Link
          href="/market-pulse"
          style={{
            background: "#ffffff",
            border: "1px solid #eae6df",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textDecoration: "none",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#faf5eb", padding: "8px", borderRadius: "6px" }}>
              <IconCalendar />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>5</span>
              <span style={{ fontSize: "13.5px", color: "#475569", fontWeight: "500" }}>
                Events this week
              </span>
            </div>
          </div>
          <span style={{ color: "#c59b27", fontSize: "16px", fontWeight: "600" }}>›</span>
        </Link>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
        {/* ── Left Column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          
          {/* Section 1: Fresh perspectives */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Fresh perspectives
              </h2>
              <Link
                href="/research"
                style={{
                  fontSize: "13px",
                  color: "#b45309",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                View all research →
              </Link>
            </div>

            {/* Featured Hero Card - Dynamic from Research Library */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #eae6df",
                borderRadius: "10px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "200px", background: "#334155" }}>
                <Image
                  src={latestResearch.imageUrl || "/electrical-substation.jpg"}
                  alt={latestResearch.title}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase" }}>
                      {latestResearch.tag || latestResearch.researchType || "RESEARCH NOTE"}
                    </span>
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#b45309",
                        fontSize: "9.5px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      NEW
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: "800",
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#0f172a",
                      margin: "0 0 10px",
                      lineHeight: "1.25",
                    }}
                  >
                    {latestResearch.title}
                  </h3>

                  <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.55", margin: 0 }}>
                    {latestResearch.deck}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b" }}>
                    <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "12px", fontWeight: "500" }}>
                      {latestResearch.sector || "Research"}
                    </span>
                    <span>{latestResearch.readTime || "10 min read"}</span>
                    <IconBookmarkOutline />
                  </div>

                  <Link
                    href={`/research/${latestResearch.slug}`}
                    style={{
                      border: "1px solid #c59b27",
                      color: "#0f172a",
                      background: "#faf5eb",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Read research →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sub-cards 2 columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Sub-card 1: RACL Geartech */}
              <Link
                href="/ideas/racl-geartech"
                style={{
                  background: "#ffffff",
                  border: "1px solid #eae6df",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "130px", background: "#1e293b" }}>
                  <Image
                    src="/aethos-eagle-logo.jpeg"
                    alt="RACL Geartech"
                    fill
                    style={{ objectFit: "cover", filter: "grayscale(100%)" }}
                  />
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: "0.14em", color: "#c59b27", textTransform: "uppercase" }}>
                        STOCK DEEP DIVE
                      </span>
                      <IconBookmarkOutline />
                    </div>
                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
                      RACL Geartech
                    </h4>
                    <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                      What changes as capacity comes on stream?
                    </p>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "12px" }}>
                    22 Sep 2026 • 10 min read
                  </div>
                </div>
              </Link>

              {/* Sub-card 2: Latest IPO Deep Dive */}
              <Link
                href={`/ipos/${latestIpoDeepDive.slug}`}
                style={{
                  background: "#ffffff",
                  border: "1px solid #eae6df",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "130px", background: "#0f172a" }}>
                  <Image
                    src="/eagle.png"
                    alt={latestIpoDeepDive.company}
                    fill
                    style={{ objectFit: "contain", filter: "grayscale(80%)", padding: "8px" }}
                  />
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "9.5px", fontWeight: "800", letterSpacing: "0.14em", color: "#c59b27", textTransform: "uppercase" }}>
                        IPO DEEP DIVE
                      </span>
                      <IconBookmarkOutline />
                    </div>
                    <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px", lineHeight: "1.2" }}>
                      {latestIpoDeepDive.company}
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        margin: 0,
                        lineHeight: "1.35",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {latestIpoDeepDive.deck}
                    </p>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "12px" }}>
                    {latestIpoDeepDive.period} • {latestIpoDeepDive.sector}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Section 2: What changed in your watchlist */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                What changed in your watchlist
              </h2>
              <Link
                href="/ideas"
                style={{
                  fontSize: "13px",
                  color: "#b45309",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                View all updates →
              </Link>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #eae6df",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
                    <th style={{ padding: "14px 20px", fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase" }}>
                      COMPANY
                    </th>
                    <th style={{ padding: "14px 20px", fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase" }}>
                      NEW UPDATE
                    </th>
                    <th style={{ padding: "14px 20px", fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase" }}>
                      CATEGORY
                    </th>
                    <th style={{ padding: "14px 20px", fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase", textAlign: "right" }}>
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 20px", fontWeight: "700", color: "#0f172a" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#c59b27", marginRight: "10px" }} />
                      Quality Power
                    </td>
                    <td style={{ padding: "16px 20px", color: "#475569" }}>
                      Capital-raising update
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748b" }}>
                      Fundraise
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <Link
                        href="/ideas"
                        style={{
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          color: "#334155",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        View update →
                      </Link>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 20px", fontWeight: "700", color: "#0f172a" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#c59b27", marginRight: "10px" }} />
                      Jubilant Pharmova
                    </td>
                    <td style={{ padding: "16px 20px", color: "#475569" }}>
                      Quarterly analysis added
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748b" }}>
                      Results
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <Link
                        href="/ideas"
                        style={{
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          color: "#334155",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Read analysis →
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "16px 20px", fontWeight: "700", color: "#0f172a" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "transparent", marginRight: "10px" }} />
                      Kross
                    </td>
                    <td style={{ padding: "16px 20px", color: "#475569" }}>
                      Expansion note added
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748b" }}>
                      Research
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <Link
                        href="/ideas"
                        style={{
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          color: "#334155",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Read note →
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── Right Column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Active IPOs Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #eae6df",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                <IconStar />
                <span>Active IPOs</span>
              </div>
              <Link href="/ipos" style={{ fontSize: "11.5px", color: "#b45309", fontWeight: "600", textDecoration: "none" }}>
                View all IPOs →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeIpos.slice(0, 3).map((ipo, idx) => (
                <Link
                  key={ipo.slug || idx}
                  href={`/ipos/${ipo.slug}`}
                  style={{
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#fdfbf7",
                    border: "1px solid #f1ece4",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                      {ipo.company}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: ipo.deepDive ? "#fef3c7" : "#f1f5f9",
                        color: ipo.deepDive ? "#b45309" : "#475569",
                      }}
                    >
                      {ipo.type || "Mainboard"}
                    </span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                    <span>{ipo.period}</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>{ipo.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Card: Saved for later */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #eae6df",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                <IconBookmarkFilled />
                <span>Saved for later</span>
              </div>
              <Link href="/research" style={{ fontSize: "11.5px", color: "#b45309", fontWeight: "600", textDecoration: "none" }}>
                View saved research →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Saved Item 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 16px", gap: "12px", alignItems: "start" }}>
                <div style={{ position: "relative", width: "60px", height: "55px", borderRadius: "6px", overflow: "hidden", background: "#1e293b" }}>
                  <Image
                    src="/aethos-eagle-logo.jpeg"
                    alt="Data centre"
                    fill
                    style={{ objectFit: "cover", filter: "grayscale(100%)" }}
                  />
                </div>
                <div>
                  <h5 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", lineHeight: "1.3" }}>
                    India&apos;s data centre buildout: opportunities and constraints
                  </h5>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Sector note • 14 min read
                  </div>
                </div>
                <IconDots />
              </div>

              {/* Saved Item 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 16px", gap: "12px", alignItems: "start" }}>
                <div style={{ position: "relative", width: "60px", height: "55px", borderRadius: "6px", overflow: "hidden", background: "#0f172a" }}>
                  <Image
                    src="/eagle.png"
                    alt="Specialty chemicals"
                    fill
                    style={{ objectFit: "contain", filter: "grayscale(80%)" }}
                  />
                </div>
                <div>
                  <h5 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", lineHeight: "1.3" }}>
                    Specialty chemicals: a more resilient cycle?
                  </h5>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Thematic note • 11 min read
                  </div>
                </div>
                <IconDots />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
