const Posting = require('../models/Posting');

// GET /stats/timeline?interval=day|week|month
async function getTimeline(req, res) {
  try {
    const { interval = 'day' } = req.query;
    const dateFormat = interval === 'month' ? '%Y-%m' : interval === 'week' ? '%Y-%U' : '%Y-%m-%d';

    const data = await Posting.aggregate([
      { $match: { discovered: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$discovered' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data.map((d) => ({ period: d._id, count: d.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute timeline' });
  }
}

// GET /stats/top-groups?limit=10
async function getTopGroups(req, res) {
  try {
    const { limit = 10 } = req.query;

    const data = await Posting.aggregate([
      { $group: { _id: '$group_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
    ]);

    res.json(data.map((d) => ({ group: d._id, count: d.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute top groups' });
  }
}

// GET /stats/sectors
async function getSectorBreakdown(req, res) {
  try {
    const data = await Posting.aggregate([
      { $match: { sector: { $ne: null } } },
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(data.map((d) => ({ sector: d._id, count: d.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute sector breakdown' });
  }
}
const { loadAliasMap } = require('../utils/resolveGroup');

// GET /stats/top-groups-canonical?limit=10
async function getTopGroupsCanonical(req, res) {
  try {
    const { limit = 10 } = req.query;
    const aliasMap = await loadAliasMap();

    const raw = await Posting.aggregate([
      { $group: { _id: '$group_name', count: { $sum: 1 } } },
    ]);

    const merged = {};
    for (const r of raw) {
      const canonical = aliasMap.get((r._id || '').toLowerCase()) || r._id;
      merged[canonical] = (merged[canonical] || 0) + r.count;
    }

    const sorted = Object.entries(merged)
      .sort((a, b) => b[1] - a[1])
      .slice(0, Number(limit))
      .map(([group, count]) => ({ group, count }));

    res.json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute canonical top groups' });
  }
}
const KnownEvent = require('../models/KnownEvent');

// GET /stats/events
async function getKnownEvents(req, res) {
  try {
    const events = await KnownEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch known events' });
  }
}

module.exports = { getTimeline, getTopGroups, getSectorBreakdown, getTopGroupsCanonical, getKnownEvents };