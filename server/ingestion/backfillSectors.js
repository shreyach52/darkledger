const connectDB = require('../db');
const Posting = require('../models/Posting');
const { deriveSector } = require('./enrichSector');

async function backfill() {
  await connectDB();
  const posts = await Posting.find({ sector: null });
  console.log(`Backfilling sector for ${posts.length} posts...`);

  for (const p of posts) {
    p.sector = deriveSector(p.description);
    await p.save();
  }

  console.log('Backfill complete.');
  process.exit(0);
}

backfill();