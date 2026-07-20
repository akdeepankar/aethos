import Link from "next/link";
import Image from "next/image";

export function ArrowRight() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Check() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="check-icon"><path d="m5 12 4.1 4L19 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Brand() {
  return <Link className="brand" href="/"><Image className="brand-logo" src="/aethos-eagle-logo.jpeg" alt="" width={40} height={40} quality={90} /><span>AETHOS</span></Link>;
}

export function SiteHeader({ active }: { active?: string }) {
  const links = [
    ["Features", "/features"],
    ["Research", "/research"],
    ["IPOs", "/ipos"],
    ["Pricing", "/membership"],
    ["About", "/about"],
  ];

  return <header className="site-header"><nav className="shell page-nav" aria-label="Main navigation"><Brand /><div className="nav-links">{links.map(([label, href]) => <Link className={active === label ? "active" : ""} href={href} key={label}>{label}</Link>)}</div><Link className="nav-cta" href="/membership">Become a member <ArrowUpRight /></Link></nav></header>;
}

export function SiteFooter() {
  return <footer><div className="shell footer-main"><Brand /><p>Independent research for the<br />long-term Indian investor.</p><div className="footer-links"><Link href="/research">Research</Link><Link href="/ipos">IPOs</Link><Link href="/membership">Membership</Link><Link href="mailto:hello@aethos.in">Contact</Link></div><Link className="footer-email" href="mailto:hello@aethos.in">hello@aethos.in <ArrowUpRight /></Link></div><div className="shell footer-bottom"><span>© 2026 Aethos Research. All rights reserved.</span><span>Research, not investment advice.</span><span>Built with intent in India.</span></div></footer>;
}
