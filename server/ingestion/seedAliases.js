const connectDB = require('../db');
const GroupAlias = require('../models/GroupAlias');

const KNOWN_ALIASES = [
  { canonical_name: 'ALPHV', aliases: ['blackcat', 'alphv', 'alphv-blackcat'] },
  { canonical_name: 'LockBit', aliases: ['lockbit', 'lockbit5', 'lockbit3', 'lockbit 3.0'] },
  { canonical_name: 'Royal', aliases: ['royal', 'blacksuit'] }, // Royal rebranded to BlackSuit, 2023
  { canonical_name: 'BlackMatter', aliases: ['blackmatter', 'darkside'] }, // DarkSide -> BlackMatter, 2021
  { canonical_name: 'Qilin', aliases: ['qilin', 'agenda'] },
];

async function seed() {
  await connectDB();
  for (const entry of KNOWN_ALIASES) {
    await GroupAlias.findOneAndUpdate(
      { canonical_name: entry.canonical_name },
      entry,
      { upsert: true }
    );
  }
  console.log(`Seeded ${KNOWN_ALIASES.length} alias groups`);
  process.exit(0);
}

seed();