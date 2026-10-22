import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";

const features = [
  { id: "01", title: "Overview", desc: "Your daily command center with the latest research, ideas, IPOs, and market updates in one place.", href: "/overview" },
  { id: "02", title: "Research Library", desc: "Stock deep dives, sector studies, thematic research, results analysis, and company updates.", href: "/research" },
  { id: "03", title: "Aethos Ideas", desc: "High-conviction company ideas with business models, growth drivers, valuation, and risks.", href: "/ideas" },
  { id: "04", title: "IPO Tracker", desc: "Live issues, upcoming offers, listing performance, archives, and dedicated IPO deep dives.", href: "/ipos" },
  { id: "05", title: "Market Pulse", desc: "Company announcements, fundraises, corporate actions, and special situations as they unfold.", href: "/market-pulse" },
  { id: "06", title: "Membership", desc: "Compare plans, manage your access, and review past payments in one place.", href: "/membership" }
];

export default function FeaturesPage() {
  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Platform Features & Capabilities</h1>
          <p>Analytical modules designed to give investors first-principles clarity on Indian equities.</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h3 className="dash-card-title">Platform Modules Overview</h3>
        </div>
        <div className="dash-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {features.map((f) => (
              <div key={f.id} style={{ padding: '20px', background: '#fafafa', border: '1px solid var(--gold-light)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--muted)' }}>MODULE {f.id}</span>
                  <Link href={f.href} className="dash-card-link">Explore <ArrowUpRight /></Link>
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700' }}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
