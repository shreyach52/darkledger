import { ExternalLink } from 'lucide-react';

const STATUS_TAG = {
  disclosed: 'tag-critical',
  pending_disclosure: 'tag-warn',
  removed: 'tag-signal',
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toISOString().slice(0, 16).replace('T', ' ');
}

export default function VictimTable({ postings = [], total, page, limit, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="card victim-table-card">
      <div className="card-header">
        <div className="card-title">Victim postings</div>
        <div className="mono card-title-count">{total} total</div>
      </div>

      <table className="victim-table">
        <thead>
          <tr>
            <th>Discovered</th>
            <th>Victim</th>
            <th>Group</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {postings.map((p) => (
            <tr key={p.misp_uuid}>
              <td className="mono cell-dim">{formatDate(p.discovered)}</td>
              <td>
                <div className="victim-title">{p.post_title || 'unknown'}</div>
                {p.description && (
                  <div className="victim-desc">{p.description.slice(0, 90)}</div>
                )}
              </td>
              <td><span className="tag tag-flag mono">{p.group_name}</span></td>
              <td>
                <span className={`tag ${STATUS_TAG[p.status] || 'tag-signal'} mono`}>
                  {p.status?.replace('_', ' ')}
                </span>
              </td>
              <td>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="victim-link">
                    <ExternalLink size={12} strokeWidth={2} />
                  </a>
                ) : (
                  <span className="cell-dim mono">—</span>
                )}
              </td>
            </tr>
          ))}
          {postings.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-state mono">no postings match these filters</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="table-pagination mono">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>prev</button>
        <span>page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>next</button>
      </div>
    </div>
  );
}
