const axios = require('axios');
const connectDB = require('../db');
const Posting = require('../models/Posting');
const { deriveSector } = require('./enrichSector');

// Ransomlook's API takes a date range: /api/posts/period/{from}/{to}
function getDateRange(daysBack = 2) {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - daysBack);

  const format = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD
  return { from: format(from), to: format(today) };
}

async function fetchRansomlook() {
  const { from, to } = getDateRange(2);
  const url = `https://www.ransomlook.io/api/posts/period/${from}/${to}`;

  try {
    const response = await axios.get(url);
    const posts = response.data;

    if (!Array.isArray(posts)) {
      console.error('Unexpected response shape:', posts);
      return [];
    }

    console.log(`Fetched ${posts.length} posts from ${from} to ${to}`);

    const parsed = posts.map(normalizePost);
    parsed.forEach((p) => console.log(p));

    return parsed;
  } catch (err) {
    console.error('Failed to fetch ransomlook data:', err.message);
    return [];
  }
}

// Heuristic only — RansomLook's API does not send an explicit status field.
// We infer "disclosed" vs "pending_disclosure" from whether a real
// description/title exists yet, since placeholder entries (e.g. "Q... E...",
// "To be announced...") represent victims not yet named by the group.
function getStatus(raw) {
  const hasRealDescription =
    raw.description &&
    raw.description.trim() !== '' &&
    raw.description.trim().toLowerCase() !== 'to be announced...';

  const placeholderPattern = /^([A-Z]\.\.\.\s*)+$/;
const hasRealTitle =
  raw.post_title && !placeholderPattern.test(raw.post_title.trim());

  return hasRealDescription || hasRealTitle ? 'disclosed' : 'pending_disclosure';
}

// Maps raw API fields to our internal schema shape
function normalizePost(raw) {
  return {
    misp_uuid: raw.misp_uuid,
    post_title: raw.post_title || null,
    group_name: raw.group_name || null,
    description: raw.description || null,
    discovered: raw.discovered ? new Date(raw.discovered) : null,
    link: raw.link || null,
    screen: raw.screen || null,
    sector: deriveSector(raw.description),
    country: null,  // derived later, in enrichment step
    status: getStatus(raw),
    source: 'ransomlook.io',
    first_seen: new Date(),
    last_seen: new Date(),
  };
}

async function upsertPosts(posts) {
  let inserted = 0;
  let updated = 0;

  for (const post of posts) {
    if (!post.misp_uuid) continue; // skip anything without a stable ID

    const existing = await Posting.findOne({ misp_uuid: post.misp_uuid });

    if (existing) {
      // Already seen — refresh fields that may have changed
      // (e.g. a "pending_disclosure" entry later gets a real description)
      existing.description = post.description;
      existing.post_title = post.post_title;
      existing.status = post.status;
      existing.last_seen = new Date();
      await existing.save();
      updated++;
    } else {
      await Posting.create(post);
      inserted++;
    }
  }

  console.log(`Upsert complete — inserted: ${inserted}, updated: ${updated}`);
}

// Run directly with: node fetchRansomlook.js
if (require.main === module) {
  (async () => {
    await connectDB();
    const posts = await fetchRansomlook();
    await upsertPosts(posts);
    process.exit(0);
  })();
}

module.exports = { fetchRansomlook, normalizePost, getStatus, upsertPosts };