const GroupAlias = require('../models/GroupAlias');

let cache = null;

async function loadAliasMap() {
  if (cache) return cache;
  const all = await GroupAlias.find();
  cache = new Map();
  for (const entry of all) {
    for (const alias of entry.aliases) {
      cache.set(alias.toLowerCase(), entry.canonical_name);
    }
  }
  return cache;
}

async function resolveGroup(rawName) {
  const map = await loadAliasMap();
  return map.get((rawName || '').toLowerCase()) || rawName;
}

module.exports = { resolveGroup, loadAliasMap };