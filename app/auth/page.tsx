"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { account, OAuthProvider } from "../_lib/appwrite";

export function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.7034 7.91133C14.7554 7.02509 13.4903 6.54228 12.1813 6.56212C9.78605 6.56212 7.75176 8.14611 7.02642 10.279V10.2791C6.64183 11.3968 6.64183 12.6071 7.02642 13.7249H7.02979C7.75849 15.8545 9.78941 17.4385 12.1847 17.4385C13.4211 17.4385 14.4826 17.1285 15.3053 16.5809V16.5787C16.2735 15.9504 16.9348 14.9616 17.1406 13.8439H12.1813V10.3783H20.8414C20.9494 10.9802 21 11.5952 21 12.207C21 14.9443 20.002 17.2586 18.2655 18.826L18.2673 18.8274C16.7458 20.203 14.6576 21 12.1813 21C8.70985 21 5.53527 19.082 3.97666 16.043V16.043C2.67445 13.5 2.67445 10.5039 3.97666 7.96096H3.97668L3.97666 7.96094C5.53527 4.9186 8.70985 3.00061 12.1813 3.00061C14.4619 2.97415 16.6649 3.8141 18.3247 5.34188L15.7034 7.91133Z"
        fill="#C4C6D7"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auth Guard: If already signed in, redirect to intended target or /
  useEffect(() => {
    let isCancelled = false;

    async function checkExistingSession() {
      try {
        await account.get();
        if (!isCancelled) {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get("redirect") || "/";
          window.location.assign(redirectUrl);
        }
      } catch {
        if (!isCancelled) {
          setCheckingAuth(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setErrorMsg(null);

      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/";
      sessionStorage.setItem("aethos_auth_redirect", redirectUrl);

      const success = `${window.location.origin}/auth/success`;
      const failure = `${window.location.origin}/auth/failure`;

      // createOAuth2Token navigates the browser to Google OAuth provider
      await account.createOAuth2Token({
        provider: OAuthProvider.Google,
        success,
        failure,
      });
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setIsSigningIn(false);
      setErrorMsg(err instanceof Error ? err.message : "Failed to connect to Google Sign In");
    }
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e2e8f0",
            borderTopColor: "var(--ink)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600" }}>
          Checking Aethos authentication...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid var(--gold-light)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.05)",
          padding: "40px 36px",
          textAlign: "center",
        }}
      >
        {/* Brand Emblem */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "12px",
              background: "#fafafa",
              border: "1px solid var(--gold-light)",
              display: "inline-flex",
            }}
          >
            <Image
              src="/aethos-eagle-logo.jpeg"
              alt="Aethos Wealth"
              width={48}
              height={48}
              style={{ borderRadius: "8px", objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#9a6b1f",
              background: "#fffaf0",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid #f2dfba",
            }}
          >
            Member Gatewall
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "12px 0 6px",
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Sign in to Aethos Wealth
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>
            Institutional research library, fundamental compounders, and IPO underwriting notes.
          </p>
        </div>

        {/* Feature Points */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            padding: "16px 18px",
            marginBottom: "24px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#334155" }}>
            <span style={{ color: "#16a34a", fontWeight: "700" }}>✓</span>
            <span>Comprehensive Company &amp; Sectoral Notes</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#334155" }}>
            <span style={{ color: "#16a34a", fontWeight: "700" }}>✓</span>
            <span>Aethos Ideas &amp; Multi-Year Trigger Tracking</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#334155" }}>
            <span style={{ color: "#16a34a", fontWeight: "700" }}>✓</span>
            <span>IPO Intelligence &amp; Forensic Checklists</span>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "20px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#991b1b",
              fontSize: "12.5px",
              textAlign: "left",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Primary CTA: Sign in with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "14px 20px",
            background: "#15191e",
            color: "#ffffff",
            border: "1px solid #15191e",
            borderRadius: "9px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: isSigningIn ? "not-allowed" : "pointer",
            opacity: isSigningIn ? 0.85 : 1,
            transition: "all 0.15s ease",
            boxShadow: "0 2px 8px rgba(21, 25, 30, 0.15)",
          }}
        >
          <GoogleIcon />
          <span>{isSigningIn ? "Connecting with Google..." : "Sign in with Google"}</span>
        </button>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: "1.5" }}>
            Secured via enterprise Appwrite OAuth2 authentication. No passwords stored.
          </p>
        </div>
      </div>
    </div>
  );
}
