const mongoose = require('mongoose');

const groupAliasSchema = new mongoose.Schema({
  canonical_name: { type: String, required: true, unique: true },
  aliases: [String],
});

module.exports = mongoose.model('GroupAlias', groupAliasSchema);