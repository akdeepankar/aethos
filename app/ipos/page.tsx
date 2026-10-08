import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";
import { Client, TablesDB, Query } from "node-appwrite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const apiKey = process.env.APPWRITE_API_KEY;
    const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "aethos-wealth";
    const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";

    if (!apiKey) {
      console.warn("APPWRITE_API_KEY is not set in environment");
      return [];
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const tablesDB = new TablesDB(client);

    const res = await tablesDB.listRows(databaseId, "ipos", [Query.limit(200)]);
    const rows = (res.rows || []).map((r: any) => {
      let minPrice: number | null = null;
      let maxPrice: number | null = null;
      if (r.price) {
        const nums = r.price.replace(/[^0-9.-]+/g, " ").trim().split(/\s+/).map(Number).filter((n: number) => !isNaN(n) && n > 0);
        if (nums.length >= 2) {
          minPrice = nums[0];
          maxPrice = nums[1];
        } else if (nums.length === 1) {
          minPrice = nums[0];
          maxPrice = nums[0];
        }
      }

      let biddingStart: string | null = null;
      let biddingEnd: string | null = null;
      if (r.period && r.period.includes(" - ")) {
        const parts = r.period.split(" - ").map((p: string) => p.trim());
        biddingStart = parts[0] || null;
        biddingEnd = parts[1] || null;
      } else if (r.period) {
        biddingStart = r.period;
      }

      const rawSector = (r.sector && !r.sector.includes("Segment")) ? r.sector : (r.isSme || r.type === "SME" ? "SME Segment" : "Mainboard Segment");
      const companyName = r.company || r.name || (r.externalId ? String(r.externalId) : r.slug);
      const rhpDocUrl = r.documentUrl || r.document_url || null;

      return {
        ...r,
        symbol: r.externalId || r.slug?.toUpperCase() || r.$id?.toUpperCase(),
        name: companyName,
        sector: rawSector,
        status: r.status,
        is_sme: Boolean(r.isSme ?? (r.type === "SME")),
        min_price: minPrice,
        max_price: maxPrice,
        issue_price: minPrice || maxPrice,
        latest_price: maxPrice || minPrice,
        bidding_start_date: biddingStart,
        bidding_end_date: biddingEnd,
        listing_date: r.listing && r.listing !== "TBA" ? r.listing : (r.period || "TBA"),
        lot_size: r.lotSize ? parseInt(r.lotSize) || null : null,
        hasReport: Boolean(r.hasReport || r.deepDive || r.htmlContent || r.pdfUrl || (r.htmlUrl && !r.htmlUrl.startsWith("/"))),
        has_aethos_notes: Boolean(r.hasReport || r.deepDive || r.htmlContent || r.pdfUrl || (r.htmlUrl && !r.htmlUrl.startsWith("/"))),
        document_url: rhpDocUrl,
        documentUrl: rhpDocUrl || "",
        action_slug: r.slug,
      };
    });

    return rows;
  } catch (err) {
    console.error("Error fetching Appwrite IPO data:", err);
    return [];
  }
}

async function getDeepDives(): Promise<any[]> {
  try {
    const apiKey = process.env.APPWRITE_API_KEY;
    const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "aethos-wealth";
    const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";

    if (!apiKey) return [];

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const tablesDB = new TablesDB(client);

    const res = await tablesDB.listRows(databaseId, "ipo_deep_dives", [Query.limit(200)]);
    return res.rows || [];
  } catch (err) {
    console.error("Error fetching ipo_deep_dives data:", err);
    return [];
  }
}

export default async function IposPage() {
  const [liveIpos, deepDives] = await Promise.all([
    getLiveIpos(),
    getDeepDives(),
  ]);

  return (
    <div className="ipo-page-container">
      <IpoTableTabs ipos={liveIpos} deepDives={deepDives} />
    </div>
  );
}
