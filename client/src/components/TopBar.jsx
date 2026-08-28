import { Search } from 'lucide-react';
import SignalStrip from './SignalStrip';

export default function TopBar({ search, onSearchChange, timeline, lastSync }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={14} strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="search victims, groups..."
          className="mono"
        />
      </div>

      <div className="topbar-signal">
        <SignalStrip data={timeline} />
      </div>

      <div className="topbar-sync mono">
        <span className="eyebrow">last sync</span>
        <span>{lastSync}</span>
      </div>
    </header>
  );
}
