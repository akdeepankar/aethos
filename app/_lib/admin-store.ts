"use client";

import { useEffect, useState, useCallback } from "react";
import { storage } from "./appwrite";
import { reports as initialReports, ipos as initialIpos, posts as initialPosts, Report, Ipo, Post } from "./content";

export interface StockIdea {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  mcap: string;
  sharedPrice: number;
  currentPrice: number;
  sharedDate: string;
  pdfUrl?: string;
  thesis?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Institutional" | "Pro" | "Standard";
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
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

const initialIdeas: StockIdea[] = [
  {
    id: "racl-geartech",
    ticker: "RACLGEAR",
    company: "RACL Geartech Limited",
    sector: "Automobile and Auto Components",
    mcap: "2030cr",
    sharedPrice: 1340,
    currentPrice: 1895,
    sharedDate: "14 Jan 2026",
    pdfUrl: "/RACL GEARTECH LIMITED.pdf",
    thesis: "Niche transmission & high-precision gear manufacturer with multi-year tier-1 export contracts and high ROCE reinvestment.",
  },
  {
    id: "spectra-a-tech",
    ticker: "SPECTRA",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Automation & Engineering",
    mcap: "1450cr",
    sharedPrice: 420,
    currentPrice: 588,
    sharedDate: "02 Feb 2026",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    thesis: "Process engineering & automation moat for brewery, distillery, and pharma turnkey plants with 37.6% ROCE.",
  },
];

const initialAdminUsers: AdminUser[] = [
  {
    id: "6ab3cbf21f09a2d6ecb4",
    name: "Ak Deepankar",
    email: "akdeepaknyc@gmail.com",
    role: "Admin",
    status: "Active",
    joinedDate: "23 Sept 2026",
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
  REPORTS: "aethos_admin_reports_v3",
  IDEAS: "aethos_admin_ideas_v3",
  IPOS: "aethos_admin_ipos_v3",
  JOURNAL: "aethos_admin_journal_v3",
  USERS: "aethos_admin_users_v3",
  MEDIA: "aethos_admin_media_v3",
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
async function persistToAppwrite(table: string, id: string, data: Record<string, unknown>) {
  try {
    await fetch("/api/appwrite/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, data }),
    });
  } catch (err) {
    console.warn(`Background sync to Appwrite table [${table}] failed:`, err);
  }
}

async function deleteFromAppwrite(table: string, id: string) {
  try {
    await fetch(`/api/appwrite/records?table=${table}&id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn(`Background delete from Appwrite table [${table}] failed:`, err);
  }
}

export function useAdminStore() {
  const [reports, setReports] = useState<Report[]>(() => getStoredData(STORAGE_KEYS.REPORTS, initialReports));
  const [ideas, setIdeas] = useState<StockIdea[]>(() => getStoredData(STORAGE_KEYS.IDEAS, initialIdeas));
  const [ipos, setIpos] = useState<Ipo[]>(() => getStoredData(STORAGE_KEYS.IPOS, initialIpos));
  const [journal, setJournal] = useState<Post[]>(() => getStoredData(STORAGE_KEYS.JOURNAL, initialPosts));
  const [users, setUsers] = useState<AdminUser[]>(() => getStoredData(STORAGE_KEYS.USERS, initialAdminUsers));
  const [media, setMedia] = useState<StoredMediaFile[]>(() => getStoredData(STORAGE_KEYS.MEDIA, initialMediaFiles));
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
        if (Array.isArray(d.reports) && d.reports.length > 0) {
          const parsedReports: Report[] = d.reports.map((r: any) => ({
            slug: r.slug || r.$id,
            title: r.title,
            tag: r.tag,
            tabCategory: r.tabCategory || (r.tag?.toLowerCase().includes("sector") ? "sectoral" : r.tag?.toLowerCase().includes("themat") ? "thematic" : "company"),
            deck: r.deck,
            readTime: r.readTime,
            date: r.date,
            free: Boolean(r.free),
            className: r.className || "badge-neutral",
            sections: typeof r.sections === "string" ? JSON.parse(r.sections || "[]") : (r.sections || []),
            pdfUrl: r.pdfUrl || undefined,
            imageUrl: r.imageUrl || undefined,
            researchType: r.researchType || undefined,
            sector: r.sector || undefined,
            company: r.company || undefined,
            isNew: Boolean(r.isNew),
            isSaved: Boolean(r.isSaved),
            isUnread: r.isUnread !== undefined ? Boolean(r.isUnread) : true,
          }));
          setReports(parsedReports);
          setStoredData(STORAGE_KEYS.REPORTS, parsedReports);
        }

        // Ideas
        if (Array.isArray(d.ideas) && d.ideas.length > 0) {
          const parsedIdeas: StockIdea[] = d.ideas.map((i: any) => ({
            id: i.$id || i.ticker.toLowerCase(),
            ticker: i.ticker,
            company: i.company,
            sector: i.sector,
            mcap: i.mcap,
            sharedPrice: Number(i.sharedPrice),
            currentPrice: Number(i.currentPrice),
            sharedDate: i.sharedDate,
            pdfUrl: i.pdfUrl || undefined,
            thesis: i.thesis || undefined,
          }));
          setIdeas(parsedIdeas);
          setStoredData(STORAGE_KEYS.IDEAS, parsedIdeas);
        }

        // IPOs
        if (Array.isArray(d.ipos) && d.ipos.length > 0) {
          const parsedIpos: Ipo[] = d.ipos.map((ipo: any) => ({
            slug: ipo.slug || ipo.$id,
            company: ipo.company,
            sector: ipo.sector,
            period: ipo.period,
            price: ipo.price,
            type: ipo.type,
            deepDive: Boolean(ipo.deepDive),
            deck: ipo.deck,
            issueSize: ipo.issueSize,
            lotSize: ipo.lotSize,
            listing: ipo.listing,
            pdfUrl: ipo.pdfUrl,
            htmlUrl: ipo.htmlUrl,
            sections: typeof ipo.sections === "string" ? JSON.parse(ipo.sections || "[]") : (ipo.sections || []),
          }));
          setIpos(parsedIpos);
          setStoredData(STORAGE_KEYS.IPOS, parsedIpos);
        }

        // Journal
        if (Array.isArray(d.journal) && d.journal.length > 0) {
          const parsedJournal: Post[] = d.journal.map((j: any) => ({
            slug: j.slug || j.$id,
            category: j.category,
            title: j.title,
            date: j.date,
            deck: j.deck,
            className: j.className,
            sections: typeof j.sections === "string" ? JSON.parse(j.sections || "[]") : (j.sections || []),
          }));
          setJournal(parsedJournal);
          setStoredData(STORAGE_KEYS.JOURNAL, parsedJournal);
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
  const updateReports = (newReports: Report[], itemToPersist?: { action: "save" | "delete"; report: Report }) => {
    setReports(newReports);
    setStoredData(STORAGE_KEYS.REPORTS, newReports);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        persistToAppwrite("reports", itemToPersist.report.slug, {
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
          pdfUrl: itemToPersist.report.pdfUrl || "",
          imageUrl: itemToPersist.report.imageUrl || "",
          researchType: itemToPersist.report.researchType || "",
          sector: itemToPersist.report.sector || "",
          company: itemToPersist.report.company || "",
          isNew: Boolean(itemToPersist.report.isNew),
          isSaved: Boolean(itemToPersist.report.isSaved),
          isUnread: itemToPersist.report.isUnread !== undefined ? Boolean(itemToPersist.report.isUnread) : true,
        });
      } else if (itemToPersist.action === "delete") {
        deleteFromAppwrite("reports", itemToPersist.report.slug);
      }
    }
  };

  const updateIdeas = (newIdeas: StockIdea[], itemToPersist?: { action: "save" | "delete"; idea: StockIdea }) => {
    setIdeas(newIdeas);
    setStoredData(STORAGE_KEYS.IDEAS, newIdeas);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        persistToAppwrite("ideas", itemToPersist.idea.id, {
          ticker: itemToPersist.idea.ticker,
          company: itemToPersist.idea.company,
          sector: itemToPersist.idea.sector,
          mcap: itemToPersist.idea.mcap,
          sharedPrice: itemToPersist.idea.sharedPrice,
          currentPrice: itemToPersist.idea.currentPrice,
          sharedDate: itemToPersist.idea.sharedDate,
          pdfUrl: itemToPersist.idea.pdfUrl || "",
          thesis: itemToPersist.idea.thesis || "",
        });
      } else if (itemToPersist.action === "delete") {
        deleteFromAppwrite("ideas", itemToPersist.idea.id);
      }
    }
  };

  const updateIpos = (newIpos: Ipo[], itemToPersist?: { action: "save" | "delete"; ipo: Ipo }) => {
    setIpos(newIpos);
    setStoredData(STORAGE_KEYS.IPOS, newIpos);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        persistToAppwrite("ipos", itemToPersist.ipo.slug, {
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
          htmlUrl: itemToPersist.ipo.htmlUrl || "",
          sections: JSON.stringify(itemToPersist.ipo.sections || []),
        });
      } else if (itemToPersist.action === "delete") {
        deleteFromAppwrite("ipos", itemToPersist.ipo.slug);
      }
    }
  };

  const updateJournal = (newJournal: Post[], itemToPersist?: { action: "save" | "delete"; post: Post }) => {
    setJournal(newJournal);
    setStoredData(STORAGE_KEYS.JOURNAL, newJournal);

    if (itemToPersist) {
      if (itemToPersist.action === "save") {
        persistToAppwrite("journal", itemToPersist.post.slug, {
          slug: itemToPersist.post.slug,
          category: itemToPersist.post.category,
          title: itemToPersist.post.title,
          date: itemToPersist.post.date,
          deck: itemToPersist.post.deck,
          className: itemToPersist.post.className || "badge-green",
          sections: JSON.stringify(itemToPersist.post.sections || []),
        });
      } else if (itemToPersist.action === "delete") {
        deleteFromAppwrite("journal", itemToPersist.post.slug);
      }
    }
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
    const fileId = "file_" + Math.random().toString(36).substring(2, 9);
    let targetUrl = `/uploads/${file.name}`;

    try {
      const response = await storage.createFile({
        bucketId: "aethos_pdfs",
        fileId: fileId,
        file: file,
      });
      const fileViewUrl = storage.getFileView({
        bucketId: "aethos_pdfs",
        fileId: response.$id,
      });
      targetUrl = fileViewUrl.toString();
    } catch {
      targetUrl = URL.createObjectURL(file);
    }

    const newMediaFile: StoredMediaFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
      url: targetUrl,
      uploadedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      category,
    };

    const updated = [newMediaFile, ...media];
    updateMedia(updated);
    return newMediaFile;
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
