export type Report = {
  slug: string;
  tag: string;
  title: string;
  deck: string;
  meta: string;
  className?: string;
  free: boolean;
  readTime: string;
  date: string;
  sections: { heading: string; body: string }[];
  sectionsJson?: string;
  richSections?: any[];
  pdfUrl?: string;
  tabCategory?: "company" | "sectoral" | "thematic";
  researchType?: "Stock deep dives" | "Sector studies" | "Thematic research" | "IPO notes" | "Results analysis" | "Company updates";
  sector?: "Electrical equipment" | "Pharmaceuticals" | "Industrials" | "Consumer" | "Auto components" | "Building materials" | "Chemicals" | string;
  company?: string;
  ticker?: string;
  imageUrl?: string;
  isNew?: boolean;
  isSaved?: boolean;
  isUnread?: boolean;
};

export const reports: Report[] = [
  {
    slug: "power-equipment-capacity-cycle",
    tag: "SECTOR STUDY",
    researchType: "Sector studies",
    tabCategory: "sectoral",
    sector: "Electrical equipment",
    company: "Power Equipment Sector",
    title: "Power equipment: following the capacity cycle",
    deck: "Demand visibility meets execution reality.",
    meta: "12 min read  ·  24 Sep 2026",
    className: "report-power",
    free: true,
    readTime: "12 min read",
    date: "24 Sep 2026",
    isNew: true,
    isSaved: false,
    isUnread: true,
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. The Multi-Decade Grid Bottleneck",
        body: "Generation additions without synchronous transmission upgrades create massive curtailment risk. The current Indian power equipment cycle is structurally distinct from the 2008–2012 phase: balance sheets are clean, state DISCOMs have improved operational liquidity, and high-voltage transmission interconnects (765kV & HVDC) are mandatory to evacuate renewable energy corridors from Rajasthan and Gujarat."
      },
      {
        heading: "2. Equipment Lead Times & Vendor Pricing Power",
        body: "Lead times for high-capacity power transformers and substation GIS (Gas Insulated Switchgear) have stretched beyond 18 to 24 months globally. Domestic original equipment manufacturers are running at peak capacity utilization with robust order books extending 2.5x to 3.5x annual revenue run-rates, translating into structural gross margin expansion."
      },
      {
        heading: "3. Execution Monitorables & Underwriting Verdict",
        body: "Key variables to monitor include CRGO electrical steel pricing, copper pass-through contracts, and timely working capital disbursements from Power Grid Corporation and state transmission utilities. We remain structurally positive on tier-1 engineering and equipment suppliers with localized precision capabilities."
      }
    ]
  },
  {
    slug: "racl-geartech-understanding-the-next-phase",
    tag: "STOCK DEEP DIVE",
    researchType: "Stock deep dives",
    tabCategory: "company",
    sector: "Auto components",
    company: "RACL Geartech",
    title: "RACL Geartech: understanding the next phase",
    deck: "Capacity, product mix and cash conversion.",
    meta: "10 min read  ·  22 Sep 2026",
    className: "report-racl",
    free: false,
    readTime: "10 min read",
    date: "22 Sep 2026",
    isNew: false,
    isSaved: true,
    isUnread: false,
    pdfUrl: "/RACL GEARTECH LIMITED.pdf",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Precision Transmission Engineering Moat",
        body: "RACL Geartech has evolved from a domestic tier-2 supplier into a critical, sole-source precision transmission gear and shaft partner for global luxury motorcycle, passenger car, and agricultural OEM leaders including BMW Motorrad, KTM, Ducati, and MAN Trucks."
      },
      {
        heading: "2. Capital Allocation & Expansion Trajectory",
        body: "The commissioning of phase-3 manufacturing capacity in Gajraula unlocks high-margin sub-assemblies and EV drivetrain components. Operating leverage from automated CNC gear-grinding lines is expected to drive return on capital employed (ROCE) towards 24%+."
      },
      {
        heading: "3. Risk Considerations & Valuation Framework",
        body: "European macroeconomic softness and customer volume concentration remain primary sensitivities. However, multi-year program wins and content-per-vehicle growth provide resilient downside support at prevailing valuation bands."
      }
    ]
  },
  {
    slug: "varmora-granito-beyond-the-offer-document",
    tag: "IPO NOTE",
    researchType: "IPO notes",
    tabCategory: "thematic",
    sector: "Building materials",
    company: "Varmora Granito",
    title: "Varmora Granito: beyond the offer document",
    deck: "Scale, distribution and capital deployment.",
    meta: "9 min read  ·  20 Sep 2026",
    className: "report-varmora",
    free: true,
    readTime: "9 min read",
    date: "20 Sep 2026",
    isNew: false,
    isSaved: false,
    isUnread: true,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Large-Format Porcelain & Export Strategy",
        body: "Varmora has established substantial distribution penetration across tier-2/3 Indian cities alongside rapid export footprint expansion into North America and the Middle East, capturing the structural shift towards high-value glazed vitrified and porcelain slab surfaces."
      },
      {
        heading: "2. Balance Sheet Deleveraging via IPO Proceeds",
        body: "Net proceeds allocated to debt retirement will compress interest burdens, expanding net profit margins and boosting free cash flow conversion across the medium-term capex holiday period."
      }
    ]
  },
  {
    slug: "specialty-chemicals-reading-the-recovery",
    tag: "THEMATIC RESEARCH",
    researchType: "Thematic research",
    tabCategory: "thematic",
    sector: "Chemicals",
    company: "Specialty Chemicals Sector",
    title: "Specialty chemicals: reading the recovery",
    deck: "What must change for a stronger cycle?",
    meta: "14 min read  ·  18 Sep 2026",
    className: "report-chemicals",
    free: false,
    readTime: "14 min read",
    date: "18 Sep 2026",
    isNew: false,
    isSaved: true,
    isUnread: false,
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Destocking Cycle Nearing Conclusion",
        body: "Following six quarters of aggressive global inventory destocking across agrochemical and polymer additives channels, order inquiry velocity has started normalizing at domestic Indian synthesizers."
      },
      {
        heading: "2. Chinese Dumping Dynamics & Margin Normalization",
        body: "Margin stabilization will be uneven: commoditized basic chemicals face sustained price pressure, while complex multi-step custom synthesis (CSM/CDMO) players retain strong contractual price protection."
      }
    ]
  },
  {
    slug: "jubilant-pharmova-quarterly-review",
    tag: "RESULTS ANALYSIS",
    researchType: "Results analysis",
    tabCategory: "company",
    sector: "Pharmaceuticals",
    company: "Jubilant Pharmova",
    title: "Jubilant Pharmova: the quarterly review",
    deck: "Operating progress and the next monitorables.",
    meta: "7 min read  ·  16 Sep 2026",
    className: "report-pharma",
    free: true,
    readTime: "7 min read",
    date: "16 Sep 2026",
    isNew: false,
    isSaved: false,
    isUnread: true,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Radiopharma Turnaround & Ruby-Fill Growth",
        body: "The radiopharmaceuticals vertical demonstrated sharp margin expansion led by higher Ruby-Fill generator placements across North American diagnostic hospital networks."
      },
      {
        heading: "2. Sterile Injectables CDMO Ramp",
        body: "Facility remediation investments and FDA clearance milestones at the Spokane unit pave the way for accelerated contract manufacturing batches in upcoming quarters."
      }
    ]
  },
  {
    slug: "yash-highvoltage-expansion-in-focus",
    tag: "COMPANY UPDATE",
    researchType: "Company updates",
    tabCategory: "company",
    sector: "Electrical equipment",
    company: "Yash Highvoltage",
    title: "Yash Highvoltage: expansion in focus",
    deck: "Connecting a new announcement to the thesis.",
    meta: "5 min read  ·  14 Sep 2026",
    className: "report-yash",
    free: true,
    readTime: "5 min read",
    date: "14 Sep 2026",
    isNew: false,
    isSaved: false,
    isUnread: false,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Transformer Bushing Capacity Ramp",
        body: "Yash Highvoltage announced the completion of its brownfield expansion for OIP and RIP high-voltage transformer bushings, meeting unprecedented domestic demand."
      },
      {
        heading: "2. Strategic Implications for Margins",
        body: "Localization of high-grade insulating paper and automated winding machinery will insulate operating margins from global currency fluctuations and freight escalations."
      }
    ]
  },
  {
    slug: "logistics-stack",
    tag: "STOCK DEEP DIVE",
    researchType: "Stock deep dives",
    tabCategory: "company",
    sector: "Industrials",
    company: "Logistics Stack",
    title: "The quality compounder hiding in India’s logistics stack.",
    deck: "A closer look at the systems, scale advantages, and operating discipline powering a quietly exceptional distribution business.",
    meta: "27 min read  ·  12 Jul 2026",
    className: "report-logistics",
    free: true,
    readTime: "27 min read",
    date: "12 Jul 2026",
    isNew: false,
    isSaved: false,
    isUnread: false,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    sections: [
      { heading: "The business beneath the movement", body: "Logistics is often treated as a cost centre. The better businesses treat it as an operating system: a compounding network of density, service quality, technology, and trust. The distinction is easy to miss in quarterly numbers and difficult to replicate over a decade." },
      { heading: "Scale is useful only when it is intelligent", body: "A growing network does not automatically create a moat. What matters is whether each new node improves route density, raises customer retention, and lowers the cost of the next shipment. The most interesting operators turn scale into an increasingly efficient flywheel." },
      { heading: "What we are watching", body: "Margin progression, mix evolution, and capital intensity will tell us more than headline revenue growth. The central question is whether the company can retain its service edge while moving meaningfully up the value chain." },
    ],
  },
  {
    slug: "indias-transmission-opportunity",
    tag: "SECTOR STUDY",
    researchType: "Sector studies",
    tabCategory: "sectoral",
    sector: "Electrical equipment",
    company: "Transmission Grid",
    title: "Powering the next decade: a map of India’s transmission opportunity.",
    deck: "India’s energy transition is not only about generation. We map the infrastructure and bottlenecks connecting new capacity to demand.",
    meta: "34 min read  ·  04 Jul 2026",
    className: "report-power",
    free: true,
    readTime: "34 min read",
    date: "04 Jul 2026",
    isNew: false,
    isSaved: false,
    isUnread: false,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    sections: [
      { heading: "The grid is the constraint", body: "Generation attracts the headlines, but transmission determines whether clean capacity can actually be useful. Renewable energy changes the grid’s physical needs, its location, and the reliability expected from each connection." },
      { heading: "A multi-year buildout", body: "The opportunity is defined by more than kilometres of line. It includes equipment, execution capability, policy visibility, and the ability to manage project complexity without compromising returns." },
      { heading: "How to separate narrative from economics", body: "We focus on order quality, working-capital discipline, and the sustainability of returns through a capex cycle. A strong theme does not make every participant a strong business." },
    ],
  },
  {
    slug: "indian-affluent-consumer",
    tag: "THEMATIC RESEARCH",
    researchType: "Thematic research",
    tabCategory: "thematic",
    sector: "Consumer",
    company: "Consumer Cohort",
    title: "The quiet rise of the Indian affluent consumer.",
    deck: "The next consumer cycle is not a single story. It is a changing mix of aspiration, access, and repeat purchase across India’s cities.",
    meta: "41 min read  ·  20 Jun 2026",
    className: "report-consumer",
    free: false,
    readTime: "41 min read",
    date: "20 Jun 2026",
    isNew: false,
    isSaved: false,
    isUnread: false,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
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
