# DarkLedger

Dark web threat intelligence dashboard — ransomware leak-site monitoring.

DarkLedger tracks victim postings made by ransomware groups on their dark web "name-and-shame" leak sites — the extortion pages threat actors publish when a victim organization refuses to pay. It ingests, normalizes, enriches, and visualizes this activity, giving a single searchable, exportable view of ransomware group behavior over time.

## Purpose & scope

This is an educational/portfolio project that visualizes and analyzes publicly available threat intelligence data. It does not crawl Tor hidden services, access dark web marketplaces directly, collect personal data, or contain any exploit/scraping code targeting live criminal infrastructure. It is not affiliated with any organization, law enforcement agency, or ransomlook.io itself.

## Why dark web leak-site monitoring

Ransomware groups use Tor hidden services to stay anonymous while extorting victims — when a victim doesn't pay, groups publish the company's name (sometimes with stolen data) on a leak site as public pressure. CTI teams monitor these sites to track active groups, spot rebrands, correlate activity against law enforcement takedowns, and build early-warning intelligence.

DarkLedger consumes this data — aggregated via [ransomlook.io](https://www.ransomlook.io), a public, legal service — and turns it into a structured, queryable dataset rather than scattered leak-site screenshots.

## Features

- **Anomaly detection** — flags unusual posting activity per group using a rolling mean/standard-deviation baseline (spikes >2σ above a group's typical rate), surfacing potential new campaigns or sudden shifts in behavior
- **Automated ingestion** — polls leak-site posting data on a schedule, deduplicated against a stable source ID
- **Sector classification** — derives victim industry from post descriptions via keyword matching
- **Group rebrand mapping** — resolves known ransomware group aliases to a canonical name (e.g. tracking a gang across its rebrand history)
- **Timeline visualization** — posting activity over time, with known law enforcement takedown events overlaid for context
- **Group leaderboard** — most active ransomware groups by posting volume
- **Searchable, filterable victim table** — by group, status, date range
- **CSV / JSON export** — scoped to whatever filters are active

## Architecture

```
ransomlook.io API → Node ingestion (cron) → MongoDB → Express API → React dashboard
```

**Backend:** Node.js, Express, MongoDB (Mongoose), node-cron
**Frontend:** React (Vite), Recharts, React Router
**Data source:** [ransomlook.io](https://www.ransomlook.io) public API

## Data model

Each posting is stored with:

- `misp_uuid` — stable unique ID from source, used as the dedupe key
- `post_title`, `group_name`, `description`, `discovered`, `link`
- `sector` — derived via keyword classification
- `status` — `disclosed` / `pending_disclosure` / `removed` (heuristically inferred — not an explicit field from the source)

Supporting collections track known group aliases (rebrand mapping) and known law enforcement events (takedown overlay).

## Anomaly detection

Each ransomware group's daily posting count is compared against its own rolling baseline (mean + standard deviation) over a trailing window (default 14 days). A day is flagged as a spike when a group's activity exceeds roughly two standard deviations above its typical rate — a lightweight statistical technique used in real CTI/SOC tooling for surfacing unusual behavior without requiring labeled training data.

This is intentionally simple rather than a black-box ML model: it's explainable (every flag traces back to a specific mean/stddev calculation you can verify), and it degrades honestly — with limited historical data, few or no anomalies will be flagged, which is statistically correct behavior rather than a failure of the system.

## Testing

Core ingestion logic (data normalization, sector classification, and disclosure-status inference) is covered by Jest unit tests. These tests caught a real bug during development — a placeholder-title regex that failed to correctly detect multi-part anonymized victim names (e.g. `"Q... E..."`), causing some undisclosed victims to be miscategorized as disclosed. The fix was verified by the test suite and backfilled against existing data.

Run tests:
```bash
cd server
npm test
```

## Scope and limitations

- No live Tor crawling — consumes an existing, legal, publicly maintained feed instead, by design
- Sector classification is keyword-based and will misclassify terse descriptions
- Anomaly detection needs more historical data per group before flags are statistically meaningful
- Tests currently cover ingestion/enrichment logic only, not API routes or the frontend

## Running locally

**Backend**
```bash
cd server
npm install
# create .env with MONGODB_URI=<your Atlas connection string>
node server.js
```

**Ingestion** (run once, then optionally schedule via cron.js)
```bash
cd server/ingestion
node fetchRansomlook.js
```

**Frontend**
```bash
cd client
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

## Credits

Data sourced from [ransomlook.io](https://www.ransomlook.io).
