"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { reports as defaultReports, Report } from "../_lib/content";
import { useAdminStore } from "../_lib/admin-store";

type TabFilter = "all" | "saved" | "unread";
type SortOption = "newest" | "oldest";
type ViewMode = "grid" | "list";

export default function ResearchPage() {
  const { reports: storeReports } = useAdminStore();
  const allReports = storeReports ?? [];

  // State management
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [publishedFilter, setPublishedFilter] = useState("any");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("aethos_user_saved_reports");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [readSlugs, setReadSlugs] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("aethos_user_read_reports");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle bookmark / saved in user's browser storage
  const toggleSave = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedSlugs((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem("aethos_user_saved_reports", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Mark report as read in user's browser storage
  const markAsRead = (slug: string) => {
    setReadSlugs((prev) => {
      if (prev[slug]) return prev;
      const next = { ...prev, [slug]: true };
      try {
        localStorage.setItem("aethos_user_read_reports", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Reset filters
  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedSectors([]);
    setCompanySearch("");
    setSearchQuery("");
    setPublishedFilter("any");
    setActiveTab("all");
    setCurrentPage(1);
  };

  const removeType = (type: string) => {
    setSelectedTypes((prev) => prev.filter((t) => t !== type));
    setCurrentPage(1);
  };

  const removeSector = (sector: string) => {
    setSelectedSectors((prev) => prev.filter((s) => s !== sector));
    setCurrentPage(1);
  };

  const clearCompanySearch = () => {
    setCompanySearch("");
    setCurrentPage(1);
  };

  const clearPublishedFilter = () => {
    setPublishedFilter("any");
    setCurrentPage(1);
  };

  const activeFilterCount =
    selectedTypes.length +
    selectedSectors.length +
    (companySearch.trim() ? 1 : 0) +
    (publishedFilter !== "any" ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0;

  const researchTypes = [
    "Stock deep dives",
    "Sector studies",
    "Thematic research",
    "IPO notes",
    "Results analysis",
    "Company updates",
  ];

  const sectorOptions = [
    "Electrical equipment",
    "Pharmaceuticals",
    "Industrials",
    "Consumer",
    "Auto components",
    "Building materials",
    "Chemicals",
  ];

  // Filtering
  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const isSaved = Boolean(savedSlugs[report.slug]);
      const isUnread = !readSlugs[report.slug];

      // Tab filter
      if (activeTab === "saved" && !isSaved) return false;
      if (activeTab === "unread" && !isUnread) return false;

      // Main search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = report.title.toLowerCase().includes(q);
        const matchesDeck = report.deck.toLowerCase().includes(q);
        const matchesTag = (report.tag || "").toLowerCase().includes(q);
        const matchesSector = (report.sector || "").toLowerCase().includes(q);
        const matchesCompany = (report.company || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDeck && !matchesTag && !matchesSector && !matchesCompany) {
          return false;
        }
      }

      // Company specific filter
      if (companySearch.trim()) {
        const cq = companySearch.toLowerCase();
        const matchesCompany = (report.company || "").toLowerCase().includes(cq) ||
          report.title.toLowerCase().includes(cq);
        if (!matchesCompany) return false;
      }

      // Research Type checkboxes
      if (selectedTypes.length > 0) {
        const reportType = report.researchType || "";
        const tag = report.tag || "";
        const matchesType = selectedTypes.some(
          (t) =>
            reportType.toLowerCase() === t.toLowerCase() ||
            tag.toLowerCase().includes(t.toLowerCase().replace(/s$/, ""))
        );
        if (!matchesType) return false;
      }

      // Sector checkboxes
      if (selectedSectors.length > 0) {
        const reportSector = report.sector || "";
        if (!selectedSectors.includes(reportSector)) return false;
      }

      return true;
    });
  }, [allReports, activeTab, searchQuery, companySearch, selectedTypes, selectedSectors, savedSlugs, readSlugs]);

  // Sorting
  const sortedReports = useMemo(() => {
    const list = [...filteredReports];
    if (sortOption === "newest") {
      // Keep natural order or sort by date
      return list;
    } else if (sortOption === "oldest") {
      return list.reverse();
    }
    return list;
  }, [filteredReports, sortOption]);

  const itemsPerPage = 6;
  const totalItems = allReports.length > 0 ? allReports.length : 48;
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(sortedReports.length / itemsPerPage));

  return (
    <div className="rl-container">
      {/* Top Banner Header */}
      <div className="rl-header">
        <div className="rl-header-left">
          <h1 className="rl-title">Research Library</h1>
          <p className="rl-subtitle">Every report. Every update. A growing perspective.</p>
        </div>
        <div className="rl-header-right">
          <span className="rl-piece-count">{sortedReports.length} research pieces</span>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="rl-search-wrapper">
        <svg className="rl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="rl-search-input"
          placeholder="Find a company, topic or keyword within research..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchQuery && (
          <button
            type="button"
            className="rl-search-clear-btn"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Filter Toggle Bar */}
      <div className="rl-mobile-filter-bar">
        <button
          type="button"
          className={`rl-mobile-filter-btn ${showMobileFilters ? "active" : ""}`}
          onClick={() => setShowMobileFilters((prev) => !prev)}
          aria-expanded={showMobileFilters}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>{showMobileFilters ? "Hide Filters" : "Filter Research"}</span>
          {activeFilterCount > 0 && (
            <span className="rl-mobile-filter-badge">{activeFilterCount}</span>
          )}
          <svg
            className={`rl-mobile-chevron ${showMobileFilters ? "open" : ""}`}
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {hasActiveFilters && (
          <button type="button" onClick={handleReset} className="rl-mobile-reset-btn">
            Reset all
          </button>
        )}
      </div>

      {/* Active Filter Chips (Removable tags) */}
      {hasActiveFilters && (
        <div className="rl-active-chips-bar">
          <div className="rl-active-chips-list">
            {selectedTypes.map((type) => (
              <span key={type} className="rl-active-chip">
                <span>{type}</span>
                <button type="button" onClick={() => removeType(type)} aria-label={`Remove ${type} filter`}>
                  ×
                </button>
              </span>
            ))}
            {selectedSectors.map((sector) => (
              <span key={sector} className="rl-active-chip">
                <span>{sector}</span>
                <button type="button" onClick={() => removeSector(sector)} aria-label={`Remove ${sector} filter`}>
                  ×
                </button>
              </span>
            ))}
            {companySearch && (
              <span className="rl-active-chip">
                <span>Co: {companySearch}</span>
                <button type="button" onClick={clearCompanySearch} aria-label="Remove company filter">
                  ×
                </button>
              </span>
            )}
            {publishedFilter !== "any" && (
              <span className="rl-active-chip">
                <span>{publishedFilter}</span>
                <button type="button" onClick={clearPublishedFilter} aria-label="Remove time filter">
                  ×
                </button>
              </span>
            )}
          </div>
          <button type="button" onClick={handleReset} className="rl-chips-clear-all">
            Clear all
          </button>
        </div>
      )}

      {/* Two Column Layout: Left Filter Sidebar & Right Research Content */}
      <div className="rl-layout">
        {/* Left Filter Column / Drawer */}
        <aside className={`rl-filter-sidebar ${showMobileFilters ? "mobile-open" : ""}`}>
          <div className="rl-filter-header">
            <span className="rl-filter-title">Refine your search</span>
            <div className="rl-filter-header-actions">
              <button type="button" onClick={handleReset} className="rl-filter-reset">
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rl-filter-close-btn"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Research Type Group */}
          <div className="rl-filter-group">
            <h3 className="rl-group-label">Research type</h3>
            <div className="rl-checkbox-list">
              {researchTypes.map((type) => {
                const checked = selectedTypes.includes(type);
                return (
                  <label key={type} className="rl-checkbox-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes((prev) => [...prev, type]);
                        } else {
                          setSelectedTypes((prev) => prev.filter((t) => t !== type));
                        }
                        setCurrentPage(1);
                      }}
                    />
                    <span className="rl-checkbox-custom" />
                    <span className="rl-checkbox-text">{type}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sector Group */}
          <div className="rl-filter-group">
            <h3 className="rl-group-label">Sector</h3>
            <div className="rl-checkbox-list">
              {sectorOptions.map((sector) => {
                const checked = selectedSectors.includes(sector);
                return (
                  <label key={sector} className="rl-checkbox-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSectors((prev) => [...prev, sector]);
                        } else {
                          setSelectedSectors((prev) => prev.filter((s) => s !== sector));
                        }
                        setCurrentPage(1);
                      }}
                    />
                    <span className="rl-checkbox-custom" />
                    <span className="rl-checkbox-text">{sector}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Company Search Group */}
          <div className="rl-filter-group">
            <h3 className="rl-group-label">Company</h3>
            <div className="rl-company-input-wrap">
              <svg className="rl-company-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="rl-company-input"
                placeholder="Find company..."
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Published Group */}
          <div className="rl-filter-group">
            <h3 className="rl-group-label">Published</h3>
            <div className="rl-select-wrap">
              <select
                className="rl-select"
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
              >
                <option value="any">Any time</option>
                <option value="7d">Past 7 days</option>
                <option value="30d">Past 30 days</option>
                <option value="6m">Past 6 months</option>
                <option value="1y">Past year</option>
              </select>
              <svg className="rl-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="rl-filter-mobile-footer">
            <button
              type="button"
              className="rl-filter-apply-btn"
              onClick={() => setShowMobileFilters(false)}
            >
              Show {sortedReports.length} {sortedReports.length === 1 ? "Report" : "Reports"}
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="rl-content-area">
          {/* Top Bar: Tabs & View/Sort Controls */}
          <div className="rl-toolbar">
            {/* Tabs */}
            <div className="rl-tabs">
              <button
                type="button"
                className={`rl-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("all");
                  setCurrentPage(1);
                }}
              >
                All research
              </button>
              <button
                type="button"
                className={`rl-tab ${activeTab === "saved" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("saved");
                  setCurrentPage(1);
                }}
              >
                Saved
              </button>
              <button
                type="button"
                className={`rl-tab ${activeTab === "unread" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("unread");
                  setCurrentPage(1);
                }}
              >
                Unread
              </button>
            </div>

            {/* Sort & View Mode Controls */}
            <div className="rl-controls">
              {/* Sort dropdown */}
              <div className="rl-sort-wrap">
                <select
                  className="rl-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <svg className="rl-sort-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* View mode toggle */}
              <div className="rl-view-toggles">
                <button
                  type="button"
                  className={`rl-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`rl-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  title="List view"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
                    <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
                    <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
                    <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" />
                    <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid / List */}
          {paginatedReports.length > 0 ? (
            <div className={viewMode === "grid" ? "rl-grid" : "rl-list"}>
              {paginatedReports.map((report) => {
                const isSaved = Boolean(savedSlugs[report.slug]);
                const isUnread = !readSlugs[report.slug];
                const imageSource =
                  report.imageUrl ||
                  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80";

                return (
                  <article key={report.slug} className="rl-card">
                    {/* Card Thumbnail Art */}
                    <div className="rl-card-image-wrap">
                      <img
                        src={imageSource}
                        alt={report.title}
                        className="rl-card-image"
                        loading="lazy"
                      />
                      {/* Bookmark Button */}
                      <button
                        type="button"
                        className={`rl-bookmark-btn ${isSaved ? "saved" : ""}`}
                        onClick={(e) => toggleSave(report.slug, e)}
                        aria-label={isSaved ? "Remove from saved" : "Save to reading list"}
                        title={isSaved ? "Saved" : "Save report"}
                      >
                        {isSaved ? (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="#d97706" stroke="#d97706" strokeWidth="1.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="rl-card-body">
                      <div className="rl-card-topline">
                        <span className="rl-category-tag">{report.tag || "RESEARCH REPORT"}</span>
                        {report.isNew && <span className="rl-new-badge">NEW</span>}
                        {isUnread && <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", background: "#eff6ff", color: "#2563eb", letterSpacing: "0.04em" }}>UNREAD</span>}
                      </div>

                      <h2 className="rl-card-title">
                        <Link href={`/research/${report.slug}`} onClick={() => markAsRead(report.slug)}>
                          {report.title}
                        </Link>
                      </h2>

                      <p className="rl-card-deck">{report.deck}</p>

                      <div className="rl-card-sector-wrap">
                        {report.sector && (
                          <span className="rl-sector-chip">{report.sector}</span>
                        )}
                      </div>

                      <div className="rl-card-footer">
                        <span className="rl-card-meta">
                          {report.date}
                        </span>
                        <Link href={`/research/${report.slug}`} onClick={() => markAsRead(report.slug)} className="rl-read-btn">
                          Read <span className="rl-read-arrow">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rl-empty-state">
              <div className="rl-empty-box">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <h3>No research reports match your filters</h3>
                <p>Try clearing your keyword search or adjusting your filter selection.</p>
                <button type="button" onClick={handleReset} className="rl-empty-reset-btn">
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Bottom Pagination */}
          <div className="rl-pagination-bar">
            <span className="rl-showing-count">
              Showing {paginatedReports.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, sortedReports.length)} of {sortedReports.length}
            </span>
            {totalPages > 1 && (
              <div className="rl-pagination-pages">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  className="rl-page-btn rl-page-prev"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`rl-page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  className="rl-page-btn rl-page-next"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

          {/* Footer Disclaimer */}
          <footer className="rl-disclaimer-footer">
            <span>Design preview • Illustrative data. Not investment advice or recommendations.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
