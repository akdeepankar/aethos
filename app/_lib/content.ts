export type Report = {
  slug: string;
  tag: string;
  title: string;
  deck: string;
  meta: string;
  className: string;
  free: boolean;
  readTime: string;
  date: string;
  sections: { heading: string; body: string }[];
};

export const reports: Report[] = [
  {
    slug: "logistics-stack",
    tag: "Company deep dive",
    title: "The quality compounder hiding in India’s logistics stack.",
    deck: "A closer look at the systems, scale advantages, and operating discipline powering a quietly exceptional distribution business.",
    meta: "27 min read  ·  12 Jul 2026",
    className: "report-logistics",
    free: true,
    readTime: "27 min read",
    date: "12 July 2026",
    sections: [
      { heading: "The business beneath the movement", body: "Logistics is often treated as a cost centre. The better businesses treat it as an operating system: a compounding network of density, service quality, technology, and trust. The distinction is easy to miss in quarterly numbers and difficult to replicate over a decade." },
      { heading: "Scale is useful only when it is intelligent", body: "A growing network does not automatically create a moat. What matters is whether each new node improves route density, raises customer retention, and lowers the cost of the next shipment. The most interesting operators turn scale into an increasingly efficient flywheel." },
      { heading: "What we are watching", body: "Margin progression, mix evolution, and capital intensity will tell us more than headline revenue growth. The central question is whether the company can retain its service edge while moving meaningfully up the value chain." },
    ],
  },
  {
    slug: "indias-transmission-opportunity",
    tag: "Sectoral deep dive",
    title: "Powering the next decade: a map of India’s transmission opportunity.",
    deck: "India’s energy transition is not only about generation. We map the infrastructure and bottlenecks connecting new capacity to demand.",
    meta: "34 min read  ·  04 Jul 2026",
    className: "report-power",
    free: true,
    readTime: "34 min read",
    date: "04 July 2026",
    sections: [
      { heading: "The grid is the constraint", body: "Generation attracts the headlines, but transmission determines whether clean capacity can actually be useful. Renewable energy changes the grid’s physical needs, its location, and the reliability expected from each connection." },
      { heading: "A multi-year buildout", body: "The opportunity is defined by more than kilometres of line. It includes equipment, execution capability, policy visibility, and the ability to manage project complexity without compromising returns." },
      { heading: "How to separate narrative from economics", body: "We focus on order quality, working-capital discipline, and the sustainability of returns through a capex cycle. A strong theme does not make every participant a strong business." },
    ],
  },
  {
    slug: "indian-affluent-consumer",
    tag: "Thematic deep dive",
    title: "The quiet rise of the Indian affluent consumer.",
    deck: "The next consumer cycle is not a single story. It is a changing mix of aspiration, access, and repeat purchase across India’s cities.",
    meta: "41 min read  ·  20 Jun 2026",
    className: "report-consumer",
    free: false,
    readTime: "41 min read",
    date: "20 June 2026",
    sections: [
      { heading: "A different kind of premiumisation", body: "Affluence is broadening beyond a narrow luxury cohort. The emerging consumer is selective, digitally informed, and willing to spend on visible quality—but only when a brand earns repeat consideration." },
      { heading: "Distribution is part of the proposition", body: "For many categories, access and discovery remain as important as the product. The winners will combine memorable brand cues with distribution models that reach consumers wherever intent is formed." },
      { heading: "The trap in the story", body: "Premiumisation is an appealing label, not an investment conclusion. We look for pricing power, a coherent unit-economics model, and evidence that brand investment is producing durable demand." },
    ],
  },
];

export type Ipo = {
  slug: string;
  company: string;
  sector: string;
  period: string;
  price: string;
  type: "Mainboard" | "SME";
  deepDive: boolean;
  deck: string;
  issueSize: string;
  lotSize: string;
  listing: string;
  pdfUrl?: string;
  htmlUrl?: string;
  sections: { heading: string; body: string }[];
};

export const ipos: Ipo[] = [
  {
    slug: "spectraa-technology-solutions",
    company: "SpectraA Technology Solutions Limited",
    sector: "Industrial Automation & Engineering",
    period: "18 — 22 Sep 2026",
    price: "₹118 (Issue Price)",
    type: "Mainboard",
    deepDive: true,
    deck: "An institutional underwriting note on high-gravity process engineering, brewery & distillery automation moat, and capital efficiency.",
    issueSize: "₹38.5 crore",
    lotSize: "1,200 shares",
    listing: "30 September 2026",
    htmlUrl: "/SpectraA_IPO_Deep_Dive_Website.html",
    pdfUrl: "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    sections: [
      {
        heading: "1. Business Architecture & Turnkey Engineering Moat",
        body: "SpectraA operates as an end-to-end design-to-commissioning engineering specialist for process plants, with dominant domain authority in high-gravity breweries, microbreweries, sanitary distilleries, and automated industrial liquid processing. The competitive moat is built on 17 years of bespoke process design, multinational reference clients, proprietary CIP (Clean-In-Place) skid automation, and high switching costs once an OEM standardizes on SpectraA's architectural layouts.",
      },
      {
        heading: "2. Order Book Runway & Export Expansion",
        body: "The company holds an active executable order book of ₹81.30 crore, providing strong 1.4x coverage over FY26 revenue. Export execution has grown structurally, reaching 29.4% of total revenue across Southeast Asia and Africa, where turnkey contracts command premium pricing and 400–600 bps higher gross margins compared to commoditized domestic fabrication.",
      },
      {
        heading: "3. Financial Performance & Return Architecture",
        body: "FY26 witnessed significant operational inflection with revenue expanding to ₹57.8 crore, EBITDA margins rising to 19.0%, and PAT margins printing at 11.4%. Return metrics reflect high capital efficiency with Return on Capital Employed (ROCE) at 37.6% and Return on Equity (ROE) at 31.8%. Repeat-order revenue from existing institutional clients reached 50.1%, highlighting sticky customer retention.",
      },
      {
        heading: "4. Expansion Plan & Jaipur Unit Economics",
        body: "A primary use of IPO proceeds is the ₹11.61 crore expansion of the Jaipur manufacturing unit, expanding total shop-floor area by 2.23x. This expansion enables parallel assembly of multi-vessel brewery skids and large-diameter fermentation tanks, reducing subcontracting bottlenecks and compressing delivery lead times.",
      },
      {
        heading: "5. Diligence Flags & Governance Checks",
        body: "While operational execution is strong, prospective investors must track post-listing public-company compliance rigor. Cumulative CFO to PAT conversion stood at 49.8% due to working capital expansion (payable days at 235), and customer concentration remains elevated with the top 10 clients contributing 65.6% of revenue. Independent board additions and audit committees are recently formalized.",
      },
      {
        heading: "6. Valuation Context & Underwriting Verdict",
        body: "At the issue cap price of ₹118, the stock is valued at 13.6x post-money FY26 P/E. This represents an attractive entry multiple relative to industrial process peers, provided the company sustains its high-teens EBITDA margins and demonstrates clean operating cash flow conversion as the expanded Jaipur facility ramps.",
      },
    ],
  },
  {
    slug: "gulf-lloyds-india",
    company: "Gulf Lloyds India",
    sector: "Specialty chemicals",
    period: "20 — 22 Jul 2026",
    price: "₹152 — 160",
    type: "Mainboard",
    deepDive: true,
    deck: "An underwriting note on the company’s manufacturing footprint, end-market exposure, and the quality of growth implicit in the offer.",
    issueSize: "₹1,240 crore",
    lotSize: "93 shares",
    listing: "29 July 2026",
    sections: [
      { heading: "What the company does", body: "Gulf Lloyds supplies a portfolio of performance and specialty chemical products to industrial customers. Its investment case rests on the durability of customer relationships, manufacturing know-how, and the ability to grow without stretching the balance sheet." },
      { heading: "The central question", body: "The offer arrives at a point of healthy demand, but the quality of that demand matters. We examine the path from capacity expansion to sustainable cash generation rather than extrapolating a single favourable period." },
      { heading: "The details worth tracking", body: "Feedstock sensitivity, the pace of new capacity utilisation, customer concentration, and the use of proceeds are the facts most likely to shape the business after listing." },
    ],
  },
  {
    slug: "cube-highways-trust",
    company: "Cube Highways Trust",
    sector: "Infrastructure trust",
    period: "23 — 27 Jul 2026",
    price: "₹96 — 102",
    type: "Mainboard",
    deepDive: true,
    deck: "A research note on the assets, traffic assumptions, and cash-flow profile behind this infrastructure trust’s public offer.",
    issueSize: "₹2,100 crore",
    lotSize: "147 units",
    listing: "03 August 2026",
    sections: [
      { heading: "An asset, not a story", body: "Infrastructure trusts are best understood through asset quality, concession terms, and the stability of distributable cash. The headline yield is only one part of the underwriting." },
      { heading: "Traffic is a variable, not a certainty", body: "Traffic estimates need to be read alongside corridor quality, competing routes, local economic activity, and the maturity of the underlying assets." },
      { heading: "What changes the return profile", body: "Leverage, maintenance capex, and any future asset acquisitions deserve as much attention as the initial portfolio. These are the factors that shape distribution capacity over time." },
    ],
  },
  {
    slug: "xtranet-technologies",
    company: "Xtranet Technologies",
    sector: "Enterprise software",
    period: "To be announced",
    price: "—",
    type: "SME",
    deepDive: false,
    deck: "Tracking information is available; an Aethos IPO deep dive has not been published for this offer.",
    issueSize: "To be announced",
    lotSize: "To be announced",
    listing: "To be announced",
    sections: [],
  },
];

export type Post = {
  slug: string;
  category: string;
  title: string;
  date: string;
  className: string;
  deck: string;
  sections: { heading: string; body: string }[];
};

export const posts: Post[] = [
  {
    slug: "boring-businesses-beautiful",
    category: "Company note",
    title: "The art of making boring businesses beautiful",
    date: "18 Jul 2026",
    className: "post-1",
    deck: "Some of the most compelling businesses make products most people never think about. That does not make their economics any less beautiful.",
    sections: [
      { heading: "The overlooked advantage", body: "A business can be unglamorous and still be hard to displace. In fact, operating in the background often creates its own advantage: fewer competitors, longer customer relationships, and a better ability to focus on execution." },
      { heading: "Where the beauty lives", body: "We look for repeat demand, modest capital needs, and a place in a customer’s workflow that is costly to disrupt. The aesthetic appeal of the product is irrelevant; the quality of the economic engine is not." },
    ],
  },
  {
    slug: "breadth-of-the-rally",
    category: "Market memo",
    title: "What the breadth of the rally is telling us",
    date: "11 Jul 2026",
    className: "post-2",
    deck: "Market breadth can add texture to a rally, but it cannot replace fundamental work. Here is how we think about the difference.",
    sections: [
      { heading: "A useful signal, imperfectly used", body: "Breadth helps us understand how widely participation is spread across a market. It is a piece of context, not a standalone answer about valuation, quality, or future returns." },
      { heading: "Stay with the business", body: "Our response to a broadening rally is not to make a market call. It is to return to business quality, the price we are paying, and the facts that would change our view." },
    ],
  },
  {
    slug: "gulf-lloyds-ipo-questions",
    category: "IPO note",
    title: "Gulf Lloyds: the questions behind the headline numbers",
    date: "08 Jul 2026",
    className: "post-3",
    deck: "A short companion to our IPO deep dive: three questions that matter more than an attractive recent growth rate.",
    sections: [
      { heading: "Growth needs a source", body: "It is tempting to focus on the rate of revenue growth. The more useful question is whether that growth comes from volume, price, new capacity, or a temporary change in the market." },
      { heading: "Read the offer in context", body: "An IPO prospectus contains an immense amount of information. It helps to start with the simple facts: what the business sells, how it earns, and what must remain true for the underwriting to work." },
    ],
  },
];

export const findReport = (slug: string) => reports.find((report) => report.slug === slug);
export const findIpo = (slug: string) => ipos.find((ipo) => ipo.slug === slug);
export const findPost = (slug: string) => posts.find((post) => post.slug === slug);
