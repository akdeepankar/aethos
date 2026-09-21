import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "../../_components/site-chrome";
import { findIpo, ipos } from "../../_lib/content";

export async function generateStaticParams() {
  return ipos.filter((ipo) => ipo.deepDive).map((ipo) => ({ slug: ipo.slug }));
}

export default async function IpoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ipo = findIpo(slug);
  if (!ipo?.deepDive) notFound();

  const docUrl = ipo.htmlUrl || ipo.pdfUrl;

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/ipos"
          className="dash-card-link"
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to IPO Intelligence
        </Link>
        {docUrl && (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dash-card-link"
            style={{
              fontSize: "11px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid var(--gold-light)",
            }}
          >
            Open in new tab <ArrowUpRight />
          </a>
        )}
      </div>

      <div className="dash-card" style={{ overflow: "hidden", background: "#ffffff" }}>
        <div
          className="dash-card-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid var(--gold-light)",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#065f46",
                background: "#ecfdf5",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.05em",
              }}
            >
              IPO Underwriting Note
            </span>
            <h1 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "var(--ink)" }}>
              {ipo.company}
            </h1>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {ipo.sector} · {ipo.type} · Price: {ipo.price}
            </span>
          </div>

          <span style={{ fontSize: "11px", color: "var(--muted)" }}>
            Bidding: <strong style={{ color: "var(--ink)" }}>{ipo.period}</strong>
          </span>
        </div>

        {/* Display Document (HTML site or clean PDF) */}
        {ipo.htmlUrl ? (
          <div style={{ width: "100%", height: "88vh", minHeight: "850px", background: "#ffffff" }}>
            <iframe
              src={ipo.htmlUrl}
              title={`${ipo.company} — Deep Dive`}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        ) : ipo.pdfUrl ? (
          <div style={{ width: "100%", height: "88vh", minHeight: "850px", background: "#ffffff" }}>
            <iframe
              src={`${ipo.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={`${ipo.company} — Deep Dive`}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        ) : (
          <div className="dash-card-body" style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "780px" }}>
              {ipo.sections.map((section) => (
                <section key={section.heading}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 12px", color: "var(--ink)" }}>
                    {section.heading}
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#333333" }}>
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
