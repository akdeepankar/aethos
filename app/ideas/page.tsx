"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminStore, StockIdea } from "../_lib/admin-store";

type SortOption = "latest" | "newest" | "highest-return" | "mcap";

export default function IdeasPage() {
  const router = useRouter();
  const { ideas: storeIdeas } = useAdminStore();
  const allIdeas = storeIdeas ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoverage, setSelectedCoverage] = useState("All");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [savedFilterOnly, setSavedFilterOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "list">("table");

  // Saved ideas in local storage
  const [savedIdeas, setSavedIdeas] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("aethos_user_saved_ideas");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleSaveIdea = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIdeas((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("aethos_user_saved_ideas", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    return allIdeas.filter((idea) => {
      if (savedFilterOnly && !savedIdeas[idea.id]) return false;

      if (selectedCoverage !== "All" && idea.coverage !== selectedCoverage) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCompany = (idea.company || "").toLowerCase().includes(q);
        const matchTicker = (idea.ticker || "").toLowerCase().includes(q);
        const matchSector = (idea.sector || "").toLowerCase().includes(q);
        const matchStudying = (idea.studying || "").toLowerCase().includes(q);
        const matchChallenge = (idea.challenge || "").toLowerCase().includes(q);
        if (!matchCompany && !matchTicker && !matchSector && !matchStudying && !matchChallenge) {
          return false;
        }
      }

      return true;
    });
  }, [allIdeas, searchQuery, selectedCoverage, savedFilterOnly, savedIdeas]);

  // Sorted Ideas
  const sortedIdeas = useMemo(() => {
    const list = [...filteredIdeas];
    if (sortOption === "highest-return") {
      list.sort((a, b) => {
        const valA = parseFloat((a.returnPct || "0").replace("+", "").replace("%", "")) || 0;
        const valB = parseFloat((b.returnPct || "0").replace("+", "").replace("%", "")) || 0;
        return valB - valA;
      });
    } else if (sortOption === "mcap") {
      list.sort((a, b) => {
        const valA = parseFloat((a.mcap || "0").replace(/,/g, "")) || 0;
        const valB = parseFloat((b.mcap || "0").replace(/,/g, "")) || 0;
        return valB - valA;
      });
    }
    return list;
  }, [filteredIdeas, sortOption]);

  return (
    <div className="ai-container">
      {/* Main Header & Subtitle */}
      <div className="ai-header">
        <div className="ai-header-left">
          <h1 className="ai-title">Aethos Ideas</h1>
          <p className="ai-subtitle">Understand the business. Track how the thesis evolves.</p>
        </div>
        <div className="ai-header-right">
          <button
            type="button"
            className={`ai-saved-btn ${savedFilterOnly ? "active" : ""}`}
            onClick={() => setSavedFilterOnly((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill={savedFilterOnly ? "#d97706" : "none"} stroke={savedFilterOnly ? "#d97706" : "currentColor"} strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{savedFilterOnly ? "Show all ideas" : "Saved ideas"}</span>
          </button>
        </div>
      </div>

      <div className="ai-stocks-view">
          {/* Filter & Search Controls */}
          <div className="ai-toolbar">
            <div className="ai-search-box">
              <svg className="ai-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="ai-search-input"
                placeholder="Search within ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ai-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="ai-controls-group">
              {/* Coverage Dropdown */}
              <div className="ai-select-wrap">
                <select
                  className="ai-select"
                  value={selectedCoverage}
                  onChange={(e) => setSelectedCoverage(e.target.value)}
                >
                  <option value="All">Coverage: All</option>
                  <option value="Coverage ongoing">Coverage ongoing</option>
                  <option value="Under review">Under review</option>
                  <option value="Archived">Archived</option>
                </select>
                <svg className="ai-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Sort Dropdown */}
              <div className="ai-select-wrap">
                <select
                  className="ai-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="latest">Sort: Latest update</option>
                  <option value="newest">Sort: Newest first</option>
                  <option value="highest-return">Sort: Highest return</option>
                  <option value="mcap">Sort: Market Cap</option>
                </select>
                <svg className="ai-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* View Mode Toggles */}
              <div className="ai-view-toggles">
                <button
                  type="button"
                  className={`ai-view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  title="Table view"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`ai-view-btn ${viewMode === "list" ? "active" : ""}`}
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

          {/* Table Container */}
          <div className="ai-table-card">
            <div className="ai-table-wrap">
              <table className="ai-table">
                <thead>
                  <tr>
                    <th className="ai-th-company">Company<br /><span className="ai-th-sub">Ticker</span></th>
                    <th>Sector</th>
                    <th>Published</th>
                    <th className="ai-th-num">M-cap<br /><span className="ai-th-sub">(₹ Cr)</span></th>
                    <th className="ai-th-num">Ref. price<br /><span className="ai-th-sub">(₹)</span></th>
                    <th className="ai-th-num">Latest price<br /><span className="ai-th-sub">(₹)</span></th>
                    <th className="ai-th-action">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedIdeas.length > 0 ? (
                    sortedIdeas.map((idea) => {
                      const isSaved = Boolean(savedIdeas[idea.id]);

                      return (
                        <tr
                          key={idea.id}
                          className="ai-tr"
                          onClick={() => router.push(`/ideas/${idea.slug || idea.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Company / Ticker with Star */}
                          <td className="ai-td-company">
                            <div className="ai-company-cell">
                              <button
                                type="button"
                                className={`ai-star-btn ${isSaved ? "saved" : ""}`}
                                onClick={(e) => toggleSaveIdea(idea.id, e)}
                                title={isSaved ? "Saved to watchlist" : "Save to watchlist"}
                              >
                                {isSaved ? (
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#d97706" stroke="#d97706" strokeWidth="1.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="1.6">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                )}
                              </button>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span className="ai-company-name">{idea.company}</span>
                                </div>
                                <div className="ai-company-ticker">{idea.ticker}</div>
                              </div>
                            </div>
                          </td>

                          {/* Sector */}
                          <td className="ai-td-sector">{idea.sector}</td>

                          {/* Published Date */}
                          <td className="ai-td-date">{idea.published}</td>

                          {/* M-Cap */}
                          <td className="ai-td-num">{idea.mcap}</td>

                          {/* Ref Price */}
                          <td className="ai-td-num">{(idea.refPrice ?? idea.sharedPrice ?? 0).toLocaleString()}</td>

                          {/* Latest Price */}
                          <td className="ai-td-num">{(idea.latestPrice ?? idea.currentPrice ?? 0).toLocaleString()}</td>

                          {/* Report Link */}
                          <td className="ai-td-action">
                            <Link
                              href={`/ideas/${idea.slug || idea.id}`}
                              className="ai-read-btn"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Read <span className="ai-arrow">→</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="ai-empty-td">
                        No investment ideas match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footnote */}
            <div className="ai-table-footnote">
              Illustrative prices as of 23 Sep 2026 close. Absolute price return from publication; adjusted for splits/bonuses; excludes dividends.
            </div>
          </div>

        </div>

      {/* Bottom Footer Disclaimer */}
      <footer className="ai-footer-disclaimer">
        <span>Design preview • Illustrative data. Not investment advice or recommendations.</span>
      </footer>
    </div>
  );
}
