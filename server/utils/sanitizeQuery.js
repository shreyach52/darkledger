// Coerces a req.query value to a plain string, rejecting anything that
// isn't a string (e.g. objects from bracket-notation like ?group[$ne]=1,
// or arrays from ?group=a&group=b). This stops Mongo operator injection
// where a query param would otherwise be interpolated straight into a
// Mongoose filter object.
function toSafeString(value) {
  if (typeof value !== 'string') return undefined;
  return value;
}

// Applies toSafeString to a whitelist of query keys and returns a clean
// object containing only the keys that were present and valid.
function sanitizeQuery(query, allowedKeys) {
  const clean = {};
  for (const key of allowedKeys) {
    const safe = toSafeString(query[key]);
    if (safe !== undefined) clean[key] = safe;
  }
  return clean;
}

module.exports = { sanitizeQuery, toSafeString };