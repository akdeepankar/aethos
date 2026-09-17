import Link from "next/link";
import { reports, ipos, posts } from "./_lib/content";
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
  const featuredReport = reports[0];

  return (
    <div className="dash-overview-page">
      {/* Welcome Header */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Research Overview</h1>
          <p>Analysis on Indian businesses, sector trends, and financial markets.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Market Status: Open</span>
          <span className="meta-chip">NIFTY 50: 24,540 (+0.4%)</span>
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
            <span className="metric-value">124</span>
            <span className="metric-trend up">+3 this wk</span>
          </div>
          <div className="metric-footer">Deep dives & sector notes</div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>IPOs Tracked</span>
            <IconIpos />
          </div>
          <div className="metric-body">
            <span className="metric-value">8</span>
            <span className="metric-trend neutral">2 Open</span>
          </div>
          <div className="metric-footer">Mainboard & SME offers</div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>Journal Memos</span>
            <IconJournal />
          </div>
          <div className="metric-body">
            <span className="metric-value">48</span>
            <span className="metric-trend up">+1 today</span>
          </div>
          <div className="metric-footer">Market insights & commentary</div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span>Coverage Sectors</span>
            <span className="metric-trend up">Active</span>
          </div>
          <div className="metric-body">
            <span className="metric-value">12</span>
          </div>
          <div className="metric-footer">Across Indian equity universe</div>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols, Right 1 Col */}
      <div className="dash-grid-layout">
        <div className="dash-main-column">
          {/* Featured Research Hero Banner */}
          <div className="featured-research-hero">
            <div>
              <div className="featured-kicker-badge">
                <span>★ Featured Deep Dive</span>
                <span>•</span>
                <span>27 Min Read</span>
              </div>
              <div className="featured-content-wrap">
                <h2>{featuredReport.title}</h2>
                <p>{featuredReport.deck}</p>
              </div>
            </div>

            <div className="featured-action-bar">
              <span className="featured-meta-info">Published {featuredReport.date}  ·  Logistics & Supply Chain</span>
              <Link href={`/research/${featuredReport.slug}`} className="button button-gold" style={{ height: '36px', padding: '0 16px', fontSize: '11px', borderRadius: '6px' }}>
                Read Deep Dive <ArrowUpRight />
              </Link>
            </div>
          </div>

          {/* Recent Research Library */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">
                <IconResearch /> Latest Research Reports
              </h3>
              <Link href="/research" className="dash-card-link">
                View All Library ({reports.length}) <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Title & Focus</th>
                      <th>Category</th>
                      <th>Access</th>
                      <th>Meta</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.slug}>
                        <td>
                          <div className="company-cell">
                            <span className="company-name">{report.title}</span>
                            <span className="company-sector">{report.deck.slice(0, 75)}...</span>
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
                          {report.readTime}
                        </td>
                        <td>
                          <Link href={`/research/${report.slug}`} className="dash-card-link">
                            Open <ArrowUpRight />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {posts.map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/journal/${post.slug}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '16px',
                      border: '1px solid var(--gold-light)',
                      borderRadius: '8px',
                      background: '#fafafa',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {post.category}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', margin: '8px 0 12px', lineHeight: '1.3' }}>
                        {post.title}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #e5e5e5', paddingTop: '10px' }}>
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
                View All <ArrowUpRight />
              </Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Status</th>
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
                        <td style={{ fontSize: '11px', fontWeight: '600' }}>
                          {ipo.price}
                        </td>
                        <td>
                          {ipo.deepDive ? (
                            <Link href={`/ipos/${ipo.slug}`} style={{ fontSize: '10px', fontWeight: '700', color: '#1d4ed8', background: '#eff6ff', padding: '3px 7px', borderRadius: '4px' }}>
                              Note <ArrowUpRight />
                            </Link>
                          ) : (
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>TBA</span>
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
                      <span className="action-desc">Explore 120+ research reports</span>
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
