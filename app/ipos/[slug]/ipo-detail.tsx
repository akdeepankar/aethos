"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { findIpo, ipos as defaultIpos, Ipo } from "../../_lib/content";
import { useAdminStore } from "../../_lib/admin-store";
import DynamicReportView from "../../_components/dynamic-report-view";

export default function IpoDetailClient({ slug }: { slug: string }) {
  const { ipos: storeIpos } = useAdminStore();
  const [ipo, setIpo] = useState<Ipo | null>(null);
  const [rawReportHtml, setRawReportHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // 1. Resolve IPO from admin store or content defaults
    const allIpos = storeIpos && storeIpos.length > 0 ? storeIpos : defaultIpos;
    const found = allIpos.find((i) => i.slug === slug) || findIpo(slug);

    if (found) {
      setIpo(found);
    }

    // 2. Fetch raw HTML or PDF if available
    fetch(`/api/reports/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found && data.html) {
          setRawReportHtml(data.html);
        }
        if (data.pdfUrl) {
          setIpo((prev) => (prev ? { ...prev, pdfUrl: data.pdfUrl } : prev));
        }
      })
      .catch((err) => {
        console.warn("Failed to check report for IPO:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, storeIpos]);

  if (loading) {
    return (
      <div className="dash-overview-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 28px", background: "#ffffff", borderRadius: "12px", border: "1px solid var(--gold-light)" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
            Loading IPO underwriting note...
          </div>
        </div>
      </div>
    );
  }

  if (rawReportHtml || ipo?.pdfUrl) {
    return (
      <DynamicReportView
        htmlContent={rawReportHtml || ""}
        backUrl="/ipos"
        backLabel="Back to IPO Tracker"
        title={ipo?.company}
        pdfUrl={ipo?.pdfUrl}
      />
    );
  }

  if (!ipo) {
    return (
      <div className="dash-overview-page">
        <div style={{ marginBottom: "16px" }}>
          <Link href="/ipos" className="dash-card-link" style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to IPO Tracker
          </Link>
        </div>
        <div className="dash-card" style={{ padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>IPO Note Not Found</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>
            No IPO note matches &quot;{slug}&quot;.
          </p>
          <Link href="/ipos" className="dash-card-link">
            Return to IPO Tracker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: "16px" }}>
        <Link href="/ipos" className="dash-card-link" style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← Back to IPO Tracker
        </Link>
      </div>

      <div className="dash-card">
        <div className="dash-card-head" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px", padding: "28px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "#1e3a8a", background: "#eff6ff", padding: "3px 8px", borderRadius: "4px" }}>
              {ipo.type} IPO
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {ipo.period}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "4px 0", lineHeight: "1.2" }}>
            {ipo.company}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.5" }}>
            {ipo.deck}
          </p>
        </div>

        <div style={{ padding: "18px 28px", background: "#fafafa", borderBottom: "1px solid var(--gold-light)" }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Price Range</th>
                  <th>Issue Size</th>
                  <th>Lot Size</th>
                  <th>Listing Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "600" }}>{ipo.sector}</td>
                  <td style={{ fontWeight: "600" }}>{ipo.price}</td>
                  <td>{ipo.issueSize}</td>
                  <td>{ipo.lotSize}</td>
                  <td>{ipo.listing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-card-body" style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "720px" }}>
            {ipo.sections && ipo.sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 10px", color: "var(--ink)" }}>
                  {section.heading}
                </h2>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: "#333333", whiteSpace: "pre-line" }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
