import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const fetchUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/appwrite/records?table=ipos` : `http://localhost:3000/api/appwrite/records?table=ipos`;
    
    console.log(`[IposPage] SSR Fetching live IPOs from URL: "${fetchUrl}" (baseUrl env: "${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'none'}")`);
    const res = await fetch(fetchUrl, { cache: "no-store" }).catch((err) => {
      console.error("[IposPage] Network/Fetch error during SSR:", err);
      return null;
    });

    if (res && res.ok) {
      const json = await res.json().catch((err) => {
        console.error("[IposPage] JSON parsing error:", err);
        return null;
      });
      if (json?.success && Array.isArray(json.rows)) {
        console.log(`[IposPage] SUCCESS: Received ${json.rows.length} IPO records from Appwrite collection 'ipos'.`);
        const statusMap = json.rows.reduce((acc: any, r: any) => {
          const st = r.status || "unknown";
          acc[st] = (acc[st] || 0) + 1;
          return acc;
        }, {});
        console.log(`[IposPage] Raw status breakdown from API payload:`, statusMap);
        return json.rows;
      } else {
        console.warn(`[IposPage] Response JSON missing success or rows array:`, json);
      }
    } else if (res) {
      console.warn(`[IposPage] Fetch returned non-OK status: ${res.status} ${res.statusText}`);
    } else {
      console.error(`[IposPage] Fetch returned null/undefined response.`);
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
        console.log(`[IposPage] Received ${json.rows.length} deep dive records.`);
        return json.rows;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export default async function IposPage() {
  console.log("[IposPage] Component executing on Server (SSR)...");
  const [liveIpos, deepDives] = await Promise.all([
    getLiveIpos(),
    getDeepDives(),
  ]);
  console.log(`[IposPage] Passing ${liveIpos.length} live IPOs and ${deepDives.length} deep dives to client component.`);

  return (
    <div className="ipo-page-container">
      <IpoTableTabs ipos={liveIpos} deepDives={deepDives} />
    </div>
  );
}
