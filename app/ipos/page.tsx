import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const fetchUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/appwrite/records?table=ipos` : `http://localhost:3000/api/appwrite/records?table=ipos`;
    
    console.log(`[IposPage] Fetching live IPOs from: ${fetchUrl}`);
    const res = await fetch(fetchUrl, { cache: "no-store" }).catch((err) => {
      console.error("[IposPage] Fetch error:", err);
      return null;
    });
    if (res && res.ok) {
      const json = await res.json().catch((err) => {
        console.error("[IposPage] JSON parse error:", err);
        return null;
      });
      if (json?.success && Array.isArray(json.rows)) {
        console.log(`[IposPage] Received ${json.rows.length} IPO records from Appwrite collection 'ipos'.`);
        return json.rows;
      }
    } else if (res) {
      console.warn(`[IposPage] Fetch returned non-OK status: ${res.status}`);
    }
    return [];
  } catch (err) {
    console.error("[IposPage] Unexpected error in getLiveIpos:", err);
    return [];
  }
}

async function getDeepDives(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const fetchUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/appwrite/records?table=ipo_deep_dives` : `http://localhost:3000/api/appwrite/records?table=ipo_deep_dives`;
    
    const res = await fetch(fetchUrl, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.rows)) {
        return json.rows;
      }
    }
    return [];
  } catch {
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
