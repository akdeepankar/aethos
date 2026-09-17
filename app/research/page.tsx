import Link from "next/link";
import { ArrowUpRight } from "../_components/site-chrome";
import { reports } from "../_lib/content";

export default function ResearchPage() {
  return (
    <div className="dash-overview-page">
      <div className="dash-welcome-banner">
        <div className="dash-welcome-copy">
          <h1>Research Library</h1>
          <p>Complete archive of long-form research notes across Indian equities and macroeconomic themes.</p>
        </div>
        <div className="dash-banner-meta">
          <span className="meta-chip">Total Notes: {reports.length}</span>
          <span className="meta-chip">Coverage: Company, Sectoral, Thematic</span>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h3 className="dash-card-title">All Published Research Reports</h3>
        </div>
        <div className="dash-card-body" style={{ padding: 0 }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title & Focus</th>
                  <th>Category</th>
                  <th>Access Tier</th>
                  <th>Published Date</th>
                  <th>Reading Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.slug}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{report.title}</span>
                        <span className="company-sector">{report.deck}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--muted)' }}>
                        {report.tag}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: '700', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        background: report.free ? '#ecfdf5' : '#fef3c7',
                        color: report.free ? '#047857' : '#b45309'
                      }}>
                        {report.free ? 'FREE' : 'PRO'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '11px' }}>
                      {report.date}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '11px' }}>
                      {report.readTime}
                    </td>
                    <td>
                      <Link href={`/research/${report.slug}`} className="dash-card-link">
                        Read Report <ArrowUpRight />
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
