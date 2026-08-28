const cron = require('node-cron');
const connectDB = require('../db');
const { fetchRansomlook, upsertPosts } = require('./fetchRansomlook');

async function runIngestion() {
  console.log(`[${new Date().toISOString()}] Running ingestion...`);
  const posts = await fetchRansomlook();
  await upsertPosts(posts);
}

async function startCron() {
  await connectDB();

  // Runs every 4 hours — adjust as needed
  cron.schedule('0 */4 * * *', runIngestion);

  console.log('Cron scheduler started — ingestion will run every 4 hours');

  // Run once immediately on startup too, so you're not waiting 4 hours to see data
  runIngestion();
}

startCron();