"use client";

import Link from "next/link";
import { useAdminStore } from "./_lib/admin-store";
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
  const { reports, ipos, journal: posts, ideas } = useAdminStore();
  const featuredReport = reports && reports.length > 0 ? reports[0] : null;

  return (
    <div className="dash-overview-page">
      {/* Welcome Header */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Research Overview</h1>
          <p>Institutional analysis on Indian equities, sector dynamics, and IPO markets.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip active-chip">
            <span className="chip-dot" /> Market Open
          </span>
          <span className="meta-chip">NIFTY 50: 24,540 (+0.4%)</span>
          <span className="meta-chip desktop-only">SENSEX: 80,710 (+0.3%)</span>
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

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>IPOs Tracked</span>
            <IconIpos />
          </div>
          <div className="metric-body">
            <span className="metric-value">{ipos.length}</span>
            <span className="metric-trend neutral">Active</span>
          </div>
          <div className="metric-footer">Mainboard & SME offers</div>
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
                <IconIpos /> IPO Intelligence
              </h3>
              <Link href="/ipos" className="dash-card-link">
                View All ({ipos.length}) <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Price</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipos.map((ipo) => (
                      <tr key={ipo.slug}>
                        <td>
                          <div className="company-cell">
                            <span className="company-name" style={{ fontSize: '12px' }}>{ipo.company}</span>
                            <span className="company-sector">{ipo.sector}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '11px', fontWeight: '600', color: '#334155' }}>
                          {ipo.price}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {ipo.deepDive ? (
                            <Link href={`/ipos/${ipo.slug}`} style={{ fontSize: '10px', fontWeight: '700', color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              Note <ArrowUpRight />
                            </Link>
                          ) : (
                            <span style={{ fontSize: '10px', color: '#94a3b8', background: '#f1f5f9', padding: '3px 7px', borderRadius: '4px' }}>Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
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
