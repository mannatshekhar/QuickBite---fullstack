const router = require('express').Router();
const Food = require('../models/Food');
const adminAuth = require('../middleware/adminAuth');

// GET /api/foods?q=&category=&veg=true&featured=true&all=true
router.get('/', async (req, res) => {
  try {
    const { q, category, veg, featured, all } = req.query;
    const filter = {};
    if (all !== 'true') filter.available = true;
    if (category && category !== 'All') filter.category = category;
    if (veg === 'true') filter.isVeg = true;
    if (featured === 'true') filter.featured = true;
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: rx }, { description: rx }, { category: rx }];
    }
    const foods = await Food.find(filter).sort({ featured: -1, rating: -1 });
    res.json(foods);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    res.status(201).json(await Food.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ message: 'Dish not found' });
    res.json(food);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
