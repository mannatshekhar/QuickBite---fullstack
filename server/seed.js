require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');
const data = require('./seedData');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Food.deleteMany({});
  await Food.insertMany(data);
  console.log(`✅ Seeded ${data.length} dishes`);
  process.exit(0);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
