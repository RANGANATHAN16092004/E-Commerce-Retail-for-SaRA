const express = require('express');
const router = express.Router();
const { addOrderItems, updateOrderToPaid, getMyOrders, getOrders, updateOrderStatus, getAnalytics, cancelOrder, updatePaymentStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.post('/verify', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/pay', protect, admin, updatePaymentStatus);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/:id', protect, require('../controllers/orderController').getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);


module.exports = router;
