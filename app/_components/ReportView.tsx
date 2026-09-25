"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Block, Report, Section, Trigger } from "@/types/report";
import s from "./report.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Props = {
  report: Report;
  /** Link for the breadcrumb, i.e. your Research Library route */
  libraryHref?: string;
  /** Slot for your existing Save / bookmark / share buttons */
  headerActions?: ReactNode;
};

export default function ReportView({ report, libraryHref = "/research", headerActions }: Props) {
  const sections = report.sections || [];
  const [active, setActive] = useState(sections[0]?.id || "section-1");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const readMins = useMemo(() => Math.max(1, Math.round(countWords(report) / 220)), [report]);

  // Scrollspy
  useEffect(() => {
    if (!sections.length) return;
    const els = sections.map((x) => document.getElementById(x.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-190px 0px -55% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  // Reading progress + back-to-top
  useEffect(() => {
    const onScroll = () => {
      const h = document.scrollingElement || document.documentElement;
      const y = window.scrollY;
      const max = h.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
      setShowTop(y > 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the active mobile tab in view
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const bar = tabsRef.current;
    if (el && bar) bar.scrollTo({ left: el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  // Deep links: /research/racl-geartech#risks
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  const goTo = useCallback((id: string) => {
    setCollapsed((c) => ({ ...c, [id]: false }));
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    });
  }, []);

  const date = fmtDate(report.reportDate || report.date || "2026-09-24");
  const coverImg = report.coverImage || report.imageUrl;
  const summaryText = report.summary || report.deck;
  const companyName = report.company || report.title;

  return (
    <div className={s.root}>
      {/* ── Header ── */}
      <header className={s.head}>
        <div className={s.headInner}>
          <nav className={s.crumbs} aria-label="Breadcrumb">
            <a href={libraryHref}>Research Library</a>
            <span aria-hidden>/</span>
            <span>{report.category || report.reportType || "Research Note"}</span>
          </nav>

          <div className={cx(s.headGrid, coverImg && s.headGridImg)}>
            <div className={s.headText}>
              <p className={s.eyebrow}>{report.category || report.reportType || "Stock deep dive"}</p>
              <h1 className={s.title}>{report.title || companyName}</h1>
              {summaryText && <p className={s.dek}>{summaryText}</p>}
              <div className={s.metaRow}>
                <span>{date}</span>
                <span className={s.dot} aria-hidden>·</span>
                <span>{report.reportType || report.category || "Research Report"}</span>
              </div>
              <div className={s.chips}>
                {report.sector && <span className={s.chip}>{report.sector}</span>}
                {report.hero?.tags?.map((t) => (
                  <span key={t} className={s.chip}>{t}</span>
                ))}
              </div>
            </div>
            {coverImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={s.cover} src={coverImg} alt="" />
            )}
          </div>
        </div>
      </header>

      {/* ── Frozen bar: price strip + section tabs, stays visible while scrolling ── */}
      <div className={s.sticky}>
        <div className={s.stickyInner}>
          <div className={s.quote}>
            <div className={s.quoteMain}>
              <span className={s.quoteLabel}>{companyName}</span>
              {report.ticker && <span className={s.quoteTicker}>{report.ticker}</span>}
            </div>
            {report.hero?.price && (
              <div className={s.quotePrice}>
                <span className={s.price}>{report.hero.price}</span>
                {report.hero.change && (
                  <span className={cx(s.change, report.hero.change.trim().startsWith("-") ? s.neg : s.pos)}>{report.hero.change}</span>
                )}
                {report.hero.asOf && <span className={s.asOf}>{report.hero.asOf}</span>}
              </div>
            )}
            {headerActions && <div className={s.actions}>{headerActions}</div>}
          </div>
          {sections.length > 0 && (
            <div className={s.tabsRow}>
              <div className={s.tabs} ref={tabsRef} role="tablist" aria-label="Report sections">
                {sections.map((x, i) => (
                  <button
                    key={x.id}
                    data-id={x.id}
                    role="tab"
                    aria-selected={active === x.id}
                    className={cx(s.tab, active === x.id && s.tabActive)}
                    onClick={() => goTo(x.id)}
                  >
                    <span className={s.tabNum}>{String(i + 1).padStart(2, "0")}</span>
                    {x.nav || x.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={s.progress} style={{ width: `${progress}%` }} aria-hidden />
      </div>

      {/* ── Body ── */}
      <div className={s.layout}>
        <main className={s.content}>
          {sections.map((x, i) => (
            <SectionView
              key={x.id}
              section={x}
              index={i}
              collapsed={!!collapsed[x.id]}
              onToggle={() => setCollapsed((c) => ({ ...c, [x.id]: !c[x.id] }))}
            />
          ))}

          <footer className={s.disclaimer}>
            <p className={s.eyebrow}>Disclaimer</p>
            <p>{report.disclaimer || "This institutional research note is prepared by Aethos Wealth for informational purposes only. It does not constitute investment advice or a recommendation to buy or sell securities."}</p>
          </footer>
        </main>
      </div>

      <button
        className={cx(s.toTop, showTop && s.toTopShow)}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

/* ───────────────────────── Sections & blocks ───────────────────────── */

function SectionView({ section, index, collapsed, onToggle }: { section: Section; index: number; collapsed: boolean; onToggle: () => void }) {
  const blocks = section.blocks || [];
  return (
    <section id={section.id} className={s.section}>
      <div className={s.sectionHead}>
        <div>
          <p className={s.eyebrow}>Section {String(index + 1).padStart(2, "0")}</p>
          <h2 className={s.h2}>{section.title}</h2>
        </div>
        <button className={s.iconBtn} onClick={onToggle} aria-expanded={!collapsed} aria-label={collapsed ? "Expand section" : "Collapse section"}>
          <span className={cx(s.chev, collapsed && s.chevClosed)} aria-hidden>⌃</span>
        </button>
      </div>
      {!collapsed && (
        <div className={s.sectionBody}>
          {blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>
      )}
    </section>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "heading":
      return <h3 className={s.h3}>{b.text}</h3>;
    case "p":
      return <p className={s.p}>{b.text}</p>;
    case "list": {
      const L = b.ordered ? "ol" : "ul";
      return (
        <L className={cx(s.list, b.ordered && s.listOl)}>
          {b.items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </L>
      );
    }
    case "kpis":
      return (
        <div className={s.kpis}>
          {b.items.map((k) => (
            <div key={k.label} className={s.kpi}>
              <span className={s.kpiLabel}>
                {k.tone && k.tone !== "neutral" && <span className={cx(s.kpiDot, k.tone === "warn" ? s.dotWarn : s.dotGood)} aria-hidden />}
                {k.label}
              </span>
              <span className={s.kpiValue}>{k.value}</span>
              {k.note && <span className={s.kpiNote}>{k.note}</span>}
            </div>
          ))}
        </div>
      );
    case "callout":
      return (
        <div className={cx(s.callout, b.tone === "copper" && s.calloutCopper, b.tone === "neutral" && s.calloutNeutral)}>
          {b.title && <p className={s.calloutTitle}>{b.title}</p>}
          {b.text && <p className={s.calloutText}>{b.text}</p>}
          {b.items && (
            <ul>
              {b.items.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "timeline":
      return (
        <ol className={s.timeline}>
          {b.items.map((t) => (
            <li key={t.date}>
              <div className={s.tlHead}>
                <span className={s.tlDate}>{t.date}</span>
                {t.label && <span className={s.chipSm}>{t.label}</span>}
              </div>
              <p>{t.text}</p>
            </li>
          ))}
        </ol>
      );
    case "triggers":
      return <Triggers items={b.items} />;
    case "risks":
      return (
        <ol className={s.risks}>
          {b.items.map((r) => (
            <li key={r.title} className={s.risk}>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>{b.columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} data-label={b.columns[j]}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function Triggers({ items }: { items: Trigger[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((t) => t.category)))], [items]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const shown = items.filter((t) => cat === "All" || t.category === cat);
  const allOpen = shown.length > 0 && shown.every((t) => open[t.id]);

  return (
    <div className={s.triggersWrap}>
      <div className={s.filterBar}>
        <div className={s.filterTabs} role="tablist" aria-label="Filter triggers">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cx(s.fTab, cat === c && s.fTabOn)} onClick={() => setCat(c)}>
              {c === "All" ? "All triggers" : c}
              <span className={s.fCount}>{c === "All" ? items.length : items.filter((t) => t.category === c).length}</span>
            </button>
          ))}
        </div>
        <button className={s.textBtn} onClick={() => setOpen((o) => ({ ...o, ...Object.fromEntries(shown.map((t) => [t.id, !allOpen])) }))}>
          {allOpen ? "Close all" : "Open all"}
        </button>
      </div>

      <div className={s.triggers}>
        {shown.map((t) => {
          const n = items.indexOf(t) + 1;
          const isOpen = !!open[t.id];
          return (
            <article key={t.id} id={t.id} className={cx(s.trigger, isOpen && s.triggerOpen)}>
              <div className={s.triggerHead}>
                <span className={s.triggerNum}>{String(n).padStart(2, "0")}</span>
                <div className={s.triggerText}>
                  <p className={s.eyebrow}>{t.category}</p>
                  <h4 className={s.triggerTitle}>{t.title}</h4>
                  {t.tagline && <p className={s.tagline}>{t.tagline}</p>}
                  <div className={s.triggerFoot}>
                    {t.timeline && <span className={s.chipSm}>{t.timeline}</span>}
                    <button className={s.readBtn} onClick={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))} aria-expanded={isOpen}>
                      {isOpen ? "Close" : "Read"} <span aria-hidden>{isOpen ? "↑" : "→"}</span>
                    </button>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className={s.triggerBody}>
                  {t.fields.map((f) => (
                    <div key={f.label} className={cx(s.field, f.label === "Management commentary" && s.fieldQuote)}>
                      <p className={s.fieldLabel}>{f.label}</p>
                      {f.text && <p>{f.text}</p>}
                      {f.items && (
                        <ul>
                          {f.items.map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Helpers ───────────────────────── */

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(+d)) return iso;
  const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()];
  return `${String(d.getUTCDate()).padStart(2, "0")} ${m} ${d.getUTCFullYear()}`;
}

function countWords(r: Report) {
  const text: string[] = [r.summary || r.deck || ""];
  const walk = (v: unknown) => {
    if (typeof v === "string") text.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(r.sections || []);
  return text.join(" ").split(/\s+/).length;
}
