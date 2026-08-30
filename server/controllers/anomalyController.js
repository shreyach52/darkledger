const Posting = require('../models/Posting');

// GET /stats/anomalies?window=14
async function getAnomalies(req, res) {
  try {
    const windowDays = Number(req.query.window) || 14;
    const since = new Date();
    since.setDate(since.getDate() - windowDays);

    const raw = await Posting.aggregate([
      { $match: { discovered: { $gte: since } } },
      {
        $group: {
          _id: {
            group: '$group_name',
            day: { $dateToString: { format: '%Y-%m-%d', date: '$discovered' } },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // reshape into { group: [{day, count}, ...] }
    const byGroup = {};
    for (const r of raw) {
      const { group, day } = r._id;
      if (!byGroup[group]) byGroup[group] = [];
      byGroup[group].push({ day, count: r.count });
    }

    const anomalies = [];

    for (const [group, entries] of Object.entries(byGroup)) {
      const counts = entries.map((e) => e.count);
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      const variance = counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length;
      const stddev = Math.sqrt(variance);

      for (const e of entries) {
        if (stddev > 0 && e.count > mean + 2 * stddev) {
          anomalies.push({
            group,
            day: e.day,
            count: e.count,
            baseline: Math.round(mean * 10) / 10,
            type: 'spike',
          });
        }
      }
    }

    anomalies.sort((a, b) => new Date(b.day) - new Date(a.day));
    res.json(anomalies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute anomalies' });
  }
}

module.exports = { getAnomalies };