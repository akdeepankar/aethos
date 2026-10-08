import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const host = process.env.NEXT_PUBLIC_APP_URL;
    const fetchUrl = host ? `${host.replace(/\/$/, "")}/api/appwrite/records?table=ipos` : `http://localhost:3000/api/appwrite/records?table=ipos`;
    const res = await fetch(fetchUrl, {
      cache: "no-store",
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.rows) && json.rows.length > 0) {
        return json.rows;
      }
    }

    return [];
  } catch (err) {
    console.error("Error fetching Appwrite IPO data:", err);
    return [];
  }
}

async function getDeepDives(): Promise<any[]> {
  try {
    const host = process.env.NEXT_PUBLIC_APP_URL;
    const fetchUrl = host ? `${host.replace(/\/$/, "")}/api/appwrite/records?table=ipo_deep_dives` : `http://localhost:3000/api/appwrite/records?table=ipo_deep_dives`;
    const res = await fetch(fetchUrl, {
      cache: "no-store",
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.rows)) {
        return json.rows;
      }
    }
    return [];
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
