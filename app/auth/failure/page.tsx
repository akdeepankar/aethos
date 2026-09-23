"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthFailurePage() {
  const [errorMessage, setErrorMessage] = useState<string>("Authentication could not be completed.");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const err = url.searchParams.get("error");
      if (err) {
        setErrorMessage(decodeURIComponent(err));
      }
    }
  }, []);

  return (
    <div className="dash-overview-page" style={{ maxWidth: "480px", margin: "50px auto 80px" }}>
      <div
        className="dash-card"
        style={{
          padding: "36px 32px",
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #fecaca",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            background: "#fef2f2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            color: "#dc2626",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#991b1b", margin: "0 0 8px" }}>
          Sign In Failed
        </h1>

        <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 20px", lineHeight: "1.5" }}>
          {errorMessage}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/auth"
            className="button"
            style={{
              padding: "12px 20px",
              background: "#15191e",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "13px",
              textAlign: "center",
              display: "block",
            }}
          >
            Try Signing In Again
          </Link>

          <Link
            href="/"
            style={{
              padding: "10px 16px",
              fontSize: "12px",
              color: "var(--muted)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
