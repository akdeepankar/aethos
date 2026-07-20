import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, SiteFooter, SiteHeader } from "../../_components/site-chrome";
import { findReport, reports } from "../../_lib/content";

export async function generateStaticParams() { return reports.map((report) => ({ slug: report.slug })); }

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = findReport(slug);
  if (!report) notFound();
  return <><SiteHeader active="Research" /><main className="detail-page"><article className="shell longform"><Link className="back-link" href="/research">← Back to research</Link><p className="eyebrow"><span />{report.tag}</p><h1>{report.title}</h1><p className="article-deck">{report.deck}</p><div className="article-meta"><span>{report.date}</span><span>{report.readTime}</span><span>{report.free ? "Free research" : "Member research"}</span></div><div className={`article-art ${report.className}`}><span>{report.tag}</span><strong>AETHOS<br />RESEARCH</strong></div><div className="article-body">{report.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div></article><section className="article-next"><div className="shell"><span>Continue exploring</span><Link href="/research">All research <ArrowRight /></Link></div></section></main><SiteFooter /></>;
}
