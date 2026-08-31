const express = require('express');
const cors = require('cors');

const postingsRoutes = require('./routes/postings');
const statsRoutes = require('./routes/stats');
const ingestRoutes = require('./routes/ingest');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/postings', postingsRoutes);
app.use('/stats', statsRoutes);
app.use('/ingest', ingestRoutes);

module.exports = app;