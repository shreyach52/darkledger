const connectDB = require('../db');
const KnownEvent = require('../models/KnownEvent');

const EVENTS = [
  { event_name: 'Operation Cronos', group: 'LockBit', date: new Date('2024-02-19'), description: 'Multi-agency takedown of LockBit infrastructure' },
  { event_name: 'ALPHV/BlackCat seizure', group: 'ALPHV', date: new Date('2023-12-19'), description: 'FBI seizure of ALPHV/BlackCat leak site' },
  { event_name: 'Hive takedown', group: 'Hive', date: new Date('2023-01-26'), description: 'FBI-led disruption of Hive ransomware infrastructure' },
];

async function seed() {
  await connectDB();
  await KnownEvent.deleteMany({});
  await KnownEvent.insertMany(EVENTS);
  console.log(`Seeded ${EVENTS.length} known events`);
  process.exit(0);
}

seed();