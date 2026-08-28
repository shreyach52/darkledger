import { Skull } from 'lucide-react';

export default function GroupLeaderboard({ groups = [], onSelectGroup }) {
  const max = Math.max(1, ...groups.map((g) => g.count));

  return (
    <div className="card leaderboard-card">
      <div className="card-header">
        <div className="card-title">
          <Skull size={14} strokeWidth={2} />
          Top groups
        </div>
      </div>

      <div className="leaderboard-list">
        {groups.map((g) => (
          <button
            key={g.group}
            className="leaderboard-row"
            onClick={() => onSelectGroup(g.group)}
          >
            <div className="leaderboard-row-top">
              <span className="tag tag-flag mono">{g.group}</span>
              <span className="mono leaderboard-count">{g.count}</span>
            </div>
            <div className="leaderboard-bar-track">
              <div
                className="leaderboard-bar-fill"
                style={{ width: `${(g.count / max) * 100}%` }}
              />
            </div>
          </button>
        ))}
        {groups.length === 0 && (
          <div className="empty-state mono">no group data yet</div>
        )}
      </div>
    </div>
  );
}
