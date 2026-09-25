"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { reports as defaultReports, Report } from "../../_lib/content";
import { useAdminStore } from "../../_lib/admin-store";
import ReportView from "../../_components/ReportView";
import CleanPdfRenderer from "../../_components/clean-pdf-renderer";
import { adaptReportToRichView } from "../../_lib/report-adapter";

export default function ResearchDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { reports: storeReports } = useAdminStore();
  const [report, setReport] = useState<Report | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"content" | "pdf">("content");
  const [isSaved, setIsSaved] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // 1. Check admin store first, then default reports
    const allReports = storeReports && storeReports.length > 0 ? storeReports : defaultReports;
    const found = allReports.find((r) => r.slug === slug) || defaultReports.find((r) => r.slug === slug);

    if (found) {
      setReport(found);
      setIsSaved(Boolean(found.isSaved));
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "18px 32px", background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#64748b" }}>
            Loading research note...
          </div>
        </div>
      </div>
    );
  }

  if (!report && !rawHtml) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/research"
            style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            ← Back to Research Library
          </Link>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "#0f172a" }}>
            Research Note Not Found
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
            The research publication with identifier &quot;{slug}&quot; could not be located in the current database.
          </p>
          <Link
            href="/research"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              background: "#0f172a",
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

  const effectiveReport: Report = report || {
    slug,
    tag: "RESEARCH NOTE",
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    deck: "Institutional Equity Research Note",
    meta: "Published Research",
    free: true,
    readTime: "10 min read",
    date: "24 Sep 2026",
    sections: [],
  };

  const richReport = adaptReportToRichView(effectiveReport, rawHtml);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  // Header Actions Slot for Bookmark, Share, and PDF toggles
  const headerActions = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Share / Copy URL button */}
      <button
        type="button"
        onClick={handleCopyLink}
        title="Copy Link"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          fontSize: "12px",
          fontWeight: "500",
          color: "#475569",
          cursor: "pointer",
        }}
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{hasCopied ? "Link Copied" : "Share"}</span>
      </button>

      {/* Bookmark button */}
      <button
        type="button"
        onClick={() => setIsSaved((prev) => !prev)}
        title={isSaved ? "Saved to reading list" : "Save report"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: isSaved ? "1px solid #fde68a" : "1px solid #e2e8f0",
          background: isSaved ? "#fffbeb" : "#ffffff",
          fontSize: "12px",
          fontWeight: "500",
          color: isSaved ? "#b45309" : "#475569",
          cursor: "pointer",
        }}
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill={isSaved ? "#d97706" : "none"} stroke={isSaved ? "#d97706" : "currentColor"} strokeWidth="1.8">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>

      {/* PDF View / Switcher button if attached */}
      {effectiveReport.pdfUrl && (
        <button
          type="button"
          onClick={() => setViewMode((m) => (m === "content" ? "pdf" : "content"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: viewMode === "pdf" ? "1px solid #0f172a" : "1px solid #e2e8f0",
            background: viewMode === "pdf" ? "#0f172a" : "#ffffff",
            fontSize: "12px",
            fontWeight: "500",
            color: viewMode === "pdf" ? "#ffffff" : "#475569",
            cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>{viewMode === "pdf" ? "View Note" : "Original PDF"}</span>
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* If user explicitly toggles into PDF Document mode */}
      {viewMode === "pdf" && effectiveReport.pdfUrl ? (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setViewMode("content")}
              style={{
                background: "none",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                color: "#2563eb",
                cursor: "pointer",
              }}
            >
              ← Back to Interactive Note
            </button>
            <a
              href={effectiveReport.pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#0f172a",
                textDecoration: "none",
                background: "#f1f5f9",
                padding: "6px 12px",
                borderRadius: "6px",
              }}
            >
              Download PDF ↗
            </a>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
            <CleanPdfRenderer pdfUrl={effectiveReport.pdfUrl} />
          </div>
        </div>
      ) : (
        /* Render Full ReportView */
        <ReportView
          report={richReport}
          libraryHref="/research"
          headerActions={headerActions}
        />
      )}
    </div>
  );
}
