"use client";

import { useEffect, useState, useCallback } from "react";
import { storage } from "./appwrite";
import { reports as initialReports, ipos as initialIpos, posts as initialPosts, Report, Ipo, Post } from "./content";

export interface StockIdea {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  published?: string;
  mcap: string;
  sharedPrice?: number;
  refPrice?: number;
  currentPrice: number;
  latestPrice?: number;
  sharedDate?: string;
  returnPct?: string;
  coverage?: "Coverage ongoing" | "Under review" | "Archived" | string;
  pdfUrl?: string;
  htmlUrl?: string;
  htmlContent?: string;
  thesis?: string;
  studying?: string;
  challenge?: string;
  watchNext?: string;
  slug?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Institutional" | "Pro" | "Standard";
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
  lastActive?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  provider: string;
}

export interface StoredMediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  category: "IPO" | "Idea" | "Report" | "General";
}

const initialIdeas: StockIdea[] = [];

const initialAdminUsers: AdminUser[] = [
  {
    id: "6ab3cbf21f09a2d6ecb4",
    name: "Ak Deepankar",
    email: "akdeepaknyc@gmail.com",
    role: "Admin",
    status: "Active",
    joinedDate: "23 Sept 2026",
    lastActive: "Today, 12:15 PM",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocL81P6s...=s96-c",
    emailVerified: true,
    provider: "Google OAuth2",
  },
  {
    id: "6ab3cdb2ef27da0f2f9f",
    name: "Sibesh Agrawal",
    email: "sibeshagrawal5@gmail.com",
    role: "Institutional",
    status: "Active",
    joinedDate: "23 Sept 2026",
    lastActive: "Yesterday",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocK...",
    emailVerified: true,
    provider: "Google OAuth2",
  },
];

const initialMediaFiles: StoredMediaFile[] = [
  {
    id: "media-1",
    name: "RACL GEARTECH LIMITED.pdf",
    size: 182272,
    type: "application/pdf",
    url: "/RACL GEARTECH LIMITED.pdf",
    uploadedAt: "21 Sep 2026",
    category: "Idea",
  },
  {
    id: "media-2",
    name: "SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    size: 637340,
    type: "application/pdf",
    url: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    uploadedAt: "21 Sep 2026",
    category: "IPO",
  },
  {
    id: "media-3",
    name: "SpectraA_IPO_Deep_Dive_Website.html",
    size: 798695,
    type: "text/html",
    url: "/SpectraA_IPO_Deep_Dive_Website.html",
    uploadedAt: "21 Sep 2026",
    category: "IPO",
  },
];

const STORAGE_KEYS = {
  REPORTS: "aethos_admin_reports_v4",
  IDEAS: "aethos_admin_ideas_v4",
  IPOS: "aethos_admin_ipos_v3",
  JOURNAL: "aethos_admin_journal_v3",
  USERS: "aethos_admin_users_v3",
  MEDIA: "aethos_admin_media_v4",
};

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

// Background Appwrite Persister
async function persistToAppwrite(table: string, id: string, data: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/appwrite/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, data }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.success === false) {
      const errMsg = json?.error || res.statusText || "Failed to persist to Appwrite";
      console.warn(`Appwrite sync to table [${table}] failed:`, errMsg);
      return { success: false, error: errMsg };
    }
    return { success: true };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`Background sync to Appwrite table [${table}] failed:`, errMsg);
    return { success: false, error: errMsg };
  }
}

async function deleteFromAppwrite(
  table: string,
  id: string,
  extraParams?: { htmlUrl?: string; pdfUrl?: string; slug?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const params = new URLSearchParams({
      table,
      id,
      ...(extraParams?.htmlUrl ? { htmlUrl: extraParams.htmlUrl } : {}),
      ...(extraParams?.pdfUrl ? { pdfUrl: extraParams.pdfUrl } : {}),
      ...(extraParams?.slug ? { slug: extraParams.slug } : {}),
    });
    const res = await fetch(`/api/appwrite/records?${params.toString()}`, {
      method: "DELETE",
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.success === false) {
      const errMsg = json?.error || res.statusText || "Failed to delete from Appwrite";
      console.warn(`Appwrite delete from table [${table}] failed:`, errMsg);
      return { success: false, error: errMsg };
    }
    return { success: true };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`Background delete from Appwrite table [${table}] failed:`, errMsg);
    return { success: false, error: errMsg };
  }
}

export function useAdminStore() {
  const [reports, setReports] = useState<Report[]>(() => getStoredData(STORAGE_KEYS.REPORTS, []));
  const [ideas, setIdeas] = useState<StockIdea[]>(() => getStoredData(STORAGE_KEYS.IDEAS, []));
  const [ipos, setIpos] = useState<Ipo[]>(() => getStoredData(STORAGE_KEYS.IPOS, initialIpos));
  const [journal, setJournal] = useState<Post[]>(() => getStoredData(STORAGE_KEYS.JOURNAL, initialPosts));
  const [users, setUsers] = useState<AdminUser[]>(() => getStoredData(STORAGE_KEYS.USERS, initialAdminUsers));
  const [media, setMedia] = useState<StoredMediaFile[]>(() => getStoredData(STORAGE_KEYS.MEDIA, []));
  const [isSynced, setIsSynced] = useState(false);

  // Sync from Appwrite DB on mount
  const syncFromAppwrite = useCallback(async () => {
    try {
      // 1. Fetch DB records (reports, ideas, ipos, journal)
      const res = await fetch("/api/appwrite/records");
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;

        // Reports
        if (Array.isArray(d.reports)) {
          const seen = new Set<string>();
          const parsedReports: Report[] = [];
          for (const r of d.reports) {
            const s = (r.slug || r.$id || "").trim();
            if (s && !seen.has(s.toLowerCase())) {
              seen.add(s.toLowerCase());
              parsedReports.push({
                slug: s,
                title: r.title,
                tag: r.tag,
                tabCategory: r.tabCategory || (r.tag?.toLowerCase().includes("sector") ? "sectoral" : r.tag?.toLowerCase().includes("themat") ? "thematic" : "company"),
                deck: r.deck,
                readTime: r.readTime,
                date: r.date,
                meta: r.meta || r.date || "Published",
                free: Boolean(r.free),
                className: r.className || "badge-neutral",
                sections: typeof r.sections === "string" ? JSON.parse(r.sections || "[]") : (r.sections || []),
                htmlUrl: r.htmlUrl || (s ? `/${s}.html` : undefined),
                htmlContent: r.htmlContent || undefined,
                pdfUrl: r.pdfUrl || undefined,
                imageUrl: r.imageUrl || undefined,
                researchType: r.researchType || undefined,
                sector: r.sector || undefined,
                company: r.company || undefined,
                isNew: Boolean(r.isNew),
              });
            }
          }
          setReports(parsedReports);
          setStoredData(STORAGE_KEYS.REPORTS, parsedReports);
        }

        // Ideas
        if (Array.isArray(d.ideas)) {
          const seen = new Set<string>();
          const parsedIdeas: StockIdea[] = [];
          for (const i of d.ideas) {
            const id = (i.id || i.$id || i.ticker || "").toLowerCase().trim();
            if (id && !seen.has(id)) {
              seen.add(id);
              const ideaSlug = (i.slug && !i.slug.startsWith("http") ? i.slug : id || (i.ticker ? i.ticker.toLowerCase() : "")).toLowerCase().trim();
              const ideaHtmlUrl = i.htmlUrl || (ideaSlug ? `/${ideaSlug}.html` : `/${id}.html`);
              const sPrice = Number(i.sharedPrice || i.refPrice || 0);
              const cPrice = Number(i.currentPrice || i.latestPrice || 0);
              const autoReturn = sPrice > 0 ? `${((cPrice - sPrice) / sPrice * 100) >= 0 ? "+" : ""}${(((cPrice - sPrice) / sPrice) * 100).toFixed(1)}%` : undefined;

              parsedIdeas.push({
                id,
                slug: ideaSlug || id,
                ticker: i.ticker || "",
                company: i.company || "",
                sector: i.sector || "Auto components",
                mcap: i.mcap || "2,000",
                published: i.published || i.sharedDate || "Today",
                sharedPrice: sPrice,
                refPrice: sPrice,
                currentPrice: cPrice,
                latestPrice: cPrice,
                sharedDate: i.sharedDate || i.published || "Today",
                returnPct: i.returnPct || autoReturn,
                coverage: i.coverage || "Coverage ongoing",
                pdfUrl: i.pdfUrl || undefined,
                htmlUrl: ideaHtmlUrl,
                htmlContent: i.htmlContent || undefined,
                thesis: i.thesis || undefined,
                studying: i.studying || undefined,
                challenge: i.challenge || undefined,
                watchNext: i.watchNext || undefined,
              });
            }
          }
          setIdeas(parsedIdeas);
          setStoredData(STORAGE_KEYS.IDEAS, parsedIdeas);
        }

        // IPOs
        if (Array.isArray(d.ipos) && d.ipos.length > 0) {
          const seen = new Set<string>();
          const parsedIpos: Ipo[] = [];
          for (const ipo of d.ipos) {
            const s = (ipo.slug || ipo.$id || "").trim();
            if (s && !seen.has(s.toLowerCase())) {
              seen.add(s.toLowerCase());
              const hasReportContent = Boolean(ipo.htmlContent || ipo.pdfUrl || (ipo.deepDive && ipo.htmlUrl && !ipo.htmlUrl.startsWith("/")));
              parsedIpos.push({
                slug: s,
                company: ipo.company,
                sector: ipo.sector,
                period: ipo.period,
                price: ipo.price,
                type: ipo.type,
                deepDive: hasReportContent,
                hasReport: hasReportContent,
                deck: ipo.deck,
                issueSize: ipo.issueSize,
                lotSize: ipo.lotSize,
                listing: ipo.listing,
                status: ipo.status || "active",
                externalId: ipo.externalId,
                isSme: Boolean(ipo.isSme ?? (ipo.type === "SME")),
                pdfUrl: ipo.pdfUrl,
                htmlUrl: ipo.htmlUrl || `/${s}.html`,
                htmlContent: ipo.htmlContent || undefined,
                sections: typeof ipo.sections === "string" ? JSON.parse(ipo.sections || "[]") : (ipo.sections || []),
              });
            }
          }
          setIpos(parsedIpos);
          setStoredData(STORAGE_KEYS.IPOS, parsedIpos);
        }

        // Journal
        if (Array.isArray(d.journal) && d.journal.length > 0) {
          const seen = new Set<string>();
          const parsedJournal: Post[] = [];
          for (const j of d.journal) {
            const s = (j.slug || j.$id || "").trim();
            if (s && !seen.has(s.toLowerCase())) {
              seen.add(s.toLowerCase());
              parsedJournal.push({
                slug: s,
                category: j.category,
                title: j.title,
                date: j.date,
                deck: j.deck,
                className: j.className,
                sections: typeof j.sections === "string" ? JSON.parse(j.sections || "[]") : (j.sections || []),
              });
            }
          }
          setJournal(parsedJournal);
          setStoredData(STORAGE_KEYS.JOURNAL, parsedJournal);
        }

        // Media Files from Appwrite Storage
        if (Array.isArray(d.media)) {
          setMedia(d.media);
          setStoredData(STORAGE_KEYS.MEDIA, d.media);
        }
      }

      // 2. Fetch real registered Appwrite Auth users
      try {
        const userRes = await fetch("/api/appwrite/users");
        const userJson = await userRes.json();
        if (userJson.success && Array.isArray(userJson.users) && userJson.users.length > 0) {
          setUsers(userJson.users);
          setStoredData(STORAGE_KEYS.USERS, userJson.users);
        }
      } catch (uErr) {
        console.warn("Could not fetch real users from Appwrite Auth:", uErr);
      }

      setIsSynced(true);
    } catch (err) {
      console.warn("Failed to sync store from Appwrite DB:", err);
    }
  }, []);

  useEffect(() => {
    syncFromAppwrite();
  }, [syncFromAppwrite]);

  // Reactive updates + Appwrite persistence
  const updateReports = async (newReports: Report[], itemToPersist?: { action: "save" | "delete"; report: Report }): Promise<{ success: boolean; error?: string }> => {
    setReports(newReports);
    setStoredData(STORAGE_KEYS.REPORTS, newReports);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        return await persistToAppwrite("reports", itemToPersist.report.slug, {
          slug: itemToPersist.report.slug,
          title: itemToPersist.report.title,
          tag: itemToPersist.report.tag,
          tabCategory: itemToPersist.report.tabCategory || "company",
          deck: itemToPersist.report.deck,
          readTime: itemToPersist.report.readTime,
          date: itemToPersist.report.date,
          free: Boolean(itemToPersist.report.free),
          className: itemToPersist.report.className || "badge-neutral",
          sections: JSON.stringify(itemToPersist.report.sections || []),
          htmlUrl: itemToPersist.report.htmlUrl || (itemToPersist.report.slug ? `/${itemToPersist.report.slug}.html` : ""),
          htmlContent: itemToPersist.report.htmlContent || "",
          pdfUrl: itemToPersist.report.pdfUrl || "",
          imageUrl: itemToPersist.report.imageUrl || "",
          researchType: itemToPersist.report.researchType || "",
          sector: itemToPersist.report.sector || "",
          company: itemToPersist.report.company || "",
          isNew: Boolean(itemToPersist.report.isNew),
        });
      } else if (itemToPersist.action === "delete") {
        const report = itemToPersist.report;
        const htmlFileId = report.htmlUrl?.match(/files\/([^/?]+)/)?.[1];
        const pdfFileId = report.pdfUrl?.match(/files\/([^/?]+)/)?.[1];

        if (htmlFileId) {
          fetch(`/api/appwrite/media?id=${encodeURIComponent(htmlFileId)}`, { method: "DELETE" }).catch(() => {});
        }
        if (pdfFileId) {
          fetch(`/api/appwrite/media?id=${encodeURIComponent(pdfFileId)}`, { method: "DELETE" }).catch(() => {});
        }

        setMedia((prevMedia) =>
          prevMedia.filter(
            (m) =>
              m.id !== htmlFileId &&
              m.id !== pdfFileId &&
              m.name !== `${report.slug}.html`
          )
        );

        return await deleteFromAppwrite("reports", itemToPersist.report.slug, {
          htmlUrl: itemToPersist.report.htmlUrl,
          pdfUrl: itemToPersist.report.pdfUrl,
          slug: itemToPersist.report.slug,
        });
      }
    }
    return { success: true };
  };

  const updateIdeas = async (newIdeas: StockIdea[], itemToPersist?: { action: "save" | "delete"; idea: StockIdea }): Promise<{ success: boolean; error?: string }> => {
    const prevIdeas = ideas;
    setIdeas(newIdeas);
    setStoredData(STORAGE_KEYS.IDEAS, newIdeas);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        const res = await persistToAppwrite("ideas", itemToPersist.idea.id, {
          slug: itemToPersist.idea.slug || itemToPersist.idea.id,
          ticker: itemToPersist.idea.ticker,
          company: itemToPersist.idea.company,
          sector: itemToPersist.idea.sector,
          mcap: itemToPersist.idea.mcap,
          sharedDate: itemToPersist.idea.sharedDate || itemToPersist.idea.published || "",
          sharedPrice: itemToPersist.idea.sharedPrice || itemToPersist.idea.refPrice || 0,
          currentPrice: itemToPersist.idea.currentPrice || itemToPersist.idea.latestPrice || 0,
          pdfUrl: itemToPersist.idea.pdfUrl || "",
          htmlUrl: itemToPersist.idea.htmlUrl || (itemToPersist.idea.slug ? `/${itemToPersist.idea.slug}.html` : (itemToPersist.idea.id ? `/${itemToPersist.idea.id}.html` : "")),
          htmlContent: itemToPersist.idea.htmlContent || "",
          thesis: itemToPersist.idea.thesis || itemToPersist.idea.studying || "",
        });
        if (!res.success) {
          setIdeas(prevIdeas);
          setStoredData(STORAGE_KEYS.IDEAS, prevIdeas);
        }
        return res;
      } else if (itemToPersist.action === "delete") {
        const idea = itemToPersist.idea;
        const htmlFileId = idea.htmlUrl?.match(/files\/([^/?]+)/)?.[1];
        const pdfFileId = idea.pdfUrl?.match(/files\/([^/?]+)/)?.[1];

        // Also delete from media endpoint directly if file IDs exist
        if (htmlFileId) {
          fetch(`/api/appwrite/media?id=${encodeURIComponent(htmlFileId)}`, { method: "DELETE" }).catch(() => {});
        }
        if (pdfFileId) {
          fetch(`/api/appwrite/media?id=${encodeURIComponent(pdfFileId)}`, { method: "DELETE" }).catch(() => {});
        }

        // Remove from local media state
        setMedia((prevMedia) =>
          prevMedia.filter(
            (m) =>
              m.id !== htmlFileId &&
              m.id !== pdfFileId &&
              m.name !== `${idea.id}.html` &&
              m.name !== `${idea.slug}.html`
          )
        );

        return await deleteFromAppwrite("ideas", itemToPersist.idea.id, {
          htmlUrl: itemToPersist.idea.htmlUrl,
          pdfUrl: itemToPersist.idea.pdfUrl,
          slug: itemToPersist.idea.slug,
        });
      }
    }
    return { success: true };
  };

  const updateIpos = async (newIpos: Ipo[], itemToPersist?: { action: "save" | "delete" | "sync"; ipo?: Ipo }): Promise<{ success: boolean; error?: string }> => {
    setIpos(newIpos);
    setStoredData(STORAGE_KEYS.IPOS, newIpos);

    if (itemToPersist) {
      if (itemToPersist.action === "save" && itemToPersist.ipo) {
        return await persistToAppwrite("ipos", itemToPersist.ipo.slug, {
          slug: itemToPersist.ipo.slug,
          company: itemToPersist.ipo.company,
          sector: itemToPersist.ipo.sector,
          period: itemToPersist.ipo.period,
          price: itemToPersist.ipo.price,
          type: itemToPersist.ipo.type,
          deepDive: Boolean(itemToPersist.ipo.deepDive),
          deck: itemToPersist.ipo.deck || "",
          issueSize: itemToPersist.ipo.issueSize || "",
          lotSize: itemToPersist.ipo.lotSize || "",
          listing: itemToPersist.ipo.listing || "",
          pdfUrl: itemToPersist.ipo.pdfUrl || "",
          htmlUrl: itemToPersist.ipo.htmlUrl || (itemToPersist.ipo.slug ? `/${itemToPersist.ipo.slug}.html` : ""),
          htmlContent: itemToPersist.ipo.htmlContent || "",
          sections: JSON.stringify(itemToPersist.ipo.sections || []),
        });
      } else if (itemToPersist.action === "sync") {
        let hasErrors = false;
        for (const item of newIpos) {
          const res = await persistToAppwrite("ipos", item.slug, {
            slug: item.slug,
            company: item.company,
            sector: item.sector,
            period: item.period,
            price: item.price,
            type: item.type,
            deepDive: Boolean(item.deepDive),
            deck: item.deck || "",
            issueSize: item.issueSize || "",
            lotSize: item.lotSize || "",
            listing: item.listing || "",
            pdfUrl: item.pdfUrl || "",
            htmlUrl: item.htmlUrl || (item.slug ? `/${item.slug}.html` : ""),
            htmlContent: item.htmlContent || "",
            sections: JSON.stringify(item.sections || []),
          });
          if (!res.success) hasErrors = true;
        }
        return { success: !hasErrors };
      } else if (itemToPersist.action === "delete" && itemToPersist.ipo) {
        return await deleteFromAppwrite("ipos", itemToPersist.ipo.slug);
      }
    }
    return { success: true };
  };

  const updateJournal = async (newJournal: Post[], itemToPersist?: { action: "save" | "delete"; post: Post }): Promise<{ success: boolean; error?: string }> => {
    setJournal(newJournal);
    setStoredData(STORAGE_KEYS.JOURNAL, newJournal);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        return await persistToAppwrite("journal", itemToPersist.post.slug, {
          slug: itemToPersist.post.slug,
          category: itemToPersist.post.category,
          title: itemToPersist.post.title,
          date: itemToPersist.post.date,
          deck: itemToPersist.post.deck,
          className: itemToPersist.post.className || "badge-green",
          sections: JSON.stringify(itemToPersist.post.sections || []),
        });
      } else if (itemToPersist.action === "delete") {
        return await deleteFromAppwrite("journal", itemToPersist.post.slug);
      }
    }
    return { success: true };
  };

  const updateUsers = async (newUsers: AdminUser[], itemToPersist?: { action: "save" | "delete"; user: AdminUser }) => {
    setUsers(newUsers);
    setStoredData(STORAGE_KEYS.USERS, newUsers);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        const isNew = itemToPersist.user.id.startsWith("usr_new_") || itemToPersist.user.id.length < 10;
        if (isNew) {
          try {
            const createRes = await fetch("/api/appwrite/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: itemToPersist.user.email,
                name: itemToPersist.user.name,
                role: itemToPersist.user.role,
              }),
            });
            const created = await createRes.json();
            if (created.success && created.user) {
              const replaced = newUsers.map((u) => (u.id === itemToPersist.user.id ? created.user : u));
              setUsers(replaced);
              setStoredData(STORAGE_KEYS.USERS, replaced);
            }
          } catch (e) {
            console.warn("Failed creating user in Appwrite Auth:", e);
          }
        } else {
          try {
            await fetch("/api/appwrite/users", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: itemToPersist.user.id,
                name: itemToPersist.user.name,
                role: itemToPersist.user.role,
                status: itemToPersist.user.status,
              }),
            });
          } catch (e) {
            console.warn("Failed updating user in Appwrite Auth:", e);
          }
        }
      } else if (itemToPersist.action === "delete") {
        try {
          await fetch(`/api/appwrite/users?id=${encodeURIComponent(itemToPersist.user.id)}`, {
            method: "DELETE",
          });
        } catch (e) {
          console.warn("Failed deleting user from Appwrite Auth:", e);
        }
      }
    }
  };

  const updateMedia = (newMedia: StoredMediaFile[]) => {
    setMedia(newMedia);
    setStoredData(STORAGE_KEYS.MEDIA, newMedia);
  };

  // Upload file to Appwrite Storage Bucket
  const uploadPdfFile = async (file: File, category: StoredMediaFile["category"] = "General"): Promise<StoredMediaFile> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/appwrite/media", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.file) {
        const updated = [json.file, ...media.filter((m) => m.id !== json.file.id)];
        updateMedia(updated);
        return json.file;
      }
    } catch (err) {
      console.warn("Server-side Appwrite upload failed:", err);
    }

    const fileId = "file_" + Math.random().toString(36).substring(2, 9);
    const fallbackFile: StoredMediaFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      category,
    };
    const updated = [fallbackFile, ...media];
    updateMedia(updated);
    return fallbackFile;
  };

  const resetToDefaults = () => {
    updateReports(initialReports);
    updateIdeas(initialIdeas);
    updateIpos(initialIpos);
    updateJournal(initialPosts);
    updateUsers(initialAdminUsers);
    setStoredData(STORAGE_KEYS.MEDIA, initialMediaFiles);
    setMedia(initialMediaFiles);
  };

  return {
    reports,
    ideas,
    ipos,
    journal,
    users,
    media,
    isSynced,
    syncFromAppwrite,
    updateReports,
    updateIdeas,
    updateIpos,
    updateJournal,
    updateUsers,
    updateMedia,
    uploadPdfFile,
    resetToDefaults,
  };
}
