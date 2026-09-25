"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "./site-chrome";

export type ReportModalData = {
  url: string;
  title: string;
  tag?: string;
  date?: string;
  readTime?: string;
  deck?: string;
};

export default function ReportModal({
  report,
  onClose,
}: {
  report: ReportModalData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!report) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [report, onClose]);

  if (!report) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={report.title}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 15, 17, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dash-card"
        style={{
          width: "min(96vw, 1200px)",
          height: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "14px",
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.45)",
          overflow: "hidden",
          border: "1px solid var(--gold-light)",
          background: "#ffffff",
        }}
      >
        {/* Research Library Report Styled Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--gold-light)",
            background: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "820px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: "#065f46",
                  background: "#ecfdf5",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                {report.tag || "Institutional Research Report"}
              </span>
              {report.date && (
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                  {report.date}
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: "20px",
                fontWeight: "700",
                margin: "2px 0 0",
                lineHeight: "1.3",
                color: "var(--ink)",
              }}
            >
              {report.title}
            </h1>

            {report.deck && (
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: "1.5",
                }}
              >
                {report.deck}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, paddingTop: "2px" }}>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dash-card-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: "600",
                padding: "7px 14px",
                borderRadius: "6px",
                background: "#fafafa",
                border: "1px solid var(--gold-light)",
                color: "var(--ink)",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              Open Fullscreen <ArrowUpRight />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close report viewer"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid var(--gold-light)",
                background: "#fafafa",
                color: "var(--ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.15s ease",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Report Content Body with Embedded Document */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f4f4f5",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <iframe
            src={report.url}
            title={report.title}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
