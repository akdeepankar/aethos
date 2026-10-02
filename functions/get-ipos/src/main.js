const fetch = require("node-fetch");
const { Client, Databases } = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
  const apiKey = req.headers?.["x-appwrite-key"] || process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";

  log(`[CRON Midnight Trigger] Running get-ipos daily sync for database: ${databaseId}`);

  try {
    // 1. Fetch live market data from Indian API
    const apiRes = await fetch("https://stock.indianapi.in/ipo", {
      headers: { "X-Api-Key": process.env.INDIAN_API_KEY || "" },
    });
    if (!apiRes.ok) {
      log(`Live API fetch returned status: ${apiRes.status}`);
      return res.json({ success: false, error: `API status ${apiRes.status}` });
    }

    const data = await apiRes.json();
    const activeIpos = data.active || [];
    const preApplyIpos = data.pre_apply || [];
    const closedIpos = data.closed || [];
    const listedIpos = data.listed || [];

    const fetchedListings = [
      ...activeIpos.map((i) => ({ ...i, status: "active" })),
      ...preApplyIpos.map((i) => ({ ...i, status: "pre_apply" })),
      ...closedIpos.slice(0, 5).map((i) => ({ ...i, status: "closed" })),
      ...listedIpos.slice(0, 8).map((i) => ({ ...i, status: "listed" })),
    ];

    log(`Fetched ${fetchedListings.length} IPO items from exchange API.`);

    // 2. If Appwrite API Key is available, persist/update rows in Appwrite DB table "ipos"
    if (apiKey) {
      const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      const databases = new Databases(client);

      let updatedCount = 0;
      let newReportsGenerated = 0;

      for (const item of fetchedListings) {
        const slug = (item.action_slug || item.symbol || item.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        if (!slug) continue;

        let existingDoc = null;
        try {
          existingDoc = await databases.getDocument(databaseId, "ipos", slug);
        } catch {}

        const hasReport = Boolean(
          existingDoc?.hasReport ||
          existingDoc?.deepDive ||
          existingDoc?.htmlContent ||
          existingDoc?.pdfUrl ||
          (existingDoc?.htmlUrl && !existingDoc.htmlUrl.startsWith("/")) ||
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
          deck: existingDoc?.deck || item.additional_text || "",
          issueSize: item.total_subscription_rate ? `${item.total_subscription_rate}x Subscribed` : existingDoc?.issueSize || "—",
          lotSize: item.lot_size ? `${item.lot_size} shares` : existingDoc?.lotSize || "—",
          listing: item.listing_date || existingDoc?.listing || "TBA",
          externalId: String(item.symbol || slug),
          status: String(item.status || "active"),
          isSme: Boolean(item.is_sme),
          additionalText: item.additional_text ? String(item.additional_text).slice(0, 500) : "",
          lastSyncedAt: new Date().toISOString(),
          closedAt: item.bidding_end_date ? new Date(item.bidding_end_date).toISOString() : undefined,
          pdfUrl: existingDoc?.pdfUrl || undefined,
          htmlUrl: existingDoc?.htmlUrl || undefined,
          htmlContent: existingDoc?.htmlContent || undefined,
        };

        try {
          if (existingDoc) {
            await databases.updateDocument(databaseId, "ipos", slug, rowData);
          } else {
            await databases.createDocument(databaseId, "ipos", slug, rowData);
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
