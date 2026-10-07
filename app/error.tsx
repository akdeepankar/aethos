"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js App Router error caught:", error);
  }, [error]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "36px 28px",
        textAlign: "center",
        background: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#fef2f2",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        !
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>
        Unable to load requested page
      </h2>

      <p style={{ fontSize: "13.5px", color: "#64748b", margin: "0 0 24px", lineHeight: "1.6" }}>
        {error?.message || "An unexpected error occurred in the application router. Please try resetting or navigate back."}
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "9px 18px",
            background: "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "7px",
            fontSize: "12.5px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>

        <Link
          href="/"
          style={{
            padding: "9px 18px",
            background: "#f1f5f9",
            color: "#475569",
            borderRadius: "7px",
            fontSize: "12.5px",
            fontWeight: "600",
            textDecoration: "none",
            border: "1px solid #cbd5e1",
          }}
        >
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
