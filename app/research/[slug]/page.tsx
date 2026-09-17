import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "../../_components/site-chrome";
import { findReport, reports } from "../../_lib/content";

export async function generateStaticParams() {
  return reports.map((report) => ({ slug: report.slug }));
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = findReport(slug);
  if (!report) notFound();

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: '16px' }}>
        <Link href="/research" className="dash-card-link" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Research Library
        </Link>
      </div>

      <div className="dash-card">
        <div className="dash-card-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', background: '#f4f4f5', padding: '3px 8px', borderRadius: '4px' }}>
              {report.tag}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {report.date} · {report.readTime}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '4px 0', lineHeight: '1.2' }}>
            {report.title}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5' }}>
            {report.deck}
          </p>
        </div>

        <div className="dash-card-body" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>
            {report.sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px', color: 'var(--ink)' }}>
                  {section.heading}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.75', color: '#333333' }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
