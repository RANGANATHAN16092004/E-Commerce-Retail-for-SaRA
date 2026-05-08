const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    qty: Number,
    price: Number,
    image: String,
    size: String,
    color: String
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  status: { type: String, default: 'Processing', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
