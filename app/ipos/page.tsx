import IpoTableTabs, { ApiIpo } from "./ipo-table-tabs";

async function getLiveIpos(): Promise<ApiIpo[]> {
  try {
    const res = await fetch("https://stock.indianapi.in/ipo", {
      headers: { "X-Api-Key": process.env.INDIAN_API_KEY || "" },
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    
    const activeIpos: ApiIpo[] = data.active || [];
    const preApplyIpos: ApiIpo[] = data.pre_apply || [];
    const closedIpos: ApiIpo[] = data.closed || [];
    const listedIpos: ApiIpo[] = data.listed || [];
    
    return [...activeIpos, ...preApplyIpos, ...closedIpos.slice(0, 3), ...listedIpos.slice(0, 2)];
  } catch (err) {
    console.error("Error fetching IPO data", err);
    return [];
  }
}

export default async function IposPage() {
  const liveIpos = await getLiveIpos();

  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>IPO Intelligence</h1>
          <p>Live data on active, upcoming, and recent BSE/NSE initial public offerings.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Source: Exchange Disclosures</span>
          <span className="meta-chip">Total Tracked: {liveIpos.length}</span>
        </div>
      </div>

      <IpoTableTabs ipos={liveIpos} />
    </div>
  );
}
