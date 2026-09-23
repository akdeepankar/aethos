"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../_context/auth-context";
import { AuthGate } from "./auth-gate";

// Icons
export function IconOverview() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconResearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconIpos() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M3 3v18h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m19 9-5 5-4-4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconJournal() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFeatures() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M12 2.8 14 10l7.2 2-7.2 2-2 7.2-2-7.2-7.2-2 7.2-2 2-7.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconIdeas() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zM9 21h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAbout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMembership() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 21-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon sm">
      <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const navItems = [
  { label: "Overview", href: "/", icon: IconOverview },
  { label: "Research Library", href: "/research", icon: IconResearch, badge: "120+" },
  { label: "Aethos Ideas", href: "/ideas", icon: IconIdeas, badge: "New", badgeType: "live" },
  { label: "IPO Intelligence", href: "/ipos", icon: IconIpos, badge: "Live", badgeType: "live" },
  { label: "Journal & Memos", href: "/journal", icon: IconJournal },
  { label: "Features", href: "/features", icon: IconFeatures },
];

const secondaryItems = [
  { label: "My Dashboard", href: "/dashboard", icon: IconOverview },
  { label: "Membership Plan", href: "/membership", icon: IconMembership },
  { label: "About Aethos", href: "/about", icon: IconAbout },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/signin") ||
    pathname === "/auth/success" ||
    pathname === "/auth/failure";

  // Dedicated clean view for Auth routes
  if (isAuthRoute) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: "64px",
            borderBottom: "1px solid #e2e8f0",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image
              src="/aethos-eagle-logo.jpeg"
              alt="Aethos"
              width={32}
              height={32}
              style={{ borderRadius: "6px" }}
              priority
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "0.1em", color: "#111111", lineHeight: 1.1 }}>
                AETHOS
              </span>
              <span style={{ fontSize: "8.5px", fontWeight: "700", letterSpacing: "0.12em", color: "#888888" }}>
                INVESTMENT RESEARCH
              </span>
            </div>
          </Link>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Secure Authentication
          </span>
        </header>

        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          {children}
        </main>
      </div>
    );
  }

  const displayName = user?.name || user?.email || "Member";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AW";

  return (
    <div className="dashboard-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand-area">
          <Link href="/" className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
            <Image
              className="brand-logo"
              src="/aethos-eagle-logo.jpeg"
              alt="Aethos"
              width={34}
              height={34}
              quality={90}
              priority
            />
            <div className="brand-text">
              <span className="brand-title">AETHOS</span>
              <span className="brand-subtitle">INVESTMENT RESEARCH</span>
            </div>
          </Link>
          <button 
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        <div className="sidebar-nav-container">
          <div className="nav-group">
            <span className="nav-group-title">MAIN NAVIGATION</span>
            <nav className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    <span className="sidebar-link-text">{item.label}</span>
                    {item.badge && (
                      <span className={`sidebar-badge ${item.badgeType || ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">PLATFORM</span>
            <nav className="nav-list">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    <span className="sidebar-link-text">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <Link href="/dashboard" className="sidebar-user-card" style={{ textDecoration: "none" }}>
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-status">{user ? "Active Member • View" : "Guest Access"}</span>
          </div>
        </Link>
      </aside>

      {/* Main Container */}
      <div className="dashboard-main-wrap">
        {/* Top Header Bar */}
        <header className="dashboard-header">
          <button 
            className="mobile-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <IconMenu />
          </button>

          <div className="header-search-bar">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search companies, sectors, IPOs, or tickers..." 
            />
            <span className="kbd-shortcut">⌘K</span>
          </div>

          <div className="header-actions">
            <div className="live-status-pill">
              <span className="pulse-dot" />
              <span>BSE / NSE Live</span>
            </div>
            
            <button className="header-icon-btn" aria-label="Notifications">
              <IconBell />
              <span className="notif-dot" />
            </button>

            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="button button-gold header-cta"
                style={{ fontSize: "12px", padding: "0 16px", height: "36px", cursor: "pointer" }}
              >
                Sign Out
              </button>
            ) : (
              <Link href="/auth" className="button button-gold header-cta">
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Protected Page Content Body with Gatewall */}
        <main className="dashboard-content">
          <AuthGate>
            {children}
          </AuthGate>
        </main>
      </div>
    </div>
  );
}
