# DarkLedger

**Dark web threat intelligence dashboard — ransomware leak-site monitoring.**

DarkLedger tracks victim postings made by ransomware groups on their dark web "name-and-shame" leak sites — the extortion pages threat actors publish when a victim organization refuses to pay. It ingests, normalizes, enriches, and visualizes this activity, giving a single searchable, exportable view of ransomware group behavior over time.

---

## Why dark web leak-site monitoring

Ransomware groups operate through Tor hidden services (`.onion` sites) specifically to stay anonymous while extorting victims. When a victim doesn't pay, groups publish the company's name — sometimes with stolen data samples — on their dark web leak site as public pressure. This "double extortion" pattern has become the dominant ransomware business model.

Security researchers and CTI (cyber threat intelligence) teams monitor these leak sites — many of which are only reachable via Tor — to:
- Track which threat actor groups are active and how their targeting shifts over time
- Identify group rebrands (a gang shuts down and relaunches under a new name to evade law enforcement pressure and sanctions)
- Correlate group activity against law enforcement takedowns
- Build early-warning intelligence for potentially affected sectors/regions

DarkLedger consumes this exact category of dark web threat intelligence — aggregated via [ransomlook.io](https://www.ransomlook.io), a public, legal service that monitors ransomware leak sites (including onion services) on researchers' behalf — and turns it into a structured, queryable dataset rather than scattered leak-site screenshots.

---

## Features

- **Automated ingestion** — polls leak-site posting data on a schedule, deduplicated against a stable source ID
- **Sector classification** — derives victim industry from post descriptions via keyword matching
- **Group rebrand mapping** — resolves known ransomware group aliases to a canonical name (e.g. tracking a gang across its rebrand history)
- **Timeline visualization** — posting activity over time, with known law enforcement takedown events overlaid for context
- **Group leaderboard** — most active ransomware groups by posting volume
- **Searchable, filterable victim table** — by group, status, date range
- **CSV / JSON export** — scoped to whatever filters are active

---

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

---

## Scope and limitations

This project deliberately does **not** crawl live Tor hidden services or dark web marketplaces directly. It consumes an existing, legal, publicly maintained threat intelligence feed. This was a conscious design choice: live dark web crawling raises real legal and safety concerns for an independent student project without institutional/legal backing, whereas the analytical layer — ingestion, enrichment, correlation, visualization — is the transferable, resume-relevant engineering skill regardless of where the raw data originates.

Sector classification is keyword-based and will misclassify or under-classify some postings, particularly terse one-word descriptions. This is a known, acceptable limitation rather than a bug — a production system would need a proper NLP classifier trained on labeled data.

---

## Running locally

**Backend**
```bash
cd server
npm install
# create .env with MONGODB_URI=<your Atlas connection string>
node server.js
```

**Ingestion (run once, then optionally schedule via cron.js)**
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

---

## Credits

Data sourced from [ransomlook.io](https://www.ransomlook.io).
