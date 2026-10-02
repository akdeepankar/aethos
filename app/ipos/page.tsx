import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    // Read cached/persisted IPO records from Appwrite Database table ipos
    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${host}/api/appwrite/records?table=ipos`, {
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

export default async function IposPage() {
  const liveIpos = await getLiveIpos();

  return (
    <div style={{ padding: "24px 28px 48px 28px", maxWidth: "1400px", margin: "0 auto" }}>
      <IpoTableTabs ipos={liveIpos} />
    </div>
  );
}


