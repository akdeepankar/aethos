const fetch = require("node-fetch");
const { Client, Databases, Query } = require("node-appwrite");

const UPSTOX_BASE = "https://api.upstox.com/v2/ipos";
// Upstox returns an empty list when no status filter is given, so each status is fetched explicitly.
const UPSTOX_STATUSES = ["open", "upcoming", "closed", "listed"];
// "listed" holds the full history (150+ IPOs); only sync the most recent pages of it.
const LISTED_MAX_PAGES = Number(process.env.UPSTOX_LISTED_MAX_PAGES || 2);
const MAX_PAGES = 20;

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "HD Fire Protect IPO" -> "hd-fire-protect"; "hd-fire-protect-limited-ipo" -> "hd-fire-protect"
const nameSlug = (value) => toSlug(String(value || "").replace(/\s+IPO$/i, ""));
const idSlug = (value) => toSlug(value).replace(/(-limited)?-ipo$/, "");

// Appwrite document IDs: max 36 chars, a-z A-Z 0-9 . - _, must not start with a special char.
const toDocId = (slug) => slug.slice(0, 36).replace(/^[^a-z0-9]+/, "").replace(/-+$/, "");

module.exports = async ({ req, res, log, error }) => {
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT || process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
  // Prefer the per-execution key: it carries the function's scopes from appwrite.json
  // (documents.read/write). The shared APPWRITE_API_KEY only has rows.* scopes for TablesDB.
  const apiKey = req.headers?.["x-appwrite-key"] || process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";
  const upstoxToken = process.env.UPSTOX_ACCESS_TOKEN;

  log(`[CRON Midnight Trigger] Running get-ipos daily sync for database: ${databaseId}`);

  const fail = (message, extra = {}) => {
    error(message);
    return res.json({ success: false, error: message, ...extra }, 500);
  };

  if (!upstoxToken) return fail("UPSTOX_ACCESS_TOKEN is not set. Use an Upstox Analytics Token (valid 1 year).");
  if (!apiKey) return fail("No Appwrite API key available (set APPWRITE_API_KEY).");

  const upstoxHeaders = { Authorization: `Bearer ${upstoxToken}`, Accept: "application/json" };

  try {
    // 1. Fetch all IPOs from Upstox, per status and across pages.
    const rawById = new Map();
    for (const status of UPSTOX_STATUSES) {
      const pageLimit = status === "listed" ? LISTED_MAX_PAGES : MAX_PAGES;
      for (let page = 1; page <= pageLimit; page++) {
        const apiRes = await fetch(`${UPSTOX_BASE}?status=${status}&page_number=${page}`, { headers: upstoxHeaders });
        if (!apiRes.ok) {
          const body = await apiRes.text().catch(() => "");
          return fail(`Upstox API returned ${apiRes.status} for status=${status} page=${page}. ${body.slice(0, 300)}`);
        }
        const json = await apiRes.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        list.forEach((item) => item?.id && rawById.set(item.id, item));
        const totalPages = json?.meta_data?.page?.total_pages || 0;
        if (page >= totalPages || list.length === 0) break;
      }
    }
    log(`Fetched ${rawById.size} IPOs from Upstox list endpoints.`);

    if (rawById.size === 0) return fail("Upstox returned 0 IPOs across all statuses; nothing was synced.");

    // 2. Enrich with detail info (lot size, RHP link, listing date).
    const fetchedListings = [];
    for (const item of rawById.values()) {
      let d = {};
      try {
        const detailRes = await fetch(`${UPSTOX_BASE}/${encodeURIComponent(item.id)}`, { headers: upstoxHeaders });
        if (detailRes.ok) d = (await detailRes.json())?.data || {};
        else log(`Detail fetch for ${item.id} returned ${detailRes.status}`);
      } catch (e) {
        log(`Detail fetch for ${item.id} failed: ${e.message}`);
      }

      let normalizedStatus = "active";
      if (item.status === "upcoming" || item.status === "pre_apply") normalizedStatus = "upcoming";
      else if (item.status === "listed") normalizedStatus = "listed";
      else if (item.status === "closed") normalizedStatus = "closed";

      fetchedListings.push({
        upstoxId: item.id,
        symbol: item.symbol || d.symbol || null,
        name: item.name ? item.name.replace(/\s+IPO$/i, "").trim() : item.symbol || item.id,
        status: normalizedStatus,
        is_sme: item.issue_type === "sme",
        sector: item.industry || d.industry || null,
        min_price: item.minimum_price,
        max_price: item.maximum_price,
        issue_price: item.maximum_price || item.minimum_price,
        bidding_start_date: item.bidding_start_date,
        bidding_end_date: item.bidding_end_date,
        listing_date: d.timeline?.listing_date || null,
        lot_size: d.lot_size || d.minimum_quantity || null,
        total_subscription_rate: item.total_subscription,
        document_url: d.rhp_url || d.drhp_url || null,
      });
    }

    // 3. Persist into Appwrite "ipos" collection.
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    const listAll = async (collectionId) => {
      const docs = [];
      let cursor = null;
      for (;;) {
        const queries = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const page = await databases.listDocuments(databaseId, collectionId, queries);
        docs.push(...page.documents);
        if (page.documents.length < 100) break;
        cursor = page.documents[page.documents.length - 1].$id;
      }
      return docs;
    };

    const existingDocs = await listAll("ipos");
    const docMap = new Map();
    existingDocs.forEach((d) => {
      [d.slug, d.externalId, d.$id].forEach((k) => k && docMap.set(String(k).toLowerCase(), d));
      if (d.company) docMap.set(nameSlug(d.company), d);
    });

    // Permanent deep dive archive, used to preserve reports across syncs.
    const deepDivesList = await listAll("ipo_deep_dives").catch(() => []);
    const deepDiveMap = new Map();
    deepDivesList.forEach((dd) => {
      if (dd.slug) deepDiveMap.set(dd.slug.toLowerCase(), dd);
      if (dd.company) deepDiveMap.set(toSlug(dd.company), dd);
      if (dd.$id) deepDiveMap.set(dd.$id.toLowerCase(), dd);
    });

    let created = 0;
    let updated = 0;
    const failures = [];

    for (const item of fetchedListings) {
      const candidates = [
        item.upstoxId?.toLowerCase(),
        item.symbol?.toLowerCase(),
        toSlug(item.symbol),
        nameSlug(item.name),
        idSlug(item.upstoxId),
      ].filter(Boolean);

      const existingDoc = candidates.map((k) => docMap.get(k)).find(Boolean);
      const slug = existingDoc?.slug || toSlug(item.symbol) || nameSlug(item.name) || idSlug(item.upstoxId);
      if (!slug) continue;
      const rowId = existingDoc?.$id || toDocId(slug);

      const archivedDeepDive = [slug.toLowerCase(), ...candidates].map((k) => deepDiveMap.get(k)).find(Boolean);
      const pdfUrl = existingDoc?.pdfUrl || archivedDeepDive?.pdfUrl || undefined;
      const deck = existingDoc?.deck || archivedDeepDive?.deck || "";
      const hasReport = Boolean(pdfUrl || existingDoc?.hasReport || existingDoc?.deepDive || archivedDeepDive);

      const subscription = Number(item.total_subscription_rate);
      const rowData = {
        slug,
        company: item.name,
        sector: item.sector || (item.is_sme ? "SME Segment" : "Mainboard Segment"),
        period: item.bidding_start_date ? `${item.bidding_start_date} - ${item.bidding_end_date || "TBA"}` : "Schedule TBA",
        price: item.min_price && item.max_price && item.min_price !== item.max_price
          ? `₹${item.min_price} - ₹${item.max_price}`
          : item.issue_price ? `₹${item.issue_price}` : "TBA",
        type: item.is_sme ? "SME" : "Mainboard",
        deepDive: hasReport,
        hasReport,
        deck,
        issueSize: subscription > 0 ? `${subscription}x Subscribed` : existingDoc?.issueSize || "—",
        lotSize: item.lot_size ? `${item.lot_size} shares` : existingDoc?.lotSize || "—",
        listing: item.listing_date || existingDoc?.listing || "TBA",
        externalId: String(item.upstoxId),
        status: item.status,
        isSme: Boolean(item.is_sme),
        additionalText: existingDoc?.additionalText || "",
        lastSyncedAt: new Date().toISOString(),
        closedAt: item.bidding_end_date ? new Date(item.bidding_end_date).toISOString() : undefined,
        pdfUrl,
        documentUrl: item.document_url || existingDoc?.documentUrl || undefined,
      };
      Object.keys(rowData).forEach((k) => rowData[k] === undefined && delete rowData[k]);

      try {
        if (existingDoc) {
          await databases.updateDocument(databaseId, "ipos", rowId, rowData);
          updated++;
        } else {
          try {
            await databases.createDocument(databaseId, "ipos", rowId, rowData);
            created++;
          } catch (createErr) {
            if (createErr.code !== 409) throw createErr;
            await databases.updateDocument(databaseId, "ipos", rowId, rowData);
            updated++;
          }
        }
      } catch (writeErr) {
        failures.push(`${slug}: ${writeErr.message}`);
      }
    }

    log(`Sync result: ${created} created, ${updated} updated, ${failures.length} failed (of ${fetchedListings.length}).`);
    failures.slice(0, 20).forEach((f) => log(`Write failed - ${f}`));

    const summary = {
      timestamp: new Date().toISOString(),
      totalItems: fetchedListings.length,
      created,
      updated,
      failed: failures.length,
      failures: failures.slice(0, 20),
    };

    if (created + updated === 0) return fail("No IPO documents were written.", summary);

    return res.json({ success: true, message: "Daily midnight IPO sync completed.", ...summary });
  } catch (err) {
    return fail("Error inside get-ipos Appwrite Cloud Function: " + err.message);
  }
};
