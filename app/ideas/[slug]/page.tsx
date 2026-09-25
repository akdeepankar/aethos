"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight } from "../../_components/site-chrome";
import DynamicReportView from "../../_components/dynamic-report-view";
import { useAdminStore } from "../../_lib/admin-store";

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
  overview: string;
  catalysts: { title: string; desc: string; impact: string }[];
  sections: { heading: string; body: string }[];
  risks: string[];
  triggersTable: { trigger: string; impact: string; timeline: string }[];
};

const defaultIdeasData: Record<string, IdeaDetail> = {
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
    overview: "RACL Geartech manufactures ultra-precision gears, transmission shafts, sub-assemblies, and precision chassis components for luxury motorcycles, high-end passenger cars, agricultural equipment, and industrial machinery. The company has evolved from a domestic tier-2 supplier into a critical, sole-source engineering partner for global marquee OEMs including BMW Motorrad, KTM, Husqvarna, Ducati, Kubota, ZF, and Royal Enfield.",
    catalysts: [
      {
        title: "BMW Titan & Venus Programs (EV & Premium ICE)",
        desc: "One of the two largest capacity programs undertaken by RACL. Supplies high-tolerance gearbox components with mass production scheduled from October 2026.",
        impact: "Major volume & revenue ramp",
      },
      {
        title: "Royal Enfield Nomination Scale-up",
        desc: "Current run-rate of 7,500–8,000 units/month ramping toward the 10,000–20,000 units/month nomination, offering 60–100%+ volume headroom on this platform alone.",
        impact: "High-volume domestic compounding",
      },
      {
        title: "In-House Heat-Treatment Overhaul",
        desc: "₹43 Cr allocated of the ₹77.45 Cr FY27 capex to modernize in-house metallurgical processing, driving structural 200–300 bps EBITDA margin expansion by reducing external job-work.",
        impact: "200-300 bps margin expansion",
      },
      {
        title: "Passenger Car Mix Shift (RACL 3.0)",
        desc: "Passenger car revenue mix expanded from 0% to 13% over four years. Standalone EBITDA margins progressed from 22.5% to 25.3% as higher-margin passenger car platforms scale.",
        impact: "Structural mix improvement",
      },
      {
        title: "Kawasaki 15-Part Multi-Application Program",
        desc: "1 of 15 validated parts currently live with 14 in advanced validation, targeting mass production across FY27-FY28.",
        impact: "Multi-year pipeline expansion",
      },
    ],
    sections: [
      {
        heading: "1. The Business Moat & Sole-Source Position",
        body: "Precision transmission manufacturing is not a commoditized fabrication business. OEM vendor qualification cycles for powertrain gears take 24 to 36 months, requiring micron-level gear-grinding tolerances, metallurgical heat-treatment certifications, and rigorous field durability testing. RACL functions as a sole-source or majority-source supplier for over 80% of its customer part numbers, resulting in near-zero customer attrition over its operational history.",
      },
      {
        heading: "2. Strategic Transition to Global Tier-1 Systems",
        body: "RACL is systematically moving up the value chain from standalone gear sets to complete sub-assemblies and electric drivetrain units. Collaborations with ZF on commercial truck electric power steering (EPS) systems provide a critical beachhead into the North American ADAS and electric truck conversion cycles.",
      },
      {
        heading: "3. Financial Architecture & Capital Efficiency",
        body: "The company has demonstrated disciplined capital allocation, with Return on Capital Employed (ROCE) exceeding 22% through historical cycles. Debt has reduced from ₹297.6 Cr to ₹221.8 Cr over FY25–FY26, expanding interest coverage from 3.01x to 4.26x and providing balance sheet headroom for the next growth phase.",
      },
      {
        heading: "4. Working Capital & Cash Conversion Normalisation",
        body: "Working capital has historically been stretched due to export shipping lead times and raw material inventory buffers (inventory days at 373). The structural migration of Kubota supply to domestic invoicing via Escorts offers a tangible catalyst to accelerate cash collections and improve operating cash flow conversion relative to reported net profit.",
      },
    ],
    risks: [
      "Simultaneous execution ramp of 6+ OEM programs (Titan, Venus, RE, Kawasaki, BRP) during plant overhaul.",
      "Working capital intensity with inventory cycles requiring discipline to ensure positive free cash flow generation.",
      "Customer concentration with top 3 OEM relationships accounting for a significant share of revenue.",
      "Raw material commodity cost fluctuations and energy tariff inflation.",
    ],
    triggersTable: [
      { trigger: "Heat-Treatment Plant Overhaul", impact: "≈200-300 bps EBITDA margin tailwind", timeline: "Trial Jan-2027; full benefit FY28+" },
      { trigger: "BMW Titan & Venus Programs", impact: "High-value EV gearbox mass delivery", timeline: "Mass production from Oct-2026" },
      { trigger: "Royal Enfield Ramp (10K→20K/mo)", impact: "60-100%+ volume headroom", timeline: "Ongoing scale-up through FY27-28" },
      { trigger: "Kawasaki 15-Part Validation", impact: "Multi-part OEM revenue stream", timeline: "Mass production Q4FY27/FY28" },
      { trigger: "ZF EPS Truck Entry", impact: "Strategic US commercial truck ADAS entry", timeline: "SOP Sep-Oct 2026" },
      { trigger: "EU-India FTA & China+1 Realignment", impact: "Accelerated RFQ/RFI conversion", timeline: "Structural from 2027" },
    ],
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
    overview: "SpectraA Technology Solutions provides end-to-end turnkey engineering solutions for breweries, distilleries, and biopharma plants.",
    catalysts: [],
    sections: [],
    risks: [],
    triggersTable: [],
  },
};

export default function IdeaDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { ideas: storeIdeas } = useAdminStore();
  const [rawReportHtml, setRawReportHtml] = useState<string | null>(null);
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // 1. Resolve idea
    const defaultItem = defaultIdeasData[slug];
    const storeItem = storeIdeas.find((i) => i.id === slug || i.ticker.toLowerCase() === slug.toLowerCase());

    if (defaultItem) {
      setIdea(defaultItem);
    } else if (storeItem) {
      setIdea({
        id: storeItem.id,
        ticker: storeItem.ticker,
        company: storeItem.company,
        sector: storeItem.sector,
        mcap: storeItem.mcap,
        sharedPrice: storeItem.sharedPrice,
        currentPrice: storeItem.currentPrice,
        sharedDate: storeItem.sharedDate,
        pdfUrl: storeItem.pdfUrl,
        tag: "Stock Idea",
        readTime: "15 min read",
        overview: storeItem.thesis || "",
        catalysts: [],
        sections: [{ heading: "Investment Thesis", body: storeItem.thesis || "" }],
        risks: [],
        triggersTable: [],
      });
    }

    // 2. Fetch raw HTML from API if available
    fetch(`/api/reports/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found && data.html) {
          setRawReportHtml(data.html);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch raw HTML report:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, storeIdeas]);

  if (loading) {
    return (
      <div className="dash-overview-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 28px", background: "#ffffff", borderRadius: "12px", border: "1px solid var(--gold-light)" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
            Loading idea analysis...
          </div>
        </div>
      </div>
    );
  }

  if (rawReportHtml) {
    return (
      <DynamicReportView
        htmlContent={rawReportHtml}
        backUrl="/ideas"
        backLabel="Back to Aethos Ideas"
        pdfUrl={idea?.pdfUrl}
      />
    );
  }

  if (!idea) {
    return (
      <div className="dash-overview-page">
        <div style={{ marginBottom: "16px" }}>
          <Link href="/ideas" className="dash-card-link" style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to Aethos Ideas
          </Link>
        </div>
        <div className="dash-card" style={{ padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Idea Not Found</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>
            No investment idea matches &quot;{slug}&quot;.
          </p>
          <Link href="/ideas" className="dash-card-link">
            Return to Ideas
          </Link>
        </div>
      </div>
    );
  }

  const returnPct = ((idea.currentPrice - idea.sharedPrice) / idea.sharedPrice) * 100;

  return (
    <div className="dash-overview-page">
      {/* Top Action Bar */}
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
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
              fontSize: "11px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 14px",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid var(--gold-light)",
            }}
          >
            Download PDF Report <ArrowUpRight />
          </a>
        )}
      </div>

      {/* Main Research Card */}
      <div className="dash-card">
        <div
          className="dash-card-head"
          style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px", padding: "28px" }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#065f46",
                background: "#ecfdf5",
                padding: "4px 9px",
                borderRadius: "4px",
                letterSpacing: "0.05em",
              }}
            >
              {idea.tag}
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Shared on {idea.sharedDate}
            </span>
          </div>

          <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "4px 0", lineHeight: "1.25", color: "var(--ink)" }}>
            {idea.company}
          </h1>

          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", maxWidth: "800px" }}>
            High-precision engineering manufacturer with sole-source OEM relationships across premium global powertrain platforms.
          </p>
        </div>

        {/* Investment Parameters Strip */}
        <div style={{ padding: "18px 28px", background: "#fafafa", borderBottom: "1px solid var(--gold-light)" }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Market Cap</th>
                  <th>Shared Price</th>
                  <th>Current Price</th>
                  <th>Return % (From Shared)</th>
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

        {/* Report Content Body formatted like Research Library */}
        <div className="dash-card-body" style={{ padding: "32px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "780px" }}>
            {/* Executive Overview */}
            {idea.overview && (
              <section>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                  Executive Thesis &amp; Business Snapshot
                </h2>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#333333" }}>
                  {idea.overview}
                </p>
              </section>
            )}

            {/* Strategic Triggers & Catalysts */}
            {idea.catalysts && idea.catalysts.length > 0 && (
              <section>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 14px", color: "var(--ink)" }}>
                  Key Multi-Year Catalysts
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {idea.catalysts.map((cat) => (
                    <div
                      key={cat.title}
                      style={{
                        padding: "16px 20px",
                        background: "#fafafa",
                        borderRadius: "8px",
                        border: "1px solid var(--gold-light)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>
                          {cat.title}
                        </span>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: "#1d4ed8", background: "#eff6ff", padding: "2px 7px", borderRadius: "4px" }}>
                          {cat.impact}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "var(--muted)" }}>
                        {cat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Detailed Report Sections */}
            {idea.sections && idea.sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                  {section.heading}
                </h2>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#333333" }}>
                  {section.body}
                </p>
              </section>
            ))}

            {/* Trigger Tracker Table */}
            {idea.triggersTable && idea.triggersTable.length > 0 && (
              <section>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                  Trigger &amp; Timeline Tracker
                </h2>
                <div className="dash-table-wrap" style={{ border: "1px solid var(--gold-light)", borderRadius: "8px" }}>
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Trigger</th>
                        <th>Revenue / Earnings Impact</th>
                        <th>Timeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {idea.triggersTable.map((row) => (
                        <tr key={row.trigger}>
                          <td style={{ fontWeight: "600" }}>{row.trigger}</td>
                          <td style={{ color: "var(--muted)", fontSize: "12px" }}>{row.impact}</td>
                          <td style={{ fontSize: "11px", fontWeight: "600", color: "var(--ink)" }}>{row.timeline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Key Risks */}
            {idea.risks && idea.risks.length > 0 && (
              <section>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                  Key Underwriting Risks
                </h2>
                <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {idea.risks.map((risk, idx) => (
                    <li key={idx} style={{ fontSize: "13px", lineHeight: "1.6", color: "#444444" }}>
                      {risk}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
