import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";

export default function MembershipPage() {
  const benefits = [
    { title: "Full Research Library", desc: "Access all published company, sectoral, and thematic deep dives." },
    { title: "IPO Underwriting Notes", desc: "Detailed breakdown of financials & valuation model for mainboard IPOs." },
    { title: "Weekly Memos & Alerts", desc: "Direct delivery of long-term insights and market signals." },
    { title: "Financial Models & Data", desc: "Downloadable spreadsheet models behind our underwriting." }
  ];

  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Institutional Membership Tier</h1>
          <p>Unrestricted access to research, underwriting models, and investment memos.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Status: Pro Trial</span>
        </div>
      </div>

      <div className="dash-grid-layout">
        <div className="dash-main-column">
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">Membership Entitlements</h3>
            </div>
            <div className="dash-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {benefits.map((b) => (
                  <div key={b.title} style={{ padding: '16px', background: '#fafafa', border: '1px solid var(--gold-light)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '700' }}>{b.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dash-side-column">
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">Early Access Account</h3>
            </div>
            <div className="dash-card-body">
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 16px' }}>
                Join the early access membership roster for priority access to institutional research notes.
              </p>
              <a 
                href="mailto:hello@aethos.in?subject=Aethos%20Membership%20Access"
                className="button button-gold"
                style={{ width: '100%', justifyContent: 'center', height: '38px', fontSize: '11px', borderRadius: '6px' }}
              >
                Request Access Brief <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
