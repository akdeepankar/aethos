import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, SiteFooter, SiteHeader } from "../../_components/site-chrome";
import { findIpo, ipos } from "../../_lib/content";

export async function generateStaticParams() { return ipos.filter((ipo) => ipo.deepDive).map((ipo) => ({ slug: ipo.slug })); }

export default async function IpoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ipo = findIpo(slug);
  if (!ipo?.deepDive) notFound();
  return <><SiteHeader active="IPOs" /><main className="detail-page"><article className="shell longform"><Link className="back-link" href="/ipos">← Back to IPO tracker</Link><p className="eyebrow"><span />IPO deep dive</p><h1>{ipo.company}</h1><p className="article-deck">{ipo.deck}</p><div className="offer-grid"><div><span>Issue period</span><strong>{ipo.period}</strong></div><div><span>Price band</span><strong>{ipo.price}</strong></div><div><span>Issue size</span><strong>{ipo.issueSize}</strong></div><div><span>Retail lot</span><strong>{ipo.lotSize}</strong></div><div><span>Expected listing</span><strong>{ipo.listing}</strong></div></div><div className="article-body">{ipo.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div></article><section className="article-next"><div className="shell"><span>More IPO research</span><Link href="/ipos">View IPO tracker <ArrowRight /></Link></div></section></main><SiteFooter /></>;
}
