import { useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import './layout.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './pages/Overview';
import Victims from './pages/Victims';
import Groups from './pages/Groups';
import { getTimeline } from './api/client';
import BinaryRain from './components/BinaryRain';

function Shell() {
  const [search, setSearch] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [lastSync, setLastSync] = useState('—');

  useEffect(() => {
    getTimeline('day').then(setTimeline);
  }, []);

  useEffect(() => {
    setLastSync(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC');
  }, [timeline]);

return (
  <>
    <div className="galaxy-bg" />
    <BinaryRain />
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <TopBar search={search} onSearchChange={setSearch} timeline={timeline} lastSync={lastSync} />
        <main className="main-content">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  </>
);
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/victims" element={<Victims />} />
        <Route path="/groups" element={<Groups />} />
      </Route>
    </Routes>
  );
}