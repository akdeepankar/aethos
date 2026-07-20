const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
    <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="check-icon">
    <path d="m5 12 4.1 4L19 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Lock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="lock-icon">
    <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const Spark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="spark-icon">
    <path d="M12 2.8 14 10l7.2 2-7.2 2-2 7.2-2-7.2-7.2-2 7.2-2 2-7.2Z" fill="currentColor" />
  </svg>
);

const reports = [
  {
    tag: "Company deep dive",
    title: "The quality compounder hiding in India’s logistics stack.",
    meta: "27 min read  ·  12 Jul 2026",
    className: "report-logistics",
    free: true,
  },
  {
    tag: "Sectoral deep dive",
    title: "Powering the next decade: a map of India’s transmission opportunity.",
    meta: "34 min read  ·  04 Jul 2026",
    className: "report-power",
    free: true,
  },
  {
    tag: "Thematic deep dive",
    title: "The quiet rise of the Indian affluent consumer.",
    meta: "41 min read  ·  20 Jun 2026",
    className: "report-consumer",
    free: false,
  },
];

const posts = [
  {
    category: "Company note",
    title: "The art of making boring businesses beautiful",
    date: "18 Jul 2026",
    className: "post-1",
  },
  {
    category: "Market memo",
    title: "What the breadth of the rally is telling us",
    date: "11 Jul 2026",
    className: "post-2",
  },
  {
    category: "IPO note",
    title: "Gulf Lloyds: the questions behind the headline numbers",
    date: "08 Jul 2026",
    className: "post-3",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-grain" />
        <nav className="nav shell" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Aethos home">
            <Image className="brand-logo" src="/aethos-eagle-logo.jpeg" alt="" width={40} height={40} quality={90} />
            <span>AETHOS</span>
          </a>
          <div className="nav-links">
            <a href="/features">Features</a>
            <a href="/research">Research</a>
            <a href="/ipos">IPOs</a>
            <a href="/membership">Pricing</a>
            <a href="/about">About</a>
          </div>
          <a className="nav-cta" href="/membership">Become a member <ArrowUpRight /></a>
        </nav>

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow light"><span />Independent investment research</p>
            <h1>See the business<br />before the <em>ticker.</em></h1>
            <p className="hero-intro">Aethos publishes long-horizon research on exceptional Indian businesses, industries, and the forces reshaping them.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="/research">Explore research <ArrowRight /></a>
              <a className="text-link light-link" href="/about">Our philosophy <span>↗</span></a>
            </div>
          </div>

          <div className="hero-feature" aria-label="Featured report">
            <div className="feature-topline"><span>01 / Featured research</span><span>Q3 · 2026</span></div>
            <div className="feature-orbit"><span className="orbit-dot" /><span className="orbit-label">AETHOS<br />RESEARCH</span></div>
            <div className="feature-title-wrap">
              <p className="feature-kicker">The India stack</p>
              <h2>Where<br />enduring<br />value lives.</h2>
            </div>
            <div className="feature-bottom"><span>Read the thesis</span><ArrowUpRight /></div>
          </div>
        </div>

        <div className="hero-footer shell">
          <div className="reader-stat"><span className="avatar-stack"><b>A</b><b>K</b><b>R</b></span><span>Trusted by curious investors</span></div>
          <div className="scroll-cue"><i /> Scroll to explore</div>
          <div className="issue-stamp">ISSUE NO. 024&nbsp;&nbsp;·&nbsp;&nbsp; JULY 2026</div>
        </div>
      </section>

      <section className="numbers-strip">
        <div className="shell numbers-grid">
          <p>Thoughtful investing begins<br />with first-principles thinking.</p>
          <div><strong>120+</strong><span>research notes</span></div>
          <div><strong>35k</strong><span>investors reading</span></div>
          <div><strong>12</strong><span>sectors mapped</span></div>
        </div>
      </section>

      <section className="research section" id="research">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span />The research library</p>
              <h2>Investing is an<br /><em>information edge.</em></h2>
            </div>
            <p className="section-description">No noise. No buy calls. Just patient, original work to help you understand a business better and form your own view.</p>
          </div>

          <div className="research-tabs" aria-label="Research categories">
            <a className="research-tab active" href="#company-research"><span>01</span> Company deep dives</a>
            <a className="research-tab" href="#sector-research"><span>02</span> Sectoral deep dives</a>
            <a className="research-tab" href="#theme-research"><span>03</span> Thematic deep dives</a>
          </div>

          <div className="report-grid">
            {reports.map((report, index) => (
              <article className="report-card" id={index === 0 ? "company-research" : index === 1 ? "sector-research" : "theme-research"} key={report.title}>
                <div className={`report-art ${report.className}`}>
                  <span className="art-number">0{index + 1}</span>
                  {index === 0 && <><i className="route route-a" /><i className="route route-b" /><i className="route route-c" /></>}
                  {index === 1 && <><i className="tower tower-one" /><i className="tower tower-two" /><i className="wire wire-one" /><i className="wire wire-two" /></>}
                  {index === 2 && <><i className="consumer-ring ring-a" /><i className="consumer-ring ring-b" /><i className="consumer-ring ring-c" /></>}
                  <p>{index === 0 ? "Distribution × Scale" : index === 1 ? "The Grid Report" : "India 2030"}</p>
                </div>
                <div className="report-copy">
                  <div className="report-label"><span>{report.tag}</span>{report.free ? <b>Free</b> : <Lock />}</div>
                  <h3>{report.title}</h3>
                  <div className="report-meta"><span>{report.meta}</span><a href={["/research/logistics-stack", "/research/indias-transmission-opportunity", "/research/indian-affluent-consumer"][index]} aria-label={`Open ${report.title}`}><ArrowUpRight /></a></div>
                </div>
              </article>
            ))}
          </div>
          <div className="section-footer"><a className="text-link" href="/research">Browse all research <ArrowRight /></a><span>New work, every week</span></div>
        </div>
      </section>

      <section className="ipo-section" id="ipos">
        <div className="shell">
          <div className="ipo-heading">
            <div>
              <p className="eyebrow light"><span />IPO intelligence</p>
              <h2>The signal<br />before the <em>listing bell.</em></h2>
            </div>
            <p>Track India&apos;s live and upcoming IPOs in one calm, considered view. When it matters, go deeper with an Aethos underwriting note.</p>
          </div>

          <div className="ipo-dashboard">
            <div className="ipo-dashboard-head">
              <div><span className="live-dot" /> Live tracker <small>Updated 20 Jul, 09:30 IST</small></div>
              <a href="/ipos">View all IPOs <ArrowUpRight /></a>
            </div>
            <div className="ipo-table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Issue period</th><th>Price band</th><th>Type</th><th>Aethos view</th></tr></thead>
                <tbody>
                  <tr>
                    <td><strong>Gulf Lloyds India</strong><span>Specialty chemicals</span></td>
                    <td>20 — 22 Jul</td><td>₹ 152 — 160</td><td><b className="tag-main">MAINBOARD</b></td>
                    <td><a className="deep-dive-link" href="/ipos/gulf-lloyds-india">Deep dive <ArrowUpRight /></a></td>
                  </tr>
                  <tr>
                    <td><strong>Cube Highways Trust</strong><span>Infrastructure trust</span></td>
                    <td>23 — 27 Jul</td><td>₹ 96 — 102</td><td><b className="tag-main">MAINBOARD</b></td>
                    <td><a className="deep-dive-link" href="/ipos/cube-highways-trust">Deep dive <ArrowUpRight /></a></td>
                  </tr>
                  <tr>
                    <td><strong>Xtranet Technologies</strong><span>Enterprise software</span></td>
                    <td>To be announced</td><td>—</td><td><b className="tag-sme">SME</b></td>
                    <td><span className="unavailable">Not available</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ipo-dashboard-foot"><span>Data sourced from public exchange disclosures.</span><span>For research, not recommendations.</span></div>
          </div>
        </div>
      </section>

      <section className="what-section section" id="features">
        <div className="shell what-grid">
          <div className="what-lead">
            <p className="eyebrow"><span />A clearer way to invest</p>
            <h2>More depth.<br /><em>Less theatre.</em></h2>
            <p>We make the work of understanding a business feel less overwhelming — and much more valuable.</p>
            <a className="button button-dark" href="/features">See what&apos;s inside <ArrowRight /></a>
          </div>
          <div className="principles">
            <div className="principle"><span className="principle-number">01</span><div><h3>We do</h3><p>Write original, rigorous research worth returning to.</p></div><Spark /></div>
            <div className="principle"><span className="principle-number">02</span><div><h3>We don&apos;t</h3><p>Chase headlines, momentum, or tell you what to buy.</p><small>We are not SEBI-registered investment advisers.</small></div><span className="no-mark">×</span></div>
            <div className="principle"><span className="principle-number">03</span><div><h3>We believe</h3><p>Great investing is built on curiosity, not certainty.</p></div><span className="quote-mark">“</span></div>
          </div>
        </div>
      </section>

      <section className="posts-section section" id="about">
        <div className="shell">
          <div className="posts-header">
            <div><p className="eyebrow light"><span />From the journal</p><h2>Recent <em>thinking.</em></h2></div>
            <a className="text-link light-link" href="/journal">Visit the journal <ArrowRight /></a>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <a className="post-card" href={["/journal/boring-businesses-beautiful", "/journal/breadth-of-the-rally", "/journal/gulf-lloyds-ipo-questions"][posts.indexOf(post)]} key={post.title}>
                <div className={`post-art ${post.className}`}><span className="post-code">A / {post.date.slice(0, 2)}</span><span className="post-shape" /></div>
                <div className="post-copy"><span>{post.category}</span><h3>{post.title}</h3><p>{post.date} <ArrowUpRight /></p></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="membership" id="pricing">
        <div className="membership-ray" />
        <div className="shell membership-inner">
          <p className="eyebrow"><span />The Aethos membership</p>
          <h2>For investors who<br />prefer to <em>think.</em></h2>
          <p className="membership-intro">Start with a selection of free research. Join to access the full library, every IPO deep dive, and the work behind the view.</p>
          <div className="membership-actions"><a className="button button-dark" href="/membership">Explore membership <ArrowRight /></a><span>Cancel anytime. No noise, ever.</span></div>
        </div>
      </section>

      <footer>
        <div className="shell footer-main">
          <a className="brand footer-brand" href="#top"><Image className="brand-logo" src="/aethos-eagle-logo.jpeg" alt="" width={40} height={40} quality={90} /><span>AETHOS</span></a>
          <p>Independent research for the<br />long-term Indian investor.</p>
          <div className="footer-links"><a href="/research">Research</a><a href="/ipos">IPOs</a><a href="/membership">Membership</a><a href="mailto:hello@aethos.in">Contact</a></div>
          <a className="footer-email" href="mailto:hello@aethos.in">hello@aethos.in <ArrowUpRight /></a>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Aethos Research. All rights reserved.</span><span>Research, not investment advice.</span><span>Built with intent in India.</span></div>
      </footer>
    </main>
  );
}
import Image from "next/image";
