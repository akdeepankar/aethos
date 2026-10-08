import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

export const revalidate = 60;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const host = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const fetchUrl = host ? `${host}/api/appwrite/records?table=ipos` : `/api/appwrite/records?table=ipos`;
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
    const host = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const fetchUrl = host ? `${host}/api/appwrite/records?table=ipo_deep_dives` : `/api/appwrite/records?table=ipo_deep_dives`;
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
