import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skull } from 'lucide-react';
import { getTopGroups } from '../api/client';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { getTopGroups(100).then(setGroups); }, []);

  const max = Math.max(1, ...groups.map((g) => g.count));

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Skull size={14} strokeWidth={2} />
          All groups ({groups.length})
        </div>
      </div>
      <div className="leaderboard-list">
        {groups.map((g) => (
          <button
            key={g.group}
            className="leaderboard-row"
            onClick={() => navigate(`/victims?group=${encodeURIComponent(g.group)}`)}
          >
            <div className="leaderboard-row-top">
              <span className="tag tag-flag mono">{g.group}</span>
              <span className="mono leaderboard-count">{g.count} postings</span>
            </div>
            <div className="leaderboard-bar-track">
              <div className="leaderboard-bar-fill" style={{ width: `${(g.count / max) * 100}%` }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}