const Posting = require('../models/Posting');

// GET /postings?group=&sector=&country=&status=&from=&to=&page=&limit=
async function getPostings(req, res) {
  try {
    const { group, sector, country, status, from, to, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (group) filter.group_name = group;
    if (sector) filter.sector = sector;
    if (country) filter.country = country;
    if (status) filter.status = status;
    if (from || to) {
      filter.discovered = {};
      if (from) filter.discovered.$gte = new Date(from);
      if (to) filter.discovered.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [postings, total] = await Promise.all([
      Posting.find(filter).sort({ discovered: -1 }).skip(skip).limit(Number(limit)),
      Posting.countDocuments(filter),
    ]);

    res.json({ total, page: Number(page), limit: Number(limit), results: postings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch postings' });
  }
}

// GET /postings/:id
async function getPostingById(req, res) {
  try {
    const posting = await Posting.findById(req.params.id);
    if (!posting) return res.status(404).json({ error: 'Posting not found' });
    res.json(posting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posting' });
  }
}

// GET /postings/export?format=csv|json&group=&status=&from=&to=
async function exportPostings(req, res) {
  try {
    const { format = 'json', group, status, from, to } = req.query;

    const filter = {};
    if (group) filter.group_name = group;
    if (status) filter.status = status;
    if (from || to) {
      filter.discovered = {};
      if (from) filter.discovered.$gte = new Date(from);
      if (to) filter.discovered.$lte = new Date(to);
    }

    const postings = await Posting.find(filter).sort({ discovered: -1 }).lean();

    if (format === 'csv') {
      const headers = ['misp_uuid', 'post_title', 'group_name', 'description', 'discovered', 'status', 'link'];
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      const rows = postings.map((p) => headers.map((h) => escape(p[h])).join(','));
      const csv = [headers.join(','), ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="postings_export.csv"');
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="postings_export.json"');
    res.json(postings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed' });
  }
}

module.exports = { getPostings, getPostingById, exportPostings };