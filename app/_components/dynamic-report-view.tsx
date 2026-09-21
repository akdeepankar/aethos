import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "./site-chrome";
import DynamicReportFrame from "./dynamic-report-frame";

interface DynamicReportViewProps {
  htmlContent: string;
  backUrl: string;
  backLabel: string;
  pdfUrl?: string;
  pdfButtonLabel?: string;
}

export default function DynamicReportView({
  htmlContent,
  backUrl,
  backLabel,
  pdfUrl,
  pdfButtonLabel = "Download PDF Report",
}: DynamicReportViewProps) {
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
          gap: "10px",
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

      {/* Main Report Card Container */}
      <div
        className="dash-card"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid var(--gold-light)",
        }}
      >
        <DynamicReportFrame htmlContent={htmlContent} />
      </div>
    </div>
  );
}
