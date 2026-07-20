import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, SiteFooter, SiteHeader } from "../../_components/site-chrome";
import { findPost, posts } from "../../_lib/content";

export async function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();
  return <><SiteHeader /><main className="detail-page"><article className="shell longform"><Link className="back-link" href="/journal">← Back to the journal</Link><p className="eyebrow"><span />{post.category}</p><h1>{post.title}</h1><p className="article-deck">{post.deck}</p><div className="article-meta"><span>{post.date}</span><span>Aethos journal</span></div><div className={`article-art post-article-art ${post.className}`}><span>AETHOS / JOURNAL</span><strong>{post.category.toUpperCase()}</strong></div><div className="article-body">{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div></article><section className="article-next"><div className="shell"><span>Keep reading</span><Link href="/journal">Visit the journal <ArrowRight /></Link></div></section></main><SiteFooter /></>;
}
