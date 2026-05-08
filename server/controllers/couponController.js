const Coupon = require('../models/Coupon');

// Create a coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minAmount, expiryDate } = req.body;
    const coupon = await Coupon.create({ code, discountType, discountValue, minAmount, expiryDate });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all coupons (Admin)
exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404).json({ message: 'Coupon not found' });
  }
};

// Validate a coupon
exports.validateCoupon = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: Date.now() } });
  
  if (coupon) {
    res.json(coupon);
  } else {
    res.status(400).json({ message: 'Invalid or expired coupon' });
  }
};

