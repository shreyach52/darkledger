const Posting = require('../models/Posting');
const { sanitizeQuery } = require('../utils/sanitizeQuery');

// GET /postings?group=&sector=&country=&status=&from=&to=&page=&limit=
async function getPostings(req, res) {
  try {
    const { group, sector, country, status, from, to } = sanitizeQuery(req.query, [
      'group', 'sector', 'country', 'status', 'from', 'to',
    ]);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));

    const filter = {};
    if (group) filter.group_name = group;
    if (sector) filter.sector = sector;
    if (country) filter.country = country;
    if (status) filter.status = status;
    if (from || to) {
      filter.discovered = {};
      if (from && !isNaN(Date.parse(from))) filter.discovered.$gte = new Date(from);
      if (to && !isNaN(Date.parse(to))) filter.discovered.$lte = new Date(to);
      if (Object.keys(filter.discovered).length === 0) delete filter.discovered;
    }

    const skip = (page - 1) * limit;

    const [postings, total] = await Promise.all([
      Posting.find(filter).sort({ discovered: -1 }).skip(skip).limit(limit),
      Posting.countDocuments(filter),
    ]);

    res.json({ total, page, limit, results: postings });
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
    const { format, group, status, from, to } = sanitizeQuery(req.query, [
      'format', 'group', 'status', 'from', 'to',
    ]);

    const filter = {};
    if (group) filter.group_name = group;
    if (status) filter.status = status;
    if (from || to) {
      filter.discovered = {};
      if (from && !isNaN(Date.parse(from))) filter.discovered.$gte = new Date(from);
      if (to && !isNaN(Date.parse(to))) filter.discovered.$lte = new Date(to);
      if (Object.keys(filter.discovered).length === 0) delete filter.discovered;
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