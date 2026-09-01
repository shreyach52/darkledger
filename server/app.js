const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const postingsRoutes = require('./routes/postings');
const statsRoutes = require('./routes/stats');
const ingestRoutes = require('./routes/ingest');
const app = express();

// Only allow requests from the deployed frontend (and localhost in dev).
// Set CLIENT_ORIGIN in your .env, e.g. https://darkledger.vercel.app
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow no-origin requests (curl, server-to-server, health checks)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

// General limiter for the public read endpoints — generous enough for
// normal dashboard use, tight enough to stop scraping/abuse of your infra.
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for the ingest trigger, since it's already secret-gated
// but shouldn't be brute-forceable.
const ingestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/postings', publicLimiter, postingsRoutes);
app.use('/stats', publicLimiter, statsRoutes);
app.use('/ingest', ingestLimiter, ingestRoutes);

module.exports = app;