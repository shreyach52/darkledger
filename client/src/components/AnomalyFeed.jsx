import { TrendingUp } from 'lucide-react';

export default function AnomalyFeed({ anomalies = [] }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <TrendingUp size={14} strokeWidth={2} />
          Activity spikes
        </div>
      </div>
      <div className="leaderboard-list">
        {anomalies.slice(0, 8).map((a, i) => (
          <div key={i} className="leaderboard-row" style={{ cursor: 'default' }}>
            <div className="leaderboard-row-top">
              <span className="tag tag-flag mono">{a.group}</span>
              <span className="mono cell-dim">{a.day}</span>
            </div>
            <div className="victim-desc">
              {a.count} postings vs. {a.baseline} baseline average
            </div>
          </div>
        ))}
        {anomalies.length === 0 && (
          <div className="empty-state mono">no spikes detected in this window</div>
        )}
      </div>
    </div>
  );
}