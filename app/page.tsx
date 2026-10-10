"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAdminStore } from "./_lib/admin-store";
import { ApiIpo, defaultAllIpos, normalizeIpoStatus } from "./ipos/ipo-table-tabs";
import { 
  IconResearch, 
  IconIpos, 
  IconJournal, 
  IconChevronRight 
} from "./_components/dashboard-layout";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-icon sm">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  const { reports, ipos: storeIpos, journal: posts, ideas } = useAdminStore();
  const featuredReport = reports && reports.length > 0 ? reports[0] : null;

  const [liveIpos, setLiveIpos] = useState<ApiIpo[]>(defaultAllIpos);
  const [liveDeepDives, setLiveDeepDives] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchIpoData() {
      try {
        const [iposRes, ddRes] = await Promise.all([
          fetch("/api/appwrite/records?table=ipos").then(r => r.ok ? r.json() : null).catch(() => null),
          fetch("/api/appwrite/records?table=ipo_deep_dives").then(r => r.ok ? r.json() : null).catch(() => null),
        ]);
        if (isMounted) {
          if (iposRes?.success && Array.isArray(iposRes.rows) && iposRes.rows.length > 0) {
            setLiveIpos(iposRes.rows);
          }
          if (ddRes?.success && Array.isArray(ddRes.rows)) {
            setLiveDeepDives(ddRes.rows);
          }
        }
      } catch {
        // Fallback already in place
      }
    }
    fetchIpoData();
    return () => {
      isMounted = false;
    };
  }, []);

  const ipoDataset = useMemo(() => {
    const combined = [...liveIpos];
    const seen = new Set(combined.map((i) => (i.slug || i.symbol || "").toLowerCase()));

    // Merge standalone deep dives from ipo_deep_dives collection
    if (liveDeepDives && liveDeepDives.length > 0) {
      for (const dd of liveDeepDives) {
        const key = (dd.slug || dd.company?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "").toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          combined.push({
            symbol: (dd.slug || key).toUpperCase(),
            name: dd.company || dd.name || dd.slug,
            sector: dd.sector || "General",
            status: "closed",
            is_sme: false,
            listing_date: "Archived",
            min_price: null,
            max_price: null,
            issue_price: null,
            bidding_start_date: null,
            bidding_end_date: null,
            listing_price: null,
            listing_gains: null,
            allotment_date: null,
            lot_size: null,
            total_subscription_rate: null,
            document_url: dd.pdfUrl || null,
          });
        }
      }
    }

    if (storeIpos && storeIpos.length > 0) {
      for (const adminIpo of storeIpos) {
        const key = (adminIpo.slug || adminIpo.company?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "").toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          combined.push({
            symbol: adminIpo.slug?.toUpperCase() || key.toUpperCase(),
            name: adminIpo.company,
            sector: adminIpo.sector || "General",
            status: adminIpo.status || "pre_apply",
            is_sme: Boolean(adminIpo.isSme ?? (adminIpo.type === "SME")),
            type: adminIpo.type,
            period: adminIpo.period,
            price: adminIpo.price,
            issueSize: adminIpo.issueSize,
            lotSize: adminIpo.lotSize,
            listing_date: adminIpo.listing || "TBA",
            min_price: null,
            max_price: null,
            issue_price: null,
            bidding_start_date: null,
            bidding_end_date: null,
            listing_price: null,
            listing_gains: null,
            allotment_date: null,
            lot_size: adminIpo.lotSize ? parseInt(adminIpo.lotSize) || null : null,
            total_subscription_rate: null,
            document_url: adminIpo.pdfUrl || null,
            slug: adminIpo.slug,
            pdfUrl: adminIpo.pdfUrl,
          });
        }
      }
    }

    return combined.length > 0 ? combined : defaultAllIpos;
  }, [liveIpos, storeIpos, liveDeepDives]);

  const activeIpos = useMemo(() => {
    return ipoDataset.filter(i => normalizeIpoStatus(i.status) === "active");
  }, [ipoDataset]);

  const upcomingIpos = useMemo(() => {
    return ipoDataset.filter(i => normalizeIpoStatus(i.status) === "pre_apply");
  }, [ipoDataset]);

  return (
    <div className="dash-overview-page">
      {/* Welcome Header */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Research Overview</h1>
          <p>Institutional analysis on Indian equities, sector dynamics, and IPO markets.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dash-metrics-row">
        <div className="dash-metric-card">
          <div className="metric-header">
            <span>Research Reports</span>
            <IconResearch />
          </div>
          <div className="metric-body">
            <span className="metric-value">{reports.length}</span>
            <span className="metric-trend up">Live</span>
          </div>
          <div className="metric-footer">Deep dives & sector notes</div>
        </div>

        {/* IPOs Tracked Card with Active and Upcoming sub-cards */}
        <div className="dash-metric-card" style={{ padding: "14px 16px" }}>
          <div className="metric-header" style={{ marginBottom: "8px" }}>
            <span>IPOs Tracked</span>
            <IconIpos />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "2px" }}>
            {/* Active IPOs mini-card */}
            <Link
              href="/ipos"
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px 10px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                transition: "all 0.15s ease",
              }}
              className="ipo-subcard"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "#16a34a" }}>
                  Active
                </span>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>
                {activeIpos.length}
              </div>
              <div style={{ fontSize: "9.5px", color: "#64748b", fontWeight: "500" }}>
                Open for bid
              </div>
            </Link>

            {/* Upcoming IPOs mini-card */}
            <Link
              href="/ipos"
              style={{
                background: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: "8px",
                padding: "8px 10px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                transition: "all 0.15s ease",
              }}
              className="ipo-subcard"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "#b45309" }}>
                  Upcoming
                </span>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>
                {upcomingIpos.length}
              </div>
              <div style={{ fontSize: "9.5px", color: "#64748b", fontWeight: "500" }}>
                Pipeline offers
              </div>
            </Link>
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>Journal Memos</span>
            <IconJournal />
          </div>
          <div className="metric-body">
            <span className="metric-value">{posts.length}</span>
            <span className="metric-trend up">Published</span>
          </div>
          <div className="metric-footer">Market insights & commentary</div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>Aethos Ideas</span>
            <span className="metric-trend up">Active</span>
          </div>
          <div className="metric-body">
            <span className="metric-value">{ideas.length}</span>
          </div>
          <div className="metric-footer">High-conviction stock theses</div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="dash-grid-layout">
        <div className="dash-main-column">
          {/* Featured Research Hero Banner */}
          {featuredReport && (
            <div className="featured-research-hero">
              <div>
                <div className="featured-kicker-badge">
                  <span>★ Featured Deep Dive</span>
                  <span>•</span>
                  <span>{featuredReport.readTime || "10 Min Read"}</span>
                </div>
                <div className="featured-content-wrap">
                  <h2>{featuredReport.title}</h2>
                  <p>{featuredReport.deck}</p>
                </div>
              </div>

              <div className="featured-action-bar">
                <span className="featured-meta-info">Published {featuredReport.date}  ·  {featuredReport.sector || featuredReport.tag}</span>
                <Link href={`/research/${featuredReport.slug}`} className="button button-gold" style={{ height: '36px', padding: '0 16px', fontSize: '12px', borderRadius: '6px' }}>
                  Read Deep Dive <ArrowUpRight />
                </Link>
              </div>
            </div>
          )}

          {/* Recent Research Library */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">
                <IconResearch /> Latest Research Reports
              </h3>
              <Link href="/research" className="dash-card-link">
                View All ({reports.length}) <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              {reports.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="dash-table-wrap overview-table-desktop">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Title & Focus</th>
                          <th>Category</th>
                          <th>Access</th>
                          <th>Published</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report.slug}>
                            <td>
                              <div className="company-cell">
                                <Link href={`/research/${report.slug}`} className="company-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                                  {report.title}
                                </Link>
                                <span className="company-sector">{report.deck ? (report.deck.length > 75 ? `${report.deck.slice(0, 75)}...` : report.deck) : ""}</span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--muted)' }}>
                                {report.tag}
                              </span>
                            </td>
                            <td>
                              <span style={{ 
                                fontSize: '9px', 
                                fontWeight: '700', 
                                padding: '3px 8px', 
                                borderRadius: '4px',
                                background: report.free ? '#ecfdf5' : '#fef3c7',
                                color: report.free ? '#047857' : '#b45309'
                              }}>
                                {report.free ? 'FREE' : 'PRO'}
                              </span>
                            </td>
                            <td style={{ color: 'var(--muted)', fontSize: '11px' }}>
                              {report.date}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <Link href={`/research/${report.slug}`} className="dash-card-link" style={{ justifyContent: 'flex-end' }}>
                                Open <ArrowUpRight />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="overview-mobile-cards">
                    {reports.map((report) => (
                      <Link 
                        key={report.slug} 
                        href={`/research/${report.slug}`} 
                        className="mobile-item-card"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{report.tag}</span>
                          <span style={{ 
                            fontSize: '9px', 
                            fontWeight: '700', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            background: report.free ? '#ecfdf5' : '#fef3c7',
                            color: report.free ? '#047857' : '#b45309'
                          }}>
                            {report.free ? 'FREE' : 'PRO'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '6px 0 4px', lineHeight: '1.3' }}>
                          {report.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px', lineHeight: '1.4' }}>
                          {report.deck ? (report.deck.length > 90 ? `${report.deck.slice(0, 90)}...` : report.deck) : ""}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                          <span>{report.date}</span>
                          <span style={{ color: '#b45309', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            Read Report <ArrowUpRight />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '13px', margin: 0 }}>No research reports published yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Journal Memos */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">
                <IconJournal /> Market Journal & Memos
              </h3>
              <Link href="/journal" className="dash-card-link">
                Visit Journal <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body">
              <div className="journal-memos-grid">
                {posts.map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/journal/${post.slug}`}
                    className="journal-memo-card"
                  >
                    <div>
                      <span className="memo-category">
                        {post.category}
                      </span>
                      <h4 className="memo-title">
                        {post.title}
                      </h4>
                    </div>
                    <div className="memo-footer">
                      <span>{post.date}</span>
                      <ArrowUpRight />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="dash-side-column">
          {/* Live IPO Tracker */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">
                <IconIpos /> Active IPOs
              </h3>
              <Link href="/ipos" className="dash-card-link">
                View All ({activeIpos.length}) <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Price</th>
                      <th style={{ textAlign: 'right' }}>Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (activeIpos.length === 0) {
                        return (
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'center', padding: '24px 16px', color: '#94a3b8', fontSize: '12px' }}>
                              No active bidding IPOs right now.
                            </td>
                          </tr>
                        );
                      }

                      return activeIpos.map((ipo, idx) => {
                        const displayName = ipo.company || ipo.name;
                        const priceDisplay = ipo.price || (ipo.min_price && ipo.max_price ? `₹${ipo.min_price} - ₹${ipo.max_price}` : ipo.min_price ? `₹${ipo.min_price}` : "TBA");
                        const hasDeepDive = Boolean(ipo.deepDive || ipo.hasReport || ipo.pdfUrl);
                        const slug = ipo.slug || ipo.symbol?.toLowerCase();
                        const uniqueKey = `${ipo.slug || ipo.symbol || displayName}-${idx}`;

                        return (
                          <tr key={uniqueKey}>
                            <td>
                              <div className="company-cell">
                                <span className="company-name" style={{ fontSize: '12px' }}>{displayName}</span>
                                <span className="company-sector">{ipo.sector || "General"}</span>
                              </div>
                            </td>
                            <td style={{ fontSize: '11px', fontWeight: '600', color: '#334155' }}>
                              {priceDisplay}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {hasDeepDive ? (
                                <Link 
                                  href={slug ? `/view-deep-dives?slug=${slug}` : `/ipos`} 
                                  style={{ 
                                    fontSize: '10px', 
                                    fontWeight: '700', 
                                    color: '#b45309', 
                                    background: '#fef3c7', 
                                    border: '1px solid #fde68a',
                                    padding: '3px 8px', 
                                    borderRadius: '4px', 
                                    textDecoration: 'none', 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '2px' 
                                  }}
                                >
                                  Deep Dive <ArrowUpRight />
                                </Link>
                              ) : (
                                <span style={{ fontSize: '10px', color: '#94a3b8', background: '#f1f5f9', padding: '3px 7px', borderRadius: '4px' }}>
                                  No Report
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Platform Shortcuts */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">Quick Actions</h3>
            </div>
            <div className="dash-card-body">
              <div className="quick-action-list">
                <Link href="/research" className="quick-action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <IconResearch />
                    </div>
                    <div className="action-text">
                      <span className="action-title">Browse Library</span>
                      <span className="action-desc">Explore institutional research reports</span>
                    </div>
                  </div>
                  <IconChevronRight />
                </Link>

                <Link href="/ipos" className="quick-action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <IconIpos />
                    </div>
                    <div className="action-text">
                      <span className="action-title">Track Live IPOs</span>
                      <span className="action-desc">Check upcoming BSE/NSE listings</span>
                    </div>
                  </div>
                  <IconChevronRight />
                </Link>

                <Link href="/membership" className="quick-action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <IconJournal />
                    </div>
                    <div className="action-text">
                      <span className="action-title">Membership Access</span>
                      <span className="action-desc">Unlock premium deep dives</span>
                    </div>
                  </div>
                  <IconChevronRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
