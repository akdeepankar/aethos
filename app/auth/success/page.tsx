"use client";

import { useEffect, useState } from "react";
import { account } from "../../_lib/appwrite";

export default function AuthSuccessPage() {
  const [statusText, setStatusText] = useState("Completing Google Sign In...");

  useEffect(() => {
    let isCancelled = false;

    async function handleOAuthSuccess() {
      try {
        if (typeof window === "undefined") return;

        const url = new URL(window.location.href);
        const secret = url.searchParams.get("secret");
        const userId = url.searchParams.get("userId");

        if (!secret || !userId) {
          throw new Error("Missing OAuth credentials in callback URL");
        }

        setStatusText("Creating authenticated session...");
        await account.createSession({ userId, secret });

        if (!isCancelled) {
          setStatusText("Redirecting to Aethos Wealth...");
          const redirectUrl = sessionStorage.getItem("aethos_auth_redirect") || "/";
          sessionStorage.removeItem("aethos_auth_redirect");
          window.location.assign(redirectUrl);
        }
      } catch (err: unknown) {
        console.error("OAuth success handler error:", err);
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Authentication failed";
          window.location.assign(`/auth/failure?error=${encodeURIComponent(message)}`);
        }
      }
    }

    handleOAuthSuccess();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#059669",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--ink)", margin: 0 }}>
        {statusText}
      </h2>
      <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
        Please wait while we verify your credentials with Appwrite.
      </p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
