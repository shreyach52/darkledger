const connectDB = require('../db');
const Posting = require('../models/Posting');
const { getStatus } = require('./fetchRansomlook');

async function backfill() {
  await connectDB();
  const posts = await Posting.find({});
  console.log(`Re-checking status for ${posts.length} posts...`);

  let changed = 0;
  for (const p of posts) {
    const correctStatus = getStatus({ description: p.description, post_title: p.post_title });
    if (p.status !== correctStatus) {
      console.log(`${p.post_title}: ${p.status} -> ${correctStatus}`);
      p.status = correctStatus;
      await p.save();
      changed++;
    }
  }

  console.log(`Backfill complete. ${changed} posts corrected.`);
  process.exit(0);
}

backfill();