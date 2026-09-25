import { NextRequest, NextResponse } from "next/server";
import { Client, TablesDB, Databases, Storage, Permission, Role } from "node-appwrite";
import { reports, ipos, posts } from "../../../_lib/content";

const initialIdeas = [
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

const initialUsers = [
  {
    userId: "usr_admin_1",
    name: "Aethos Lead Analyst",
    email: "analyst@aethoswealth.com",
    role: "Admin",
    status: "Active",
    joinedAt: "01 Jan 2026",
  },
  {
    userId: "usr_inst_2",
    name: "Kotak Family Office",
    email: "portfolio@kotakfo.in",
    role: "Institutional",
    status: "Active",
    joinedAt: "15 Jan 2026",
  },
  {
    userId: "usr_pro_3",
    name: "Deepankar Sharma",
    email: "deepankar@aethos.io",
    role: "Admin",
    status: "Active",
    joinedAt: "12 Jul 2026",
  },
];

export async function POST(req: NextRequest) {
  const logs: string[] = [];
  const addLog = (msg: string) => {
    logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  try {
    const body = await req.json();
    const apiKey = body.apiKey || process.env.APPWRITE_API_KEY;
    const endpoint = body.endpoint || process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const projectId = body.projectId || process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
    const databaseId = body.databaseId || "aethos_db";
    const bucketId = body.bucketId || "aethos_pdfs";

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Appwrite API Key. Please provide an API key in .env.local or the input field.",
          logs,
        },
        { status: 400 }
      );
    }

    addLog(`Initializing Server Client for Project: ${projectId} at ${endpoint}`);
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const tablesDB = new TablesDB(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    // 1. Create or Check Database
    addLog(`Checking database '${databaseId}'...`);
    try {
      await tablesDB.get(databaseId);
      addLog(`✓ Database '${databaseId}' confirmed.`);
    } catch {
      try {
        await tablesDB.create(databaseId, "Aethos Core Database", true);
        addLog(`✓ Created database '${databaseId}'.`);
      } catch (e: unknown) {
        addLog(`Database notice: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 2. Helper to safely create tables
    const getOrCreateTable = async (tableId: string, tableName: string) => {
      try {
        await tablesDB.getTable(databaseId, tableId);
        addLog(`✓ Table '${tableId}' already exists.`);
      } catch {
        addLog(`Creating table '${tableId}' (${tableName})...`);
        try {
          await tablesDB.createTable(
            databaseId,
            tableId,
            tableName,
            [
              Permission.read(Role.any()),
              Permission.create(Role.users()),
              Permission.update(Role.users()),
              Permission.delete(Role.users()),
            ],
            false,
            true
          );
          addLog(`✓ Created table '${tableId}'.`);
        } catch (e: unknown) {
          try {
            await databases.createCollection(
              databaseId,
              tableId,
              tableName,
              [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
              ],
              false,
              true
            );
            addLog(`✓ Created collection '${tableId}' (via Databases fallback).`);
          } catch (e2: unknown) {
            addLog(`  ! Table/Collection '${tableId}' notice: ${e2 instanceof Error ? e2.message : String(e2)}`);
          }
        }
      }
    };

    // 3. Helper to safely add columns
    const addStringCol = async (tableId: string, key: string, size: number, required: boolean, defaultVal?: string) => {
      try {
        await tablesDB.createStringColumn(databaseId, tableId, key, size, required, defaultVal);
        addLog(`  + Added column '${key}' to '${tableId}'`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes("already exists")) {
          try {
            await databases.createStringAttribute(databaseId, tableId, key, size, required, defaultVal);
            addLog(`  + Added attribute '${key}' to '${tableId}'`);
          } catch {}
        }
      }
    };

    const addBoolCol = async (tableId: string, key: string, required: boolean, defaultVal?: boolean) => {
      try {
        await tablesDB.createBooleanColumn(databaseId, tableId, key, required, defaultVal);
        addLog(`  + Added boolean column '${key}' to '${tableId}'`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes("already exists")) {
          try {
            await databases.createBooleanAttribute(databaseId, tableId, key, required, defaultVal);
            addLog(`  + Added boolean attribute '${key}' to '${tableId}'`);
          } catch {}
        }
      }
    };

    const addFloatCol = async (tableId: string, key: string, required: boolean, defaultVal?: number) => {
      try {
        await tablesDB.createFloatColumn(databaseId, tableId, key, required, undefined, undefined, defaultVal);
        addLog(`  + Added float column '${key}' to '${tableId}'`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes("already exists")) {
          try {
            await databases.createFloatAttribute(databaseId, tableId, key, required, undefined, undefined, defaultVal);
            addLog(`  + Added float attribute '${key}' to '${tableId}'`);
          } catch {}
        }
      }
    };

    // --- Table: reports ---
    await getOrCreateTable("reports", "Research Reports");
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
    await addStringCol("reports", "imageUrl", 1000, false);
    await addStringCol("reports", "researchType", 100, false);
    await addStringCol("reports", "sector", 150, false);
    await addStringCol("reports", "company", 255, false);
    await addBoolCol("reports", "isNew", false, false);
    await addBoolCol("reports", "isSaved", false, false);
    await addBoolCol("reports", "isUnread", false, true);
    await addStringCol("reports", "tabCategory", 50, false);

    // --- Table: ideas ---
    await getOrCreateTable("ideas", "Aethos Ideas");
    await addStringCol("ideas", "ticker", 50, true);
    await addStringCol("ideas", "company", 255, true);
    await addStringCol("ideas", "sector", 100, true);
    await addStringCol("ideas", "mcap", 50, true);
    await addFloatCol("ideas", "sharedPrice", true);
    await addFloatCol("ideas", "currentPrice", true);
    await addStringCol("ideas", "sharedDate", 50, true);
    await addStringCol("ideas", "pdfUrl", 1000, false);
    await addStringCol("ideas", "thesis", 65535, false);

    // --- Table: ipos ---
    await getOrCreateTable("ipos", "IPO Intelligence");
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

    // --- Table: journal ---
    await getOrCreateTable("journal", "Journal & Memos");
    await addStringCol("journal", "slug", 255, true);
    await addStringCol("journal", "category", 100, true);
    await addStringCol("journal", "title", 500, true);
    await addStringCol("journal", "date", 50, true);
    await addStringCol("journal", "deck", 2000, true);
    await addStringCol("journal", "className", 100, false);
    await addStringCol("journal", "sections", 65535, false);

    // --- Table: users_meta ---
    await getOrCreateTable("users_meta", "User Access & Roles");
    await addStringCol("users_meta", "userId", 255, true);
    await addStringCol("users_meta", "email", 255, true);
    await addStringCol("users_meta", "name", 255, false);
    await addStringCol("users_meta", "role", 50, true, "Institutional");
    await addStringCol("users_meta", "status", 50, true, "Active");
    await addStringCol("users_meta", "joinedAt", 50, false);

    // 4. Create Storage Bucket
    addLog(`Checking Storage Bucket '${bucketId}'...`);
    try {
      await storage.getBucket(bucketId);
      addLog(`✓ Storage Bucket '${bucketId}' already exists.`);
    } catch {
      addLog(`Creating Storage Bucket '${bucketId}' (Aethos Research PDFs)...`);
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
        addLog(`✓ Created Storage Bucket '${bucketId}'.`);
      } catch (e: unknown) {
        addLog(`Storage notice: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 5. Seed Rows / Documents
    addLog(`Seeding initial rows into database tables...`);

    const insertRow = async (tableId: string, rowId: string, data: Record<string, unknown>) => {
      try {
        await tablesDB.createRow(databaseId, tableId, rowId, data);
        addLog(`  + Seeded row [${tableId}]: ${rowId}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes("already exists") && !msg.includes("Conflict")) {
          try {
            await databases.createDocument(databaseId, tableId, rowId, data);
            addLog(`  + Seeded document [${tableId}]: ${rowId}`);
          } catch {}
        }
      }
    };

    // Reports
    for (const r of reports) {
      await insertRow("reports", r.slug, {
        slug: r.slug,
        title: r.title,
        tag: r.tag,
        deck: r.deck,
        readTime: r.readTime,
        date: r.date,
        free: r.free,
        className: r.className || "",
        sections: JSON.stringify(r.sections),
        pdfUrl: r.pdfUrl || "",
        imageUrl: r.imageUrl || "",
        researchType: r.researchType || "",
        sector: r.sector || "",
        company: r.company || "",
        isNew: r.isNew || false,
        isSaved: r.isSaved || false,
        isUnread: r.isUnread ?? true,
        tabCategory: r.tabCategory || "company",
      });
    }

    // Ideas
    for (const idea of initialIdeas) {
      await insertRow("ideas", idea.id, {
        ticker: idea.ticker,
        company: idea.company,
        sector: idea.sector,
        mcap: idea.mcap,
        sharedPrice: idea.sharedPrice,
        currentPrice: idea.currentPrice,
        sharedDate: idea.sharedDate,
        pdfUrl: idea.pdfUrl || "",
        thesis: idea.thesis || "",
      });
    }

    // IPOs
    for (const ipo of ipos) {
      await insertRow("ipos", ipo.slug, {
        slug: ipo.slug,
        company: ipo.company,
        sector: ipo.sector,
        period: ipo.period,
        price: ipo.price,
        type: ipo.type,
        deepDive: ipo.deepDive,
        deck: ipo.deck || "",
        issueSize: ipo.issueSize || "",
        lotSize: ipo.lotSize || "",
        listing: ipo.listing || "",
        pdfUrl: ipo.pdfUrl || "",
        htmlUrl: ipo.htmlUrl || "",
        sections: JSON.stringify(ipo.sections),
      });
    }

    // Journal
    for (const post of posts) {
      await insertRow("journal", post.slug, {
        slug: post.slug,
        category: post.category,
        title: post.title,
        date: post.date,
        deck: post.deck,
        className: post.className,
        sections: JSON.stringify(post.sections),
      });
    }

    // Users
    for (const u of initialUsers) {
      await insertRow("users_meta", u.userId, {
        userId: u.userId,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
        joinedAt: u.joinedAt,
      });
    }

    addLog(`🎉 Appwrite Tables & Storage successfully provisioned on Appwrite Cloud!`);

    return NextResponse.json({
      success: true,
      message: "Database, tables, and storage bucket successfully provisioned on Appwrite Cloud.",
      databaseId,
      tables: ["reports", "ideas", "ipos", "journal", "users_meta"],
      bucketId,
      logs,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    addLog(`❌ Error: ${errorMsg}`);
    console.error("Appwrite Provisioning Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        logs,
      },
      { status: 500 }
    );
  }
}
