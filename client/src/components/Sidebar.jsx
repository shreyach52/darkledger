import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Skull, Download } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/victims', label: 'Victims', icon: Users },
  { to: '/groups', label: 'Groups', icon: Skull },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <Skull size={22} strokeWidth={1.5} />
        </div>
        <div>
          <div className="sidebar-brand-title">DarkLedger</div>
          <div className="sidebar-brand-sub">leak-site monitor</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'is-active' : ''}`}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="eyebrow">Data source</div>
        <div className="sidebar-source mono">ransomlook.io</div>
      </div>
    </aside>
  );
}