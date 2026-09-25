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
  const allReports = storeReports?.length > 0 ? storeReports : defaultReports;

  // State management
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [publishedFilter, setPublishedFilter] = useState("any");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>({
    "racl-geartech-understanding-the-next-phase": true,
    "specialty-chemicals-reading-the-recovery": true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle bookmark / saved
  const toggleSave = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
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
      const isSaved = savedSlugs[report.slug] ?? report.isSaved ?? false;
      const isUnread = report.isUnread ?? true;

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
  }, [allReports, activeTab, searchQuery, companySearch, selectedTypes, selectedSectors, savedSlugs]);

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
  const totalItems = 48; // Illustrative full count matching design
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rl-container">
      {/* Top Banner Header */}
      <div className="rl-header">
        <div className="rl-header-left">
          <h1 className="rl-title">Research Library</h1>
          <p className="rl-subtitle">Every report. Every update. A growing perspective.</p>
        </div>
        <div className="rl-header-right">
          <span className="rl-piece-count">{totalItems} research pieces</span>
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
      </div>

      {/* Two Column Layout: Left Filter Sidebar & Right Research Content */}
      <div className="rl-layout">
        {/* Left Filter Column */}
        <aside className="rl-filter-sidebar">
          <div className="rl-filter-header">
            <span className="rl-filter-title">Refine your search</span>
            <button type="button" onClick={handleReset} className="rl-filter-reset">
              Reset
            </button>
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
                const isSaved = savedSlugs[report.slug] ?? report.isSaved ?? false;
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
                      </div>

                      <h2 className="rl-card-title">
                        <Link href={`/research/${report.slug}`} target="_blank" rel="noreferrer">
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
                        <Link href={`/research/${report.slug}`} target="_blank" rel="noreferrer" className="rl-read-btn">
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
              Showing 1–{Math.min(paginatedReports.length, 6)} of {totalItems}
            </span>
            <div className="rl-pagination-pages">
              <button
                type="button"
                className={`rl-page-btn ${currentPage === 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button
                type="button"
                className={`rl-page-btn ${currentPage === 2 ? "active" : ""}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button
                type="button"
                className={`rl-page-btn ${currentPage === 3 ? "active" : ""}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
              <span className="rl-page-ellipsis">...</span>
              <button
                type="button"
                className={`rl-page-btn ${currentPage === 8 ? "active" : ""}`}
                onClick={() => setCurrentPage(8)}
              >
                8
              </button>
              <button
                type="button"
                className="rl-page-btn rl-page-next"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, 8))}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
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
