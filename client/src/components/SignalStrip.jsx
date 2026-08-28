// Real signal, not decoration: bars reflect actual posting volume from the
// last N periods returned by /stats/timeline. Height = relative count.
export default function SignalStrip({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const recent = data.slice(-48);

  return (
    <div className="signal-strip" title="Postings discovered per period, most recent window">
      {recent.map((d, i) => (
        <div
          key={d.period + i}
          className="signal-bar"
          style={{ height: `${Math.max(8, (d.count / max) * 100)}%` }}
        />
      ))}
      {recent.length === 0 && <div className="signal-strip-empty mono">no data yet</div>}
    </div>
  );
}
