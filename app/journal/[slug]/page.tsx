"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { findPost, posts as defaultPosts, Post } from "../../_lib/content";
import { useAdminStore } from "../../_lib/admin-store";

export default function JournalPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { journal: storePosts } = useAdminStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const allPosts = storePosts && storePosts.length > 0 ? storePosts : defaultPosts;
    const found = allPosts.find((p) => p.slug === slug) || findPost(slug);
    if (found) {
      setPost(found);
    }
    setLoading(false);
  }, [slug, storePosts]);

  if (loading) {
    return (
      <div className="dash-overview-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 28px", background: "#ffffff", borderRadius: "12px", border: "1px solid var(--gold-light)" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
            Loading memo...
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="dash-overview-page">
        <div style={{ marginBottom: "16px" }}>
          <Link href="/journal" className="dash-card-link" style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to Journal & Memos
          </Link>
        </div>
        <div className="dash-card" style={{ padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Post Not Found</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px" }}>
            No journal note matches &quot;{slug}&quot;.
          </p>
          <Link href="/journal" className="dash-card-link">
            Return to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-overview-page">
      <div style={{ marginBottom: "16px" }}>
        <Link href="/journal" className="dash-card-link" style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← Back to Journal & Memos
        </Link>
      </div>

      <div className="dash-card">
        <div className="dash-card-head" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px", padding: "28px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted)", background: "#f4f4f5", padding: "3px 8px", borderRadius: "4px" }}>
              {post.category}
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              {post.date}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "4px 0", lineHeight: "1.2" }}>
            {post.title}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)", lineHeight: "1.5" }}>
            {post.deck}
          </p>
        </div>

        <div className="dash-card-body" style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "720px" }}>
            {post.sections && post.sections.map((section) => (
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
