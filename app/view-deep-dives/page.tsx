"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DynamicReportFrame from "../_components/dynamic-report-frame";
import CleanPdfRenderer from "../_components/clean-pdf-renderer";

interface DeepDiveResult {
  success: boolean;
  type?: "pdf" | "html" | "structured";
  title?: string;
  fileName?: string;
  pdfUrl?: string;
  htmlContent?: string;
  data?: any;
  error?: string;
}

function ViewDeepDivesContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || searchParams.get("id") || "spectraa-technology-solutions";

  const [result, setResult] = useState<DeepDiveResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(`/api/deep-dive?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data: DeepDiveResult) => {
        setResult(data);
      })
      .catch((err) => {
        console.warn("Failed to load deep dive:", err);
        setResult({ success: false, error: err?.message || "Failed to load document" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(+(z + 0.1).toFixed(1), 1.6));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(+(z - 0.1).toFixed(1), 0.7));
  const handleZoomReset = () => setZoomLevel(1.0);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#ffffff", gap: "16px" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #e2e8f0", borderTopColor: "#b45309", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
          Loading deep dive research for &quot;{slug}&quot;...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!result || !result.success) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "100vh", background: "#ffffff" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "36px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#fafafa" }}>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>📄</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#0f172a" }}>Document Not Found</h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>
            {result?.error || `No research report or PDF found matching "${slug}".`}
          </p>
          <Link
            href="/ipos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            ← Return to IPO Tracker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", background: "#ffffff", overflow: "hidden" }}>
      {/* Top Header Bar */}
      <div
        style={{
          height: "44px",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
          gap: "12px",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <Link
          href="/ipos"
          style={{
            fontSize: "12px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#475569",
            textDecoration: "none",
            padding: "4px 10px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            lineHeight: 1.2,
          }}
        >
          <span>←</span>
          <span>IPO Tracker</span>
        </Link>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "13px",
            fontWeight: "700",
            color: "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "50%",
          }}
          title={result.title}
        >
          {result.title || slug}
        </div>

        {/* Right Tools (Zoom & Download) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Zoom controls */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "6px",
              padding: "2px 4px",
              border: "1px solid #e2e8f0",
              gap: "2px",
              height: "28px",
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.7}
              title="Zoom Out"
              style={{
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel <= 0.7 ? "not-allowed" : "pointer",
                color: zoomLevel <= 0.7 ? "#cbd5e1" : "#475569",
              }}
            >
              −
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              title="Reset Zoom"
              style={{
                padding: "1px 6px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                background: "#f1f5f9",
                cursor: "pointer",
                color: "#0f172a",
                borderRadius: "4px",
                minWidth: "40px",
                textAlign: "center",
              }}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 1.6}
              title="Zoom In"
              style={{
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel >= 1.6 ? "not-allowed" : "pointer",
                color: zoomLevel >= 1.6 ? "#cbd5e1" : "#475569",
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "#ffffff", display: "flex", flexDirection: "column" }}>
        {result.type === "pdf" && result.pdfUrl ? (
          <div style={{ flex: 1, overflowY: "auto", height: "100%" }}>
            <CleanPdfRenderer pdfUrl={result.pdfUrl} zoom={zoomLevel} />
          </div>
        ) : result.type === "html" && result.htmlContent ? (
          <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
            <DynamicReportFrame htmlContent={result.htmlContent} zoom={zoomLevel} height="100%" minHeight="100%" style={{ borderRadius: 0 }} />
          </div>
        ) : result.type === "structured" && result.data ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px", maxWidth: "840px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              {result.data.company || result.data.title}
            </h1>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
              {result.data.sector} • {result.data.period || result.data.date}
            </div>
            {result.data.deck && (
              <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#334155", background: "#f8fafc", padding: "16px 20px", borderRadius: "8px", borderLeft: "4px solid #b45309", marginBottom: "32px" }}>
                {result.data.deck}
              </p>
            )}
            {Array.isArray(result.data.sections) &&
              result.data.sections.map((s: any, idx: number) => (
                <div key={idx} style={{ marginBottom: "28px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
                    {s.heading || s.title}
                  </h3>
                  <p style={{ fontSize: "14.5px", lineHeight: "1.75", color: "#334155", whiteSpace: "pre-line" }}>
                    {s.body || s.content}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            No printable content found for this document.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewDeepDivesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
      <ViewDeepDivesContent />
    </Suspense>
  );
}
