import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";

const features = [
  { id: "01", title: "Company Deep Dives", desc: "Granular breakdown of business models, unit economics, supply chain positioning, and risk factors." },
  { id: "02", title: "Sectoral Maps", desc: "Detailed breakdown of market structure, total addressable market (TAM), and profit pool shifts." },
  { id: "03", title: "Thematic Notes", desc: "Macro trends shaping Indian consumption, industrial capex, energy transition, and tech adoption." },
  { id: "04", title: "IPO Underwriting", desc: "Objective analysis of prospectus disclosures, offer structure, valuation, and peer benchmarks." }
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
          <h3 className="dash-card-title">Research Modules Overview</h3>
        </div>
        <div className="dash-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {features.map((f) => (
              <div key={f.id} style={{ padding: '20px', background: '#fafafa', border: '1px solid var(--gold-light)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--muted)' }}>MODULE {f.id}</span>
                  <Link href="/research" className="dash-card-link">Explore <ArrowUpRight /></Link>
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
