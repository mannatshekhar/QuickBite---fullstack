const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, signToken } = require('../middleware/auth');

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Enter your name' });
    if (!EMAIL_RX.test(email || '')) return res.status(400).json({ message: 'Enter a valid email address' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'An account with this email already exists. Sign in instead.' });

    const user = await User.create({ name, email, phone: phone || '', passwordHash: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: signToken(user._id), user: user.toSafe() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash)))
      return res.status(401).json({ message: 'Wrong email or password' });
    res.json({ token: signToken(user._id), user: user.toSafe() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: 'Account not found. Please sign in again' });
  res.json(user.toSafe());
});

router.put('/me', auth, async (req, res) => {
  const { name, phone, address } = req.body;
  const patch = {};
  if (name?.trim()) patch.name = name.trim();
  if (typeof phone === 'string') patch.phone = phone.replace(/\s+/g, '');
  if (typeof address === 'string') patch.address = address;
  const user = await User.findByIdAndUpdate(req.userId, patch, { new: true });
  res.json(user.toSafe());
});

module.exports = router;