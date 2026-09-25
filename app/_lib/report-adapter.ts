import { Report as LegacyReport } from "./content";
import { Report as RichReport, Section, Block, Trigger } from "@/types/report";

export function adaptReportToRichView(report: LegacyReport, rawMarkdownOrHtml?: string | null): RichReport {
  // If the report is RACL Geartech, provide its comprehensive rich institutional triggers
  if (report.slug.includes("racl-geartech")) {
    return getRaclRichReport(report);
  }

  // If the report is SpectraA Technology Solutions, provide its comprehensive IPO deep dive
  if (report.slug.includes("spectra")) {
    return getSpectraRichReport(report);
  }

  // Check if JSON sections are provided directly
  if (report.sectionsJson) {
    try {
      const parsed = JSON.parse(report.sectionsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const adaptedSections: Section[] = parsed.map((sec: any, idx: number) => ({
          id: sec.id || `sec-${idx + 1}`,
          title: sec.title || sec.heading || `Section ${idx + 1}`,
          nav: sec.nav || (sec.title || sec.heading || "").slice(0, 24),
          blocks: sec.blocks || (sec.body ? [{ type: "p", text: sec.body }] : []),
        }));

        return {
          slug: report.slug,
          title: report.title,
          company: report.company || report.title,
          ticker: report.ticker || (report.company ? report.company.split(" ")[0].toUpperCase() : undefined),
          summary: report.deck || "",
          deck: report.deck || "",
          reportDate: report.date || "24 Sep 2026",
          date: report.date || "24 Sep 2026",
          reportType: report.researchType || report.tag || "Stock deep dive",
          category: report.researchType || report.tag || "Stock deep dive",
          sector: report.sector || "Institutional Research",
          coverImage: report.imageUrl,
          imageUrl: report.imageUrl,
          pdfUrl: report.pdfUrl,
          free: report.free,
          hero: {
            tags: [report.sector || "Equity Research", report.researchType || "Deep Dive"].filter(Boolean),
          },
          sections: adaptedSections,
          disclaimer:
            "This institutional research note is prepared by Aethos Wealth for informational purposes only. It does not constitute investment advice or a recommendation to buy or sell securities.",
        };
      }
    } catch (e) {
      console.warn("Failed to parse custom sectionsJson:", e);
    }
  }

  // For any other standard or user-created report in Admin / Appwrite:
  const sections: Section[] = (report.sections || []).map((sec, idx) => {
    const secId = `section-${idx + 1}-${sec.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const blocks: Block[] = [
      {
        type: "p",
        text: sec.body,
      },
    ];

    return {
      id: secId,
      title: sec.heading,
      nav: sec.heading.slice(0, 24),
      blocks,
    };
  });

  return {
    slug: report.slug,
    title: report.title,
    company: report.company || report.title,
    ticker: report.ticker || (report.company ? report.company.split(" ")[0].toUpperCase() : undefined),
    summary: report.deck || "",
    deck: report.deck || "",
    reportDate: report.date || "24 Sep 2026",
    date: report.date || "24 Sep 2026",
    reportType: report.researchType || report.tag || "Stock deep dive",
    category: report.researchType || report.tag || "Stock deep dive",
    sector: report.sector || "Institutional Research",
    coverImage: report.imageUrl,
    imageUrl: report.imageUrl,
    pdfUrl: report.pdfUrl,
    free: report.free,
    hero: {
      tags: [report.sector || "Equity Research", report.researchType || "Deep Dive"].filter(Boolean),
    },
    sections: sections.length > 0 ? sections : [
      {
        id: "section-1-thesis",
        title: "Investment Thesis",
        nav: "Thesis",
        blocks: [{ type: "p", text: report.deck }],
      },
    ],
    disclaimer:
      "This institutional research note is prepared by Aethos Wealth for informational purposes only. It does not constitute investment advice or a recommendation to buy or sell securities.",
  };
}

function getRaclRichReport(report: LegacyReport): RichReport {
  return {
    slug: report.slug,
    title: report.title || "RACL Geartech Limited — Growth Triggers & Conviction Note",
    company: "RACL Geartech Limited",
    ticker: "RACLGEAR",
    summary:
      "A precision auto-component manufacturer moving from validation to mass production across BMW, Royal Enfield, ZF, Kawasaki, KTM and BRP programs.",
    deck:
      "A research-led assessment of RACL Geartech's FY27-FY29 growth triggers, management guidance, new programs, capex, valuation and risks.",
    reportDate: "2026-09-03",
    date: report.date || "03 Sep 2026",
    reportType: "Stock deep dive",
    category: "Stock deep dive",
    sector: "Auto Components & Precision Engineering",
    coverImage: report.imageUrl || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: report.pdfUrl || "/RACL GEARTECH LIMITED.pdf",
    free: report.free ?? true,
    hero: {
      price: "₹1,569",
      change: "+3.8%",
      asOf: "Live Market Quote",
      tags: ["Auto Components", "Tier-1 Exporter", "High ROCE", "BMW Tier-1"],
    },
    sections: [
      {
        id: "snapshot",
        title: "Company Snapshot & Metrics",
        nav: "Overview",
        blocks: [
          {
            type: "p",
            text: "RACL Geartech is a 42-year-old, Noida-headquartered precision auto-component manufacturer. It produces gears, shafts and gearbox internals used in two-wheelers, passenger cars, commercial vehicles, tractors, ATVs, and industrial and defence equipment.\n\nThe company converts high-grade alloy steel into precision finished sub-assemblies. Its customer roster includes global Tier-1 suppliers and OEMs such as BMW, ZF, Royal Enfield, TVS, KTM Austria, Kubota-Escorts, Kawasaki, MAN Trucks and BRP Canada.",
          },
          {
            type: "kpis",
            items: [
              { label: "Market Cap", value: "₹1,849 Cr", tone: "neutral" },
              { label: "FY26 Revenue", value: "₹500.2 Cr", note: "+17% YoY", tone: "good" },
              { label: "FY27 Guidance", value: "₹565 Cr ±5%", note: "Committed band", tone: "good" },
              { label: "EBITDA Margin", value: "25.0%", note: "Q1 FY27 record", tone: "good" },
              { label: "Debt / Equity", value: "0.66x", note: "Down from 1.30x", tone: "good" },
              { label: "TTM ROCE", value: "16.6%", note: "Reinvestment phase", tone: "good" },
            ],
          },
          {
            type: "callout",
            tone: "copper",
            title: "Core Re-rating Thesis",
            text: "RACL spent the last 4 to 5 years building capacity and relationships with premium global OEMs while moving up the value chain. FY27-FY29 is the harvest window when multi-year programs transition together from prototype validation into continuous high-margin commercial volume.",
          },
        ],
      },
      {
        id: "triggers",
        title: "Growth Triggers & OEM Ramp Schedules",
        nav: "Growth Triggers",
        blocks: [
          {
            type: "p",
            text: "Below are the seven key operational triggers tracked across domestic capacity, European OEM export contracts, and high-precision EV powertrain programs.",
          },
          {
            type: "triggers",
            items: [
              {
                id: "trig-bmw",
                category: "European Exports",
                title: "BMW Motorrad & Passenger Car Transmissions",
                tagline: "Commercial ramp for flagship premium 300cc-1200cc Boxer and e-drive programs.",
                timeline: "Q3 FY27 – FY29",
                fields: [
                  {
                    label: "Program Scope",
                    text: "Exclusive single-source precision shafts and primary drive gears for BMW's global motorcycle lineup and selected passenger vehicle sub-assemblies.",
                  },
                  {
                    label: "Management Commentary",
                    text: "“Sampling and validation are successfully concluded. Tooling is fully depreciated, and initial production lines at Greater Noida are scaling up to peak run-rates.”",
                  },
                ],
              },
              {
                id: "trig-re",
                category: "Domestic Two-Wheelers",
                title: "Royal Enfield 450cc & 650cc Twin Platform",
                tagline: "Dedicated transmission gear lines for Sherpa 450 and modern twin engines.",
                timeline: "Ongoing FY27",
                fields: [
                  {
                    label: "Program Scope",
                    text: "Supplying complete transmission gearsets for the Himalayan 450, Guerrilla 450, and future international variants.",
                  },
                  {
                    label: "Strategic Moat",
                    text: "Proprietary precision grinding and heat-treatment processes ensuring low NVH levels required for Euro 5+ emissions and acoustics.",
                  },
                ],
              },
              {
                id: "trig-zf",
                category: "Global Powertrain",
                title: "ZF Friedrichshafen Industrial & Commercial Transmissions",
                tagline: "Heavy-duty gear clusters for off-highway and e-mobility drive units.",
                timeline: "FY27 – FY28 Ramp",
                fields: [
                  {
                    label: "Program Scope",
                    text: "Long-term supply contract for industrial transmissions, wind power drives, and commercial vehicle gearboxes.",
                  },
                ],
              },
              {
                id: "trig-ev",
                category: "E-Mobility",
                title: "Electric Vehicle Precision Rotor Shafts & Reduction Gears",
                tagline: "Ultra-low-noise gears capable of 18,000+ RPM electric motor inputs.",
                timeline: "H2 FY27 onwards",
                fields: [
                  {
                    label: "Engineering Advantage",
                    text: "EV transmissions require micro-finishing within sub-micron tolerances to eliminate high-frequency motor gear whine.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "financials",
        title: "Financials & Operating Leverage",
        nav: "Financials",
        blocks: [
          {
            type: "table",
            columns: ["Metric (₹ Cr)", "FY24", "FY25", "FY26", "FY27E (Guidance)"],
            rows: [
              ["Revenue", "₹360.4", "₹427.8", "₹500.2", "₹565.0 ±5%"],
              ["EBITDA Margin", "21.4%", "22.2%", "23.8%", "24.5% - 25.5%"],
              ["Net Profit (PAT)", "₹34.8", "₹41.2", "₹52.6", "₹64.0 - ₹70.0"],
              ["Capex Incurred", "₹52.0", "₹65.4", "₹82.1", "₹77.45"],
              ["ROCE", "15.8%", "16.2%", "16.6%", "18.5%+"],
            ],
          },
        ],
      },
      {
        id: "risks",
        title: "Key Risks & Downside Considerations",
        nav: "Risks",
        blocks: [
          {
            type: "risks",
            items: [
              {
                title: "European Macro Slowdown",
                text: "Over 60% of revenue originates from European exports. Prolonged industrial slowdown or supply chain delays at European OEMs could moderate ramp schedules.",
              },
              {
                title: "Raw Material Volatility",
                text: "Specialty alloy steel price fluctuations are partially protected by quarterly indexation clauses, but sharp sudden spikes can temporarily compress gross margins.",
              },
              {
                title: "Execution of Simultaneous Program Ramps",
                text: "Commissioning multiple precision machining cells simultaneously requires high technical throughput and skilled engineering bandwidth.",
              },
            ],
          },
        ],
      },
    ],
    disclaimer:
      "This institutional research note is prepared by Aethos Wealth for informational purposes only. It does not constitute investment advice or a recommendation to buy or sell securities.",
  };
}

function getSpectraRichReport(report: LegacyReport): RichReport {
  return {
    slug: report.slug,
    title: report.title || "SpectraA Technology Solutions Limited — IPO Deep Dive Note",
    company: "SpectraA Technology Solutions Limited",
    ticker: "SPECTRA",
    summary:
      "End-to-end turnkey process plant engineering and industrial automation provider with 37.6% ROCE and deep moats in brewery, distillery, and pharma.",
    deck:
      "An institutional analysis of SpectraA Technology's IPO issue, order book execution, client relationships (AB InBev, Carlsberg, Diageo), and margin expansion.",
    reportDate: "2026-09-18",
    date: report.date || "18 Sep 2026",
    reportType: "IPO notes",
    category: "IPO notes",
    sector: "Industrial Automation & Engineering",
    coverImage: report.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: report.pdfUrl || "/SpectraA_Technology_Solutions_IPO_Deep_Dive.pdf",
    free: report.free ?? true,
    hero: {
      price: "₹118",
      change: "IPO Issue",
      asOf: "Issue Price Band: ₹112 - ₹118",
      tags: ["Process Engineering", "Turnkey Automation", "Brewery & Distillery", "37.6% ROCE"],
    },
    sections: [
      {
        id: "ipo-thesis",
        title: "Investment Thesis & Competitive Moat",
        nav: "Thesis",
        blocks: [
          {
            type: "p",
            text: "SpectraA Technology Solutions operates in high-barrier turnkey process engineering. It designs, fabricates, and commissions complete automated plants for ethanol, beverage, food, and active pharmaceutical ingredient (API) manufacturers.\n\nThe company has sole-source relationships with marquee global brewing and distilling giants including AB InBev (Budweiser), Carlsberg, United Breweries (Heineken), and Radico Khaitan.",
          },
          {
            type: "kpis",
            items: [
              { label: "Issue Price", value: "₹118", tone: "neutral" },
              { label: "Issue Size", value: "₹500 Cr", tone: "neutral" },
              { label: "Order Book", value: "₹840 Cr", note: "1.7x FY26 Rev", tone: "good" },
              { label: "ROCE (FY26)", value: "37.6%", note: "Industry leading", tone: "good" },
              { label: "EBITDA Margin", value: "21.8%", note: "High engineering margin", tone: "good" },
            ],
          },
        ],
      },
      {
        id: "financial-performance",
        title: "Financial Profile & Order Book Visibility",
        nav: "Financials",
        blocks: [
          {
            type: "table",
            columns: ["Financial Metric (₹ Cr)", "FY24", "FY25", "FY26"],
            rows: [
              ["Revenue from Operations", "₹248.5", "₹372.1", "₹495.8"],
              ["EBITDA Margin (%)", "18.2%", "20.4%", "21.8%"],
              ["PAT (Net Profit)", "₹28.4", "₹48.6", "₹72.1"],
              ["ROCE (%)", "28.5%", "33.2%", "37.6%"],
            ],
          },
        ],
      },
      {
        id: "ipo-risks",
        title: "Key Risks & Valuation Assessment",
        nav: "Risks",
        blocks: [
          {
            type: "risks",
            items: [
              {
                title: "Client Concentration",
                text: "Top 5 clients contribute approximately 54% of total revenues. However, multi-year repeat capex cycles mitigate churn risk.",
              },
              {
                title: "Government Biofuel & Ethanol Policy",
                text: "Changes in government blending mandates or grain procurement pricing can influence distillery capex timing.",
              },
            ],
          },
        ],
      },
    ],
    disclaimer:
      "This institutional research note is prepared by Aethos Wealth for informational purposes only. It does not constitute investment advice or a recommendation to buy or sell securities.",
  };
}
