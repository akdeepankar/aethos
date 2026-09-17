import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";
import { posts } from "../_lib/content";

export default function JournalPage() {
  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Journal & Market Memos</h1>
          <p>Short-form observations, market updates, and thematic analysis.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Total Memos: {posts.length}</span>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h3 className="dash-card-title">Recent Journal Entries</h3>
        </div>
        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title & Summary</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{post.title}</span>
                        <span className="company-sector">{post.deck}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--muted)' }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '11px' }}>
                      {post.date}
                    </td>
                    <td>
                      <Link href={`/journal/${post.slug}`} className="dash-card-link">
                        Read Memo <ArrowUpRight />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
