import Link from "next/link";
import { notFound } from "next/navigation";
import { findPost, posts } from "../../_lib/content";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: '16px' }}>
        <Link href="/journal" className="dash-card-link" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Journal & Memos
        </Link>
      </div>

      <div className="dash-card">
        <div className="dash-card-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', background: '#f4f4f5', padding: '3px 8px', borderRadius: '4px' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {post.date}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '4px 0', lineHeight: '1.2' }}>
            {post.title}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5' }}>
            {post.deck}
          </p>
        </div>

        <div className="dash-card-body" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>
            {post.sections.map((section) => (
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
