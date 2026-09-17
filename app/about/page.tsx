export default function AboutPage() {
  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>About Aethos Research</h1>
          <p>Independent research platform focused on Indian businesses, market themes, and long-horizon investing.</p>
        </div>
      </div>

      <div className="dash-grid-layout">
        <div className="dash-main-column">
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">Research Principles & Mandate</h3>
            </div>
            <div className="dash-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#fafafa', border: '1px solid var(--gold-light)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Core Objective</span>
                  <h4 style={{ margin: '6px 0', fontSize: '14px', fontWeight: '700' }}>First-Principles Business Analysis</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    Publishing objective work on company moats, financial quality, and sector developments. No short-term momentum trading or buy/sell call mandates.
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#fafafa', border: '1px solid var(--gold-light)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Regulatory & Disclosure</span>
                  <h4 style={{ margin: '6px 0', fontSize: '14px', fontWeight: '700' }}>Independent Research Entity</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    Aethos Research is not a SEBI-registered investment advisor. All published notes are exclusively for informational and analytical purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-side-column">
          <div className="dash-card">
            <div className="dash-card-head">
              <h3 className="dash-card-title">Platform Stats</h3>
            </div>
            <div className="dash-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e5e5' }}>
                <span style={{ color: 'var(--muted)' }}>Coverage Universe</span>
                <strong style={{ fontWeight: '700' }}>NSE / BSE 500</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e5e5' }}>
                <span style={{ color: 'var(--muted)' }}>Focus Region</span>
                <strong style={{ fontWeight: '700' }}>India (Domestic)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Horizon</span>
                <strong style={{ fontWeight: '700' }}>3 - 10 Years</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
