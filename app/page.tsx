"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./_context/auth-context";

// Icons for 6 features
function IconAethosIdeas() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <rect x="5" y="4" width="14" height="14" rx="2" transform="rotate(-6 12 11)" />
      <rect x="5" y="4" width="14" height="14" rx="2" transform="rotate(3 12 11)" />
      <rect x="5" y="4" width="14" height="14" rx="2" fill="#FAF8F5" />
    </svg>
  );
}

function IconThemesSectors() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
      <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
      <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" />
    </svg>
  );
}

function IconIpoTracking() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <rect x="4" y="3" width="12" height="18" rx="1" />
      <line x1="16" y1="21" x2="21" y2="21" />
      <line x1="16" y1="17" x2="19" y2="17" />
    </svg>
  );
}

function IconResearchLibrary() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </svg>
  );
}

function IconMarketPulse() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3" fill="#c59b27" />
    </svg>
  );
}

function IconDirectMessage() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c59b27" strokeWidth="1.6">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#c59b27", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", flexShrink: 0 }}>
      ✓
    </div>
  );
}

function CrossIcon() {
  return (
    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1.5px solid #a88a40", color: "#a88a40", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", flexShrink: 0 }}>
      ✕
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ background: "#090a0d", color: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight: "100vh" }}>
      
      {/* ── Top Navigation Header ── */}
      <header
        style={{
          borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
          background: "#08090b",
          padding: "16px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #c59b27",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image src="/aethos-eagle-logo.jpeg" alt="Aethos Eagle" fill style={{ objectFit: "cover" }} priority />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "0.12em", color: "#f8fafc", lineHeight: "1.1" }}>
              AETHOS WEALTH
            </span>
            <span style={{ fontSize: "9.5px", color: "#c59b27", letterSpacing: "0.05em", fontWeight: "500" }}>
              Perspective that creates value
            </span>
          </div>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: "#d1d5db", fontSize: "13.5px", textDecoration: "none", fontWeight: "500", cursor: "pointer" }}
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: "#d1d5db", fontSize: "13.5px", textDecoration: "none", fontWeight: "500", cursor: "pointer" }}
          >
            Pricing
          </a>
          {user ? (
            <Link
              href="/overview"
              style={{
                color: "#e2c275",
                fontSize: "13.5px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Go to Portal →
            </Link>
          ) : (
            <Link href="/signin" style={{ color: "#d1d5db", fontSize: "13.5px", textDecoration: "none", fontWeight: "500" }}>
              Log in
            </Link>
          )}
          <Link
            href="/membership"
            style={{
              border: "1px solid #c59b27",
              color: "#e2c275",
              padding: "7px 18px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Subscribe
          </Link>
        </nav>
      </header>

      {/* ── Hero Container (Full Viewport) ── */}
      <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Hero Section */}
        <section style={{ position: "relative", overflow: "hidden", padding: "40px 36px", maxWidth: "1280px", margin: "auto", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "center" }}>
            {/* Left Hero Text */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "20px" }}>
                INDEPENDENT THINKING STARTS WITH DEEPER RESEARCH
              </div>

              <h1
                style={{
                  fontSize: "clamp(38px, 4.5vw, 62px)",
                  fontWeight: "800",
                  color: "#ffffff",
                  lineHeight: "1.08",
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                Ignore the noise.<br />
                Build your own<br />
                <span
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontStyle: "italic",
                    color: "#e2c275",
                    fontWeight: "400",
                  }}
                >
                  perspective.
                </span>
              </h1>

              <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.65", maxWidth: "520px", marginBottom: "32px" }}>
                Explore businesses, sectors and IPOs through research that connects the numbers, the narrative and the risks.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", marginBottom: "20px" }}>
                <Link
                  href="/overview"
                  style={{
                    background: "#e2c275",
                    color: "#090a0d",
                    padding: "13px 28px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "700",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 20px rgba(226, 194, 117, 0.25)",
                  }}
                >
                  Explore sample access →
                </Link>
                <Link
                  href="/membership"
                  style={{
                    border: "1px solid rgba(197, 155, 39, 0.6)",
                    background: "rgba(9, 10, 13, 0.6)",
                    color: "#ffffff",
                    padding: "13px 28px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Discover membership
                </Link>
              </div>

              <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                For curious investors. Built for independent thinking.
              </div>
            </div>

            {/* Right Hero Eagle Graphic */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div
                style={{
                  position: "absolute",
                  width: "500px",
                  height: "500px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(197, 155, 39, 0.22) 0%, rgba(9, 10, 13, 0) 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", width: "100%", maxWidth: "520px", height: "480px" }}>
                <Image
                  src="/eagle.png"
                  alt="Aethos Eagle Artwork"
                  fill
                  style={{ objectFit: "contain", filter: "drop-shadow(0 10px 30px rgba(197, 155, 39, 0.15))" }}
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Hero Bottom Tagline */}
          <div style={{ textAlign: "right", marginTop: "20px", fontSize: "11px", letterSpacing: "0.22em", color: "#c59b27", textTransform: "uppercase", fontWeight: "600" }}>
            VISION. PRECISION. INTEGRITY.
          </div>
        </section>

        {/* ── Golden Ticker Banner ── */}
        <div
          style={{
            borderTop: "1px solid rgba(197, 155, 39, 0.2)",
            borderBottom: "1px solid rgba(197, 155, 39, 0.2)",
            background: "#0d0e12",
            padding: "14px 24px",
            textAlign: "center",
            fontSize: "11.5px",
            fontWeight: "700",
            letterSpacing: "0.2em",
            color: "#c59b27",
            textTransform: "uppercase",
          }}
        >
          DEPTH OVER SPEED. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; EVIDENCE OVER EXCITEMENT. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; PERSPECTIVE OVER NOISE.
        </div>
      </div>

      {/* ── Section 2: INSIDE AETHOS (Cream Light Background - Full Viewport) ── */}
      <section id="features" style={{ background: "#faf8f5", color: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", padding: "60px 36px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px" }}>
            INSIDE AETHOS
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 3.5vw, 46px)",
              fontWeight: "800",
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#0f172a",
              marginBottom: "50px",
              letterSpacing: "-0.02em",
            }}
          >
            Better questions. Deeper research.
          </h2>

          {/* 6 Grid items (3 Columns) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "40px 36px" }}>
            
            {/* 1. AETHOS IDEAS */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconAethosIdeas />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                AETHOS IDEAS
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                What makes a business worth a closer look?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Stock deep dives into business models, competitive strengths, growth drivers, valuation and risks.
              </p>
            </div>

            {/* 2. THEMES & SECTORS */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconThemesSectors />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                THEMES &amp; SECTORS
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                Where is the next structural shift?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Understand industry economics, emerging themes and the companies shaping them.
              </p>
            </div>

            {/* 3. IPO TRACKING */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconIpoTracking />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                IPO TRACKING
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                What happens after the listing-day noise?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Detailed IPO notes and continued tracking to explore post-listing opportunities.
              </p>
            </div>

            {/* 4. FULL RESEARCH LIBRARY */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconResearchLibrary />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                FULL RESEARCH LIBRARY
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                Can you connect today&apos;s update to the bigger picture?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Revisit a growing, searchable archive of reports, company notes and past developments.
              </p>
            </div>

            {/* 5. MARKET PULSE */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconMarketPulse />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                MARKET PULSE
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                What changed—and why does it matter?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Track company announcements, fundraises, special situations and corporate actions.
              </p>
            </div>

            {/* 6. DIRECT MESSAGE ACCESS */}
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <IconDirectMessage />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                DIRECT MESSAGE ACCESS
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "10px" }}>
                What would you like to understand better?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>
                Discuss published research, clarify an assumption or suggest a company to explore.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: THE THINKING BEHIND OUR NAME (Dark Background) ── */}
      <section style={{ background: "#090a0d", minHeight: "100vh", display: "flex", alignItems: "center", borderTop: "1px solid rgba(197, 155, 39, 0.15)", borderBottom: "1px solid rgba(197, 155, 39, 0.15)", padding: "60px 36px" }}>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "16px" }}>
            THE THINKING BEHIND OUR NAME
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "stretch" }}>
            <div>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: "800",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#ffffff",
                  lineHeight: "1.1",
                  marginBottom: "40px",
                }}
              >
                Aetos + Ethos = <span style={{ color: "#e2c275" }}>Aethos</span>
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div style={{ borderLeft: "1px solid rgba(197, 155, 39, 0.3)", paddingLeft: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#e2c275", marginBottom: "4px" }}>
                    Aetos <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "400" }}>/ The eagle</span>
                  </h3>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
                    Vision &amp; precision
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                    The depth to look closer. The discipline to see beyond the obvious.
                  </p>
                </div>

                <div style={{ borderLeft: "1px solid rgba(197, 155, 39, 0.3)", paddingLeft: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#e2c275", marginBottom: "4px" }}>
                    Ethos <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "400" }}>/ Character &amp; integrity</span>
                  </h3>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
                    Conviction, grounded in evidence
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: "1.5", margin: 0 }}>
                    Question assumptions. Acknowledge risks. Stay open to a better perspective.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Quote Card */}
            <div
              style={{
                border: "1px solid rgba(197, 155, 39, 0.3)",
                borderRadius: "8px",
                background: "radial-gradient(circle at top right, rgba(197, 155, 39, 0.1), rgba(9, 10, 13, 0.95))",
                padding: "40px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <blockquote
                style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  color: "#f8fafc",
                  lineHeight: "1.35",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                &ldquo;We believe wealth built on conviction outlasts wealth built on noise.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: A Clear Lens / Deliberate Filter (Cream Background) ── */}
      <section style={{ background: "#faf8f5", color: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", padding: "60px 36px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: "800",
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#0f172a",
              marginBottom: "48px",
            }}
          >
            A clear lens. A deliberate filter.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
            {/* What we cover */}
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", color: "#0f172a", marginBottom: "24px" }}>
                What we cover
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#334155", fontWeight: "500" }}>
                  <CheckIcon />
                  Businesses beyond the familiar names
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#334155", fontWeight: "500" }}>
                  <CheckIcon />
                  Capacity, execution and cash generation
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#334155", fontWeight: "500" }}>
                  <CheckIcon />
                  Industry shifts and company developments
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#334155", fontWeight: "500" }}>
                  <CheckIcon />
                  Valuation, governance and the downside
                </li>
              </ul>
            </div>

            {/* What we ignore */}
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", color: "#0f172a", marginBottom: "24px" }}>
                What we ignore
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#64748b" }}>
                  <CrossIcon />
                  Rumours dressed as research
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#64748b" }}>
                  <CrossIcon />
                  Daily price noise and sensationalism
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#64748b" }}>
                  <CrossIcon />
                  Guaranteed-return narratives
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#64748b" }}>
                  <CrossIcon />
                  Buy / sell tips and target-price calls
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Bottom CTA Banner ── */}
      <section id="pricing" style={{ background: "#faf8f5", borderTop: "1px solid #e2e8f0", padding: "60px 36px 80px", textAlign: "center", scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(30px, 3.8vw, 48px)",
              fontWeight: "800",
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#0f172a",
              marginBottom: "12px",
            }}
          >
            Build a perspective you can call your own.
          </h2>
          <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "32px" }}>
            Perspective that creates value.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
            <Link
              href="/overview"
              style={{
                background: "#0f172a",
                color: "#ffffff",
                padding: "13px 28px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Explore sample access →
            </Link>
            <Link
              href="/membership"
              style={{
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                padding: "13px 28px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              View membership plans
            </Link>
          </div>

          <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            New research updates also reach members through the Aethos WhatsApp group.
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(212, 175, 55, 0.15)",
          background: "#08090b",
          padding: "32px 36px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #c59b27", overflow: "hidden", position: "relative" }}>
            <Image src="/aethos-eagle-logo.jpeg" alt="Aethos Eagle" fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", letterSpacing: "0.08em" }}>
              AETHOS WEALTH
            </span>
            <span style={{ display: "block", fontSize: "9px", color: "#c59b27" }}>
              Perspective that creates value
            </span>
          </div>
        </div>

        <div>
          Research and information only. Not investment advice or stock recommendations.
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/about" style={{ color: "#64748b", textDecoration: "none" }}>Privacy</Link>
          <span>•</span>
          <Link href="/about" style={{ color: "#64748b", textDecoration: "none" }}>Terms</Link>
          <span>•</span>
          <Link href="/about" style={{ color: "#64748b", textDecoration: "none" }}>Contact</Link>
        </div>
      </footer>

    </div>
  );
}
