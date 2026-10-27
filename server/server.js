require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Food = require('./models/Food');
const seedData = require('./seedData');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : true }));
app.use(express.json());

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', razorpay: !!process.env.RAZORPAY_KEY_ID })
);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

if (!uri || uri.includes('<username>')) {
  console.error('\n❌ MONGO_URI is not set. Open server/.env and paste your MongoDB Atlas connection string.\n');
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 12000 })
  .then(async () => {
    console.log('✅ MongoDB Atlas connected:', mongoose.connection.name);
    if ((await Food.countDocuments()) === 0) {
      await Food.insertMany(seedData);
      console.log(`🍔 Empty database detected - seeded ${seedData.length} sample dishes`);
    }
    app.listen(PORT, () => console.log(`🚀 QuickBite API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('\n❌ Could not connect to MongoDB Atlas:', err.message);
    console.error('   Check: (1) username/password in MONGO_URI  (2) Atlas > Network Access allows your IP (0.0.0.0/0)');
    console.error('   (3) special characters in the password must be URL-encoded (e.g. @ becomes %40)\n');
    process.exit(1);
  });
