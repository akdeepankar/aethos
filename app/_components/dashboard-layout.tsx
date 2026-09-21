"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  { label: "Membership Plan", href: "/membership", icon: IconMembership },
  { label: "About Aethos", href: "/about", icon: IconAbout },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        <div className="sidebar-user-card">
          <div className="user-avatar">AK</div>
          <div className="user-info">
            <span className="user-name">Active User</span>
            <span className="user-status">Member</span>
          </div>
        </div>
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

            <Link href="/membership" className="button button-gold header-cta">
              Upgrade Plan
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
