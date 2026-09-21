"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";
import { reports } from "../_lib/content";

type TabType = "all" | "company" | "sectoral" | "thematic";

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const companyReports = reports.filter((r) => r.tag.toLowerCase().includes("company"));
  const sectoralReports = reports.filter((r) => r.tag.toLowerCase().includes("sector"));
  const thematicReports = reports.filter((r) => r.tag.toLowerCase().includes("themat"));

  const filteredReports =
    activeTab === "company"
      ? companyReports
      : activeTab === "sectoral"
      ? sectoralReports
      : activeTab === "thematic"
      ? thematicReports
      : reports;

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "all", label: "All Research", count: reports.length },
    { id: "company", label: "Company", count: companyReports.length },
    { id: "sectoral", label: "Sectoral", count: sectoralReports.length },
    { id: "thematic", label: "Thematic", count: thematicReports.length },
  ];

  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Research Library</h1>
          <p>Complete archive of long-form research notes across Indian equities and macroeconomic themes.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Total Notes: {reports.length}</span>
          <span className="meta-chip">Coverage: Company, Sectoral, Thematic</span>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head" style={{ borderBottom: "none", paddingBottom: "12px" }}>
          <h3 className="dash-card-title">All Published Research Reports</h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
            Showing {filteredReports.length} {activeTab === "all" ? "total" : activeTab} reports
          </span>
        </div>

        {/* Tabs Bar */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "0 20px",
            borderBottom: "1px solid var(--gold-light)",
            background: "#fafafa",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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
                  whiteSpace: "nowrap",
                  borderBottom: isActive ? "2px solid var(--ink)" : "2px solid transparent",
                  color: isActive ? "var(--ink)" : "var(--muted)",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    background: isActive ? "#e4e4e7" : "#f4f4f5",
                    color: isActive ? "var(--ink)" : "var(--muted)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title & Focus</th>
                  <th>Category</th>
                  <th>Access Tier</th>
                  <th>Published Date</th>
                  <th>Reading Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.slug}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{report.title}</span>
                        <span className="company-sector">{report.deck}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted)" }}>
                        {report.tag}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background: report.free ? "#ecfdf5" : "#fef3c7",
                          color: report.free ? "#047857" : "#b45309",
                        }}
                      >
                        {report.free ? "FREE" : "PRO"}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "11px" }}>{report.date}</td>
                    <td style={{ color: "var(--muted)", fontSize: "11px" }}>{report.readTime}</td>
                    <td>
                      <Link href={`/research/${report.slug}`} className="dash-card-link">
                        Read Report <ArrowUpRight />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "32px 24px", color: "var(--muted)", fontSize: "13px" }}
                    >
                      No reports found under this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
