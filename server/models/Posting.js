const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema({
  misp_uuid: { type: String, required: true, unique: true },
  post_title: String,
  group_name: String,
  description: String,
  discovered: Date,
  link: String,
  screen: String,
  sector: { type: String, default: null },
  country: { type: String, default: null },
  status: {
    type: String,
    enum: ['disclosed', 'pending_disclosure', 'removed'],
    default: 'pending_disclosure',
  },
  source: { type: String, default: 'ransomlook.io' },
  first_seen: { type: Date, default: Date.now },
  last_seen: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Posting', postingSchema);