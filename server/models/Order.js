const mongoose = require('mongoose');

const STATUSES = ['Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema(
  {
        orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      address: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    total: Number,
     paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: { type: String, default: 'Pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, enum: STATUSES, default: 'Placed' },
  },
  { timestamps: true }
);

orderSchema.statics.STATUSES = STATUSES;
module.exports = mongoose.model('Order', orderSchema);
