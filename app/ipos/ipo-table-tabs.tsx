"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminStore } from "../_lib/admin-store";

export type ApiIpo = {
  symbol: string;
  name: string;
  company?: string;
  price?: string;
  period?: string;
  issueSize?: string;
  lotSize?: string;
  status: string; // 'active' (Open), 'pre_apply' (Upcoming), 'listed' (Listed), 'closed' (Closed)
  is_sme?: boolean;
  isSme?: boolean;
  type?: string;
  additional_text?: string;
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
  sector?: string;
  latest_price?: number;
  since_issue?: string;
  action_label?: string;
  action_slug?: string;
  has_aethos_notes?: boolean;
  pdfUrl?: string;
  htmlUrl?: string;
  deepDive?: boolean;
  hasReport?: boolean;
  slug?: string;
};

// Rich default dataset covering Open, Upcoming, Listed, and Archive IPOs
const defaultAllIpos: ApiIpo[] = [
  {
    symbol: "KANOHAR",
    name: "Kanohar Electricals",
    sector: "Electrical equipment",
    status: "listed",
    is_sme: false,
    listing_date: "08 Sep 2026",
    issue_price: 200,
    latest_price: 218,
    since_issue: "+9.0%",
    action_label: "Deep dive →",
    action_slug: "kanohar-electricals",
    min_price: 200,
    max_price: 200,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 218,
    listing_gains: 9.0,
    allotment_date: null,
    lot_size: 100,
    total_subscription_rate: 15.4,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "GLASSWALL",
    name: "Glass Wall Systems",
    sector: "Building products",
    status: "listed",
    is_sme: false,
    listing_date: "11 Sep 2026",
    issue_price: 180,
    latest_price: 171,
    since_issue: "-5.0%",
    action_label: "Updated →",
    action_slug: "glass-wall-systems",
    min_price: 180,
    max_price: 180,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 171,
    listing_gains: -5.0,
    allotment_date: null,
    lot_size: 75,
    total_subscription_rate: 8.2,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "SPECTRAA",
    name: "SpectraA Technology",
    sector: "Engineering",
    status: "listed",
    is_sme: false,
    listing_date: "15 Sep 2026",
    issue_price: 100,
    latest_price: 112,
    since_issue: "+12.0%",
    action_label: "Deep dive →",
    action_slug: "spectraa-technology-solutions",
    min_price: 100,
    max_price: 100,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 112,
    listing_gains: 12.0,
    allotment_date: null,
    lot_size: 150,
    total_subscription_rate: 24.1,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "VARMORA",
    name: "Varmora Granito",
    sector: "Tiles & surfaces",
    status: "listed",
    is_sme: false,
    listing_date: "18 Sep 2026",
    issue_price: 250,
    latest_price: 240,
    since_issue: "-4.0%",
    action_label: "Review due →",
    action_slug: "varmora-granito",
    min_price: 250,
    max_price: 250,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 240,
    listing_gains: -4.0,
    allotment_date: null,
    lot_size: 60,
    total_subscription_rate: 11.5,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "NEXGEN",
    name: "NexGen Renewable Energy",
    sector: "Electrical equipment",
    status: "active",
    is_sme: false,
    listing_date: "Closes 04 Oct 2026",
    issue_price: 450,
    latest_price: 450,
    since_issue: "Bidding Open",
    action_label: "Apply Now →",
    action_slug: "spectraa-technology-solutions",
    min_price: 425,
    max_price: 450,
    bidding_start_date: "28 Sep 2026",
    bidding_end_date: "04 Oct 2026",
    listing_price: null,
    listing_gains: null,
    allotment_date: "06 Oct 2026",
    lot_size: 33,
    total_subscription_rate: 3.8,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "APEXCHEM",
    name: "Apex Life Sciences",
    sector: "Building products",
    status: "active",
    is_sme: true,
    listing_date: "Closes 02 Oct 2026",
    issue_price: 120,
    latest_price: 120,
    since_issue: "Bidding Open",
    action_label: "Apply Now →",
    action_slug: "spectraa-technology-solutions",
    min_price: 115,
    max_price: 120,
    bidding_start_date: "29 Sep 2026",
    bidding_end_date: "02 Oct 2026",
    listing_price: null,
    listing_gains: null,
    allotment_date: "05 Oct 2026",
    lot_size: 1200,
    total_subscription_rate: 14.2,
    document_url: null,
    has_aethos_notes: false
  },
  {
    symbol: "ORIONROBOT",
    name: "Orion Robotics & Automation",
    sector: "Engineering",
    status: "pre_apply",
    is_sme: false,
    listing_date: "Starts 10 Oct 2026",
    issue_price: 680,
    latest_price: 680,
    since_issue: "Pre-apply",
    action_label: "Pre-apply →",
    action_slug: "spectraa-technology-solutions",
    min_price: 650,
    max_price: 680,
    bidding_start_date: "10 Oct 2026",
    bidding_end_date: "14 Oct 2026",
    listing_price: null,
    listing_gains: null,
    allotment_date: "16 Oct 2026",
    lot_size: 22,
    total_subscription_rate: null,
    document_url: null,
    has_aethos_notes: true
  },
  {
    symbol: "CERAFLOOR",
    name: "Cerafloor Decor Ltd",
    sector: "Tiles & surfaces",
    status: "pre_apply",
    is_sme: true,
    listing_date: "Starts 12 Oct 2026",
    issue_price: 95,
    latest_price: 95,
    since_issue: "Pre-apply",
    action_label: "Pre-apply →",
    action_slug: "spectraa-technology-solutions",
    min_price: 90,
    max_price: 95,
    bidding_start_date: "12 Oct 2026",
    bidding_end_date: "15 Oct 2026",
    listing_price: null,
    listing_gains: null,
    allotment_date: "18 Oct 2026",
    lot_size: 1500,
    total_subscription_rate: null,
    document_url: null,
    has_aethos_notes: false
  },
  {
    symbol: "ADROIT",
    name: "Adroit Industries",
    sector: "Engineering",
    status: "listed",
    is_sme: true,
    listing_date: "22 Aug 2026",
    issue_price: 140,
    latest_price: 165,
    since_issue: "+17.8%",
    action_label: "Deep dive →",
    action_slug: "spectraa-technology-solutions",
    min_price: 140,
    max_price: 140,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 165,
    listing_gains: 17.8,
    allotment_date: null,
    lot_size: 1000,
    total_subscription_rate: 42.0,
    document_url: null,
    has_aethos_notes: false
  },
  {
    symbol: "GULLLLOYD",
    name: "Gulf Lloyds Tech",
    sector: "Electrical equipment",
    status: "listed",
    is_sme: false,
    listing_date: "05 Aug 2026",
    issue_price: 320,
    latest_price: 355,
    since_issue: "+10.9%",
    action_label: "Updated →",
    action_slug: "spectraa-technology-solutions",
    min_price: 320,
    max_price: 320,
    bidding_start_date: null,
    bidding_end_date: null,
    listing_price: 355,
    listing_gains: 10.9,
    allotment_date: null,
    lot_size: 45,
    total_subscription_rate: 18.5,
    document_url: null,
    has_aethos_notes: true
  }
];

// Status Badge Render Helper
function renderStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <span
          style={{
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            borderRadius: "4px",
            backgroundColor: "#ecfdf5",
            color: "#047857",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10b981" }} />
          OPEN
        </span>
      );
    case "pre_apply":
      return (
        <span
          style={{
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            borderRadius: "4px",
            backgroundColor: "#fffbeb",
            color: "#b45309",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
        >
          UPCOMING
        </span>
      );
    case "listed":
      return (
        <span
          style={{
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            borderRadius: "4px",
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
        >
          LISTED
        </span>
      );
    case "closed":
    default:
      return (
        <span
          style={{
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            borderRadius: "4px",
            backgroundColor: "#f4f4f5",
            color: "#71717a",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
        >
          CLOSED
        </span>
      );
  }
}

export default function IpoTableTabs({ ipos, deepDives = [] }: { ipos: ApiIpo[]; deepDives?: any[] }) {
  const { ipos: storeIpos } = useAdminStore();
  const [activeTab, setActiveTab] = useState<"upcoming" | "open" | "recently_listed" | "archive" | "deep_dives">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("last_90");
  const [withNotesOnly, setWithNotesOnly] = useState(false);
  const [starredSymbols, setStarredSymbols] = useState<Record<string, boolean>>({});

  // Merge server API results, admin store state, ipo_deep_dives collection, and fallback datasets
  const dataset = useMemo(() => {
    const combined = [...ipos];
    const seen = new Set(combined.map((i) => (i.slug || i.symbol || "").toLowerCase()));

    // Merge standalone deep dives from ipo_deep_dives collection
    if (deepDives && deepDives.length > 0) {
      for (const dd of deepDives) {
        const key = (dd.slug || dd.company?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "").toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          combined.push({
            symbol: (dd.slug || key).toUpperCase(),
            name: dd.company || dd.name || dd.slug,
            sector: dd.sector || "General",
            status: "closed",
            is_sme: false,
            type: "Mainboard",
            period: "Archived Deep Dive",
            price: "—",
            issueSize: "—",
            lotSize: "—",
            listing_date: "Archived",
            min_price: null,
            max_price: null,
            issue_price: null,
            bidding_start_date: null,
            bidding_end_date: null,
            listing_price: null,
            listing_gains: null,
            allotment_date: null,
            lot_size: null,
            total_subscription_rate: null,
            document_url: dd.pdfUrl || null,
            has_aethos_notes: true,
            hasReport: true,
            deepDive: true,
            slug: dd.slug,
            pdfUrl: dd.pdfUrl,
            htmlUrl: dd.htmlUrl,
          });
        } else if (key) {
          // Enrich existing match with deep dive URLs from ipo_deep_dives collection
          const existing = combined.find(i => (i.slug || i.symbol || "").toLowerCase() === key);
          if (existing) {
            existing.pdfUrl = existing.pdfUrl || dd.pdfUrl;
            existing.htmlUrl = existing.htmlUrl || dd.htmlUrl;
            existing.has_aethos_notes = true;
            existing.hasReport = true;
            existing.deepDive = true;
          }
        }
      }
    }

    if (storeIpos && storeIpos.length > 0) {
      for (const adminIpo of storeIpos) {
        const key = (adminIpo.slug || adminIpo.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          combined.push({
            symbol: adminIpo.slug?.toUpperCase() || key.toUpperCase(),
            name: adminIpo.company,
            sector: adminIpo.sector || "General",
            status: adminIpo.status || "active",
            is_sme: Boolean(adminIpo.isSme ?? (adminIpo.type === "SME")),
            type: adminIpo.type,
            period: adminIpo.period,
            price: adminIpo.price,
            issueSize: adminIpo.issueSize,
            lotSize: adminIpo.lotSize,
            listing_date: adminIpo.listing || "TBA",
            min_price: null,
            max_price: null,
            issue_price: null,
            bidding_start_date: null,
            bidding_end_date: null,
            listing_price: null,
            listing_gains: null,
            allotment_date: null,
            lot_size: adminIpo.lotSize ? parseInt(adminIpo.lotSize) || null : null,
            total_subscription_rate: null,
            document_url: adminIpo.pdfUrl || null,
            has_aethos_notes: Boolean(adminIpo.hasReport || adminIpo.deepDive || adminIpo.pdfUrl),
            slug: adminIpo.slug,
            pdfUrl: adminIpo.pdfUrl,
          });
        }
      }
    }

    return combined.length > 0 ? combined : defaultAllIpos;
  }, [ipos, storeIpos, deepDives]);

  // Dynamic sectors extracted from current dataset
  const availableSectors = useMemo(() => {
    const secs = new Set<string>();
    dataset.forEach((i) => {
      if (i.sector && i.sector.trim()) {
        secs.add(i.sector.trim());
      }
    });
    return Array.from(secs).sort();
  }, [dataset]);

  // Helper to normalize status comparison
  const normalizeStatus = (s: string | undefined) => (s || "").toLowerCase().trim();

  // Deep Dives list strictly from ipo_deep_dives collection & active PDF reports
  const deepDivesDataset = useMemo(() => {
    const list: ApiIpo[] = [];
    const seen = new Set<string>();

    if (deepDives && deepDives.length > 0) {
      for (const dd of deepDives) {
        const key = (dd.slug || dd.company?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "").toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          const matchedIpo = ipos.find(i => (i.slug || i.symbol || "").toLowerCase() === key);
          list.push({
            symbol: (dd.slug || key).toUpperCase(),
            name: dd.company || dd.name || matchedIpo?.name || dd.slug,
            sector: dd.sector || matchedIpo?.sector || "General",
            status: matchedIpo?.status || "closed",
            is_sme: Boolean(matchedIpo?.is_sme ?? matchedIpo?.isSme),
            type: matchedIpo?.type || "Mainboard",
            period: matchedIpo?.period || "Archived Deep Dive",
            price: matchedIpo?.price || "—",
            issueSize: matchedIpo?.issueSize || "—",
            lotSize: matchedIpo?.lotSize || "—",
            listing_date: matchedIpo?.listing_date || "Archived",
            min_price: matchedIpo?.min_price ?? null,
            max_price: matchedIpo?.max_price ?? null,
            issue_price: matchedIpo?.issue_price ?? null,
            bidding_start_date: matchedIpo?.bidding_start_date ?? null,
            bidding_end_date: matchedIpo?.bidding_end_date ?? null,
            listing_price: matchedIpo?.listing_price ?? null,
            listing_gains: matchedIpo?.listing_gains ?? null,
            allotment_date: matchedIpo?.allotment_date ?? null,
            lot_size: matchedIpo?.lot_size ?? null,
            total_subscription_rate: matchedIpo?.total_subscription_rate ?? null,
            document_url: matchedIpo?.document_url || null,
            has_aethos_notes: true,
            hasReport: true,
            deepDive: true,
            slug: dd.slug,
            pdfUrl: dd.pdfUrl || matchedIpo?.pdfUrl || "",
          });
        }
      }
    }

    // Include any IPOs in the main dataset that have a pdfUrl attached
    for (const item of dataset) {
      const key = (item.slug || item.symbol || "").toLowerCase();
      if (key && !seen.has(key) && Boolean(item.pdfUrl)) {
        seen.add(key);
        list.push(item);
      }
    }

    return list;
  }, [deepDives, ipos, dataset]);

  // Tab counts
  const deepDivesCount = useMemo(() => deepDivesDataset.length, [deepDivesDataset]);
  const upcomingCount = useMemo(() => dataset.filter(i => normalizeStatus(i.status) === "pre_apply").length, [dataset]);
  const openCount = useMemo(() => dataset.filter(i => normalizeStatus(i.status) === "active").length, [dataset]);
  const recentlyListedCount = useMemo(() => dataset.filter(i => normalizeStatus(i.status) === "listed").length, [dataset]);
  const archiveCount = useMemo(() => dataset.filter(i => normalizeStatus(i.status) === "closed").length || 24, [dataset]);

  // Master dataset filter by selected tab
  const baseTabDataset = useMemo(() => {
    if (activeTab === "deep_dives") return deepDivesDataset;
    if (activeTab === "recently_listed") return dataset.filter(i => normalizeStatus(i.status) === "listed");
    if (activeTab === "upcoming") return dataset.filter(i => normalizeStatus(i.status) === "pre_apply");
    if (activeTab === "open") return dataset.filter(i => normalizeStatus(i.status) === "active");
    return dataset.filter(i => normalizeStatus(i.status) === "closed" || normalizeStatus(i.status) === "listed");
  }, [activeTab, dataset, deepDivesDataset]);

  // Filtered dataset reactive to search query, segment, sector, and notes toggle
  const filteredList = useMemo(() => {
    return baseTabDataset.filter((item) => {
      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = (item.name || item.company || "").toLowerCase().includes(q);
        const matchesSymbol = (item.symbol || "").toLowerCase().includes(q);
        const matchesSector = (item.sector || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSymbol && !matchesSector) return false;
      }

      // Segment filter (Mainboard vs SME)
      const isSmeRecord = Boolean(
        item.is_sme ||
        item.isSme ||
        (item.type && item.type.toUpperCase() === "SME") ||
        (item.sector && item.sector.toLowerCase().includes("sme"))
      );

      if (segmentFilter === "mainboard" && isSmeRecord) return false;
      if (segmentFilter === "sme" && !isSmeRecord) return false;

      // Dynamic Sector filter
      if (sectorFilter !== "all") {
        const itemSec = (item.sector || "").toLowerCase().trim();
        if (itemSec !== sectorFilter.toLowerCase().trim()) return false;
      }

      // Notes filter
      if (withNotesOnly && !item.has_aethos_notes) return false;

      return true;
    });
  }, [baseTabDataset, searchQuery, segmentFilter, sectorFilter, withNotesOnly]);

  const toggleStar = (symbol: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredSymbols(prev => ({ ...prev, [symbol]: !prev[symbol] }));
  };

  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)", color: "#1c1917" }}>
      {/* Top Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1 className="ipo-header-title" style={{ fontFamily: 'var(--font-playfair), Georgia, "Times New Roman", serif', fontSize: "42px", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 6px 0", color: "#0f172a" }}>
            IPO Tracker
          </h1>
          <p className="ipo-header-subtitle" style={{ fontSize: "15px", color: "#475569", margin: 0, fontWeight: "400" }}>
            The listing is a milestone. The business is the story.
          </p>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="ipo-tabs-grid">
        <button
          type="button"
          onClick={() => setActiveTab("open")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: activeTab === "open" ? "#ffffff" : "#fcfcfc",
            color: activeTab === "open" ? "#b45309" : "#71717a",
            borderBottom: activeTab === "open" ? "2.5px solid #b45309" : "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Open now
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", backgroundColor: activeTab === "open" ? "#fef3c7" : "#f4f4f5", color: activeTab === "open" ? "#92400e" : "#52525b" }}>
            {openCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: activeTab === "upcoming" ? "#ffffff" : "#fcfcfc",
            color: activeTab === "upcoming" ? "#b45309" : "#71717a",
            borderBottom: activeTab === "upcoming" ? "2.5px solid #b45309" : "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Upcoming
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", backgroundColor: activeTab === "upcoming" ? "#fef3c7" : "#f4f4f5", color: activeTab === "upcoming" ? "#92400e" : "#52525b" }}>
            {upcomingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recently_listed")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: activeTab === "recently_listed" ? "#ffffff" : "#fcfcfc",
            color: activeTab === "recently_listed" ? "#b45309" : "#71717a",
            borderBottom: activeTab === "recently_listed" ? "2.5px solid #b45309" : "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Recently listed
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", backgroundColor: activeTab === "recently_listed" ? "#fef3c7" : "#f4f4f5", color: activeTab === "recently_listed" ? "#92400e" : "#52525b" }}>
            {recentlyListedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("archive")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: activeTab === "archive" ? "#ffffff" : "#fcfcfc",
            color: activeTab === "archive" ? "#b45309" : "#71717a",
            borderBottom: activeTab === "archive" ? "2.5px solid #b45309" : "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Archive
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", backgroundColor: activeTab === "archive" ? "#fef3c7" : "#f4f4f5", color: activeTab === "archive" ? "#92400e" : "#52525b" }}>
            {archiveCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("deep_dives")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: activeTab === "deep_dives" ? "#ffffff" : "#fcfcfc",
            color: activeTab === "deep_dives" ? "#2563eb" : "#71717a",
            borderBottom: activeTab === "deep_dives" ? "2.5px solid #2563eb" : "1px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Deep Dives
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", backgroundColor: activeTab === "deep_dives" ? "#eff6ff" : "#f4f4f5", color: activeTab === "deep_dives" ? "#1d4ed8" : "#52525b" }}>
            {deepDivesCount}
          </span>
        </button>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="ipo-toolbar">
        <div className="ipo-toolbar-left">
          {/* Search Box */}
          <div className="ipo-search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="1.8" style={{ position: "absolute", left: "12px", top: "10px" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search IPOs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#fcfcfc",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          {/* Segment Dropdown */}
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: "500",
              color: "#3f3f46",
              cursor: "pointer"
            }}
          >
            <option value="all">Mainboard + SME</option>
            <option value="mainboard">Mainboard Only</option>
            <option value="sme">SME Only</option>
          </select>

          {/* Sector Dropdown */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: "500",
              color: "#3f3f46",
              cursor: "pointer"
            }}
          >
            <option value="all">Sector: All</option>
            {availableSectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {/* Date Listed Dropdown */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: "500",
              color: "#3f3f46",
              cursor: "pointer"
            }}
          >
            <option value="last_90">Listed in: Last 90 days</option>
            <option value="last_30">Listed in: Last 30 days</option>
            <option value="last_365">Listed in: Last 1 year</option>
          </select>
        </div>

        {/* Toggle Switch: With Aethos notes */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#3f3f46" }}>
            <div
              onClick={() => setWithNotesOnly(!withNotesOnly)}
              style={{
                width: "40px",
                height: "22px",
                borderRadius: "12px",
                backgroundColor: withNotesOnly ? "#d97706" : "#e4e4e7",
                position: "relative",
                transition: "background-color 0.2s ease"
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  position: "absolute",
                  top: "2px",
                  left: withNotesOnly ? "20px" : "2px",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                }}
              />
            </div>
            With Aethos notes
          </label>
        </div>
      </div>

      {/* Full-Width Layout (Without Sidepanel) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "20px" }}>
        
        {/* Post-listing Watch Table Container */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "20px 24px 16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", fontFamily: "Georgia, serif", margin: 0, color: "#0f172a" }}>
              {activeTab === "recently_listed" ? "Post-listing watch" : activeTab === "upcoming" ? "Upcoming IPOs" : activeTab === "open" ? "Active Bidding Offers" : "IPO Archive"}
            </h2>
            <span style={{ fontSize: "12px", color: "#71717a" }}>
              Showing {filteredList.length} of {baseTabDataset.length} results
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="ipo-table-desktop" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e4e4e7", backgroundColor: "#fafafa" }}>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  COMPANY ↑
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  STATUS
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  PERIOD ↑
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  PRICE BAND (₹) ▾
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  LOT SIZE ▾
                </th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a" }}>
                  RESEARCH
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, idx) => {
                const isGain = (item.since_issue || "").startsWith("+");
                const rowKey = item.symbol || item.action_slug || item.name || `ipo-${idx}`;
                const isStarred = !!starredSymbols[rowKey];
                return (
                  <tr
                    key={`${rowKey}-${idx}`}
                    style={{
                      borderBottom: "1px solid #f4f4f5",
                      backgroundColor: "#ffffff",
                      transition: "background-color 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                            {item.name || item.company || item.symbol}
                          </div>
                          <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>
                            {item.sector || (item.is_sme ? "SME Segment" : "Mainboard Segment")}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleStar(rowKey, e)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: isStarred ? "#d97706" : "#d4d4d8", padding: "2px", marginLeft: "4px" }}
                          title={isStarred ? "Starred" : "Star IPO"}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: "16px 16px" }}>
                      {renderStatusBadge(item.status)}
                    </td>

                    <td style={{ padding: "16px 16px", fontSize: "13px", color: "#3f3f46" }}>
                      {item.period ? item.period : (item.bidding_start_date && item.bidding_end_date ? `${item.bidding_start_date} - ${item.bidding_end_date}` : item.listing_date || "TBA")}
                    </td>

                    <td style={{ padding: "16px 16px", fontSize: "13px", color: "#3f3f46", textAlign: "right" }}>
                      {item.min_price && item.max_price && item.min_price !== item.max_price
                        ? `₹${item.min_price} - ₹${item.max_price}`
                        : item.price
                        ? item.price
                        : item.issue_price
                        ? `₹${item.issue_price}`
                        : item.min_price
                        ? `₹${item.min_price}`
                        : "TBA"}
                    </td>

                    <td style={{ padding: "16px 16px", fontSize: "13px", color: "#3f3f46", textAlign: "right" }}>
                      {item.lot_size ? `${item.lot_size} shares` : item.lotSize ? item.lotSize : item.latest_price ? `₹${item.latest_price}` : "—"}
                    </td>

                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      {(() => {
                        const itemName = (item.name || item.company || "").toLowerCase();
                        const targetSlug = (item.slug || item.action_slug || item.symbol || "").toLowerCase();
                        const storeMatch = storeIpos.find(
                          (i) =>
                            (i.slug && i.slug.toLowerCase() === targetSlug) ||
                            (itemName && i.company && i.company.toLowerCase().includes(itemName)) ||
                            (itemName && i.company && itemName.includes(i.company.toLowerCase()))
                        );

                        const hasReport = Boolean(
                          (storeMatch && (Boolean(storeMatch.pdfUrl?.trim()) || Boolean(storeMatch.htmlContent?.trim()) || (storeMatch.htmlUrl?.trim() && !storeMatch.htmlUrl.startsWith("/")))) ||
                          Boolean(item.pdfUrl?.trim()) ||
                          Boolean(item.hasReport)
                        );
                        const label = hasReport ? "Deep dive →" : "No Deep Dive";

                        if (!hasReport) {
                          return (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "1px solid #e4e4e7",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#a1a1aa",
                                backgroundColor: "#f4f4f5",
                                cursor: "not-allowed",
                                opacity: 0.85
                              }}
                              title="Deep dive research report is not available for this IPO yet"
                            >
                              {label.endsWith("→") ? label : "No Deep Dive"}
                            </span>
                          );
                        }

                        return (
                          <Link
                            href={`/ipos/${storeMatch?.slug || item.action_slug || "spectraa-technology-solutions"}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "1px solid #d97706",
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#b45309",
                              textDecoration: "none",
                              backgroundColor: "#ffffff"
                            }}
                          >
                            {label}
                          </Link>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 24px", color: "#71717a", fontSize: "14px" }}>
                    No IPO records matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* Mobile Responsive Card List View */}
          <div className="ipo-card-grid">
            {filteredList.map((item, idx) => {
              const rowKey = item.symbol || item.action_slug || item.name || `ipo-card-${idx}`;
              const isStarred = !!starredSymbols[rowKey];
              const itemName = (item.name || item.company || "").toLowerCase();
              const targetSlug = (item.slug || item.action_slug || item.symbol || "").toLowerCase();
              const storeMatch = storeIpos.find(
                (i) =>
                  (i.slug && i.slug.toLowerCase() === targetSlug) ||
                  (itemName && i.company && i.company.toLowerCase().includes(itemName)) ||
                  (itemName && i.company && itemName.includes(i.company.toLowerCase()))
              );
              const hasReport = Boolean(
                (storeMatch && (Boolean(storeMatch.pdfUrl?.trim()) || Boolean(storeMatch.htmlContent?.trim()) || (storeMatch.htmlUrl?.trim() && !storeMatch.htmlUrl.startsWith("/")))) ||
                Boolean(item.pdfUrl?.trim()) ||
                Boolean(item.hasReport)
              );

              return (
                <div
                  key={`${rowKey}-${idx}`}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e4e4e7",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                        {item.name || item.company || item.symbol}
                      </div>
                      <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>
                        {item.sector || (item.is_sme ? "SME Segment" : "Mainboard Segment")}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {renderStatusBadge(item.status)}
                      <button
                        type="button"
                        onClick={(e) => toggleStar(rowKey, e)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: isStarred ? "#d97706" : "#d4d4d8", padding: "2px" }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: "12px", color: "#52525b", backgroundColor: "#fafafa", padding: "10px 12px", borderRadius: "8px" }}>
                    <div>
                      <span style={{ color: "#a1a1aa", fontSize: "10px", textTransform: "uppercase", display: "block" }}>Period</span>
                      <strong style={{ color: "#3f3f46", fontWeight: "600" }}>
                        {item.period ? item.period : (item.bidding_start_date && item.bidding_end_date ? `${item.bidding_start_date} - ${item.bidding_end_date}` : item.listing_date || "TBA")}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "#a1a1aa", fontSize: "10px", textTransform: "uppercase", display: "block" }}>Price Band</span>
                      <strong style={{ color: "#3f3f46", fontWeight: "600" }}>
                        {item.min_price && item.max_price && item.min_price !== item.max_price
                          ? `₹${item.min_price} - ₹${item.max_price}`
                          : item.price || (item.issue_price ? `₹${item.issue_price}` : "TBA")}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "#a1a1aa", fontSize: "10px", textTransform: "uppercase", display: "block" }}>Lot Size</span>
                      <strong style={{ color: "#3f3f46", fontWeight: "600" }}>
                        {item.lot_size ? `${item.lot_size} shares` : item.lotSize ? item.lotSize : "—"}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "#a1a1aa", fontSize: "10px", textTransform: "uppercase", display: "block" }}>Segment</span>
                      <strong style={{ color: "#3f3f46", fontWeight: "600" }}>
                        {item.is_sme || item.type === "SME" ? "SME" : "Mainboard"}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                    {hasReport ? (
                      <Link
                        href={`/ipos/${storeMatch?.slug || item.action_slug || "spectraa-technology-solutions"}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "1px solid #d97706",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#b45309",
                          textDecoration: "none",
                          backgroundColor: "#ffffff",
                          width: "100%",
                          textAlign: "center"
                        }}
                      >
                        Deep dive →
                      </Link>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "1px solid #e4e4e7",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#a1a1aa",
                          backgroundColor: "#f4f4f5",
                          width: "100%",
                          textAlign: "center",
                          cursor: "not-allowed"
                        }}
                      >
                        No Deep Dive
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "#71717a", fontSize: "13px" }}>
                No IPO records matched your search filters.
              </div>
            )}
          </div>

          {/* Table Footer Stats & Pagination */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              borderTop: "1px solid #e4e4e7",
              backgroundColor: "#ffffff",
              fontSize: "12px",
              color: "#71717a"
            }}
          >
            <span>Price return from issue price; corporate-action adjusted, dividends excluded. Illustrative prices as of 23 Sep 2026 close.</span>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Showing {filteredList.length} of {baseTabDataset.length}</span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button type="button" style={{ border: "1px solid #e4e4e7", borderRadius: "4px", width: "28px", height: "28px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ‹
                </button>
                <button type="button" style={{ border: "1px solid #e4e4e7", borderRadius: "4px", width: "28px", height: "28px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer copyright preview note */}
      <div style={{ marginTop: "24px", textAlign: "right", fontSize: "11px", color: "#a1a1aa" }}>
        Design preview · Illustrative data. Not investment advice or recommendations.
      </div>
    </div>
  );
}

