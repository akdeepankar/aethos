export default function JournalPage() {
  return (
    <div className="rl-container">
      <div className="rl-header">
        <div className="rl-header-left">
          <h1 className="rl-title">Market Pulse</h1>
          <p className="rl-subtitle">Short-form observations, market updates, and thematic analysis.</p>
        </div>
      </div>

      <div className="dash-card" style={{ padding: "80px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "20px",
          background: "#f1f5f9",
          color: "#475569",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></span>
          Market Pulse
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
          Coming Soon
        </h2>
        <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "480px", margin: "0 auto", lineHeight: "1.6" }}>
          Real-time market updates, sector commentaries, and daily insights are currently under development. Stay tuned!
        </p>
      </div>
    </div>
  );
}
