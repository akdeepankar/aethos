"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

export function IconAdmin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconSidebarToggle({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon" style={{ width: "16px", height: "16px" }}>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 3v18" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {collapsed ? (
        <path d="m13 10 2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m16 10-2 2 2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
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

export function IconPulse() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
  badgeType?: string;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: IconOverview },
  { label: "Aethos Ideas", href: "/ideas", icon: IconIdeas },
  { label: "IPO Tracker", href: "/ipos", icon: IconIpos },
  { label: "Research Library", href: "/research", icon: IconResearch },
  { label: "Market Pulse", href: "/journal", icon: IconPulse },
];

const secondaryItems: NavItem[] = [
  { label: "Features", href: "/features", icon: IconFeatures },
  { label: "Membership", href: "/membership", icon: IconMembership },
  { label: "About Aethos", href: "/about", icon: IconAbout },
  { label: "Admin Studio", href: "/admin", icon: IconAdmin, badge: "Admin", badgeType: "live" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  // Load user sidebar preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aethos_main_sidebar_collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aethos_main_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

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
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-brand-area">
          <Link href="/" className="sidebar-brand" onClick={() => setSidebarOpen(false)} title="Aethos Investment Research">
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
              <span className="brand-title">AETHOS WEALTH</span>
              <span className="brand-subtitle">Perspective that creates value</span>
            </div>
          </Link>
          <button 
            className="sidebar-minimize-btn"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          >
            <span style={{ fontSize: "11px", fontWeight: "bold", lineHeight: 1 }}>
              {sidebarCollapsed ? "▶" : "◀"}
            </span>
          </button>
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
                    title={item.label}
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
        </div>

        {/* User Profile in Bottom Sidebar */}
        <div className="sidebar-footer-area">
          <Link href="/dashboard" className="sidebar-user-card" style={{ textDecoration: "none" }} title={displayName}>
            <div className="user-avatar">{user ? initials : "SA"}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Sibesh Agrawal"}</span>
              <span className="user-status">{user ? "Active Member" : "Member"}</span>
            </div>
            <span className="user-chevron">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`dashboard-main-wrap ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Header Bar */}
        <header className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button 
              className="mobile-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <IconMenu />
            </button>

            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="header-sidebar-toggle-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            >
              <IconSidebarToggle collapsed={sidebarCollapsed} />
              <span className="sidebar-toggle-text" style={{ fontSize: "11px" }}>
                {sidebarCollapsed ? "Expand" : "Collapse"}
              </span>
            </button>
          </div>

          <div className="header-search-bar">
            <IconSearch />
            <input 
              type="text" 
              placeholder="Search companies, sectors, IPOs or research..." 
            />
            <span className="kbd-shortcut">⌘K</span>
          </div>

          <div className="header-actions">
            <button className="header-icon-btn" aria-label="Notifications" title="Notifications">
              <IconBell />
              <span className="notif-dot" />
            </button>

            <div className="header-avatar-circle" title="Sibesh Agrawal">
              {user ? initials : "SA"}
            </div>

            <div className="header-illustrative-tag">
              Illustrative data
            </div>

            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="button button-gold header-cta"
                style={{ fontSize: "11px", padding: "0 12px", height: "32px", cursor: "pointer" }}
              >
                Sign Out
              </button>
            ) : null}
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
