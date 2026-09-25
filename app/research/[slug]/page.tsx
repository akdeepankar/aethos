"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { reports as defaultReports, Report } from "../../_lib/content";
import { useAdminStore } from "../../_lib/admin-store";
import DynamicReportView from "../../_components/dynamic-report-view";
import CleanPdfRenderer from "../../_components/clean-pdf-renderer";
import { ArrowUpRight } from "../../_components/site-chrome";

export default function ResearchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { reports: storeReports } = useAdminStore();
  const [report, setReport] = useState<Report | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"content" | "pdf">("content");
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  useEffect(() => {
    if (!slug) return;

    // 1. Check admin store first, then default reports
    const allReports = storeReports && storeReports.length > 0 ? storeReports : defaultReports;
    const found = allReports.find((r) => r.slug === slug) || defaultReports.find((r) => r.slug === slug);

    if (found) {
      setReport(found);
    }

    // 2. Fetch raw report HTML/Markdown from API if available in public/
    fetch(`/api/reports/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found && data.html) {
          setRawHtml(data.html);
        }
      })
      .catch((err) => {
        console.warn("Failed to check for raw HTML report:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, storeReports]);

  if (loading) {
    return (
      <div className="dash-overview-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 28px", background: "#ffffff", borderRadius: "12px", border: "1px solid var(--gold-light)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
            Loading research note...
          </div>
        </div>
      </div>
    );
  }

  if (!report && !rawHtml) {
    return (
      <div className="dash-overview-page">
        <div style={{ marginBottom: "16px" }}>
          <Link
            href="/research"
            className="dash-card-link"
            style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            ← Back to Research Library
          </Link>
        </div>
        <div className="dash-card" style={{ padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "var(--ink)" }}>
            Research Note Not Found
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>
            The research publication with identifier &quot;{slug}&quot; could not be located in the current database.
          </p>
          <Link
            href="/research"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              background: "var(--ink)",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Return to Research Library
          </Link>
        </div>
      </div>
    );
  }

  // If raw HTML file exists in public/ (e.g. RACL / SpectraA), use DynamicReportView
  if (rawHtml) {
    return (
      <DynamicReportView
        htmlContent={rawHtml}
        backUrl="/research"
        backLabel="Back to Research Library"
        pdfUrl={report?.pdfUrl}
      />
    );
  }

  // Otherwise render structured report
  const effectiveReport = report!;

  return (
    <div className="dash-overview-page">
      {/* Top Navigation & Controls */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Link
          href="/research"
          className="dash-card-link"
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to Research Library
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* View Mode Switcher if PDF is attached */}
          {effectiveReport.pdfUrl && (
            <div
              style={{
                display: "inline-flex",
                background: "#f4f4f5",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid var(--gold-light)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("content")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "content" ? "#ffffff" : "transparent",
                  color: viewMode === "content" ? "var(--ink)" : "var(--muted)",
                  boxShadow: viewMode === "content" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                Structured Note
              </button>
              <button
                type="button"
                onClick={() => setViewMode("pdf")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "pdf" ? "#ffffff" : "transparent",
                  color: viewMode === "pdf" ? "var(--ink)" : "var(--muted)",
                  boxShadow: viewMode === "pdf" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                PDF Document
              </button>
            </div>
          )}

          {/* Zoom Controls if in PDF mode */}
          {effectiveReport.pdfUrl && viewMode === "pdf" && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#f4f4f5",
                borderRadius: "8px",
                padding: "2px 4px",
                border: "1px solid var(--gold-light)",
                gap: "2px",
              }}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(+(z - 0.1).toFixed(1), 0.7))}
                disabled={zoomLevel <= 0.7}
                style={{ padding: "4px 8px", fontSize: "13px", fontWeight: "700", border: "none", background: "transparent", cursor: "pointer" }}
              >
                −
              </button>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "0 4px", minWidth: "40px", textAlign: "center" }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(+(z + 0.1).toFixed(1), 1.6))}
                disabled={zoomLevel >= 1.6}
                style={{ padding: "4px 8px", fontSize: "13px", fontWeight: "700", border: "none", background: "transparent", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          )}

          {/* PDF Download link */}
          {effectiveReport.pdfUrl && (
            <a
              href={effectiveReport.pdfUrl}
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
              Download PDF <ArrowUpRight />
            </a>
          )}
        </div>
      </div>

      {/* PDF View Container */}
      {viewMode === "pdf" && effectiveReport.pdfUrl ? (
        <div className="dash-card" style={{ padding: 0, overflow: "hidden", background: "#ffffff" }}>
          <CleanPdfRenderer pdfUrl={effectiveReport.pdfUrl} zoom={zoomLevel} />
        </div>
      ) : (
        /* Structured Research Note */
        <div className="dash-card">
          <div
            className="dash-card-head"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
              padding: "28px 32px",
              background: "#fafafa",
              borderBottom: "1px solid var(--gold-light)",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
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
                {effectiveReport.tag}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: effectiveReport.free ? "#ecfdf5" : "#fef3c7",
                  color: effectiveReport.free ? "#047857" : "#b45309",
                }}
              >
                {effectiveReport.free ? "FREE ACCESS" : "PRO SUBSCRIBER"}
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                {effectiveReport.date}
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "30px", fontWeight: "700", margin: "6px 0", lineHeight: "1.25", color: "#0f172a" }}>
              {effectiveReport.title}
            </h1>

            <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", maxWidth: "800px" }}>
              {effectiveReport.deck}
            </p>
          </div>

          <div className="dash-card-body" style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "780px" }}>
              {effectiveReport.sections && effectiveReport.sections.length > 0 ? (
                effectiveReport.sections.map((section, idx) => (
                  <section
                    key={idx}
                    style={{
                      paddingBottom: idx !== effectiveReport.sections.length - 1 ? "24px" : "0",
                      borderBottom: idx !== effectiveReport.sections.length - 1 ? "1px dashed var(--gold-light)" : "none",
                    }}
                  >
                    <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                      {section.heading}
                    </h2>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#333333", whiteSpace: "pre-line" }}>
                      {section.body}
                    </p>
                  </section>
                ))
              ) : (
                <div style={{ color: "var(--muted)", fontSize: "14px", fontStyle: "italic" }}>
                  Detailed underwriting sections are being compiled for this report.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
