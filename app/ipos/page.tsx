import Link from "next/link";
import { ArrowRight, ArrowUpRight, SiteFooter, SiteHeader } from "../_components/site-chrome";

type ApiIpo = {
  symbol: string;
  name: string;
  status: string;
  is_sme: boolean;
  additional_text: string;
  min_price: number | null;
  max_price: number | null;
  issue_price: number | null;
  bidding_start_date: string | null;
  bidding_end_date: string | null;
  listing_price: number | null;
  listing_gains: number | null;
  allotment_date: string | null;
  listing_date: string | null;
  lot_size: number | null;
  total_subscription_rate: number | null;
  document_url: string | null;
};

// Helper function to format dates to like "20 — 22 Jul 2026"
function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return "TBA";
  if (!end) {
    const s = new Date(start!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return `Starts ${s}`;
  }
  const sDate = new Date(start!);
  const eDate = new Date(end!);
  const sDay = sDate.toLocaleDateString('en-GB', { day: '2-digit' });
  const eDay = eDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  return `${sDay} — ${eDay}`;
}

// Helper for single date
function formatDate(dateString: string | null) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// Helper to format price
function formatPrice(min: number | null, max: number | null, issue: number | null) {
  if (issue) return `₹${issue}`;
  if (min && max) return `₹${min} — ${max}`;
  if (min) return `₹${min}`;
  return "—";
}

async function getLiveIpos() {
  try {
    const res = await fetch("https://stock.indianapi.in/ipo", {
      headers: { "X-Api-Key": process.env.INDIAN_API_KEY || "" },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) {
      console.error("Failed to fetch IPO data", res.status);
      return [];
    }
    const data = await res.json();
    
    // Combine active, pre_apply, and some closed IPOs for display
    const activeIpos: ApiIpo[] = data.active || [];
    const preApplyIpos: ApiIpo[] = data.pre_apply || [];
    const closedIpos: ApiIpo[] = data.closed || [];
    const listedIpos: ApiIpo[] = data.listed || [];
    
    return [...activeIpos, ...preApplyIpos, ...closedIpos.slice(0, 3), ...listedIpos.slice(0, 2)];
  } catch (err) {
    console.error("Error fetching IPO data", err);
    return [];
  }
}

export default async function IposPage() {
  const liveIpos = await getLiveIpos();

  return (
    <>
      <SiteHeader active="IPOs" />
      <main className="ipo-directory">
        <section style={{ padding: '20px 0' }}>
          <div className="shell" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
            <strong style={{ color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '.05em' }}>IPO Intelligence</strong>
            <span style={{ color: 'var(--muted)' }}>/</span>
            <span style={{ color: 'var(--muted)' }}>
              The signal before the listing bell. Track current and upcoming Indian IPOs.
            </span>
          </div>
        </section>

        <section className="ipo-list-section" style={{ paddingTop: '20px' }}>
          <div className="shell">
            <div className="ipo-page-status" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '24px' }}>
              <span>
                <i className="live-dot" /> Live tracker
              </span>
              <small>Data powered by IndianAPI</small>
            </div>

            <div className="ipo-list">
              {liveIpos.map((ipo) => (
                <article 
                  key={ipo.symbol}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '28px 32px',
                    marginBottom: '24px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.03), 0 4px 10px rgba(0, 0, 0, 0.02)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '24px',
                    alignItems: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {/* Col 1: Status + Name */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <span 
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '.08em',
                        fontWeight: '700',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '12px',
                        ...(ipo.status === 'active' 
                          ? { color: '#065f46', backgroundColor: '#ecfdf5' }
                          : ipo.status === 'pre_apply'
                          ? { color: '#92400e', backgroundColor: '#fffbeb' }
                          : { color: 'var(--muted)', backgroundColor: '#f9f9f9' })
                      }}
                    >
                      {ipo.status === 'active' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>}
                      {ipo.status === 'pre_apply' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>}
                      {ipo.status === 'active' ? 'Open' : ipo.status === 'pre_apply' ? 'Upcoming' : ipo.status === 'listed' ? 'Listed' : 'Closed'}
                    </span>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600', color: 'var(--ink)' }}>{ipo.name}</h2>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: '600', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '8px' }}>
                      {!ipo.is_sme ? "MAINBOARD" : "SME"}
                    </span>
                  </div>

                  {/* Col 2: Dates */}
                  <div>
                    <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>Schedule</span>
                    <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '8px' }}>{formatPeriod(ipo.bidding_start_date, ipo.bidding_end_date)}</strong>
                    {ipo.allotment_date && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Allotment: {formatDate(ipo.allotment_date)}</div>}
                    {ipo.listing_date && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Listing: {formatDate(ipo.listing_date)}</div>}
                  </div>

                  {/* Col 3: Offer Details */}
                  <div>
                    <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>Offer Details</span>
                    <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '8px' }}>{formatPrice(ipo.min_price, ipo.max_price, ipo.issue_price)}</strong>
                    {ipo.lot_size && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Lot Size: {ipo.lot_size} shares</div>}
                  </div>

                  {/* Col 4: Market Data */}
                  <div>
                    <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>Market Interest</span>
                    
                    {ipo.total_subscription_rate ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🔥</span>
                        <strong style={{ fontSize: '16px', color: '#ea580c' }}>{ipo.total_subscription_rate.toFixed(2)}x</strong>
                      </div>
                    ) : ipo.listing_gains !== null ? (
                      <div>
                        <strong style={{ fontSize: '16px', color: ipo.listing_gains >= 0 ? '#10b981' : '#ef4444' }}>
                          {ipo.listing_gains >= 0 ? '+' : ''}{ipo.listing_gains.toFixed(2)}%
                        </strong>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>at ₹{ipo.listing_price}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Data unavailable</div>
                    )}
                  </div>

                  {/* Col 5: Actions & Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                    {ipo.document_url ? (
                      <a href={ipo.document_url} target="_blank" rel="noopener noreferrer" className="button button-gold" style={{ fontSize: '12px', padding: '0 16px', minHeight: '40px', width: '100%', justifyContent: 'center' }}>
                        Read Prospectus <ArrowUpRight />
                      </a>
                    ) : (
                      <span className="unavailable" style={{ fontSize: '12px', width: '100%', textAlign: 'center', padding: '10px 0', border: '1px dashed #ccc', borderRadius: '30px' }}>No Prospectus</span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.5', textAlign: 'center', width: '100%' }}>
                      {ipo.additional_text}
                    </span>
                  </div>
                </article>
              ))}
              {liveIpos.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
                  Error loading live IPO data. Please check your API key.
                </div>
              )}
            </div>

            <p className="ipo-disclaimer">
              Aethos research is for information and education. It is not investment advice or a recommendation to apply to an IPO.
            </p>
          </div>
        </section>

        <section className="ipo-page-cta">
          <div className="shell">
            <div>
              <p className="eyebrow light">
                <span />
                Go beyond the calendar
              </p>
              <h2>
                Business first.
                <br />
                <em>Offer second.</em>
              </h2>
            </div>
            <Link className="button button-gold" href="/membership">
              See membership <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
