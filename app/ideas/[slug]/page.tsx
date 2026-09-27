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

const defaultIdeasData: Record<string, IdeaDetail> = {};

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
    const storeItem = storeIdeas.find(
      (i) =>
        i.id.toLowerCase() === slug.toLowerCase() ||
        (i.slug && i.slug.toLowerCase() === slug.toLowerCase()) ||
        i.ticker.toLowerCase() === slug.toLowerCase()
    );

    if (defaultItem) {
      setIdea(defaultItem);
    } else if (storeItem) {
      setIdea({
        id: storeItem.id,
        ticker: storeItem.ticker,
        company: storeItem.company,
        sector: storeItem.sector,
        mcap: storeItem.mcap,
        sharedPrice: Number(storeItem.refPrice || storeItem.sharedPrice || 0),
        currentPrice: Number(storeItem.latestPrice || storeItem.currentPrice || 0),
        sharedDate: storeItem.published || storeItem.sharedDate || "",
        pdfUrl: storeItem.pdfUrl,
        tag: "Aethos Idea",
        readTime: "15 min read",
        overview: storeItem.thesis || storeItem.studying || "",
        catalysts: storeItem.watchNext ? [{ title: "What to watch next", desc: storeItem.watchNext, impact: "Key milestone" }] : [],
        sections: [
          ...(storeItem.studying ? [{ heading: "What we are studying", body: storeItem.studying }] : []),
          ...(storeItem.challenge ? [{ heading: "What could challenge it", body: storeItem.challenge }] : []),
          ...(storeItem.thesis ? [{ heading: "Investment Thesis", body: storeItem.thesis }] : []),
        ],
        risks: storeItem.challenge ? [storeItem.challenge] : [],
        triggersTable: storeItem.watchNext ? [{ trigger: storeItem.watchNext, impact: "Upcoming catalyst", timeline: "FY27" }] : [],
      });

      if (storeItem.htmlContent && storeItem.htmlContent.trim().length > 0) {
        setRawReportHtml(storeItem.htmlContent);
        setLoading(false);
        return;
      }
    }

    // 2. Fetch raw HTML from API or public HTML path if available
    fetch(`/api/reports/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found && data.html) {
          setRawReportHtml(data.html);
        } else if (storeItem?.htmlUrl) {
          fetch(storeItem.htmlUrl)
            .then((r) => r.text())
            .then((html) => {
              if (html && html.includes("<")) {
                setRawReportHtml(html);
              }
            })
            .catch(() => {});
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
