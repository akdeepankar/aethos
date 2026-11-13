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
  $createdAt?: string;
  createdAt?: string;
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
  $createdAt?: string;
  createdAt?: string;
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

const INITIAL_DEALS: DealRow[] = [
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

const INITIAL_FUNDRAISES: FundraiseRow[] = [
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

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDbDate(value: string) {
  if (!value) return "";
  const cleaned = value.split("T")[0].trim();
  const parts = cleaned.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
  return `${parts[2]} ${monthNames[parts[1] - 1] ?? ""}`.trim();
}

function formatScanDate(value: string) {
  if (!value) return "";
  const cleaned = value.split("T")[0].trim();
  const parts = cleaned.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
  return `${parts[2]} ${monthNames[parts[1] - 1] ?? ""} ${parts[0]}`;
}

const monthMap: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseNewsTimestamp(row: MarketNewsDoc): number {
  if (row.filedTime) {
    const trimmed = row.filedTime.trim();
    const match = trimmed.match(/^(\d{1,2})[\s\-]+([A-Za-z]+)(?:[\s\-]+(\d{4}))?[,\s]+(\d{1,2}):(\d{2})/i);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthStr = match[2].toLowerCase().slice(0, 3);
      const month = monthMap[monthStr] ?? 0;
      let year = match[3] ? parseInt(match[3], 10) : null;
      if (!year && row.newsDate) {
        year = parseInt(row.newsDate.split("-")[0], 10);
      }
      if (!year) year = new Date().getFullYear();
      const hour = parseInt(match[4], 10);
      const min = parseInt(match[5], 10);
      const dt = new Date(year, month, day, hour, min);
      if (!isNaN(dt.getTime())) return dt.getTime();
    }
    const directDate = new Date(trimmed);
    if (!isNaN(directDate.getTime())) return directDate.getTime();
  }
  if (row.newsDate) {
    const d = new Date(row.newsDate);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
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

function IconX() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
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
  const urlQueryParam = searchParams.get("q") || searchParams.get("query") || searchParams.get("search") || "";
  const [query, setQuery] = useState(urlQueryParam);
  const urlHighlightParam = searchParams.get("highlight") || searchParams.get("id") || "";
  const [activeHighlight, setActiveHighlight] = useState<string>(urlHighlightParam);

  useEffect(() => {
    if (urlQueryParam) {
      setQuery(urlQueryParam);
    }
  }, [urlQueryParam]);

  useEffect(() => {
    if (urlHighlightParam) {
      setActiveHighlight(urlHighlightParam);
    }
  }, [urlHighlightParam]);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [deals, setDeals] = useState<DealRow[]>(INITIAL_DEALS);
  const [fundraises, setFundraises] = useState<FundraiseRow[]>(INITIAL_FUNDRAISES);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [fundraisesLoading, setFundraisesLoading] = useState(true);
  const [newsDocs, setNewsDocs] = useState<MarketNewsDoc[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Active tab and date: URL parameter takes priority, otherwise internal state
  const activeTab = parsedUrlTab ?? internalTab;
  const date = parsedUrlDate ?? internalDate;

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(date.getFullYear(), date.getMonth(), 1),
  );

  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // Close calendar popover on outside click or Escape key
  useEffect(() => {
    if (!calendarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarContainerRef.current && !calendarContainerRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [calendarOpen]);

  const handleToggleCalendar = useCallback(() => {
    setCalendarOpen((prev) => {
      if (!prev) {
        setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
      return !prev;
    });
  }, [date]);

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
      setCalendarOpen(false);
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

  // If highlight is provided in URL, automatically switch to news tab
  useEffect(() => {
    if (urlHighlightParam && activeTab !== "news") {
      changeTab("news");
    }
  }, [urlHighlightParam, activeTab, changeTab]);

  // If highlighted document belongs to a different date, switch date to match
  useEffect(() => {
    if (!urlHighlightParam || newsDocs.length === 0) return;
    const targetDoc = newsDocs.find((d) => d.$id === urlHighlightParam);
    if (targetDoc?.newsDate && !matchesDate(targetDoc.newsDate, date)) {
      const parsed = parseDateParam(targetDoc.newsDate);
      if (parsed) {
        changeDate(parsed);
      }
    }
  }, [urlHighlightParam, newsDocs, date, changeDate]);

  const targetDateKey = toDateKey(date);

  // On mount: fetch latest news to discover available dates and seed initial view if needed
  useEffect(() => {
    let cancelled = false;

    databases
      .listDocuments("aethos_db", "market_news", [
        Query.orderDesc("newsDate"),
        Query.limit(100),
      ])
      .then((response) => {
        if (cancelled) return;
        const docs = (response.documents as unknown as MarketNewsDoc[]).sort(
          (a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a),
        );
        if (docs.length > 0) {
          setNewsDocs((prev) => {
            const map = new Map<string, MarketNewsDoc>();
            for (const d of prev) map.set(d.$id, d);
            for (const d of docs) map.set(d.$id, d);
            return Array.from(map.values()).sort(
              (a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a),
            );
          });
          const watchlisted = docs.filter((doc) => doc.isWatchlist).map((doc) => doc.$id);
          if (watchlisted.length > 0) {
            setStarred((prev) => new Set([...prev, ...watchlisted]));
          }
          if (!urlDateParam && docs[0]?.newsDate) {
            const parsed = parseDateParam(docs[0].newsDate);
            if (parsed) {
              setInternalDate(parsed);
            }
          }
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.warn("Could not fetch initial news feed:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [urlDateParam]);

  // When date changes: fetch and filter news for the selected date
  useEffect(() => {
    let cancelled = false;
    setNewsLoading(true);
    setNewsError(null);

    databases
      .listDocuments("aethos_db", "market_news", [
        Query.startsWith("newsDate", targetDateKey),
        Query.limit(100),
      ])
      .then((response) => {
        if (cancelled) return;
        const docs = (response.documents as unknown as MarketNewsDoc[]).sort(
          (a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a),
        );
        setNewsDocs((prev) => {
          const map = new Map<string, MarketNewsDoc>();
          for (const d of prev) map.set(d.$id, d);
          for (const d of docs) map.set(d.$id, d);
          return Array.from(map.values()).sort(
            (a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a),
          );
        });
        const watchlisted = docs.filter((doc) => doc.isWatchlist).map((doc) => doc.$id);
        if (watchlisted.length > 0) {
          setStarred((prev) => new Set([...prev, ...watchlisted]));
        }
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
  }, [targetDateKey]);

  // Fetch market deals and fundraises from Appwrite
  useEffect(() => {
    let cancelled = false;

    databases
      .listDocuments("aethos_db", "market_deals", [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ])
      .then((res) => {
        if (cancelled) return;
        const mapped: DealRow[] = res.documents.map((d: any) => ({
          id: d.$id,
          company: d.company,
          dealType: d.dealType,
          participant: d.participant,
          side: d.side,
          quantity: d.quantity,
          price: d.price,
          value: d.value,
          source: d.source,
          dealDate: d.dealDate,
          $createdAt: d.$createdAt,
          createdAt: d.$createdAt,
        }));
        if (mapped.length > 0) {
          setDeals(mapped);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Could not load market_deals:", err);
      })
      .finally(() => {
        if (!cancelled) setDealsLoading(false);
      });

    databases
      .listDocuments("aethos_db", "market_fundraises", [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ])
      .then((res) => {
        if (cancelled) return;
        const mapped: FundraiseRow[] = res.documents.map((d: any) => ({
          id: d.$id,
          company: d.company,
          route: d.route,
          stage: d.stage,
          stageTone: d.stageTone,
          amount: d.amount,
          keyDate: d.keyDate,
          source: d.source,
          fundDate: d.fundDate,
          $createdAt: d.$createdAt,
          createdAt: d.$createdAt,
        }));
        if (mapped.length > 0) {
          setFundraises(mapped);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Could not load market_fundraises:", err);
      })
      .finally(() => {
        if (!cancelled) setFundraisesLoading(false);
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
    () =>
      newsDocs
        .filter((row) => matchesDate(row.newsDate, date))
        .sort((a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a)),
    [newsDocs, date],
  );

  // Date-wise deals filtering strictly by createdAt
  const dealsForDate = useMemo(() => {
    return deals.filter((row) => {
      const dateVal = row.$createdAt || row.createdAt || row.dealDate;
      return dateVal && matchesDate(dateVal, date);
    });
  }, [deals, date]);

  // Date-wise fundraises filtering strictly by createdAt
  const fundraisesForDate = useMemo(() => {
    return fundraises.filter((row) => {
      const dateVal = row.$createdAt || row.createdAt || row.fundDate;
      return dateVal && matchesDate(dateVal, date);
    });
  }, [fundraises, date]);

  // Map of available dates with update counts
  const availableScanMap = useMemo(() => {
    const map = new Map<string, { count: number; newsCount: number; dealsCount: number; fundsCount: number }>();
    for (const doc of newsDocs) {
      if (!doc.newsDate) continue;
      const key = doc.newsDate.split("T")[0];
      const cur = map.get(key) || { count: 0, newsCount: 0, dealsCount: 0, fundsCount: 0 };
      cur.count += 1;
      cur.newsCount += 1;
      map.set(key, cur);
    }
    for (const deal of deals) {
      const dateStr = deal.$createdAt || deal.createdAt || deal.dealDate;
      if (!dateStr) continue;
      const key = dateStr.split("T")[0];
      const cur = map.get(key) || { count: 0, newsCount: 0, dealsCount: 0, fundsCount: 0 };
      cur.dealsCount += 1;
      if (cur.newsCount === 0) cur.count += 1;
      map.set(key, cur);
    }
    for (const fund of fundraises) {
      const dateStr = fund.$createdAt || fund.createdAt || fund.fundDate;
      if (!dateStr) continue;
      const key = dateStr.split("T")[0];
      const cur = map.get(key) || { count: 0, newsCount: 0, dealsCount: 0, fundsCount: 0 };
      cur.fundsCount += 1;
      if (cur.newsCount === 0 && cur.dealsCount === 0) cur.count += 1;
      map.set(key, cur);
    }
    return map;
  }, [newsDocs, deals, fundraises]);

  // Group and sort available dates to offer easy edition navigation
  const availableScanDates = useMemo(() => {
    return Array.from(availableScanMap.entries())
      .map(([dateKey, info]) => ({
        dateKey,
        date: parseDateParam(dateKey) || new Date(dateKey),
        count: info.count,
        newsCount: info.newsCount,
      }))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [availableScanMap]);

  // Computed days for calendar month grid
  const calendarGrid = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return { year, month, blanks, days };
  }, [calendarMonth]);

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

  const latestNewsDateStr = useMemo(() => {
    if (newsDocs.length === 0) return null;
    let max = "";
    for (const doc of newsDocs) {
      if (!doc.newsDate) continue;
      const key = doc.newsDate.split("T")[0].trim();
      if (!max || key > max) {
        max = key;
      }
    }
    return max || null;
  }, [newsDocs]);

  const latestNewsDate = useMemo(() => {
    if (!latestNewsDateStr) return null;
    return parseDateParam(latestNewsDateStr);
  }, [latestNewsDateStr]);

  // In market news, filter strictly date-wise using the newsDate column
  const filteredNews = useMemo(() => {
    const list = newsDocs
      .filter((row) => row.newsDate && matchesDate(row.newsDate, date))
      .sort((a, b) => parseNewsTimestamp(b) - parseNewsTimestamp(a));

    if (activeHighlight && !list.some((r) => r.$id === activeHighlight)) {
      const target = newsDocs.find((r) => r.$id === activeHighlight);
      if (target) {
        return [target, ...list];
      }
    }

    return list;
  }, [newsDocs, date, activeHighlight]);

  const showDeals = activeTab === "brief" || activeTab === "deals";
  const showFundraises = activeTab === "brief" || activeTab === "fundraises";
  const showNews = activeTab === "brief" || activeTab === "news";
  const shortDate = formatShortDate(date);
  const visibleNews = activeTab === "brief" ? filteredNews.slice(0, 2) : filteredNews;
  const visibleDeals = activeTab === "brief" ? filteredDeals.slice(0, 3) : filteredDeals;
  const visibleFundraises = activeTab === "brief" ? filteredFundraises.slice(0, 3) : filteredFundraises;
  const publishedLabel =
    filteredNews.length > 0 && filteredNews[0].newsDate
      ? formatDbDate(filteredNews[0].newsDate)
      : shortDate;

  // Scroll to highlighted row when loaded and rendered
  useEffect(() => {
    if (!activeHighlight || newsLoading) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`news-row-${activeHighlight}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [activeHighlight, newsLoading, visibleNews]);

  return (
    <div className="dash-overview-page mp-page">
      <header className="mp-header">
        <div>
          <h1 className="mp-title">Market Pulse</h1>
          <p className="mp-subtitle">Daily deal activity, fundraising announcements and company news.</p>
        </div>
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
        <div className="mp-toolbar-left" style={{ position: "relative" }} ref={calendarContainerRef}>
          <button
            type="button"
            className={`mp-control mp-date${calendarOpen ? " is-active" : ""}`}
            onClick={handleToggleCalendar}
            title="Open archive calendar"
            aria-expanded={calendarOpen}
            style={{
              cursor: "pointer",
              borderColor: calendarOpen ? "#0f172a" : undefined,
            }}
          >
            <IconCalendar />
            <span>{formatDate(date)}</span>
            <IconChevronDown />
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

          {calendarOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                zIndex: 50,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                boxShadow: "0 20px 35px -5px rgba(15, 23, 42, 0.15), 0 10px 15px -5px rgba(15, 23, 42, 0.08)",
                padding: "16px",
                width: "min(340px, calc(100vw - 32px))",
                color: "#0f172a",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                    {formatMonthYear(calendarMonth)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                    }
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                    title="Previous month"
                    aria-label="Previous month"
                  >
                    <IconChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                    }}
                    style={{
                      height: "28px",
                      padding: "0 8px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      color: "#475569",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    title="Jump to current month"
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                    }
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                    title="Next month"
                    aria-label="Next month"
                  >
                    <IconChevronRight />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(false)}
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      color: "#94a3b8",
                      cursor: "pointer",
                      marginLeft: "2px",
                    }}
                    title="Close calendar"
                    aria-label="Close calendar"
                  >
                    <IconX />
                  </button>
                </div>
              </div>

              {/* Legend Banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 10px",
                  background: "#fefce8",
                  border: "1px solid #fef08a",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#854d0e",
                  fontWeight: 500,
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#eab308",
                    flexShrink: 0,
                  }}
                />
                <span>
                  <strong>Gold highlighted dates</strong> have past archives available.
                </span>
              </div>

              {/* Weekday headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                  marginBottom: "6px",
                  textAlign: "center",
                }}
              >
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                  <span
                    key={dayName}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#94a3b8",
                      padding: "2px 0",
                    }}
                  >
                    {dayName}
                  </span>
                ))}
              </div>

              {/* Day cells grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                }}
              >
                {calendarGrid.blanks.map((blankIndex) => (
                  <div key={`blank-${blankIndex}`} style={{ height: "34px" }} />
                ))}

                {calendarGrid.days.map((dayNum) => {
                  const cellDate = new Date(calendarGrid.year, calendarGrid.month, dayNum);
                  const cellKey = toDateKey(cellDate);
                  const scanInfo = availableScanMap.get(cellKey);
                  const isAvailable = Boolean(scanInfo);
                  const isSelected = cellKey === toDateKey(date);
                  const isCurrentDay = isToday(cellDate);

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => changeDate(cellDate)}
                      title={
                        isAvailable
                          ? `${formatDate(cellDate)}: ${scanInfo?.count} updates in archive (Click to view)`
                          : formatDate(cellDate)
                      }
                      style={{
                        height: "34px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        borderRadius: "7px",
                        border: isSelected
                          ? "1.5px solid #0f172a"
                          : isAvailable
                          ? "1.5px solid #eab308"
                          : isCurrentDay
                          ? "1px dashed #94a3b8"
                          : "1px solid transparent",
                        background: isSelected
                          ? "#0f172a"
                          : isAvailable
                          ? "#fef9c3"
                          : "transparent",
                        color: isSelected
                          ? "#ffffff"
                          : isAvailable
                          ? "#854d0e"
                          : "#334155",
                        fontWeight: isSelected || isAvailable ? 700 : 500,
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                        boxShadow: isSelected
                          ? "0 2px 4px rgba(15,23,42,0.2)"
                          : isAvailable
                          ? "0 1px 2px rgba(234, 179, 8, 0.15)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = isAvailable ? "#fef08a" : "#f1f5f9";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = isAvailable ? "#fef9c3" : "transparent";
                        }
                      }}
                    >
                      <span style={{ lineHeight: "1" }}>{dayNum}</span>
                      {isAvailable && (
                        <span
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: isSelected ? "#facc15" : "#ca8a04",
                            marginTop: "2px",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Jump to latest edition */}
              {availableScanDates.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "10px",
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const latest = availableScanDates[0];
                      setCalendarMonth(new Date(latest.date.getFullYear(), latest.date.getMonth(), 1));
                      changeDate(latest.date);
                    }}
                    style={{
                      width: "100%",
                      padding: "7px 12px",
                      borderRadius: "7px",
                      border: "1px solid #fef08a",
                      background: "#fefce8",
                      color: "#854d0e",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "background 0.15s ease",
                    }}
                    title={`Jump to latest edition (${formatDate(availableScanDates[0].date)})`}
                  >
                    <span>Jump to latest edition</span>
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>({formatDate(availableScanDates[0].date)})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {activeTab !== "news" && (
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
        )}
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
            <span className="mp-stat-number">{dealsLoading ? "—" : filteredDeals.length}</span>
            <span className="mp-stat-label">Bulk / block records</span>
          </button>
          <button type="button" className="mp-stat" onClick={() => changeTab("fundraises")}>
            <span className="mp-stat-icon">
              <IconFundraise />
            </span>
            <span className="mp-stat-number">{fundraisesLoading ? "—" : filteredFundraises.length}</span>
            <span className="mp-stat-label">Fundraise announcements</span>
          </button>
        </div>
      )}

      {showNews && (
        <section className="mp-card" aria-label="News & Announcements">
          <SectionHead
            icon={<IconNews />}
            title="News & Announcements"
            meta={`Published: ${publishedLabel} · ${newsLoading ? "Loading updates" : `${filteredNews.length} updates`}`}
            total={newsLoading ? "—" : filteredNews.length}
            showViewAll={activeTab === "brief" && filteredNews.length > 0}
            onViewAll={() => changeTab("news")}
          />
          {visibleNews.length > 0 ? (
            <div className="mp-table-wrap">
              <table className={`mp-table mp-news-table${activeTab === "news" ? " is-news-tab" : ""}`}>
                <thead>
                  <tr>
                    <th className="mp-col-star"><span className="mp-sr-only">Watchlist</span></th>
                    <th className="mp-col-time">Date</th>
                    <th className="mp-col-company">Company</th>
                    <th className="mp-col-headline">Headline</th>
                    <th className="mp-col-category">Category</th>
                    <th className="mp-col-sentiment">Sentiment</th>
                    <th className="mp-col-source">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleNews.map((row) => {
                    const tone = sentimentTone(row.sentiment);
                    const newsItemDate = formatScanDate(row.newsDate);
                    const isRowHighlighted = activeHighlight === row.$id;
                    return (
                      <tr
                        key={row.$id}
                        id={`news-row-${row.$id}`}
                        className={`mp-news-row${isRowHighlighted ? " is-highlighted" : ""}`}
                      >
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
                        <td className="mp-col-time mp-time">
                          <strong className="mp-scan-date">{formatScanDate(row.newsDate)}</strong>
                          <span className="mp-news-scan">Scan Date</span>
                        </td>
                        <td className="mp-col-company">
                          <strong>{row.company}</strong>
                          <span className="mp-company-ticker">{row.ticker}</span>
                        </td>
                        <td className="mp-col-headline">
                          {newsItemDate && (
                            <div className="mp-news-mobile-date">
                              {newsItemDate}
                            </div>
                          )}
                          <strong className="mp-headline">{row.headline}</strong>
                          <span className="mp-headline-sub">{row.summary}</span>
                        </td>
                        <td className="mp-col-category"><span className={`mp-badge is-${tone}`}>{row.category}</span></td>
                        <td className="mp-col-sentiment"><span className={`mp-sentiment is-${tone}`}>{row.sentiment}</span></td>
                        <td className="mp-col-source"><SourceLink label={row.sourceName} href={row.sourceUrl} /></td>
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
                    {isToday(date)
                      ? "No news reported yet today"
                      : `No news reported for ${shortDate}`}
                  </p>
                  <p className="mp-empty-desc">
                    {isToday(date)
                      ? "There are no corporate filings or market news announcements reported yet today."
                      : `There are no corporate filings or market news announcements reported for ${shortDate}. Use the calendar to select an edition date.`}
                  </p>

                  {newsForDate.length === 0 && (
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                          setCalendarOpen(true);
                        }}
                        className="mp-control"
                        style={{
                          fontSize: "12.5px",
                          padding: "6px 16px",
                          borderRadius: "8px",
                          background: "#fefce8",
                          borderColor: "#fef08a",
                          color: "#854d0e",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <IconCalendar />
                        Open Calendar
                      </button>
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
            total={dealsLoading ? "—" : filteredDeals.length}
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
              <p className="mp-empty">
                {dealsLoading ? "Loading bulk and block deals…" : `No bulk or block deals reported for ${shortDate}.`}
              </p>
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
            total={fundraisesLoading ? "—" : filteredFundraises.length}
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
              <p className="mp-empty">
                {fundraisesLoading ? "Loading fundraise announcements…" : `No fundraise announcements reported for ${shortDate}.`}
              </p>
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
