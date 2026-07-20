import Link from "next/link";
import { ArrowRight, SiteFooter, SiteHeader } from "../_components/site-chrome";

const features = [["01", "Company deep dives", "The people, products, economics, and risks behind a business—considered in one coherent note."], ["02", "Sectoral deep dives", "A map of the structure, participants, and profit pools shaping an industry over time."], ["03", "Thematic deep dives", "Long-form work on the shifts changing how India produces, consumes, and grows."], ["04", "IPO intelligence", "A cleaner tracker for live and upcoming offers, plus deeper underwriting where we have published it."]];

export default function FeaturesPage() {
  return <><SiteHeader active="Features" /><main className="features-page"><section className="page-intro page-intro-dark"><div className="shell"><p className="eyebrow light"><span />What Aethos offers</p><h1>Research that<br /><em>connects the dots.</em></h1><p>Aethos is built around a simple belief: investors can make better decisions when the business is understood before the ticker is discussed.</p></div></section><section className="features-list"><div className="shell">{features.map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div></section><section className="journal-subscribe"><div className="shell"><div><p className="eyebrow"><span />Ready to begin?</p><h2>Start with the<br /><em>work.</em></h2></div><Link className="button button-dark" href="/research">Explore research <ArrowRight /></Link></div></section></main><SiteFooter /></>;
}
