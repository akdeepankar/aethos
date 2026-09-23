"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { account } from "../_lib/appwrite";
import { Models } from "appwrite";
import { ArrowUpRight } from "../_components/site-chrome";

export default function DashboardPage() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // Auth Guard: If not signed in, redirect to /auth
  useEffect(() => {
    let isCancelled = false;

    async function loadDashboard() {
      try {
        const currentUser = await account.get();
        if (!isCancelled) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch {
        if (!isCancelled) {
          window.location.assign("/auth");
        }
      }
    }

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await account.deleteSession({ sessionId: "current" });
      window.location.assign("/auth");
    } catch (err) {
      console.error("Sign out error:", err);
      window.location.assign("/auth");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e2e8f0",
            borderTopColor: "var(--ink)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600" }}>
          Loading your dashboard...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const displayName = user?.name || user?.email || "Valued Member";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dash-overview-page">
      {/* Welcome Banner */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
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
              Authenticated Member
            </span>
          </div>
          <h1>Welcome back, {displayName}</h1>
          <p>You are signed in via Google OAuth with Appwrite Auth.</p>
        </div>

        <div className="dash-banner-meta">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              padding: "8px 18px",
              background: "#ffffff",
              color: "#991b1b",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: signingOut ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* User Details Profile Card */}
      <div className="dash-card" style={{ marginBottom: "20px" }}>
        <div className="dash-card-head">
          <h3 className="dash-card-title">Member Account Profile</h3>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Connected via Google</span>
        </div>

        <div className="dash-card-body" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#15191e",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "0.05em",
              }}
            >
              {userInitials}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <strong style={{ fontSize: "18px", color: "var(--ink)" }}>{displayName}</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>{user?.email}</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", fontWeight: "600" }}>Account ID</span>
              <span style={{ fontSize: "13px", color: "var(--ink)", fontWeight: "700", display: "block", marginTop: "2px", wordBreak: "break-all" }}>
                {user?.$id}
              </span>
            </div>

            <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", fontWeight: "600" }}>Email Status</span>
              <span style={{ fontSize: "13px", color: user?.emailVerification ? "#065f46" : "#b45309", fontWeight: "700", display: "block", marginTop: "2px" }}>
                {user?.emailVerification ? "✓ Verified" : "Google Verified"}
              </span>
            </div>

            <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", fontWeight: "600" }}>Membership Tier</span>
              <span style={{ fontSize: "13px", color: "#a76511", fontWeight: "700", display: "block", marginTop: "2px" }}>
                Institutional Access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <Link href="/research" className="dash-card" style={{ padding: "22px", textDecoration: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted)" }}>
              Library
            </span>
            <ArrowUpRight />
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px", color: "var(--ink)" }}>
            Research Library
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
            Explore in-depth company notes, sectoral maps, and thematic compounder deep dives.
          </p>
        </Link>

        <Link href="/ideas" className="dash-card" style={{ padding: "22px", textDecoration: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#065f46" }}>
              High Conviction
            </span>
            <ArrowUpRight />
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px", color: "var(--ink)" }}>
            Aethos Ideas
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
            Review high-conviction ideas like RACL Geartech with live return tracking and trigger checklists.
          </p>
        </Link>

        <Link href="/ipos" className="dash-card" style={{ padding: "22px", textDecoration: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#1d4ed8" }}>
              Underwriting
            </span>
            <ArrowUpRight />
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px", color: "var(--ink)" }}>
            IPO Intelligence
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: "1.5" }}>
            Track live and upcoming mainboard / SME IPO issues with objective underwriting notes.
          </p>
        </Link>
      </div>
    </div>
  );
}
