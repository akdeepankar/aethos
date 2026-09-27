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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fmt = params.get("format");
      if (fmt === "pdf") {
        setActiveFormat("pdf");
      } else if (fmt === "markdown") {
        setActiveFormat("markdown");
      }
    }
  }, []);

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
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", background: "#ffffff", overflow: "hidden" }}>
      {/* Sleek, Ultra-Compact Top Bar */}
      <div
        style={{
          height: "38px",
          padding: "0 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
          gap: "10px",
        }}
      >
        {/* Compact Back Button */}
        <Link
          href={backUrl}
          style={{
            fontSize: "11px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "#475569",
            textDecoration: "none",
            padding: "3px 8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "5px",
            lineHeight: 1.2,
            transition: "all 0.15s ease",
          }}
          title={backLabel}
        >
          <span>←</span>
          <span>{backLabel}</span>
        </Link>

        {/* Compact Action Controls, Format Switcher & Zoom Tools */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Format Switcher */}
          {pdfUrl && (
            <div
              style={{
                display: "inline-flex",
                background: "#ffffff",
                padding: "1px",
                borderRadius: "5px",
                border: "1px solid #e2e8f0",
                height: "25px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveFormat("markdown")}
                style={{
                  padding: "2px 7px",
                  fontSize: "10.5px",
                  fontWeight: "700",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: activeFormat === "markdown" ? "#0f172a" : "transparent",
                  color: activeFormat === "markdown" ? "#ffffff" : "#64748b",
                  transition: "all 0.15s ease",
                  height: "21px",
                  lineHeight: "17px",
                }}
              >
                Note
              </button>
              <button
                type="button"
                onClick={() => setActiveFormat("pdf")}
                style={{
                  padding: "2px 7px",
                  fontSize: "10.5px",
                  fontWeight: "700",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: activeFormat === "pdf" ? "#0f172a" : "transparent",
                  color: activeFormat === "pdf" ? "#ffffff" : "#64748b",
                  transition: "all 0.15s ease",
                  height: "21px",
                  lineHeight: "17px",
                }}
              >
                PDF
              </button>
            </div>
          )}

          {/* Compact Zoom In / Out Controls */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "5px",
              padding: "1px 2px",
              border: "1px solid #e2e8f0",
              gap: "1px",
              height: "25px",
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.7}
              title="Zoom Out (−)"
              style={{
                padding: "2px 5px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel <= 0.7 ? "not-allowed" : "pointer",
                color: zoomLevel <= 0.7 ? "#cbd5e1" : "#475569",
                borderRadius: "3px",
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
                padding: "1px 4px",
                fontSize: "10px",
                fontWeight: "700",
                border: "none",
                background: "#f1f5f9",
                cursor: "pointer",
                color: "#0f172a",
                borderRadius: "3px",
                minWidth: "38px",
                textAlign: "center",
                lineHeight: "1.3",
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
                padding: "2px 5px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                background: "transparent",
                cursor: zoomLevel >= 1.6 ? "not-allowed" : "pointer",
                color: zoomLevel >= 1.6 ? "#cbd5e1" : "#475569",
                borderRadius: "3px",
                lineHeight: "1",
              }}
            >
              +
            </button>
          </div>

          {/* Compact PDF Link */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "10.5px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                borderRadius: "5px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                textDecoration: "none",
                height: "25px",
                lineHeight: 1,
              }}
            >
              <span>{pdfButtonLabel}</span>
              <ArrowUpRight />
            </a>
          )}
        </div>
      </div>

      {/* Main Report Container - Full Available Height from Top */}
      <div
        style={{
          flex: 1,
          height: "calc(100vh - 38px)",
          minHeight: 0,
          padding: 0,
          overflow: "hidden",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeFormat === "markdown" ? (
          <DynamicReportFrame htmlContent={htmlContent} zoom={zoomLevel} height="100%" minHeight="100%" style={{ borderRadius: 0 }} />
        ) : pdfUrl ? (
          <div style={{ flex: 1, overflowY: "auto", height: "100%" }}>
            <CleanPdfRenderer pdfUrl={pdfUrl} zoom={zoomLevel} />
          </div>
        ) : (
          <DynamicReportFrame htmlContent={htmlContent} zoom={zoomLevel} height="100%" minHeight="100%" style={{ borderRadius: 0 }} />
        )}
      </div>
    </div>
  );
}
