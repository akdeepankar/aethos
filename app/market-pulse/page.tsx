"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  dealDate?: string;
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
  fundDate?: string;
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
    company: "NLC India",
    dealType: "BULK",
    participant: "Societe Generale",
    side: "BUY",
    quantity: "15,00,000",
    price: "₹248.50",
    value: "₹37.28 Cr",
    source: "NSE",
    dealDate: "2026-10-23",
  },
  {
    id: "deal-2",
    company: "Petronet LNG",
    dealType: "BLOCK",
    participant: "ICICI Prudential Mutual Fund",
    side: "BUY",
    quantity: "8,50,000",
    price: "₹312.00",
    value: "₹26.52 Cr",
    source: "BSE",
    dealDate: "2026-10-23",
  },
  {
    id: "deal-3",
    company: "BlueStone Jewellery",
    dealType: "BULK",
    participant: "Peak XV Partners",
    side: "SELL",
    quantity: "12,00,000",
    price: "₹520.00",
    value: "₹62.40 Cr",
    source: "NSE",
    dealDate: "2026-10-23",
  },
  {
    id: "deal-4",
    company: "GPT Infraprojects",
    dealType: "BULK",
    participant: "Nine Rivers Capital",
    side: "BUY",
    quantity: "4,20,000",
    price: "₹185.00",
    value: "₹7.77 Cr",
    source: "NSE",
    dealDate: "2026-10-23",
  },
  {
    id: "deal-5",
    company: "Sagility",
    dealType: "BULK",
    participant: "Morgan Stanley Asia",
    side: "BUY",
    quantity: "25,00,000",
    price: "₹42.50",
    value: "₹10.63 Cr",
    source: "NSE",
    dealDate: "2026-10-26",
  },
  {
    id: "deal-6",
    company: "Waaree Energies",
    dealType: "BLOCK",
    participant: "Goldman Sachs Investments",
    side: "BUY",
    quantity: "3,50,000",
    price: "₹2,840.00",
    value: "₹99.40 Cr",
    source: "NSE",
    dealDate: "2026-10-26",
  },
  {
    id: "deal-7",
    company: "Deep Industries",
    dealType: "BULK",
    participant: "Quant Mutual Fund",
    side: "BUY",
    quantity: "6,00,000",
    price: "₹480.00",
    value: "₹28.80 Cr",
    source: "BSE",
    dealDate: "2026-10-26",
  },
  {
    id: "deal-demo-1",
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
    id: "deal-demo-2",
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
    company: "BlueStone Jewellery and Lifestyle",
    route: "Non-Convertible Debentures (NCD)",
    stage: "BOARD APPROVED",
    stageTone: "proposed",
    amount: "₹300 Cr",
    keyDate: "Board · 23 Oct",
    source: "Filing",
    fundDate: "2026-10-23",
  },
  {
    id: "fund-2",
    company: "NLC India",
    route: "Project Debt & Equity via JV",
    stage: "MoU SIGNED",
    stageTone: "neutral",
    amount: "₹19,422 Cr",
    keyDate: "MoU · 23 Oct",
    source: "Filing",
    fundDate: "2026-10-23",
  },
  {
    id: "fund-3",
    company: "Waaree Energies",
    route: "Qualified Institutional Placement (QIP)",
    stage: "PROPOSED",
    stageTone: "proposed",
    amount: "₹1,500 Cr",
    keyDate: "EGM · 26 Oct",
    source: "Filing",
    fundDate: "2026-10-26",
  },
  {
    id: "fund-4",
    company: "Sagility",
    route: "Interim Dividend Allotment",
    stage: "DECLARED",
    stageTone: "neutral",
    amount: "₹72 Cr",
    keyDate: "Record · 05 Nov",
    source: "Filing",
    fundDate: "2026-10-26",
  },
  {
    id: "fund-demo-1",
    company: "Sample Industries",
    route: "Preferential warrants",
    stage: "PROPOSED",
    stageTone: "proposed",
    amount: "₹80 Cr",
    keyDate: "EGM · 14 Nov",
    source: "Filing",
  },
  {
    id: "fund-demo-2",
    company: "Sample Components",
    route: "To be considered",
    stage: "BOARD MEETING ANNOUNCED",
    stageTone: "neutral",
    amount: "Not disclosed",
    keyDate: "Board · 28 Oct",
    source: "Filing",
  },
];

function getToday(): Date {
  return new Date();
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isToday(d: Date): boolean {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function parseDateParam(param: string | null | undefined): Date | null {
  if (!param) return null;
  const trimmed = param.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase() === "today") {
    return new Date();
  }
  if (trimmed.toLowerCase() === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }

  // Format: YYYY-MM-DD or YYYY/MM/DD
  const ymd = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const y = parseInt(ymd[1], 10);
    const m = parseInt(ymd[2], 10);
    const d = parseInt(ymd[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Format: DD-MM-YYYY or DD/MM/YYYY
  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10);
    const y = parseInt(dmy[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // ISO or general date parsing
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return null;
}

function parseTabParam(param: string | null | undefined): TabId | null {
  if (!param) return null;
  const normalized = param.trim().toLowerCase();
  if (
    normalized === "deals" ||
    normalized === "bulk" ||
    normalized === "block" ||
    normalized === "bulk-block" ||
    normalized === "bulk-and-block" ||
    normalized === "bulk-and-block-deals" ||
    normalized === "bulk_block" ||
    normalized === "bulkblock"
  ) {
    return "deals";
  }
  if (
    normalized === "fundraises" ||
    normalized === "fundraise" ||
    normalized === "funding" ||
    normalized === "fund" ||
    normalized === "fundraising"
  ) {
    return "fundraises";
  }
  if (
    normalized === "news" ||
    normalized === "announcements" ||
    normalized === "market-news" ||
    normalized === "marketnews" ||
    normalized === "filings"
  ) {
    return "news";
  }
  if (
    normalized === "brief" ||
    normalized === "daily" ||
    normalized === "daily-brief" ||
    normalized === "summary" ||
    normalized === "overview"
  ) {
    return "brief";
  }
  return null;
}

function matchesDate(docDate: string, target: Date): boolean {
  if (!docDate) return false;
  const targetKey = toDateKey(target);
  const trimmed = docDate.trim();
  if (trimmed === targetKey || trimmed.startsWith(targetKey)) {
    return true;
  }
  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const d = String(dmy[1]).padStart(2, "0");
    const m = String(dmy[2]).padStart(2, "0");
    const y = dmy[3];
    if (`${y}-${m}-${d}` === targetKey) return true;
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return toDateKey(parsed) === targetKey;
  }
  return false;
}

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
      {showViewAll && total !== 0 && total !== "0" && total !== "—" && (
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

function MarketPulseContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read date parameter from URL if provided (supports ?date=YYYY-MM-DD or ?d=...)
  const urlDateParam = searchParams.get("date") || searchParams.get("d");
  const parsedUrlDate = useMemo(() => parseDateParam(urlDateParam), [urlDateParam]);

  // Read tab parameter from URL if provided (supports ?tab=deals, ?tab=fundraises, ?tab=news, ?tab=brief)
  const urlTabParam =
    searchParams.get("tab") ||
    searchParams.get("type") ||
    searchParams.get("section") ||
    searchParams.get("view");
  const parsedUrlTab = useMemo(() => parseTabParam(urlTabParam), [urlTabParam]);

  const [internalTab, setInternalTab] = useState<TabId>(() => parsedUrlTab ?? "brief");
  const [internalDate, setInternalDate] = useState<Date>(() => parsedUrlDate ?? getToday());
  const [query, setQuery] = useState("");
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [newsDocs, setNewsDocs] = useState<MarketNewsDoc[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const archiveDropdownRef = useRef<HTMLDivElement>(null);

  // Close archive dropdown on outside click
  useEffect(() => {
    if (!archiveOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (archiveDropdownRef.current && !archiveDropdownRef.current.contains(e.target as Node)) {
        setArchiveOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [archiveOpen]);

  // Active tab and date: URL parameter takes priority, otherwise internal state
  const activeTab = parsedUrlTab ?? internalTab;
  const date = parsedUrlDate ?? internalDate;

  // Change tab and synchronize the URL parameter ?tab=... while preserving active date
  const changeTab = useCallback(
    (newTab: TabId) => {
      setInternalTab(newTab);
      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      params.set("tab", newTab);
      params.delete("type");
      params.delete("section");
      params.delete("view");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Change date and synchronize the URL parameter ?date=... while preserving active tab
  const changeDate = useCallback(
    (newDate: Date) => {
      setInternalDate(newDate);
      setArchiveOpen(false);
      const newKey = toDateKey(newDate);
      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      if (params.get("date") !== newKey) {
        params.set("date", newKey);
        params.delete("d");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [searchParams, router, pathname],
  );

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

  const newsForDate = useMemo(
    () => newsDocs.filter((row) => matchesDate(row.newsDate, date)),
    [newsDocs, date],
  );

  // Date-wise deals filtering with fallback
  const dealsForDate = useMemo(() => {
    const matching = deals.filter((row) => row.dealDate && matchesDate(row.dealDate, date));
    if (matching.length > 0) return matching;
    return deals;
  }, [date]);

  // Date-wise fundraises filtering with fallback
  const fundraisesForDate = useMemo(() => {
    const matching = fundraises.filter((row) => row.fundDate && matchesDate(row.fundDate, date));
    if (matching.length > 0) return matching;
    return fundraises;
  }, [date]);

  // Group and sort available dates from database to offer easy edition navigation
  const availableScanDates = useMemo(() => {
    const map = new Map<string, number>();
    for (const doc of newsDocs) {
      if (!doc.newsDate) continue;
      const key = doc.newsDate.split("T")[0];
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([dateKey, count]) => ({
        dateKey,
        date: parseDateParam(dateKey) || new Date(dateKey),
        count,
      }))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [newsDocs]);

  const filteredDeals = useMemo(
    () =>
      dealsForDate.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.id)) &&
          (!term ||
            row.company.toLowerCase().includes(term) ||
            row.participant.toLowerCase().includes(term)),
      ),
    [dealsForDate, term, watchlistOnly, starred],
  );

  const filteredFundraises = useMemo(
    () =>
      fundraisesForDate.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.id)) &&
          (!term || row.company.toLowerCase().includes(term)),
      ),
    [fundraisesForDate, term, watchlistOnly, starred],
  );

  const filteredNews = useMemo(
    () =>
      newsForDate.filter(
        (row) =>
          (!watchlistOnly || starred.has(row.$id)) &&
          (!term ||
            [row.company, row.ticker, row.headline, row.summary, row.category, row.sentiment].some((value) =>
              value.toLowerCase().includes(term),
            )),
      ),
    [newsForDate, term, watchlistOnly, starred],
  );

  const showDeals = activeTab === "brief" || activeTab === "deals";
  const showFundraises = activeTab === "brief" || activeTab === "fundraises";
  const showNews = activeTab === "brief" || activeTab === "news";
  const shortDate = formatShortDate(date);
  const visibleNews = activeTab === "brief" ? filteredNews.slice(0, 2) : filteredNews;
  const visibleDeals = activeTab === "brief" ? filteredDeals.slice(0, 3) : filteredDeals;
  const visibleFundraises = activeTab === "brief" ? filteredFundraises.slice(0, 3) : filteredFundraises;
  const publishedLabel = newsForDate.length > 0 ? formatDbDate(newsForDate[0].newsDate) : shortDate;

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
            onClick={() => changeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mp-toolbar">
        <div className="mp-toolbar-left" style={{ position: "relative" }}>
          <button
            type="button"
            className="mp-control mp-date"
            onClick={() => {
              try {
                dateInputRef.current?.showPicker();
              } catch {
                dateInputRef.current?.focus();
              }
            }}
            title="Click to select date"
          >
            <IconCalendar />
            {formatDate(date)}
            <input
              ref={dateInputRef}
              type="date"
              value={toDateKey(date)}
              onChange={(e) => {
                if (!e.target.value) return;
                const parsed = parseDateParam(e.target.value);
                if (parsed) {
                  changeDate(parsed);
                }
              }}
              style={{
                position: "absolute",
                opacity: 0,
                width: 0,
                height: 0,
                pointerEvents: "none",
              }}
              tabIndex={-1}
              aria-hidden="true"
            />
          </button>

          <div className="mp-stepper">
            <button
              type="button"
              aria-label="Previous day"
              title="Previous day"
              onClick={() => changeDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next day"
              title="Next day"
              onClick={() => changeDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))}
            >
              <IconChevronRight />
            </button>
          </div>

          {!isToday(date) && (
            <button
              type="button"
              className="mp-control"
              onClick={() => changeDate(new Date())}
              style={{
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#854d0e",
                background: "#fefce8",
                borderColor: "#fef08a",
                cursor: "pointer",
                padding: "0 10px",
              }}
              title="Return to today's date"
            >
              Today
            </button>
          )}

          <div className="mp-select">
            <select
              aria-label="Edition"
              value={
                availableScanDates.some((item) => item.dateKey === toDateKey(date))
                  ? toDateKey(date)
                  : "daily"
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === "daily") {
                  changeDate(new Date());
                } else if (val) {
                  const parsed = parseDateParam(val);
                  if (parsed) changeDate(parsed);
                }
              }}
            >
              <option value="daily">Daily scan edition</option>
              {availableScanDates.map((item) => (
                <option key={item.dateKey} value={item.dateKey}>
                  Edition {formatDate(item.date)} ({item.count})
                </option>
              ))}
            </select>
            <IconChevronDown />
          </div>

          <div ref={archiveDropdownRef} style={{ position: "relative" }}>
            <button
              type="button"
              className={`mp-control${archiveOpen ? " is-active" : ""}`}
              onClick={() => setArchiveOpen((prev) => !prev)}
              aria-expanded={archiveOpen}
              title="Browse past editions archive"
            >
              <IconFolder />
              Archive
              <IconChevronDown />
            </button>

            {archiveOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  zIndex: 40,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                  padding: "8px",
                  minWidth: "220px",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#64748b",
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: "4px",
                  }}
                >
                  Available Editions
                </div>
                {availableScanDates.length > 0 ? (
                  availableScanDates.map((item) => {
                    const isSelected = item.dateKey === toDateKey(date);
                    return (
                      <button
                        key={item.dateKey}
                        type="button"
                        onClick={() => changeDate(item.date)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "none",
                          background: isSelected ? "#f8fafc" : "transparent",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "12.5px",
                          color: isSelected ? "#0f172a" : "#334155",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <IconCalendar />
                          {formatDate(item.date)}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            background: isSelected ? "#e2e8f0" : "#f1f5f9",
                            color: "#64748b",
                          }}
                        >
                          {item.count} updates
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div style={{ padding: "10px", fontSize: "12px", color: "#64748b" }}>
                    No recorded archives yet.
                  </div>
                )}
                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "4px", paddingTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setArchiveOpen(false);
                      try {
                        dateInputRef.current?.showPicker();
                      } catch {
                        dateInputRef.current?.focus();
                      }
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      fontSize: "12px",
                      color: "#b45309",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Custom calendar date...</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
          <button type="button" className="mp-stat" onClick={() => changeTab("news")}>
            <span className="mp-stat-icon">
              <IconNews />
            </span>
            <span className="mp-stat-number">{newsLoading ? "—" : newsForDate.length}</span>
            <span className="mp-stat-label">News updates</span>
          </button>
          <button type="button" className="mp-stat" onClick={() => changeTab("deals")}>
            <span className="mp-stat-icon">
              <IconDeals />
            </span>
            <span className="mp-stat-number">{filteredDeals.length}</span>
            <span className="mp-stat-label">Bulk / block records</span>
          </button>
          <button type="button" className="mp-stat" onClick={() => changeTab("fundraises")}>
            <span className="mp-stat-icon">
              <IconFundraise />
            </span>
            <span className="mp-stat-number">{filteredFundraises.length}</span>
            <span className="mp-stat-label">Fundraise announcements</span>
          </button>
        </div>
      )}

      {showNews && (
        <section className="mp-card" aria-label="News & Announcements">
          <SectionHead
            icon={<IconNews />}
            title="News & Announcements"
            meta={`Published: ${publishedLabel} · ${newsLoading ? "Loading updates" : `${newsForDate.length} updates`}`}
            total={newsLoading ? "—" : newsForDate.length}
            showViewAll={activeTab === "brief" && filteredNews.length > 0}
            onViewAll={() => changeTab("news")}
          />
          {visibleNews.length > 0 ? (
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
            </div>
          ) : (
            <div className="mp-empty mp-empty-center">
              {newsLoading ? (
                <p className="mp-empty-title">Loading market news…</p>
              ) : newsError ? (
                <p className="mp-empty-title">Unable to load market news: {newsError}</p>
              ) : (
                <>
                  <div className="mp-empty-icon" aria-hidden="true">
                    <IconNews />
                  </div>
                  <p className="mp-empty-title">
                    {newsForDate.length === 0
                      ? isToday(date)
                        ? "No news reported yet today"
                        : `No news reported for ${shortDate}`
                      : "No news updates match the current filters."}
                  </p>
                  <p className="mp-empty-desc">
                    {newsForDate.length === 0
                      ? isToday(date)
                        ? "There are no corporate filings or market news announcements reported yet today."
                        : `There are no corporate filings or market news announcements reported for ${shortDate}.`
                      : "Try clearing search keywords or unchecking watchlist only."}
                  </p>

                  {newsForDate.length === 0 && availableScanDates.length > 0 && (
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "var(--muted, #64748b)" }}>
                        Browse available archive editions:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                        {availableScanDates.map((item) => (
                          <button
                            key={item.dateKey}
                            type="button"
                            onClick={() => changeDate(item.date)}
                            className="mp-control"
                            style={{
                              fontSize: "12px",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              background: "#ffffff",
                              borderColor: "#cbd5e1",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <IconCalendar />
                            <strong>{formatDate(item.date)}</strong>
                            <span style={{ fontSize: "10.5px", background: "#f1f5f9", padding: "1px 6px", borderRadius: "8px", color: "#64748b" }}>
                              {item.count} updates
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <p className="mp-card-foot">Use News filters for results, orders, M&amp;A, demergers, buybacks, rights, bonus and splits.</p>
        </section>
      )}

      {showDeals && (
        <section className="mp-card" aria-label="Bulk & Block Deals">
          <SectionHead
            icon={<IconDeals />}
            title="Bulk & Block Deals"
            meta={`Trade date: ${shortDate} · Updated 18:30 IST`}
            total={filteredDeals.length}
            showViewAll={activeTab === "brief" && filteredDeals.length > 0}
            onViewAll={() => changeTab("deals")}
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
                {visibleDeals.map((row) => (
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
            total={filteredFundraises.length}
            showViewAll={activeTab === "brief" && filteredFundraises.length > 0}
            onViewAll={() => changeTab("fundraises")}
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
                {visibleFundraises.map((row) => (
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

      <div className="mp-page-foot">
        <span>Daily scans are dated snapshots. Open the source for the full disclosure.</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="mp-edition-link"
            onClick={() => {
              const earlier = availableScanDates.find((item) => item.dateKey < toDateKey(date));
              if (earlier) {
                changeDate(earlier.date);
              } else {
                changeDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
              }
            }}
          >
            <IconChevronLeft />
            Previous edition
          </button>

          {availableScanDates.some((item) => item.dateKey > toDateKey(date)) && (
            <button
              type="button"
              className="mp-edition-link"
              onClick={() => {
                const later = [...availableScanDates].reverse().find((item) => item.dateKey > toDateKey(date));
                if (later) {
                  changeDate(later.date);
                } else {
                  changeDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
                }
              }}
            >
              Next edition
              <IconChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketPulsePage() {
  return (
    <Suspense
      fallback={
        <div className="dash-overview-page mp-page" style={{ padding: "60px 20px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "16px 28px",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
              Loading Market Pulse…
            </span>
          </div>
        </div>
      }
    >
      <MarketPulseContent />
    </Suspense>
  );
}
