const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

router.post('/validate', protect, validateCoupon);

module.exports = router;
