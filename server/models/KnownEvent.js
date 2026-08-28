const mongoose = require('mongoose');

const knownEventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  group: String,
  date: { type: Date, required: true },
  description: String,
});

module.exports = mongoose.model('KnownEvent', knownEventSchema);