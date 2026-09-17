import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";

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
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    
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
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>IPO Intelligence</h1>
          <p>Live data on active, upcoming, and recent BSE/NSE initial public offerings.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Source: Exchange Disclosures</span>
          <span className="meta-chip">Total Tracked: {liveIpos.length}</span>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h3 className="dash-card-title">Live & Upcoming IPO Tracker</h3>
        </div>
        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Company & Segment</th>
                  <th>Status</th>
                  <th>Bidding Schedule</th>
                  <th>Price Band</th>
                  <th>Lot Size</th>
                  <th>Subscription / Gains</th>
                  <th>Prospectus</th>
                </tr>
              </thead>
              <tbody>
                {liveIpos.map((ipo) => (
                  <tr key={ipo.symbol}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{ipo.name}</span>
                        <span className="company-sector">{ipo.symbol} · {!ipo.is_sme ? "MAINBOARD" : "SME"}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        ...(ipo.status === 'active' 
                          ? { color: '#065f46', backgroundColor: '#ecfdf5' }
                          : ipo.status === 'pre_apply'
                          ? { color: '#92400e', backgroundColor: '#fffbeb' }
                          : { color: 'var(--muted)', backgroundColor: '#f4f4f5' })
                      }}>
                        {ipo.status === 'active' ? 'Open' : ipo.status === 'pre_apply' ? 'Upcoming' : ipo.status === 'listed' ? 'Listed' : 'Closed'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: '600' }}>
                      {formatPeriod(ipo.bidding_start_date, ipo.bidding_end_date)}
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: '600' }}>
                      {formatPrice(ipo.min_price, ipo.max_price, ipo.issue_price)}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {ipo.lot_size ? `${ipo.lot_size} shares` : '—'}
                    </td>
                    <td>
                      {ipo.total_subscription_rate ? (
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#ea580c' }}>
                          🔥 {ipo.total_subscription_rate.toFixed(2)}x
                        </span>
                      ) : ipo.listing_gains !== null ? (
                        <span style={{ fontSize: '12px', fontWeight: '700', color: ipo.listing_gains >= 0 ? '#10b981' : '#ef4444' }}>
                          {ipo.listing_gains >= 0 ? '+' : ''}{ipo.listing_gains.toFixed(2)}%
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {ipo.document_url ? (
                        <a href={ipo.document_url} target="_blank" rel="noopener noreferrer" className="dash-card-link">
                          PDF <ArrowUpRight />
                        </a>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
                {liveIpos.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No active IPO data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
