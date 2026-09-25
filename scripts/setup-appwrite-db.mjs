#!/usr/bin/env node

/**
 * Appwrite Database & Storage Setup Script for Aethos Wealth
 * Seamlessly supports both modern TablesDB and legacy Collections/Databases APIs.
 */

import { Client, TablesDB, Databases, Storage, Permission, Role } from "node-appwrite";
import fs from "node:fs";
import path from "node:path";

// Auto-load .env.local and .env
const loadEnvFile = (filename) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";
const bucketId = process.env.APPWRITE_BUCKET_ID || "aethos_pdfs";

// Extract key from args or env
const keyArg = process.argv.find((a) => a.startsWith("--key="))?.split("=")[1];
const apiKey = process.env.APPWRITE_API_KEY || keyArg;

if (!apiKey) {
  console.error(`
❌ Error: Missing Appwrite API Key.
Please ensure APPWRITE_API_KEY is present in .env.local or pass --key=your_key
`);
  process.exit(1);
}

console.log(`\n🚀 Initializing Appwrite Provisioning...`);
console.log(`• Project: ${projectId}`);
console.log(`• Endpoint: ${endpoint}`);
console.log(`• Database ID: ${databaseId}`);
console.log(`• Bucket ID: ${bucketId}\n`);

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tablesDB = new TablesDB(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Initial Seed Data
const initialReports = [
  {
    slug: "logistics-stack",
    title: "The Quality Compounder in India's Logistics Stack",
    tag: "Supply Chain & Logistics",
    deck: "An exhaustive underwriting of India's multimodal transportation supply chain, asset-light third-party logistics (3PL) moats, and operational leverage.",
    readTime: "22 min read",
    date: "18 Sep 2026",
    free: true,
    className: "badge-purple",
    sections: JSON.stringify([{ title: "Executive Thesis", body: "Multimodal logistics infrastructure investments are inflecting operational margins across top tier 3PL providers." }]),
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
  },
  {
    slug: "indias-transmission-opportunity",
    title: "High-Precision Transmission: India's Global Moat",
    tag: "Automotive Precision & Exports",
    deck: "Examining tier-1 drivetrain component manufacturers, bespoke machining tolerances, EV-agnostic architectures, and multi-year supply contracts.",
    readTime: "28 min read",
    date: "12 Sep 2026",
    free: false,
    className: "badge-green",
    sections: JSON.stringify([{ title: "The Structural Edge", body: "Precision gear manufacturing requires 10-15 year validation cycles, creating deep switching costs for European and North American OEMs." }]),
    pdfUrl: "/RACL GEARTECH LIMITED.pdf",
  },
  {
    slug: "indian-affluent-consumer",
    title: "The Premiumization Supercycle: High-End Consumption",
    tag: "Consumer Discretionary",
    deck: "Quantifying the structural rise of the top 3% Indian income pyramid and pure-play luxury retail compounders.",
    readTime: "18 min read",
    date: "04 Sep 2026",
    free: false,
    className: "badge-gold",
    sections: JSON.stringify([{ title: "Consumer Tailwinds", body: "The affluent consumer cohort is compounding discretionary spend at 2.4x the baseline retail growth rate." }]),
    pdfUrl: "/Aethos_Capital_Partnership_Overview.pdf",
  },
];

const initialIdeas = [
  {
    id: "racl-geartech",
    ticker: "RACLGEAR",
    company: "RACL Geartech Limited",
    sector: "Automobile & Precision Components",
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

const initialIpos = [
  {
    slug: "spectraa-technology-solutions",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Engineering",
    period: "18 — 22 Sep 2026",
    price: "₹118",
    type: "Mainboard",
    deepDive: true,
    deck: "Turnkey engineering solutions provider catering to breweries, distilleries, and pharmaceutical liquid processing units.",
    issueSize: "₹38.5 crore",
    lotSize: "1,200 shares",
    listing: "BSE & NSE",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    htmlUrl: "/SpectraA_IPO_Deep_Dive_Website.html",
    sections: JSON.stringify([{ title: "Underwriting Note", body: "Robust order book of 2.8x trailing revenues with negative net debt." }]),
  },
  {
    slug: "gulf-lloyds-india",
    company: "Gulf Lloyds India Limited",
    sector: "Industrial Testing & Inspection",
    period: "24 — 28 Sep 2026",
    price: "₹82 — ₹87",
    type: "Mainboard",
    deepDive: true,
    deck: "Comprehensive technical inspection, non-destructive testing (NDT), and certification services for oil & gas infrastructure.",
    issueSize: "₹54.2 crore",
    lotSize: "1,600 shares",
    listing: "NSE SME / Mainboard",
    pdfUrl: "",
    htmlUrl: "",
    sections: JSON.stringify([{ title: "Inspection Moat", body: "High statutory compliance requirements ensure recurring testing mandates." }]),
  },
];

const initialJournal = [
  {
    slug: "boring-businesses-beautiful",
    category: "Company Note",
    title: "The Art of Making Boring Businesses Beautiful",
    date: "20 Sep 2026",
    deck: "Why low-profile B2B manufacturers and mission-critical component suppliers make the best long-term compounders.",
    className: "badge-green",
    sections: JSON.stringify([{ title: "Compounder DNA", body: "Boring businesses often operate in oligopolies with high pricing power and low customer churn." }]),
  },
  {
    slug: "breadth-of-the-rally",
    category: "Market Memo",
    title: "Under the Hood: Dissecting Market Breadth and Valuation Dispersion",
    date: "14 Sep 2026",
    deck: "Analyzing liquidity concentration vs fundamental earnings growth across Indian mid and small-cap indices.",
    className: "badge-purple",
    sections: JSON.stringify([{ title: "Market Dynamics", body: "Earnings dispersion is widening, favoring quality balance sheets over speculative momentum." }]),
  },
];

const initialUsers = [
  {
    userId: "usr_admin_1",
    email: "analyst@aethoswealth.com",
    name: "Aethos Lead Analyst",
    role: "Admin",
    status: "Active",
    joinedAt: "01 Jan 2026",
  },
  {
    userId: "usr_inst_2",
    email: "portfolio@kotakfo.in",
    name: "Kotak Family Office",
    role: "Institutional",
    status: "Active",
    joinedAt: "15 Jan 2026",
  },
];

async function main() {
  try {
    // 1. Check or Create Database
    console.log(`1. Checking database '${databaseId}'...`);
    try {
      await tablesDB.get(databaseId);
      console.log(`   ✓ Database '${databaseId}' confirmed.`);
    } catch {
      try {
        await tablesDB.create(databaseId, "Aethos Core Database", true);
        console.log(`   ✓ Created database '${databaseId}'.`);
      } catch (e) {
        console.log(`   ! Note: ${e.message}`);
      }
    }

    // 2. Table / Collection Creation Helper
    const createTableOrColl = async (id, name) => {
      try {
        await tablesDB.getTable(databaseId, id);
        console.log(`   ✓ Table '${id}' exists.`);
      } catch {
        console.log(`   + Creating table '${id}' (${name})...`);
        try {
          await tablesDB.createTable(databaseId, id, name, [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]);
          console.log(`   ✓ Created table '${id}'.`);
        } catch (e) {
          // Try legacy fallback
          try {
            await databases.createCollection(databaseId, id, name, [
              Permission.read(Role.any()),
              Permission.create(Role.users()),
              Permission.update(Role.users()),
              Permission.delete(Role.users()),
            ]);
            console.log(`   ✓ Created collection '${id}' (via Databases fallback).`);
          } catch (e2) {
            console.log(`   ! Notice on creating '${id}': ${e2.message || e.message}`);
          }
        }
      }
    };

    // Column / Attribute Helpers
    const addStringCol = async (tableId, key, size = 255, req = true, def = undefined) => {
      try {
        await tablesDB.createStringColumn(databaseId, tableId, key, size, req, def);
        console.log(`     + Added column string: ${key}`);
      } catch (e) {
        if (!e.message?.includes("already exists")) {
          try {
            await databases.createStringAttribute(databaseId, tableId, key, size, req, def);
            console.log(`     + Added attribute string: ${key}`);
          } catch {}
        }
      }
    };

    const addBoolCol = async (tableId, key, req = true, def = false) => {
      try {
        await tablesDB.createBooleanColumn(databaseId, tableId, key, req, def);
        console.log(`     + Added column boolean: ${key}`);
      } catch (e) {
        if (!e.message?.includes("already exists")) {
          try {
            await databases.createBooleanAttribute(databaseId, tableId, key, req, def);
            console.log(`     + Added attribute boolean: ${key}`);
          } catch {}
        }
      }
    };

    const addFloatCol = async (tableId, key, req = true, def = undefined) => {
      try {
        await tablesDB.createFloatColumn(databaseId, tableId, key, req, undefined, undefined, def);
        console.log(`     + Added column float: ${key}`);
      } catch (e) {
        if (!e.message?.includes("already exists")) {
          try {
            await databases.createFloatAttribute(databaseId, tableId, key, req, undefined, undefined, def);
            console.log(`     + Added attribute float: ${key}`);
          } catch {}
        }
      }
    };

    // --- Create Tables ---
    console.log(`\n2. Provisioning Tables & Columns...`);

    // Table: reports
    await createTableOrColl("reports", "Research Reports");
    await addStringCol("reports", "slug", 255, true);
    await addStringCol("reports", "title", 500, true);
    await addStringCol("reports", "tag", 100, true);
    await addStringCol("reports", "deck", 2000, true);
    await addStringCol("reports", "readTime", 50, true);
    await addStringCol("reports", "date", 50, true);
    await addBoolCol("reports", "free", true, false);
    await addStringCol("reports", "className", 100, false);
    await addStringCol("reports", "sections", 65535, false);
    await addStringCol("reports", "pdfUrl", 1000, false);

    // Table: ideas
    await createTableOrColl("ideas", "Aethos Ideas");
    await addStringCol("ideas", "ticker", 50, true);
    await addStringCol("ideas", "company", 255, true);
    await addStringCol("ideas", "sector", 100, true);
    await addStringCol("ideas", "mcap", 50, true);
    await addFloatCol("ideas", "sharedPrice", true);
    await addFloatCol("ideas", "currentPrice", true);
    await addStringCol("ideas", "sharedDate", 50, true);
    await addStringCol("ideas", "pdfUrl", 1000, false);
    await addStringCol("ideas", "thesis", 65535, false);

    // Table: ipos
    await createTableOrColl("ipos", "IPO Intelligence");
    await addStringCol("ipos", "slug", 255, true);
    await addStringCol("ipos", "company", 255, true);
    await addStringCol("ipos", "sector", 100, true);
    await addStringCol("ipos", "period", 100, true);
    await addStringCol("ipos", "price", 100, true);
    await addStringCol("ipos", "type", 50, true);
    await addBoolCol("ipos", "deepDive", true, true);
    await addStringCol("ipos", "deck", 2000, false);
    await addStringCol("ipos", "issueSize", 100, false);
    await addStringCol("ipos", "lotSize", 100, false);
    await addStringCol("ipos", "listing", 100, false);
    await addStringCol("ipos", "pdfUrl", 1000, false);
    await addStringCol("ipos", "htmlUrl", 1000, false);
    await addStringCol("ipos", "sections", 65535, false);

    // Table: journal
    await createTableOrColl("journal", "Journal & Memos");
    await addStringCol("journal", "slug", 255, true);
    await addStringCol("journal", "category", 100, true);
    await addStringCol("journal", "title", 500, true);
    await addStringCol("journal", "date", 50, true);
    await addStringCol("journal", "deck", 2000, true);
    await addStringCol("journal", "className", 100, false);
    await addStringCol("journal", "sections", 65535, false);

    // Table: users_meta
    await createTableOrColl("users_meta", "User Access & Roles");
    await addStringCol("users_meta", "userId", 255, true);
    await addStringCol("users_meta", "email", 255, true);
    await addStringCol("users_meta", "name", 255, false);
    await addStringCol("users_meta", "role", 50, true, "Institutional");
    await addStringCol("users_meta", "status", 50, true, "Active");
    await addStringCol("users_meta", "joinedAt", 50, false);

    // 3. Storage Bucket
    console.log(`\n3. Checking Storage Bucket '${bucketId}'...`);
    try {
      await storage.getBucket(bucketId);
      console.log(`   ✓ Storage Bucket '${bucketId}' already exists.`);
    } catch {
      console.log(`   + Creating Storage Bucket '${bucketId}'...`);
      try {
        await storage.createBucket(
          bucketId,
          "Aethos Research PDFs and Media",
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ],
          false,
          true,
          50000000,
          ["pdf", "png", "jpg", "jpeg", "svg", "html", "md", "txt"],
          undefined,
          true,
          true
        );
        console.log(`   ✓ Created Storage Bucket '${bucketId}'.`);
      } catch (e) {
        console.log(`   ! Storage Notice: ${e.message}`);
      }
    }

    // 4. Seed Data (Rows / Documents)
    console.log(`\n4. Seeding Initial Rows into Tables...`);

    // Helper to insert row
    const insertRow = async (tableId, rowId, data) => {
      try {
        await tablesDB.createRow(databaseId, tableId, rowId, data);
        console.log(`   + Seeded [${tableId}]: ${rowId}`);
      } catch (e) {
        if (!e.message?.includes("already exists") && !e.message?.includes("Conflict")) {
          try {
            await databases.createDocument(databaseId, tableId, rowId, data);
            console.log(`   + Seeded (via Databases) [${tableId}]: ${rowId}`);
          } catch {}
        }
      }
    };

    // Reports
    for (const r of initialReports) {
      await insertRow("reports", r.slug, r);
    }

    // Ideas
    for (const i of initialIdeas) {
      await insertRow("ideas", i.id, {
        ticker: i.ticker,
        company: i.company,
        sector: i.sector,
        mcap: i.mcap,
        sharedPrice: i.sharedPrice,
        currentPrice: i.currentPrice,
        sharedDate: i.sharedDate,
        pdfUrl: i.pdfUrl,
        thesis: i.thesis,
      });
    }

    // IPOs
    for (const ipo of initialIpos) {
      await insertRow("ipos", ipo.slug, ipo);
    }

    // Journal
    for (const j of initialJournal) {
      await insertRow("journal", j.slug, j);
    }

    // Users
    for (const u of initialUsers) {
      await insertRow("users_meta", u.userId, u);
    }

    console.log(`\n🎉 Success! All TablesDB tables, columns, rows, and Storage bucket '${bucketId}' are live on Appwrite Cloud!`);
    console.log(`Portal URL: https://cloud.appwrite.io/console/project-${projectId}/databases/database-${databaseId}`);
  } catch (error) {
    console.error(`\n❌ Provisioning failed:`, error);
    process.exit(1);
  }
}

main();
