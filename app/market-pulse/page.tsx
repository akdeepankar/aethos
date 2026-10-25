"use client";

import { useEffect, useMemo, useState } from "react";
import { databases, Query } from "../_lib/appwrite";

type TabId = "brief" | "deals" | "fundraises" | "news";

type DealRow = {
  id: string;
  company: string;
  dealType: "BULK" | "BLOCK";
  participant: string;
  side: "BUY" | "SELL";
  quantity: string;
  price: string;
  value: string;
  source: string;
};

type FundraiseRow = {
  id: string;
  company: string;
  route: string;
  stage: string;
  stageTone: "proposed" | "neutral";
  amount: string;
  keyDate: string;
  source: string;
};

type MarketNewsDoc = {
  $id: string;
  newsDate: string;
  filedTime: string;
  company: string;
  ticker: string;
  headline: string;
  summary: string;
  category: string;
  sentiment: string;
  sourceName: string;
  sourceUrl: string;
  isWatchlist: boolean;
  sortOrder: number;
};

type SentimentTone = "positive" | "negative" | "neutral";

const tabs: { id: TabId; label: string }[] = [
  { id: "brief", label: "Daily Brief" },
  { id: "deals", label: "Bulk & Block Deals" },
  { id: "fundraises", label: "Fundraises" },
  { id: "news", label: "News" },
];

const deals: DealRow[] = [
  {
    id: "deal-1",
    company: "Sample Engineering",
    dealType: "BULK",
    participant: "Example Capital Fund",
    side: "BUY",
    quantity: "2,00,000",
    price: "₹250",
    value: "₹5.00 Cr",
    source: "NSE",
  },
  {
    id: "deal-2",
    company: "Sample Cables",
    dealType: "BLOCK",
    participant: "Example Holdings",
    side: "SELL",
    quantity: "5,00,000",
    price: "₹120",
    value: "₹6.00 Cr",
    source: "BSE",
  },
];

const fundraises: FundraiseRow[] = [
  {
    id: "fund-1",
    company: "Sample Industries",
    route: "Preferential warrants",
    stage: "PROPOSED",
    stageTone: "proposed",
    amount: "₹80 Cr",
    keyDate: "EGM · 14 Nov",
    source: "Filing",
  },
  {
    id: "fund-2",
    company: "Sample Components",
    route: "To be considered",
    stage: "BOARD MEETING ANNOUNCED",
    stageTone: "neutral",
    amount: "Not disclosed",
    keyDate: "Board · 28 Oct",
    source: "Filing",
  },
];

const initialDate = new Date(2026, 9, 22);

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDbDate(value: string) {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
  return `${parts[2]} ${monthNames[parts[1] - 1] ?? ""}`.trim();
}

function sentimentTone(value: string): SentimentTone {
  const tone = value.toLowerCase();
  return tone === "positive" || tone === "negative" ? tone : "neutral";
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.4-3.4" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function IconDeals() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </svg>
  );
}

function IconFundraise() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="10" cy="6" rx="6" ry="3" />
      <path d="M4 6v5c0 1.7 2.7 3 6 3s6-1.3 6-3V6M4 11v5c0 1.7 2.7 3 6 3 1.6 0 3-.3 4.1-.8" />
      <circle cx="17.5" cy="17.5" r="3.5" />
      <path d="M17.5 15.8v3.4M16.2 17.5h2.6" />
    </svg>
  );
}

function IconNews() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

function IconStar({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function SectionHead({
  icon,
  title,
  meta,
  total,
  onViewAll,
  showViewAll,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  total: number | string;
  onViewAll: () => void;
  showViewAll: boolean;
}) {
  return (
    <div className="mp-card-head">
      <div className="mp-card-heading">
        <span className="mp-card-icon">{icon}</span>
        <h2 className="mp-card-title">{title}</h2>
        <span className="mp-card-meta">{meta}</span>
      </div>
      {showViewAll && (
        <button type="button" className="mp-view-all" onClick={onViewAll}>
          View all {total}
          <IconArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function SourceLink({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      {label}
      <IconExternal />
    </>
  );

  if (href) {
    return (
      <a className="mp-source" href={href} target="_blank" rel="noopener noreferrer" title={`Open ${label}`}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="mp-source" title={`Open ${label}`}>
      {content}
    </button>
  );
}

export default function MarketPulsePage() {
  const [activeTab, setActiveTab] = useState<TabId>("brief");
  const [date, setDate] = useState(initialDate);
  const [query, setQuery] = useState("");
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [newsDocs, setNewsDocs] = useState<MarketNewsDoc[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    databases
      .listDocuments("aethos_db", "market_news", [Query.orderAsc("sortOrder"), Query.limit(100)])
      .then((response) => {
        if (cancelled) return;
        const docs = response.documents as unknown as MarketNewsDoc[];
        setNewsDocs(docs);
        const watchlisted = docs.filter((doc) => doc.isWatchlist).map((doc) => doc.$id);
        if (watchlisted.length > 0) {
          setStarred((prev) => new Set([...prev, ...watchlisted]));
        }
        setNewsError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setNewsError(error instanceof Error ? error.message : "Unable to load market news.");
      })
      .finally(() => {
        if (!cancelled) setNewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const term = query.trim().toLowerCase();

  const filteredDeals = useMemo(
    () =>
      deals.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.id)) &&
          (!term ||
            row.company.toLowerCase().includes(term) ||
            row.participant.toLowerCase().includes(term)),
      ),
    [term, watchlistOnly, starred],
  );

  const filteredFundraises = useMemo(
    () =>
      fundraises.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.id)) &&
          (!term || row.company.toLowerCase().includes(term)),
      ),
    [term, watchlistOnly, starred],
  );

  const filteredNews = useMemo(
    () =>
      newsDocs.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.$id)) &&
          (!term ||
            [row.company, row.ticker, row.headline, row.summary, row.category, row.sentiment].some((value) =>
              value.toLowerCase().includes(term),
            )),
      ),
    [newsDocs, term, watchlistOnly, starred],
  );

  const showDeals = activeTab === "brief" || activeTab === "deals";
  const showFundraises = activeTab === "brief" || activeTab === "fundraises";
  const showNews = activeTab === "brief" || activeTab === "news";
  const shortDate = formatShortDate(date);
  const visibleNews = activeTab === "brief" ? filteredNews.slice(0, 2) : filteredNews;
  const publishedLabel = newsDocs.length > 0 ? formatDbDate(newsDocs[0].newsDate) : shortDate;

  return (
    <div className="dash-overview-page mp-page">
      <header className="mp-header">
        <div>
          <h1 className="mp-title">Market Pulse</h1>
          <p className="mp-subtitle">Daily deal activity, fundraising announcements and company news.</p>
        </div>
        <span className="mp-demo-tag">
          <IconInfo />
          Illustrative demo · Deals & fundraises
        </span>
      </header>

      <div className="mp-tabs" role="tablist" aria-label="Market Pulse sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`mp-tab${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mp-toolbar">
        <div className="mp-toolbar-left">
          <button type="button" className="mp-control mp-date">
            <IconCalendar />
            {formatDate(date)}
          </button>
          <div className="mp-stepper">
            <button
              type="button"
              aria-label="Previous day"
              onClick={() => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next day"
              onClick={() => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))}
            >
              <IconChevronRight />
            </button>
          </div>
          <div className="mp-select">
            <select aria-label="Edition">
              <option>Daily edition</option>
              <option>Morning wrap</option>
              <option>Closing bell</option>
            </select>
            <IconChevronDown />
          </div>
          <button type="button" className="mp-control">
            <IconFolder />
            Archive
          </button>
        </div>
        <div className="mp-toolbar-right">
          <div className="mp-search">
            <IconSearch />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a company..."
              aria-label="Find a company"
            />
          </div>
          <label className="mp-watch">
            <input
              type="checkbox"
              checked={watchlistOnly}
              onChange={(event) => setWatchlistOnly(event.target.checked)}
            />
            My watchlist only
          </label>
        </div>
      </div>

      <p className="mp-viewing">Viewing {shortDate} · Each scan shows its own coverage and update time.</p>

      {activeTab === "brief" && (
        <div className="mp-stats">
          <button type="button" className="mp-stat" onClick={() => setActiveTab("deals")}>
            <span className="mp-stat-icon">
              <IconDeals />
            </span>
            <span className="mp-stat-number">12</span>
            <span className="mp-stat-label">Bulk / block records</span>
          </button>
          <button type="button" className="mp-stat" onClick={() => setActiveTab("fundraises")}>
            <span className="mp-stat-icon">
              <IconFundraise />
            </span>
            <span className="mp-stat-number">5</span>
            <span className="mp-stat-label">Fundraise announcements</span>
          </button>
          <button type="button" className="mp-stat" onClick={() => setActiveTab("news")}>
            <span className="mp-stat-icon">
              <IconNews />
            </span>
            <span className="mp-stat-number">{newsLoading ? "—" : newsDocs.length}</span>
            <span className="mp-stat-label">News updates</span>
          </button>
        </div>
      )}

      {showDeals && (
        <section className="mp-card" aria-label="Bulk & Block Deals">
          <SectionHead
            icon={<IconDeals />}
            title="Bulk & Block Deals"
            meta={`Trade date: ${shortDate} · Updated 18:30 IST`}
            total={12}
            showViewAll={activeTab === "brief"}
            onViewAll={() => setActiveTab("deals")}
          />
          <div className="mp-table-wrap">
            <table className="mp-table mp-deals-table">
              <thead>
                <tr>
                  <th className="mp-col-star"><span className="mp-sr-only">Watchlist</span></th>
                  <th>Company</th>
                  <th>Deal</th>
                  <th>Participant</th>
                  <th>Side</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((row) => (
                  <tr key={row.id}>
                    <td className="mp-col-star">
                      <button
                        type="button"
                        className={`mp-star${starred.has(row.id) ? " is-starred" : ""}`}
                        aria-label={`${starred.has(row.id) ? "Remove" : "Add"} ${row.company} ${starred.has(row.id) ? "from" : "to"} watchlist`}
                        onClick={() => toggleStar(row.id)}
                      >
                        <IconStar filled={starred.has(row.id)} />
                      </button>
                    </td>
                    <td><strong>{row.company}</strong></td>
                    <td><span className="mp-badge">{row.dealType}</span></td>
                    <td>{row.participant}</td>
                    <td><span className={`mp-side is-${row.side.toLowerCase()}`}>{row.side}</span></td>
                    <td className="mp-num">{row.quantity}</td>
                    <td className="mp-num">{row.price}</td>
                    <td className="mp-num">{row.value}</td>
                    <td><SourceLink label={row.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDeals.length === 0 && (
              <p className="mp-empty">No bulk or block deals match the current filters.</p>
            )}
          </div>
          <p className="mp-card-foot">Individual reported records; buy and sell entries may relate to the same transaction.</p>
        </section>
      )}

      {showFundraises && (
        <section className="mp-card" aria-label="Fundraises">
          <SectionHead
            icon={<IconFundraise />}
            title="Fundraises"
            meta={`Announcements: ${shortDate} · Updated 21:00 IST`}
            total={5}
            showViewAll={activeTab === "brief"}
            onViewAll={() => setActiveTab("fundraises")}
          />
          <div className="mp-table-wrap">
            <table className="mp-table mp-fundraise-table">
              <thead>
                <tr>
                  <th className="mp-col-star"><span className="mp-sr-only">Watchlist</span></th>
                  <th>Company</th>
                  <th>Route</th>
                  <th>Stage</th>
                  <th>Amount</th>
                  <th>Key date</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredFundraises.map((row) => (
                  <tr key={row.id}>
                    <td className="mp-col-star">
                      <button
                        type="button"
                        className={`mp-star${starred.has(row.id) ? " is-starred" : ""}`}
                        aria-label={`${starred.has(row.id) ? "Remove" : "Add"} ${row.company} ${starred.has(row.id) ? "from" : "to"} watchlist`}
                        onClick={() => toggleStar(row.id)}
                      >
                        <IconStar filled={starred.has(row.id)} />
                      </button>
                    </td>
                    <td><strong>{row.company}</strong></td>
                    <td>{row.route}</td>
                    <td><span className={`mp-badge is-${row.stageTone === "proposed" ? "proposed" : "plain"}`}>{row.stage}</span></td>
                    <td className="mp-num">{row.amount}</td>
                    <td>{row.keyDate}</td>
                    <td><SourceLink label={row.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFundraises.length === 0 && (
              <p className="mp-empty">No fundraise announcements match the current filters.</p>
            )}
          </div>
          <p className="mp-card-foot">Track each raise from meeting notice through proposal, approval and allotment.</p>
        </section>
      )}

      {showNews && (
        <section className="mp-card" aria-label="News & Announcements">
          <SectionHead
            icon={<IconNews />}
            title="News & Announcements"
            meta={`Published: ${publishedLabel} · ${newsLoading ? "Loading updates" : `${newsDocs.length} updates`}`}
            total={newsLoading ? "—" : newsDocs.length}
            showViewAll={activeTab === "brief"}
            onViewAll={() => setActiveTab("news")}
          />
          <div className="mp-table-wrap">
            <table className="mp-table mp-news-table">
              <thead>
                <tr>
                  <th className="mp-col-star"><span className="mp-sr-only">Watchlist</span></th>
                  <th>Time</th>
                  <th>Company</th>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Sentiment</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {visibleNews.map((row) => {
                  const tone = sentimentTone(row.sentiment);
                  return (
                    <tr key={row.$id}>
                      <td className="mp-col-star">
                        <button
                          type="button"
                          className={`mp-star${starred.has(row.$id) ? " is-starred" : ""}`}
                          aria-label={`${starred.has(row.$id) ? "Remove" : "Add"} ${row.company} ${starred.has(row.$id) ? "from" : "to"} watchlist`}
                          onClick={() => toggleStar(row.$id)}
                        >
                          <IconStar filled={starred.has(row.$id)} />
                        </button>
                      </td>
                      <td className="mp-time">
                        {row.filedTime}
                        <span className="mp-news-scan">Scan {formatDbDate(row.newsDate)}</span>
                      </td>
                      <td>
                        <strong>{row.company}</strong>
                        <span className="mp-company-ticker">{row.ticker}</span>
                      </td>
                      <td>
                        <strong className="mp-headline">{row.headline}</strong>
                        <span className="mp-headline-sub">{row.summary}</span>
                      </td>
                      <td><span className={`mp-badge is-${tone}`}>{row.category}</span></td>
                      <td><span className={`mp-sentiment is-${tone}`}>{row.sentiment}</span></td>
                      <td><SourceLink label={row.sourceName} href={row.sourceUrl} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {newsLoading && <p className="mp-empty">Loading market news…</p>}
            {!newsLoading && newsError && <p className="mp-empty">Unable to load market news: {newsError}</p>}
            {!newsLoading && !newsError && visibleNews.length === 0 && (
              <p className="mp-empty">No news updates match the current filters.</p>
            )}
          </div>
          <p className="mp-card-foot">Use News filters for results, orders, M&amp;A, demergers, buybacks, rights, bonus and splits.</p>
        </section>
      )}

      <div className="mp-page-foot">
        <span>Daily scans are dated snapshots. Open the source for the full disclosure.</span>
        <button type="button" className="mp-edition-link">
          <IconChevronLeft />
          Previous edition
        </button>
      </div>
    </div>
  );
}
