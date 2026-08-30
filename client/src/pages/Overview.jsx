import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Timeline from '../components/Timeline';
import GroupLeaderboard from '../components/GroupLeaderboard';
import AnomalyFeed from '../components/AnomalyFeed';
import { getTimeline, getTopGroups, getPostings, getKnownEvents, getAnomalies } from '../api/client';

export default function Overview() {
  useOutletContext();
  const [timeline, setTimeline] = useState([]);
  const [interval, setInterval_] = useState('day');
  const [topGroups, setTopGroups] = useState([]);
  const [recent, setRecent] = useState([]);
  const [events, setEvents] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => { getTimeline(interval).then(setTimeline); }, [interval]);
  useEffect(() => { getTopGroups(6).then(setTopGroups); }, []);
  useEffect(() => { getPostings({ page: 1, limit: 5 }).then((d) => setRecent(d.results)); }, []);
  useEffect(() => { getKnownEvents().then(setEvents); }, []);
  useEffect(() => { getAnomalies(14).then(setAnomalies); }, []);

  return (
    <>
      <div className="grid-primary">
        <Timeline data={timeline} interval={interval} onIntervalChange={setInterval_} events={events} />
        <GroupLeaderboard groups={topGroups} onSelectGroup={() => {}} />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Most recent postings</div>
        </div>
        <div className="leaderboard-list">
          {recent.map((p) => (
            <div key={p.misp_uuid} className="leaderboard-row" style={{ cursor: 'default' }}>
              <div className="leaderboard-row-top">
                <span className="victim-title">{p.post_title}</span>
                <span className="tag tag-flag mono">{p.group_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnomalyFeed anomalies={anomalies} />
    </>
  );
}