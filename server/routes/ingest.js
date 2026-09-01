const express = require('express');
const router = express.Router();
const { fetchRansomlook, upsertPosts } = require('../ingestion/fetchRansomlook');

// A simple shared-secret check so random people can't trigger this endlessly
router.get('/run', async (req, res) => {
  const secret = req.headers['x-ingest-secret'];
  if (secret !== process.env.INGEST_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const posts = await fetchRansomlook();
    await upsertPosts(posts);
    res.json({ status: 'ok', fetched: posts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ingestion failed' });
  }
});

module.exports = router;