const router = require('express').Router();
const Order = require('../models/Order');
const Food = require('../models/Food');
const adminAuth = require('../middleware/adminAuth');
const { auth } = require('../middleware/auth');
const { calcTotals } = require('../pricing');

// Place an order. Prices are re-read from MongoDB so the client can't tamper with them.
router.post('/', auth, async (req, res) => {
  try {
    const { items, customer, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Your cart is empty' });
    if (!customer?.name || !customer?.phone || !customer?.address)
      return res.status(400).json({ message: 'Name, phone and address are required' });
    if (!/^[0-9+\-\s]{7,15}$/.test(customer.phone)) return res.status(400).json({ message: 'Enter a valid phone number' });

    const foods = await Food.find({ _id: { $in: items.map((i) => i.foodId) }, available: true });
    const map = new Map(foods.map((f) => [String(f._id), f]));
    const lines = [];
    for (const i of items) {
      const f = map.get(String(i.foodId));
      const qty = Math.max(1, Math.min(20, parseInt(i.qty, 10) || 1));
      if (!f) return res.status(400).json({ message: 'A dish in your cart is no longer available. Remove it and try again.' });
      lines.push({ food: f._id, name: f.name, price: f.price, qty, image: f.image });
    }
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const totals = calcTotals(subtotal);
    const orderNumber = 'QB' + Date.now().toString().slice(-7) + Math.floor(Math.random() * 90 + 10);

    const order = await Order.create({
      orderNumber,
      user: req.userId,
      items: lines,
      customer: { ...customer, phone: customer.phone.replace(/\s+/g, '') },
      ...totals,
      paymentMethod: paymentMethod === 'Online' ? 'Online' : 'COD',
      paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Pay on delivery',
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: all orders (must come before '/:id')
router.get('/admin/all', adminAuth, async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }).limit(200));
});

// Order history of the signed-in user
router.get('/', auth, async (req, res) => {
  res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 }));
});

router.patch('/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body;
  if (!Order.STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

module.exports = router;