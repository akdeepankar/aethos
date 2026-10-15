"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user, signInWithGoogle, loading } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  const handleChoosePlan = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    if (user) {
      router.push("/membership");
    } else {
      await signInWithGoogle("/membership");
    }
  };

  return (
    <div style={{ background: "#090a0d", color: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", minHeight: "100vh" }}>
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .landing-header {
            padding: 12px 16px !important;
          }
          .hero-section {
            padding: 48px 16px 36px !important;
            min-height: auto !important;
          }
          .hero-badge {
            font-size: 9.5px !important;
            padding: 6px 14px !important;
            margin-bottom: 16px !important;
          }
          .ticker-banner {
            font-size: 10px !important;
            padding: 10px 12px !important;
            letter-spacing: 0.1em !important;
          }
          .section-padding {
            padding: 48px 16px !important;
            min-height: auto !important;
          }
          .philosophy-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .thinking-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .feature-grid-items {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .footer-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
            padding: 24px 16px !important;
          }
        }
      `}</style>
      
      {/* ── Top Navigation Header ── */}
      <header
        className="landing-header"
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

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
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

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid rgba(197, 155, 39, 0.4)",
            borderRadius: "6px",
            color: "#e2c275",
            padding: "6px 10px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Toggle navigation menu"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "61px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "#08090b",
            zIndex: 40,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            borderBottom: "1px solid rgba(197, 155, 39, 0.2)",
          }}
        >
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: "#f8fafc", fontSize: "16px", textDecoration: "none", fontWeight: "600", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: "#f8fafc", fontSize: "16px", textDecoration: "none", fontWeight: "600", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            Pricing
          </a>
          {user ? (
            <Link
              href="/overview"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#e2c275", fontSize: "16px", textDecoration: "none", fontWeight: "600", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              Go to Portal →
            </Link>
          ) : (
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#f8fafc", fontSize: "16px", textDecoration: "none", fontWeight: "600", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              Log in
            </Link>
          )}
          <Link
            href="/membership"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              border: "1px solid #c59b27",
              background: "rgba(197, 155, 39, 0.1)",
              color: "#e2c275",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "700",
              textDecoration: "none",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Subscribe
          </Link>
        </div>
      )}

      {/* ── Hero Container (Full Viewport) ── */}
      <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Hero Section */}
        <section className="hero-section" style={{ position: "relative", overflow: "hidden", padding: "80px 24px 60px", maxWidth: "1280px", margin: "auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "560px", textAlign: "center" }}>
          
          {/* Dimmed Eagle Background in Center */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: "680px",
              height: "580px",
              opacity: 0.18,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(197, 155, 39, 0.35) 0%, rgba(9, 10, 13, 0) 70%)",
                filter: "blur(40px)",
              }}
            />
            <Image
              src="/eagle.png"
              alt="Aethos Eagle Artwork"
              fill
              style={{ objectFit: "contain", filter: "brightness(0.9) contrast(1.1)" }}
              priority
              unoptimized
            />
          </div>

          {/* Hero Content Overlay */}
          <div style={{ position: "relative", zIndex: 10, maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* Top Badge */}
            <div
              className="hero-badge"
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.22em",
                color: "#c59b27",
                textTransform: "uppercase",
                marginBottom: "24px",
                background: "rgba(197, 155, 39, 0.08)",
                border: "1px solid rgba(197, 155, 39, 0.25)",
                padding: "8px 20px",
                borderRadius: "9999px",
                backdropFilter: "blur(8px)",
              }}
            >
              INDEPENDENT THINKING STARTS WITH DEEPER RESEARCH
            </div>

            {/* Hero Main Heading */}
            <h1
              style={{
                fontSize: "clamp(32px, 5.5vw, 72px)",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.08",
                letterSpacing: "-0.025em",
                marginBottom: "28px",
              }}
            >
              Ignore the noise.<br />
              Build your own{" "}
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

            {/* Hero Subtitle */}
            <p style={{ fontSize: "clamp(15px, 1.8vw, 19px)", color: "#94a3b8", lineHeight: "1.65", maxWidth: "660px", marginBottom: "40px", fontWeight: "400" }}>
              Explore businesses, sectors and IPOs through research that connects the numbers, the narrative and the risks.
            </p>

            {/* Hero Action Buttons */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginBottom: "32px", width: "100%" }}>
              <Link
                href="/overview"
                style={{
                  background: "#e2c275",
                  color: "#090a0d",
                  padding: "14px 28px",
                  borderRadius: "6px",
                  fontSize: "14.5px",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 25px rgba(226, 194, 117, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Explore sample access →
              </Link>
              <Link
                href="/membership"
                style={{
                  border: "1px solid rgba(197, 155, 39, 0.6)",
                  background: "rgba(18, 21, 28, 0.7)",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "6px",
                  fontSize: "14.5px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s ease",
                }}
              >
                Discover membership
              </Link>
            </div>

            <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "0.02em" }}>
              For curious investors. Built for independent thinking.
            </div>
          </div>

          {/* Hero Bottom Tagline */}
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: "48px", fontSize: "11px", letterSpacing: "0.25em", color: "#c59b27", textTransform: "uppercase", fontWeight: "600" }}>
            VISION. PRECISION. INTEGRITY.
          </div>
        </section>

        {/* ── Golden Ticker Banner ── */}
        <div
          className="ticker-banner"
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
      <section id="features" className="section-padding" style={{ background: "#faf8f5", color: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 36px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px" }}>
              INSIDE AETHOS
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 50px)",
                fontWeight: "800",
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#0f172a",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Better questions. Deeper research.
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              A structured approach to evaluating businesses beyond surface-level narratives.
            </p>
          </div>

          {/* 6 Grid items (3 Columns) with premium card styling */}
          <div className="feature-grid-items" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            
            {/* 1. AETHOS IDEAS */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconAethosIdeas />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                AETHOS IDEAS
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                What makes a business worth a closer look?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Stock deep dives into business models, competitive strengths, growth drivers, valuation and risks.
              </p>
            </div>

            {/* 2. THEMES & SECTORS */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconThemesSectors />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                THEMES &amp; SECTORS
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                Where is the next structural shift?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Understand industry economics, emerging themes and the companies shaping them.
              </p>
            </div>

            {/* 3. IPO TRACKING */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconIpoTracking />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                IPO TRACKING
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                What happens after the listing-day noise?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Detailed IPO notes and continued tracking to explore post-listing opportunities.
              </p>
            </div>

            {/* 4. FULL RESEARCH LIBRARY */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconResearchLibrary />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                FULL RESEARCH LIBRARY
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                Can you connect today&apos;s update to the bigger picture?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Revisit a growing, searchable archive of reports, company notes and past developments.
              </p>
            </div>

            {/* 5. MARKET PULSE */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconMarketPulse />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                MARKET PULSE
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                What changed—and why does it matter?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Track company announcements, fundraises, special situations and corporate actions.
              </p>
            </div>

            {/* 6. DIRECT MESSAGE ACCESS */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <IconDirectMessage />
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.18em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>
                DIRECT MESSAGE ACCESS
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: "#0f172a", marginBottom: "12px", lineHeight: "1.3" }}>
                What would you like to understand better?
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.65", margin: 0 }}>
                Discuss published research, clarify an assumption or suggest a company to explore.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: THE THINKING BEHIND OUR NAME (Dark Luxury Background) ── */}
      <section className="section-padding" style={{ background: "#08090c", minHeight: "100vh", display: "flex", alignItems: "center", borderTop: "1px solid rgba(197, 155, 39, 0.2)", borderBottom: "1px solid rgba(197, 155, 39, 0.2)", padding: "80px 36px", position: "relative", overflow: "hidden" }}>
        
        {/* Subtle golden ambient light */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(197, 155, 39, 0.15) 0%, rgba(8, 9, 12, 0) 70%)", pointerEvents: "none", filter: "blur(50px)" }} />

        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.22em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px", display: "inline-block", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.25)", padding: "6px 18px", borderRadius: "9999px" }}>
              THE THINKING BEHIND OUR NAME
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 4.5vw, 58px)",
                fontWeight: "800",
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#ffffff",
                lineHeight: "1.1",
                letterSpacing: "-0.01em",
              }}
            >
              Aetos + Ethos = <span style={{ color: "#e2c275" }}>Aethos</span>
            </h2>
          </div>

          <div className="thinking-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", alignItems: "stretch" }}>
            
            {/* Left Cards Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Aetos Card */}
              <div style={{ background: "linear-gradient(135deg, rgba(22, 26, 35, 0.9) 0%, rgba(14, 16, 22, 0.9) 100%)", border: "1px solid rgba(197, 155, 39, 0.35)", borderRadius: "16px", padding: "28px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#c59b27" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#e2c275", margin: 0, letterSpacing: "0.02em" }}>
                    Aetos
                  </h3>
                  <span style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#e2c275", textTransform: "uppercase", background: "rgba(197, 155, 39, 0.12)", border: "1px solid rgba(197, 155, 39, 0.3)", padding: "4px 12px", borderRadius: "9999px" }}>
                    The Eagle
                  </span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                  Vision &amp; Precision
                </div>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.65", margin: 0 }}>
                  The depth to look closer. The discipline to see beyond the obvious noise and evaluate fundamental strength with clarity.
                </p>
              </div>

              {/* Ethos Card */}
              <div style={{ background: "linear-gradient(135deg, rgba(22, 26, 35, 0.9) 0%, rgba(14, 16, 22, 0.9) 100%)", border: "1px solid rgba(197, 155, 39, 0.35)", borderRadius: "16px", padding: "28px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#e2c275" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#e2c275", margin: 0, letterSpacing: "0.02em" }}>
                    Ethos
                  </h3>
                  <span style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#e2c275", textTransform: "uppercase", background: "rgba(197, 155, 39, 0.12)", border: "1px solid rgba(197, 155, 39, 0.3)", padding: "4px 12px", borderRadius: "9999px" }}>
                    Character &amp; Integrity
                  </span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                  Conviction Grounded in Evidence
                </div>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.65", margin: 0 }}>
                  Question assumptions. Acknowledge risks explicitly. Stay open to building a genuine, value-generating perspective.
                </p>
              </div>

            </div>

            {/* Right Featured Principle Box */}
            <div
              style={{
                border: "1px solid rgba(197, 155, 39, 0.45)",
                borderRadius: "18px",
                background: "radial-gradient(circle at top right, rgba(197, 155, 39, 0.22), rgba(12, 14, 18, 0.98))",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div style={{ fontSize: "44px", color: "#c59b27", lineHeight: "1", marginBottom: "8px", opacity: 0.8, fontFamily: "serif" }}>
                “
              </div>
              <blockquote
                style={{
                  fontSize: "clamp(20px, 2.5vw, 32px)",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  color: "#ffffff",
                  lineHeight: "1.4",
                  margin: "0 0 20px 0",
                  textAlign: "center",
                }}
              >
                We believe wealth built on conviction outlasts wealth built on noise.
              </blockquote>
              <div style={{ fontSize: "10.5px", letterSpacing: "0.2em", color: "#c59b27", textTransform: "uppercase", fontWeight: "800", background: "rgba(197, 155, 39, 0.12)", border: "1px solid rgba(197, 155, 39, 0.3)", padding: "5px 16px", borderRadius: "9999px" }}>
                THE AETHOS PRINCIPLE
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 4: A Clear Lens / Deliberate Filter (Cream Background) ── */}
      <section className="section-padding" style={{ background: "#faf8f5", color: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 36px" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto", width: "100%" }}>
          
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px" }}>
              OUR PHILOSOPHY
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 50px)",
                fontWeight: "800",
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#0f172a",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              A clear lens. A deliberate filter.
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              We set strict research parameters so you focus only on what truly moves business value.
            </p>
          </div>

          <div className="philosophy-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
            
            {/* What we cover */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px 24px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#059669", padding: "5px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                ✓ FOCUS AREAS
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", fontFamily: "var(--font-playfair), serif", color: "#0f172a", marginBottom: "20px" }}>
                What we cover
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#334155", fontWeight: "500", lineHeight: "1.5" }}>
                  <CheckIcon />
                  <span>Businesses beyond the familiar headline names</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#334155", fontWeight: "500", lineHeight: "1.5" }}>
                  <CheckIcon />
                  <span>Capacity expansion, execution track record and cash generation</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#334155", fontWeight: "500", lineHeight: "1.5" }}>
                  <CheckIcon />
                  <span>Structural industry shifts and emerging corporate developments</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#334155", fontWeight: "500", lineHeight: "1.5" }}>
                  <CheckIcon />
                  <span>Discipline on valuation, governance checks and downside risk</span>
                </li>
              </ul>
            </div>

            {/* What we ignore */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px 24px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#dc2626", padding: "5px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                ✕ NOISE FILTER
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", fontFamily: "var(--font-playfair), serif", color: "#0f172a", marginBottom: "20px" }}>
                What we ignore
              </h3>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#64748b", lineHeight: "1.5" }}>
                  <CrossIcon />
                  <span>Market rumours dressed up as formal research</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#64748b", lineHeight: "1.5" }}>
                  <CrossIcon />
                  <span>Short-term daily price noise and media sensationalism</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#64748b", lineHeight: "1.5" }}>
                  <CrossIcon />
                  <span>Guaranteed-return hype and speculative momentum calls</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14.5px", color: "#64748b", lineHeight: "1.5" }}>
                  <CrossIcon />
                  <span>Buy / sell tip sheets and arbitrary target-price predictions</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 5: THE AETHOS MEMBERSHIP / PRICING SECTION ── */}
      <section id="pricing" className="section-padding" style={{ background: "#0b0d11", color: "#f8fafc", padding: "80px 24px", scrollMarginTop: "60px", borderTop: "1px solid rgba(197, 155, 39, 0.2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px" }}>
              THE AETHOS MEMBERSHIP
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: "800", fontFamily: "var(--font-playfair), Georgia, serif", color: "#ffffff", marginBottom: "16px", letterSpacing: "-0.01em" }}>
              One membership. A deeper perspective.
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "640px", margin: "0 auto 20px", lineHeight: "1.6" }}>
              Explore businesses, sectors and market developments through research built for independent thinking.
            </p>

            <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px", background: "rgba(197, 155, 39, 0.1)", border: "1px solid rgba(197, 155, 39, 0.3)", padding: "8px 16px", borderRadius: "9999px", fontSize: "12px", color: "#e2c275", fontWeight: "500" }}>
              <span>Full research access</span>
              <span style={{ color: "#c59b27" }}>•</span>
              <span>One-time payment</span>
              <span style={{ color: "#c59b27" }}>•</span>
              <span>No auto-renewal</span>
            </div>
          </div>

          {/* Pricing Tier Cards Grid (3 Cards) */}
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            
            {/* 3 Months */}
            <div style={{ background: "#12151c", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>3 Months</h3>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", lineHeight: "1", marginBottom: "8px" }}>₹4,500</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Paid once for 3 months</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "28px" }}>(₹1,500 / month)</div>
              </div>
              <button
                onClick={handleChoosePlan}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Choose 3 months
              </button>
            </div>

            {/* 6 Months */}
            <div style={{ background: "#12151c", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>6 Months</h3>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", lineHeight: "1", marginBottom: "8px" }}>₹7,500</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Paid once for 6 months</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "28px" }}>(₹1,250 / month)</div>
              </div>
              <button
                onClick={handleChoosePlan}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Choose 6 months
              </button>
            </div>

            {/* 1 Year - Best Value */}
            <div style={{ background: "radial-gradient(circle at top, rgba(197, 155, 39, 0.15), #12151c 70%)", border: "1px solid #c59b27", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", boxShadow: "0 8px 32px rgba(197, 155, 39, 0.12)" }}>
              <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#c59b27", color: "#090a0d", fontSize: "10px", fontWeight: "800", letterSpacing: "0.1em", padding: "4px 12px", borderRadius: "9999px", textTransform: "uppercase" }}>
                BEST VALUE
              </div>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>1 Year</h3>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#e2c275", lineHeight: "1", marginBottom: "8px" }}>₹12,000</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Paid once for 1 year</div>
                <div style={{ fontSize: "12px", color: "#c59b27", marginBottom: "28px" }}>(₹1,000 / month)</div>
              </div>
              <button
                onClick={handleChoosePlan}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  background: "#e2c275",
                  color: "#090a0d",
                  border: "none",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(226, 194, 117, 0.2)"
                }}
              >
                Choose 1 year
              </button>
            </div>

          </div>

          {/* Subtext under cards */}
          <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
            Monthly equivalents are for comparison. The full membership fee is paid upfront. <span style={{ marginLeft: "8px" }}>🔒 Secure payments via Razorpay</span>
          </div>

        </div>
      </section>

      {/* ── Section 6: MEMBERSHIP INCLUSIONS, FAQ & CTA (Single White Background Section) ── */}
      <section style={{ background: "#ffffff", color: "#0f172a", padding: "90px 24px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* 1. Features Grid Header */}
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", color: "#c59b27", textTransform: "uppercase", marginBottom: "12px", display: "inline-block", background: "rgba(197, 155, 39, 0.08)", border: "1px solid rgba(197, 155, 39, 0.2)", padding: "6px 18px", borderRadius: "9999px" }}>
              INCLUDED WITH EVERY DURATION
            </div>
            <h3 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: "800", fontFamily: "var(--font-playfair), Georgia, serif", color: "#0f172a", letterSpacing: "-0.01em" }}>
              Everything you need to look deeper.
            </h3>
          </div>

          {/* 6 Features Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "28px" }}>
            
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>AETHOS IDEAS</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>What makes a business worth studying?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Stock deep dives into business models, competitive strengths, growth drivers, valuation and risks.</div>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>THEMES &amp; SECTORS</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>Where is the next structural shift?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Understand industry economics, emerging themes and the companies shaping them.</div>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>IPO TRACKER</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>What follows the listing-day noise?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Detailed IPO notes and continued tracking to explore post-listing opportunities.</div>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>RESEARCH LIBRARY</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>How does the bigger picture connect?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Revisit a growing, searchable archive of reports, company notes and past developments.</div>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>MARKET PULSE</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>What changed—and why does it matter?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Track company announcements, fundraises, special situations and corporate actions.</div>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px 26px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "8px" }}>YOUR WATCHLIST</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", marginBottom: "8px" }}>What matters for the companies you follow?</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>Follow specific companies and receive updates as new research or notes are published.</div>
            </div>

          </div>

          {/* Direct Message Access Card */}
          <div style={{ background: "#faf8f5", border: "1px solid rgba(197, 155, 39, 0.3)", borderRadius: "12px", padding: "30px 36px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", color: "#c59b27", textTransform: "uppercase", marginBottom: "6px" }}>DIRECT MESSAGE ACCESS</div>
              <div style={{ fontSize: "19px", fontWeight: "700", color: "#0f172a", fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}>Questions about published research and membership support.</div>
            </div>
            <div style={{ fontSize: "14px", color: "#64748b", maxWidth: "480px", lineHeight: "1.5" }}>
              Direct line for questions regarding published reports, methodology or account help.
            </div>
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

      {/* ── Payment Modal for Razorpay ── */}
      {showPaymentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPaymentModal(false);
          }}
        >
          <div
            style={{
              background: "#12151c",
              border: "1px solid #c59b27",
              borderRadius: "16px",
              padding: "36px 28px",
              maxWidth: "420px",
              width: "100%",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                lineHeight: "1",
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
              Complete Your Subscription
            </h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px" }}>
              3 Months Membership — ₹4,500
            </p>

            <div
              ref={paymentContainerRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60px",
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
