import { SlidersHorizontal } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'disclosed', 'pending_disclosure', 'removed'];

export default function FilterBar({ filters, onChange, groupOptions = [] }) {
  return (
    <div className="filter-bar mono">
      <SlidersHorizontal size={13} strokeWidth={2} />

      <select
        value={filters.group || ''}
        onChange={(e) => onChange({ ...filters, group: e.target.value || undefined })}
      >
        <option value="">all groups</option>
        {groupOptions.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        value={filters.status || 'all'}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })
        }
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>

      <input
        type="date"
        value={filters.from || ''}
        onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
      />
      <span className="filter-bar-sep">to</span>
      <input
        type="date"
        value={filters.to || ''}
        onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
      />
    </div>
  );
}
