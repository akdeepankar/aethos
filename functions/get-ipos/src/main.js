const fetch = require("node-fetch");
const { Client, Databases } = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
  const apiKey = req.headers?.["x-appwrite-key"] || process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";

  log(`[CRON Midnight Trigger] Running get-ipos daily sync for database: ${databaseId}`);

  try {
    // 1. Fetch live market data from Upstox API
    const upstoxToken = process.env.UPSTOX_ACCESS_TOKEN;
    let fetchedListings = [];

    if (upstoxToken) {
      const apiRes = await fetch("https://api.upstox.com/v2/ipos", {
        headers: {
          "Authorization": `Bearer ${upstoxToken}`,
          "Accept": "application/json",
        },
      });

      if (apiRes.ok) {
        const json = await apiRes.json();
        const rawList = Array.isArray(json?.data) ? json.data : [];

        // Enrich items with detail info for RHP and exact timeline
        for (const item of rawList) {
          let rhpUrl = null;
          let lotSize = item.lot_size;
          let minQty = item.minimum_quantity;
          let listingDate = null;

          if (item.id) {
            try {
              const detailRes = await fetch(`https://api.upstox.com/v2/ipos/${item.id}`, {
                headers: {
                  "Authorization": `Bearer ${upstoxToken}`,
                  "Accept": "application/json",
                },
              });
              if (detailRes.ok) {
                const detailJson = await detailRes.json();
                const d = detailJson?.data || {};
                rhpUrl = d.rhp_url || d.drhp_url || null;
                lotSize = d.lot_size || lotSize;
                minQty = d.minimum_quantity || minQty;
                listingDate = d.timeline?.listing_date || null;
              }
            } catch (e) {
              log(`Notice fetching detail for Upstox IPO ${item.id}: ${e.message}`);
            }
          }

          let normalizedStatus = "active";
          if (item.status === "open") normalizedStatus = "active";
          else if (item.status === "upcoming" || item.status === "pre_apply") normalizedStatus = "pre_apply";
          else if (item.status === "listed") normalizedStatus = "listed";
          else if (item.status === "closed") normalizedStatus = "closed";

          fetchedListings.push({
            symbol: item.symbol || item.id,
            name: item.name ? item.name.replace(/\s+IPO$/i, "").trim() : item.symbol,
            status: normalizedStatus,
            is_sme: item.issue_type === "sme",
            min_price: item.minimum_price,
            max_price: item.maximum_price,
            issue_price: item.maximum_price || item.minimum_price,
            bidding_start_date: item.bidding_start_date,
            bidding_end_date: item.bidding_end_date,
            listing_date: listingDate,
            lot_size: lotSize,
            total_subscription_rate: item.total_subscription,
            document_url: rhpUrl,
          });
        }
      } else {
        log(`Upstox API returned status: ${apiRes.status}`);
      }
    }

    // Supplementary/Fallback fetch from Indian API to guarantee full coverage of open, closed, listed, and upcoming IPOs
    try {
      const indianRes = await fetch("https://stock.indianapi.in/ipo", {
        headers: { "X-Api-Key": process.env.INDIAN_API_KEY || "" },
      });
      if (indianRes.ok) {
        const data = await indianRes.json();
        const existingSymbols = new Set(fetchedListings.map(i => (i.symbol || i.name || "").toLowerCase()));
        
        const additionalItems = [
          ...(data.active || []).map((i) => ({ ...i, status: "active" })),
          ...(data.pre_apply || data.upcoming || []).map((i) => ({ ...i, status: "pre_apply" })),
          ...(data.closed || []).map((i) => ({ ...i, status: "closed" })),
          ...(data.listed || []).map((i) => ({ ...i, status: "listed" })),
        ];

        for (const item of additionalItems) {
          const symKey = (item.symbol || item.name || "").toLowerCase();
          if (symKey && !existingSymbols.has(symKey)) {
            existingSymbols.add(symKey);
            fetchedListings.push(item);
          }
        }
      }
    } catch (e) {
      log(`Indian API fallback/supplementary fetch notice: ${e.message}`);
    }

    log(`Fetched ${fetchedListings.length} IPO items from exchange API.`);

    // 2. If Appwrite API Key is available, persist/update rows in Appwrite DB table "ipos"
    if (apiKey) {
      const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      const databases = new Databases(client);

      let updatedCount = 0;
      let newReportsGenerated = 0;

      const existingRes = await databases.listDocuments(databaseId, "ipos").catch(() => ({ documents: [] }));
      const existingDocs = existingRes.documents || [];
      const docMap = new Map();
      existingDocs.forEach((d) => {
        if (d.slug) docMap.set(d.slug.toLowerCase(), d);
        if (d.externalId) docMap.set(d.externalId.toLowerCase(), d);
        if (d.$id) docMap.set(d.$id.toLowerCase(), d);
      });

      // Fetch permanent deep dive archive records to preserve reports across fresh API syncs
      const deepDivesRes = await databases.listDocuments(databaseId, "ipo_deep_dives").catch(() => ({ documents: [] }));
      const deepDivesList = deepDivesRes.documents || [];
      const deepDiveMap = new Map();
      deepDivesList.forEach((dd) => {
        if (dd.slug) deepDiveMap.set(dd.slug.toLowerCase(), dd);
        if (dd.company) deepDiveMap.set(dd.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"), dd);
        if (dd.$id) deepDiveMap.set(dd.$id.toLowerCase(), dd);
      });

      for (const item of fetchedListings) {
        const rawBase = (item.action_slug || item.symbol || item.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        if (!rawBase) continue;

        const existingDoc = docMap.get(rawBase) || docMap.get(item.symbol?.toLowerCase());
        const slug = existingDoc?.slug || rawBase;
        const rowId = existingDoc?.$id || (slug.length <= 36 ? slug : slug.slice(0, 36));

        // Cross-check ipo_deep_dives collection by unique slug/symbol/company identifier
        const archivedDeepDive = deepDiveMap.get(slug.toLowerCase()) ||
          deepDiveMap.get(rawBase) ||
          deepDiveMap.get(item.symbol?.toLowerCase());

        const pdfUrl = existingDoc?.pdfUrl || archivedDeepDive?.pdfUrl || undefined;
        const deck = existingDoc?.deck || archivedDeepDive?.deck || item.additional_text || "";

        const hasReport = Boolean(
          pdfUrl ||
          existingDoc?.hasReport ||
          existingDoc?.deepDive ||
          archivedDeepDive ||
          item.has_aethos_notes
        );

        const rowData = {
          slug,
          company: item.name || item.symbol,
          sector: item.sector || (item.is_sme ? "SME Segment" : "Mainboard Segment"),
          period: item.bidding_start_date ? `${item.bidding_start_date} - ${item.bidding_end_date || "TBA"}` : "Schedule TBA",
          price: item.issue_price ? `₹${item.issue_price}` : item.min_price ? `₹${item.min_price} - ₹${item.max_price}` : "TBA",
          type: item.is_sme ? "SME" : "Mainboard",
          deepDive: hasReport,
          hasReport: hasReport,
          deck,
          issueSize: item.total_subscription_rate ? `${item.total_subscription_rate}x Subscribed` : existingDoc?.issueSize || "—",
          lotSize: item.lot_size ? `${item.lot_size} shares` : existingDoc?.lotSize || "—",
          listing: item.listing_date || existingDoc?.listing || "TBA",
          externalId: String(item.symbol || slug),
          status: String(item.status || "active"),
          isSme: Boolean(item.is_sme),
          additionalText: item.additional_text ? String(item.additional_text).slice(0, 500) : "",
          lastSyncedAt: new Date().toISOString(),
          closedAt: item.bidding_end_date ? new Date(item.bidding_end_date).toISOString() : undefined,
          pdfUrl,
          documentUrl: item.document_url || existingDoc?.documentUrl || undefined,
        };

        try {
          if (existingDoc) {
            await databases.updateDocument(databaseId, "ipos", rowId, rowData);
          } else {
            await databases.createDocument(databaseId, "ipos", rowId, rowData);
          }
          updatedCount++;
        } catch (writeErr) {
          log(`Could not write document ${slug}: ${writeErr.message}`);
        }
      }
      log(`Successfully updated ${updatedCount} documents in Appwrite database table [ipos].`);
    }

    return res.json({
      success: true,
      message: "Daily midnight IPO sync completed.",
      timestamp: new Date().toISOString(),
      totalItems: fetchedListings.length,
      data: fetchedListings,
    });
  } catch (err) {
    error("Error inside get-ipos Appwrite Cloud Function: " + err.message);
    return res.json({ success: false, error: err.message });
  }
};
