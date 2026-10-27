const router = require('express').Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const keys = () => ({ id: process.env.RAZORPAY_KEY_ID, secret: process.env.RAZORPAY_KEY_SECRET });
const configured = () => {
  const { id, secret } = keys();
  return !!id && !!secret && !id.includes('xxxx') && !secret.includes('xxxx');
};
// Only the user who placed the order can pay for it
const findOrder = async (id, userId) => {
  try {
    const o = await Order.findById(id);
    return o && String(o.user) === String(userId) ? o : null;
  } catch { return null; }
};

// Step 1: create a Razorpay order for an existing (unpaid) QuickBite order
router.post('/create', auth, async (req, res) => {
  try {
    if (!configured())
      return res.status(503).json({ message: 'Online payments are not set up yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env and restart the server.' });
    const order = await findOrder(req.body.orderId, req.userId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'Paid') return res.status(400).json({ message: 'This order is already paid' });

    const { id, secret } = keys();
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64') },
      body: JSON.stringify({ amount: Math.round(order.total * 100), currency: 'INR', receipt: order.orderNumber }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ message: data?.error?.description || 'Razorpay rejected the request. Check your test keys.' });

    order.razorpayOrderId = data.id;
    await order.save();
    res.json({ keyId: id, razorpayOrderId: data.id, amount: data.amount, currency: data.currency, orderNumber: order.orderNumber });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Step 2: verify the signature Razorpay returns after payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await findOrder(orderId, req.userId);
    if (!order || !razorpay_signature || order.razorpayOrderId !== razorpay_order_id)
      return res.status(400).json({ message: 'Payment could not be verified' });

    const expected = crypto.createHmac('sha256', keys().secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const a = Buffer.from(expected), b = Buffer.from(String(razorpay_signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(400).json({ message: 'Payment signature mismatch' });
    }
    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;