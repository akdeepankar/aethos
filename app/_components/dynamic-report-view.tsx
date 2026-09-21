"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "./site-chrome";
import DynamicReportFrame from "./dynamic-report-frame";
import CleanPdfRenderer from "./clean-pdf-renderer";

interface DynamicReportViewProps {
  htmlContent: string;
  backUrl: string;
  backLabel: string;
  pdfUrl?: string;
  pdfButtonLabel?: string;
  initialFormat?: "markdown" | "pdf";
}

export default function DynamicReportView({
  htmlContent,
  backUrl,
  backLabel,
  pdfUrl,
  pdfButtonLabel = "Download PDF",
  initialFormat = "markdown",
}: DynamicReportViewProps) {
  const [activeFormat, setActiveFormat] = useState<"markdown" | "pdf">(initialFormat);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(+(z + 0.1).toFixed(1), 1.6));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(+(z - 0.1).toFixed(1), 0.7));
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
  };

  return (
    <div className="dash-overview-page">
      {/* Top Navigation & Action Header */}
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
          href={backUrl}
          className="dash-card-link"
          style={{
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← {backLabel}
        </Link>

        {/* Action Controls, Format Switcher & Zoom Tools */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Format Switcher */}
          {pdfUrl && (
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
                onClick={() => setActiveFormat("markdown")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: activeFormat === "markdown" ? "#ffffff" : "transparent",
                  color: activeFormat === "markdown" ? "var(--ink)" : "var(--muted)",
                  boxShadow:
                    activeFormat === "markdown"
                      ? "0 1px 3px rgba(0,0,0,0.08)"
                      : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Markdown Format
              </button>
              <button
                type="button"
                onClick={() => setActiveFormat("pdf")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: activeFormat === "pdf" ? "#ffffff" : "transparent",
                  color: activeFormat === "pdf" ? "var(--ink)" : "var(--muted)",
                  boxShadow:
                    activeFormat === "pdf"
                      ? "0 1px 3px rgba(0,0,0,0.08)"
                      : "none",
                  transition: "all 0.15s ease",
                }}
              >
                PDF Format
              </button>
            </div>
          )}

          {/* Zoom In / Out Controls */}
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
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.7}
              title="Zoom Out (−)"
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel <= 0.7 ? "not-allowed" : "pointer",
                color: zoomLevel <= 0.7 ? "#a1a1aa" : "var(--ink)",
                borderRadius: "4px",
                lineHeight: "1",
              }}
            >
              −
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              title="Reset Zoom (100%)"
              style={{
                padding: "4px 6px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                background: "#ffffff",
                cursor: "pointer",
                color: "var(--ink)",
                borderRadius: "4px",
                minWidth: "46px",
                textAlign: "center",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                lineHeight: "1.2",
              }}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 1.6}
              title="Zoom In (+)"
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel >= 1.6 ? "not-allowed" : "pointer",
                color: zoomLevel >= 1.6 ? "#a1a1aa" : "var(--ink)",
                borderRadius: "4px",
                lineHeight: "1",
              }}
            >
              +
            </button>
          </div>

          {/* Direct PDF Download Link */}
          {pdfUrl && (
            <a
              href={pdfUrl}
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
              {pdfButtonLabel} <ArrowUpRight />
            </a>
          )}
        </div>
      </div>

      {/* Main Report Container */}
      <div
        className="dash-card"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid var(--gold-light)",
        }}
      >
        {activeFormat === "markdown" ? (
          <DynamicReportFrame htmlContent={htmlContent} zoom={zoomLevel} />
        ) : pdfUrl ? (
          <CleanPdfRenderer pdfUrl={pdfUrl} zoom={zoomLevel} />
        ) : (
          <DynamicReportFrame htmlContent={htmlContent} zoom={zoomLevel} />
        )}
      </div>
    </div>
  );
}
