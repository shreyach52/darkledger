import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Activity } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip mono">
      <div className="chart-tooltip-period">{label}</div>
      <div className="chart-tooltip-value">{payload[0].value} postings</div>
    </div>
  );
}

export default function Timeline({ data = [], interval, onIntervalChange, events = [] }) {
  return (
    <div className="card timeline-card">
      <div className="card-header">
        <div className="card-title">
          <Activity size={14} strokeWidth={2} />
          Postings over time
        </div>
        <div className="interval-toggle mono">
          {['day', 'week', 'month'].map((opt) => (
            <button
              key={opt}
              className={interval === opt ? 'is-active' : ''}
              onClick={() => onIntervalChange(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-chart">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="signalFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b7cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b7cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a2521" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: '#6f8c7f', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#223029' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6f8c7f', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8b7cf6"
              strokeWidth={1.5}
              fill="url(#signalFill)"
            />
            {events.map((ev) => {
              const period = new Date(ev.date).toISOString().slice(0, 10);
              return (
                <ReferenceLine
                  key={ev.event_name}
                  x={period}
                  stroke="#f2685c"
                  strokeDasharray="3 3"
                  label={{ value: ev.event_name, position: 'top', fill: '#f2685c', fontSize: 9 }}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}