"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../_context/auth-context";
import {
  useAdminStore,
  StockIdea,
  AdminUser,
  StoredMediaFile,
} from "../_lib/admin-store";
import { Report, Ipo, Post } from "../_lib/content";

type TabType = "reports" | "ideas" | "ipos" | "journal" | "media" | "database";
type DrawerType = "report" | "idea" | "ipo" | "journal" | "file" | null;

const SECTORS = [
  "Electrical equipment",
  "Auto components",
  "Building materials",
  "Chemicals",
  "Pharmaceuticals",
  "Industrials",
  "Consumer",
  "Technology & SaaS",
  "Banking & Financials",
  "Infrastructure",
];

const RESEARCH_TYPES = [
  "Stock deep dives",
  "Sector studies",
  "Thematic research",
  "IPO notes",
  "Results analysis",
  "Company updates",
];

// Clean minimalist SVG icons (No emojis)
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFileText() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const {
    reports,
    ideas,
    ipos,
    journal,
    users,
    media,
    syncFromAppwrite,
    updateReports,
    updateIdeas,
    updateIpos,
    updateJournal,
    updateMedia,
    uploadPdfFile,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<TabType>("reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type?: "success" | "error" | "info" } | null>(null);

  // Right Side Column Drawer State
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [selectedFile, setSelectedFile] = useState<StoredMediaFile | null>(null);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Report Form State
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [reportForm, setReportForm] = useState({
    title: "",
    slug: "",
    deck: "",
    sector: "Electrical equipment",
    researchType: "Stock deep dives",
    company: "",
    readTime: "12 min read",
    date: "24 Sep 2026",
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "",
    isNew: true,
    isSaved: false,
    tabCategory: "company" as "company" | "sectoral" | "thematic",
    sections: [
      { heading: "Thesis", body: "" },
      { heading: "Market Position & Moat", body: "" },
      { heading: "Financials & Valuation", body: "" },
    ],
  });

  // Idea Form State
  const [editingIdea, setEditingIdea] = useState<StockIdea | null>(null);
  const [ideaForm, setIdeaForm] = useState({
    company: "",
    ticker: "",
    sector: "Automotive",
    mcap: "2000cr",
    sharedPrice: 1000,
    currentPrice: 1200,
    sharedDate: "14 Jan 2026",
    thesis: "",
    pdfUrl: "",
  });

  // IPO Form State
  const [editingIpo, setEditingIpo] = useState<Ipo | null>(null);
  const [ipoForm, setIpoForm] = useState({
    company: "",
    slug: "",
    sector: "Industrial",
    period: "20-22 Sep 2026",
    price: "₹100 - ₹120",
    type: "Mainboard" as "Mainboard" | "SME",
    deepDive: true,
    deck: "",
    issueSize: "₹500 crore",
    lotSize: "100 shares",
    listing: "30 Sep 2026",
  });

  const [isConnecting, setIsConnecting] = useState(false);

  const showNotification = (msg: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Open report editor drawer
  const handleOpenReportDrawer = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setReportForm({
        title: report.title,
        slug: report.slug,
        deck: report.deck,
        sector: report.sector || report.tag || "Electrical equipment",
        researchType: (report.researchType as string) || "Stock deep dives",
        company: report.company || "",
        readTime: report.readTime || "12 min read",
        date: report.date || "Today",
        free: report.free,
        imageUrl: report.imageUrl || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
        pdfUrl: report.pdfUrl || "",
        isNew: Boolean(report.isNew),
        isSaved: Boolean(report.isSaved),
        tabCategory: report.tabCategory || "company",
        sections: report.sections && report.sections.length > 0 ? report.sections : [{ heading: "Thesis", body: report.deck }],
      });
    } else {
      setEditingReport(null);
      setReportForm({
        title: "",
        slug: "",
        deck: "",
        sector: "Electrical equipment",
        researchType: "Stock deep dives",
        company: "",
        readTime: "12 min read",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        free: true,
        imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
        pdfUrl: "",
        isNew: true,
        isSaved: false,
        tabCategory: "company",
        sections: [
          { heading: "Thesis", body: "" },
          { heading: "Market Position & Moat", body: "" },
          { heading: "Financials & Valuation", body: "" },
        ],
      });
    }
    setActiveDrawer("report");
  };

  // Open idea editor drawer
  const handleOpenIdeaDrawer = (idea?: StockIdea) => {
    if (idea) {
      setEditingIdea(idea);
      setIdeaForm({
        company: idea.company,
        ticker: idea.ticker,
        sector: idea.sector,
        mcap: idea.mcap,
        sharedPrice: idea.sharedPrice,
        currentPrice: idea.currentPrice,
        sharedDate: idea.sharedDate,
        thesis: idea.thesis || "",
        pdfUrl: idea.pdfUrl || "",
      });
    } else {
      setEditingIdea(null);
      setIdeaForm({
        company: "",
        ticker: "",
        sector: "Automotive",
        mcap: "1500cr",
        sharedPrice: 500,
        currentPrice: 550,
        sharedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        thesis: "",
        pdfUrl: "",
      });
    }
    setActiveDrawer("idea");
  };

  // Open IPO editor drawer
  const handleOpenIpoDrawer = (ipo?: Ipo) => {
    if (ipo) {
      setEditingIpo(ipo);
      setIpoForm({
        company: ipo.company,
        slug: ipo.slug,
        sector: ipo.sector,
        period: ipo.period,
        price: ipo.price,
        type: ipo.type,
        deepDive: ipo.deepDive,
        deck: ipo.deck,
        issueSize: ipo.issueSize,
        lotSize: ipo.lotSize,
        listing: ipo.listing,
      });
    } else {
      setEditingIpo(null);
      setIpoForm({
        company: "",
        slug: "",
        sector: "Industrial Automation",
        period: "18-22 Sep 2026",
        price: "₹118",
        type: "Mainboard",
        deepDive: true,
        deck: "",
        issueSize: "₹38.5 crore",
        lotSize: "1,200 shares",
        listing: "30 Sep 2026",
      });
    }
    setActiveDrawer("ipo");
  };

  // Save report
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title.trim()) {
      showNotification("Title is required", "error");
      return;
    }

    const slug = reportForm.slug.trim() || reportForm.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 60);
    const autoDate = editingReport?.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const reportObj: Report = {
      slug,
      title: reportForm.title.trim(),
      tag: reportForm.researchType.toUpperCase(),
      researchType: reportForm.researchType as any,
      sector: reportForm.sector,
      company: reportForm.company.trim(),
      tabCategory: reportForm.tabCategory,
      deck: reportForm.deck.trim(),
      readTime: "10 min read",
      date: autoDate,
      meta: autoDate,
      free: reportForm.free,
      imageUrl: reportForm.imageUrl.trim(),
      pdfUrl: reportForm.pdfUrl.trim() || undefined,
      isNew: reportForm.isNew,
      isSaved: reportForm.isSaved,
      isUnread: true,
      sections: reportForm.sections.filter((s) => s.heading.trim() || s.body.trim()),
    };

    if (editingReport) {
      const updated = reports.map((r) => (r.slug === editingReport.slug ? reportObj : r));
      updateReports(updated, { action: "save", report: reportObj });
      showNotification(`Report "${reportForm.title}" saved`, "success");
    } else {
      updateReports([reportObj, ...reports], { action: "save", report: reportObj });
      showNotification(`Report "${reportForm.title}" created`, "success");
    }

    setActiveDrawer(null);
  };

  // Save idea
  const handleSaveIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaForm.company.trim() || !ideaForm.ticker.trim()) {
      showNotification("Company and ticker are required", "error");
      return;
    }

    const id = editingIdea?.id || ideaForm.ticker.toLowerCase();
    const ideaObj: StockIdea = {
      id,
      company: ideaForm.company.trim(),
      ticker: ideaForm.ticker.trim().toUpperCase(),
      sector: ideaForm.sector,
      mcap: ideaForm.mcap,
      sharedPrice: Number(ideaForm.sharedPrice),
      currentPrice: Number(ideaForm.currentPrice),
      sharedDate: ideaForm.sharedDate,
      thesis: ideaForm.thesis.trim(),
      pdfUrl: ideaForm.pdfUrl.trim() || undefined,
    };

    if (editingIdea) {
      const updated = ideas.map((i) => (i.id === editingIdea.id ? ideaObj : i));
      updateIdeas(updated, { action: "save", idea: ideaObj });
      showNotification(`Idea "${ideaForm.company}" saved`, "success");
    } else {
      updateIdeas([ideaObj, ...ideas], { action: "save", idea: ideaObj });
      showNotification(`Idea "${ideaForm.company}" created`, "success");
    }

    setActiveDrawer(null);
  };

  // Save IPO
  const handleSaveIpo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipoForm.company.trim()) {
      showNotification("Company is required", "error");
      return;
    }

    const slug = ipoForm.slug.trim() || ipoForm.company.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 60);
    const ipoObj: Ipo = {
      slug,
      company: ipoForm.company.trim(),
      sector: ipoForm.sector,
      period: ipoForm.period,
      price: ipoForm.price,
      type: ipoForm.type,
      deepDive: ipoForm.deepDive,
      deck: ipoForm.deck.trim(),
      issueSize: ipoForm.issueSize,
      lotSize: ipoForm.lotSize,
      listing: ipoForm.listing,
      sections: [],
    };

    if (editingIpo) {
      const updated = ipos.map((i) => (i.slug === editingIpo.slug ? ipoObj : i));
      updateIpos(updated, { action: "save", ipo: ipoObj });
      showNotification(`IPO "${ipoForm.company}" saved`, "success");
    } else {
      updateIpos([ipoObj, ...ipos], { action: "save", ipo: ipoObj });
      showNotification(`IPO "${ipoForm.company}" created`, "success");
    }

    setActiveDrawer(null);
  };

  // Delete report
  const handleDeleteReport = (slug: string) => {
    const target = reports.find((r) => r.slug === slug);
    if (confirm("Delete this report from database?")) {
      updateReports(reports.filter((r) => r.slug !== slug), target ? { action: "delete", report: target } : undefined);
      showNotification("Report deleted", "info");
    }
  };

  // Open file inspector drawer
  const handleOpenFileDrawer = (file: StoredMediaFile) => {
    setSelectedFile(file);
    setActiveDrawer("file");
  };

  // Delete stored file
  const handleDeleteFile = (fileId: string) => {
    const target = media.find((m) => m.id === fileId);
    if (!target) return;
    if (confirm(`Are you sure you want to permanently delete "${target.name}"?`)) {
      const remaining = media.filter((m) => m.id !== fileId);
      updateMedia(remaining);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
        setActiveDrawer(null);
      }
      showNotification(`File "${target.name}" deleted`, "info");
    }
  };

  // Upload file handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    try {
      const newFile = await uploadPdfFile(file, "Report");
      showNotification(`Uploaded "${file.name}" successfully`, "success");
      setSelectedFile(newFile);
      setActiveDrawer("file");
    } catch {
      showNotification("Failed to upload file", "error");
    } finally {
      setIsUploadingFile(false);
      e.target.value = "";
    }
  };

  // Copy file direct link
  const handleCopyUrl = (url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setHasCopiedUrl(true);
    showNotification("File URL copied to clipboard", "success");
    setTimeout(() => setHasCopiedUrl(false), 2000);
  };

  // Filtered reports list
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.company || "").toLowerCase().includes(q) ||
        (r.sector || "").toLowerCase().includes(q)
    );
  }, [reports, searchQuery]);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 32px 64px" }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            padding: "10px 18px",
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
            Admin Panel
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            Manage research notes, stock ideas, files, and database records.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => {
              syncFromAppwrite();
              showNotification("Database synchronized", "info");
            }}
            style={{
              padding: "7px 14px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            Sync Database
          </button>

          {activeTab === "reports" && (
            <button
              type="button"
              onClick={() => handleOpenReportDrawer()}
              style={{
                padding: "7px 16px",
                background: "#0f172a",
                border: "1px solid #0f172a",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IconPlus /> Add Research
            </button>
          )}

          {activeTab === "ideas" && (
            <button
              type="button"
              onClick={() => handleOpenIdeaDrawer()}
              style={{
                padding: "7px 16px",
                background: "#0f172a",
                border: "1px solid #0f172a",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IconPlus /> Add Idea
            </button>
          )}

          {activeTab === "ipos" && (
            <button
              type="button"
              onClick={() => handleOpenIpoDrawer()}
              style={{
                padding: "7px 16px",
                background: "#0f172a",
                border: "1px solid #0f172a",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IconPlus /> Add IPO
            </button>
          )}
        </div>
      </div>

      {/* Minimal Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "24px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "reports", label: "Research", icon: IconBook, count: reports.length },
          { id: "ideas", label: "Ideas", icon: IconSparkles, count: ideas.length },
          { id: "ipos", label: "IPOs", icon: IconTrend, count: ipos.length },
          { id: "journal", label: "Journal", icon: IconFileText, count: journal.length },
          { id: "media", label: "Files", icon: IconFolder, count: media.length },
          { id: "database", label: "Database", icon: IconDatabase },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#0f172a" : "#64748b",
                borderBottom: isActive ? "2px solid #0f172a" : "2px solid transparent",
                background: "none",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    background: isActive ? "#f1f5f9" : "#f8fafc",
                    color: isActive ? "#0f172a" : "#94a3b8",
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {activeTab === "reports" && (
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Search reports by title, company, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "420px",
                padding: "8px 14px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          {/* Reports Table */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Cover & Title</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Type</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Sector</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Access</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.slug} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "34px", borderRadius: "4px", overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
                          {report.imageUrl ? (
                            <img src={report.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "#e2e8f0" }} />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/research/${report.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#0f172a",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                          >
                            <span>{report.title}</span>
                            <span style={{ opacity: 0.5 }}>
                              <IconExternalLink />
                            </span>
                          </Link>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {report.company || report.deck.slice(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                      {report.researchType || report.tag}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11px", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "12px" }}>
                        {report.sector || "General"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: report.free ? "#ecfdf5" : "#fef3c7",
                          color: report.free ? "#047857" : "#b45309",
                        }}
                      >
                        {report.free ? "FREE" : "PRO"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>
                      {report.date}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenReportDrawer(report)}
                          style={{
                            padding: "5px 10px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "4px",
                            fontSize: "11.5px",
                            fontWeight: "500",
                            color: "#334155",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(report.slug)}
                          style={{
                            padding: "5px 8px",
                            background: "#ffffff",
                            border: "1px solid #fecaca",
                            borderRadius: "4px",
                            fontSize: "11.5px",
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ideas Tab */}
      {activeTab === "ideas" && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Stock Ideas</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{ideas.length} ideas published</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ideas.map((idea) => (
              <div key={idea.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #f1f5f9", borderRadius: "6px" }}>
                <div>
                  <Link
                    href={`/ideas/${idea.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "600",
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                  >
                    <span>{idea.company}</span>
                    <span style={{ opacity: 0.5 }}>
                      <IconExternalLink />
                    </span>
                  </Link>
                  <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "8px" }}>({idea.ticker}) · {idea.sector}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#059669" }}>
                    ₹{idea.currentPrice}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenIdeaDrawer(idea)}
                    style={{ padding: "4px 8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IPOs Tab */}
      {activeTab === "ipos" && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>IPO Intelligence</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{ipos.length} companies tracked</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ipos.map((ipo) => (
              <div key={ipo.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #f1f5f9", borderRadius: "6px" }}>
                <div>
                  <Link
                    href={`/ipos/${ipo.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "600",
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                  >
                    <span>{ipo.company}</span>
                    <span style={{ opacity: 0.5 }}>
                      <IconExternalLink />
                    </span>
                  </Link>
                  <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "8px" }}>{ipo.sector} · {ipo.type}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#475569" }}>
                    {ipo.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenIpoDrawer(ipo)}
                    style={{ padding: "4px 8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === "journal" && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Journal & Memos</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{journal.length} articles</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {journal.map((post) => (
              <div key={post.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #f1f5f9", borderRadius: "6px" }}>
                <div>
                  <Link
                    href={`/journal/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "600",
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                  >
                    <span>{post.title}</span>
                    <span style={{ opacity: 0.5 }}>
                      <IconExternalLink />
                    </span>
                  </Link>
                  <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "8px" }}>{post.category} · {post.date}</span>
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  {post.slug}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files & Media Tab */}
      {activeTab === "media" && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Stored Files (Appwrite Bucket)</h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{media.length} files available in storage bucket</span>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                disabled={isUploadingFile}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: isUploadingFile ? "wait" : "pointer",
                }}
              >
                <IconUpload />
                <span>{isUploadingFile ? "Uploading..." : "Upload File"}</span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {media.map((file) => {
              const isPdf = file.type.includes("pdf") || file.url.endsWith(".pdf");
              const isImg = file.type.startsWith("image/") || file.url.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i);
              return (
                <div
                  key={file.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    border: "1px solid #f1f5f9",
                    borderRadius: "6px",
                    background: "#ffffff",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    onClick={() => handleOpenFileDrawer(file)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", flex: 1 }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "6px",
                        background: isPdf ? "#fef2f2" : isImg ? "#eff6ff" : "#f8fafc",
                        color: isPdf ? "#dc2626" : isImg ? "#2563eb" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isImg ? <IconSparkles /> : <IconFileText />}
                    </div>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px", display: "flex", gap: "10px" }}>
                        <span>
                          {file.size > 1048576
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : `${(file.size / 1024).toFixed(0)} KB`}
                        </span>
                        <span>•</span>
                        <span>{file.uploadedAt || "Stored"}</span>
                        {file.category && (
                          <>
                            <span>•</span>
                            <span style={{ fontWeight: "600", color: "#475569" }}>{file.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleOpenFileDrawer(file)}
                      style={{
                        padding: "6px 12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#0f172a",
                        cursor: "pointer",
                      }}
                    >
                      View & Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id)}
                      title="Delete file"
                      style={{
                        padding: "6px 10px",
                        background: "#fff",
                        border: "1px solid #fee2e2",
                        borderRadius: "5px",
                        fontSize: "12px",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Database Connection Tab */}
      {activeTab === "database" && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px", maxWidth: "600px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
            Database Setup
          </h3>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
            Connect and synchronize all research publications, cover images, and stock ideas to your Appwrite backend.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              type="button"
              disabled={isConnecting}
              onClick={async () => {
                setIsConnecting(true);
                try {
                  const res = await fetch("/api/appwrite/provision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                  const data = await res.json();
                  if (data.success) {
                    showNotification("Database initialized and synchronized", "success");
                    syncFromAppwrite();
                  } else {
                    showNotification(data.error || "Connection failed", "error");
                  }
                } catch {
                  showNotification("Could not reach backend", "error");
                } finally {
                  setIsConnecting(false);
                }
              }}
              style={{
                padding: "10px 16px",
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {isConnecting ? "Synchronizing..." : "Initialize / Sync Database Tables"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RIGHT SIDE COLUMN DRAWER FOR ALL ADDITIONS / EDITS                        */}
      {/* ========================================================================= */}
      {activeDrawer && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setActiveDrawer(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.35)",
              backdropFilter: "blur(2px)",
              zIndex: 1000,
              transition: "opacity 0.2s ease",
            }}
          />

          {/* Slide-over Right Column Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(580px, 95vw)",
              background: "#ffffff",
              borderLeft: "1px solid #e2e8f0",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                  {activeDrawer === "report"
                    ? editingReport
                      ? "Edit Research Report"
                      : "Add New Research Report"
                    : activeDrawer === "idea"
                    ? editingIdea
                      ? "Edit Stock Idea"
                      : "Add New Stock Idea"
                    : activeDrawer === "ipo"
                    ? editingIpo
                      ? "Edit IPO Intelligence"
                      : "Add New IPO Note"
                    : activeDrawer === "file"
                    ? selectedFile
                      ? selectedFile.name
                      : "File Details"
                    : "Add Item"}
                </h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {activeDrawer === "file"
                    ? "Stored File Inspection & Asset Management"
                    : "Directly saved to database & displayed across platform"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body - Research Report Form */}
            {activeDrawer === "report" && (
              <form onSubmit={handleSaveReport} style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Title */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Publication Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const slug = val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
                      setReportForm((prev) => ({
                        ...prev,
                        title: val,
                        slug: editingReport ? prev.slug : slug,
                      }));
                    }}
                    placeholder="e.g. Power equipment: following the capacity cycle"
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", outline: "none" }}
                  />
                </div>

                {/* Slug & Company */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={reportForm.slug}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="power-equipment-capacity-cycle"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12.5px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Company / Target Focus
                    </label>
                    <input
                      type="text"
                      value={reportForm.company}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Power Grid Corp"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12.5px", outline: "none" }}
                    />
                  </div>
                </div>

                {/* Research Type & Sector */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Research Type
                    </label>
                    <select
                      value={reportForm.researchType}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, researchType: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12.5px", background: "#ffffff", outline: "none" }}
                    >
                      {RESEARCH_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Sector
                    </label>
                    <select
                      value={reportForm.sector}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, sector: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12.5px", background: "#ffffff", outline: "none" }}
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Summary Deck */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Summary Deck
                  </label>
                  <textarea
                    rows={2}
                    value={reportForm.deck}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, deck: e.target.value }))}
                    placeholder="Demand visibility meets execution reality."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", outline: "none" }}
                  />
                </div>

                {/* Cover Picture */}
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Cover Picture
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={reportForm.imageUrl}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none" }}
                    />
                    <div style={{ height: "54px", borderRadius: "6px", overflow: "hidden", background: "#e2e8f0", border: "1px solid #cbd5e1" }}>
                      {reportForm.imageUrl ? (
                        <img src={reportForm.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#94a3b8" }}>No image</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[
                      { label: "Power", url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80" },
                      { label: "Industrial", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
                      { label: "Materials", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
                      { label: "Chemicals", url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80" },
                      { label: "Pharma", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setReportForm((prev) => ({ ...prev, imageUrl: p.url }))}
                        style={{
                          padding: "3px 8px",
                          fontSize: "11px",
                          fontWeight: "500",
                          background: reportForm.imageUrl === p.url ? "#0f172a" : "#ffffff",
                          color: reportForm.imageUrl === p.url ? "#ffffff" : "#475569",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: "flex", gap: "18px", alignItems: "center", paddingTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={reportForm.free}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, free: e.target.checked }))}
                    />
                    <span>Free Public Access</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={reportForm.isNew}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, isNew: e.target.checked }))}
                    />
                    <span>Show &quot;NEW&quot; Tag</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={reportForm.isSaved}
                      onChange={(e) => setReportForm((prev) => ({ ...prev, isSaved: e.target.checked }))}
                    />
                    <span>Saved by Default</span>
                  </label>
                </div>

                {/* Sections Editor */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>
                      Analytical Sections ({reportForm.sections.length})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setReportForm((prev) => ({
                          ...prev,
                          sections: [...prev.sections, { heading: `Section ${prev.sections.length + 1}`, body: "" }],
                        }))
                      }
                      style={{ fontSize: "11.5px", fontWeight: "600", color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      + Add Section
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {reportForm.sections.map((sec, idx) => (
                      <div key={idx} style={{ padding: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const newSecs = [...reportForm.sections];
                              newSecs[idx].heading = e.target.value;
                              setReportForm((prev) => ({ ...prev, sections: newSecs }));
                            }}
                            placeholder="Section Heading"
                            style={{ width: "80%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}
                          />
                          {reportForm.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setReportForm((prev) => ({
                                  ...prev,
                                  sections: prev.sections.filter((_, i) => i !== idx),
                                }))
                              }
                              style={{ fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={sec.body}
                          onChange={(e) => {
                            const newSecs = [...reportForm.sections];
                            newSecs[idx].body = e.target.value;
                            setReportForm((prev) => ({ ...prev, sections: newSecs }));
                          }}
                          placeholder="Section narrative..."
                          style={{ width: "100%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px", marginTop: "4px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drawer Sticky Footer Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer(null)}
                    style={{ padding: "8px 16px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontWeight: "500", color: "#475569", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "8px 18px", background: "#0f172a", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#ffffff", cursor: "pointer" }}
                  >
                    {editingReport ? "Save Changes" : "Create Report"}
                  </button>
                </div>
              </form>
            )}

            {/* Drawer Body - Stock Idea Form */}
            {activeDrawer === "idea" && (
              <form onSubmit={handleSaveIdea} style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ideaForm.company}
                    onChange={(e) => setIdeaForm((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. RACL Geartech Limited"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Ticker Symbol *
                    </label>
                    <input
                      type="text"
                      required
                      value={ideaForm.ticker}
                      onChange={(e) => setIdeaForm((prev) => ({ ...prev, ticker: e.target.value }))}
                      placeholder="RACLGEAR"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Sector
                    </label>
                    <input
                      type="text"
                      value={ideaForm.sector}
                      onChange={(e) => setIdeaForm((prev) => ({ ...prev, sector: e.target.value }))}
                      placeholder="Auto Components"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Entry Price (₹)
                    </label>
                    <input
                      type="number"
                      value={ideaForm.sharedPrice}
                      onChange={(e) => setIdeaForm((prev) => ({ ...prev, sharedPrice: Number(e.target.value) }))}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Current Price (₹)
                    </label>
                    <input
                      type="number"
                      value={ideaForm.currentPrice}
                      onChange={(e) => setIdeaForm((prev) => ({ ...prev, currentPrice: Number(e.target.value) }))}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Investment Thesis
                  </label>
                  <textarea
                    rows={4}
                    value={ideaForm.thesis}
                    onChange={(e) => setIdeaForm((prev) => ({ ...prev, thesis: e.target.value }))}
                    placeholder="Core investment rationale, margin triggers..."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer(null)}
                    style={{ padding: "8px 16px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", color: "#475569", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "8px 18px", background: "#0f172a", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#ffffff", cursor: "pointer" }}
                  >
                    {editingIdea ? "Save Idea" : "Create Idea"}
                  </button>
                </div>
              </form>
            )}

            {/* Drawer Body - IPO Form */}
            {activeDrawer === "ipo" && (
              <form onSubmit={handleSaveIpo} style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ipoForm.company}
                    onChange={(e) => setIpoForm((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="SpectraA Technology Solutions"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Issue Price
                    </label>
                    <input
                      type="text"
                      value={ipoForm.price}
                      onChange={(e) => setIpoForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="₹118"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Board Type
                    </label>
                    <select
                      value={ipoForm.type}
                      onChange={(e) => setIpoForm((prev) => ({ ...prev, type: e.target.value as "Mainboard" | "SME" }))}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", background: "#ffffff" }}
                    >
                      <option value="Mainboard">Mainboard</option>
                      <option value="SME">SME</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
                    IPO Summary Deck
                  </label>
                  <textarea
                    rows={3}
                    value={ipoForm.deck}
                    onChange={(e) => setIpoForm((prev) => ({ ...prev, deck: e.target.value }))}
                    placeholder="Turnkey process plant engineering note..."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer(null)}
                    style={{ padding: "8px 16px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", color: "#475569", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "8px 18px", background: "#0f172a", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#ffffff", cursor: "pointer" }}
                  >
                    {editingIpo ? "Save IPO" : "Create IPO"}
                  </button>
                </div>
              </form>
            )}

            {/* Drawer Body - File Inspector */}
            {activeDrawer === "file" && selectedFile && (
              <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Preview Box */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "220px",
                  }}
                >
                  {selectedFile.type.startsWith("image/") || selectedFile.url.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i) ? (
                    <div style={{ width: "100%", maxHeight: "300px", display: "flex", justifyContent: "center", overflow: "hidden", borderRadius: "6px" }}>
                      <img
                        src={selectedFile.url}
                        alt={selectedFile.name}
                        style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "4px" }}
                      />
                    </div>
                  ) : selectedFile.type.includes("pdf") || selectedFile.url.endsWith(".pdf") ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <iframe
                        src={selectedFile.url}
                        title={selectedFile.name}
                        style={{ width: "100%", height: "290px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#ffffff" }}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <a
                          href={selectedFile.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#2563eb", textDecoration: "none", fontWeight: "500" }}
                        >
                          Open PDF in new tab <IconExternalLink />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "24px 16px" }}>
                      <div style={{ width: "48px", height: "48px", margin: "0 auto 12px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                        <IconFileText />
                      </div>
                      <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>{selectedFile.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{selectedFile.type || "Document File"}</div>
                    </div>
                  )}
                </div>

                {/* File Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      File Name
                    </label>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a", wordBreak: "break-all" }}>
                      {selectedFile.name}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        File Size
                      </label>
                      <div style={{ fontSize: "13px", color: "#334155" }}>
                        {selectedFile.size > 1048576
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                          : `${(selectedFile.size / 1024).toFixed(0)} KB`}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                        Uploaded Date
                      </label>
                      <div style={{ fontSize: "13px", color: "#334155" }}>
                        {selectedFile.uploadedAt || "Stored in bucket"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Direct Asset URL
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        readOnly
                        value={selectedFile.url}
                        style={{ flex: 1, padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#f8fafc", color: "#475569" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(selectedFile.url)}
                        style={{ padding: "7px 12px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "500", color: "#0f172a", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <IconCopy />
                        {hasCopiedUrl ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(selectedFile.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      color: "#dc2626",
                      cursor: "pointer",
                    }}
                  >
                    <IconTrash />
                    Delete File
                  </button>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={selectedFile.url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        color: "#334155",
                        textDecoration: "none",
                      }}
                    >
                      <IconExternalLink />
                      Open Link
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveDrawer(null)}
                      style={{
                        padding: "8px 16px",
                        background: "#0f172a",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        color: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
