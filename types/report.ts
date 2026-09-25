export type Kpi = {
  label: string;
  value: string;
  note?: string;
  tone?: "good" | "warn" | "neutral";
};

export type TimelineItem = {
  date: string;
  label?: string;
  text: string;
};

export type TriggerField = {
  label: string;
  text?: string;
  items?: string[];
};

export type Trigger = {
  id: string;
  category: string;
  title: string;
  tagline?: string;
  timeline?: string;
  fields: TriggerField[];
};

export type Risk = {
  title: string;
  text: string;
};

export type Block =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "kpis"; items: Kpi[] }
  | { type: "callout"; tone?: "copper" | "neutral"; title?: string; text?: string; items?: string[] }
  | { type: "timeline"; items: TimelineItem[] }
  | { type: "triggers"; items: Trigger[] }
  | { type: "risks"; items: Risk[] }
  | { type: "table"; columns: string[]; rows: string[][] };

export type Section = {
  id: string;
  title: string;
  nav?: string;
  blocks: Block[];
};

export type HeroInfo = {
  price?: string;
  change?: string;
  asOf?: string;
  tags?: string[];
};

export type Report = {
  slug: string;
  title: string;
  company?: string;
  ticker?: string;
  summary?: string;
  deck?: string;
  reportDate?: string;
  date?: string;
  reportType?: string;
  category?: string;
  sector?: string;
  coverImage?: string;
  imageUrl?: string;
  disclaimer?: string;
  hero?: HeroInfo;
  sections: Section[];
  pdfUrl?: string;
  free?: boolean;
};
