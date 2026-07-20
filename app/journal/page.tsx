import Link from "next/link";
import { ArrowRight, ArrowUpRight, SiteFooter, SiteHeader } from "../_components/site-chrome";
import { posts } from "../_lib/content";

export default function JournalPage() {
  return <><SiteHeader /><main className="journal-page"><section className="page-intro page-intro-dark"><div className="shell"><p className="eyebrow light"><span />The Aethos journal</p><h1>Notes for the<br /><em>thinking investor.</em></h1><p>Shorter observations on the businesses, markets, and questions that deserve a closer look.</p></div></section><section className="journal-list"><div className="shell">{posts.map((post) => <Link className="journal-row" href={`/journal/${post.slug}`} key={post.slug}><div className={`journal-art ${post.className}`}><span>A / {post.date.slice(0, 2)}</span></div><div><span>{post.category}</span><h2>{post.title}</h2><p>{post.deck}</p></div><div className="journal-date">{post.date}<ArrowUpRight /></div></Link>)}</div></section><section className="journal-subscribe"><div className="shell"><div><p className="eyebrow"><span />Research, in your inbox</p><h2>Read slowly.<br /><em>Think deeply.</em></h2></div><Link className="button button-dark" href="/membership">Explore membership <ArrowRight /></Link></div></section></main><SiteFooter /></>;
}
