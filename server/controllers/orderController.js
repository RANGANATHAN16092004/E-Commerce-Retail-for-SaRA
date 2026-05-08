const Order = require('../models/Order');
const { createRazorpayOrder, verifyPayment } = require('../utils/razorpay');

// Create new order
exports.addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not found, please login again' });
      return;
    }
    let razorpayOrder = null;
    let paymentResult = { status: 'Pending' };

    if (paymentMethod === 'Online') {
      if (!totalPrice || totalPrice <= 0) {
        res.status(400).json({ message: 'Invalid total price' });
        return;
      }
      razorpayOrder = await createRazorpayOrder(totalPrice);
      paymentResult = { id: razorpayOrder.id, status: 'Created' };
    } else {
      paymentResult = { id: 'COD-' + Date.now(), status: 'Cash on Delivery' };
    }
    
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || 'Online',
      paymentResult
    });

    const createdOrder = await order.save();
    res.status(201).json({ order: createdOrder, razorpayOrder });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// Verify payment
exports.updateOrderToPaid = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const isVerified = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (isVerified) {
    const order = await Order.findOne({ "paymentResult.id": razorpay_order_id });
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = { 
        id: razorpay_payment_id, 
        status: 'Paid',
        update_time: Date.now().toString()
      };
      await order.save();
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } else {
    res.status(400).json({ message: 'Invalid signature' });
  }
};

// User: Get my orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// Admin: Get all orders
exports.getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const User = require('../models/User');
const Product = require('../models/Product');

// Admin: Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    const products = await Product.find({});
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

    // Sales Velocity Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesOverTime = await Order.aggregate([
      { 
        $match: { 
          isPaid: true,
          paidAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ 
      totalSales: totalSales[0]?.total || 0, 
      totalOrders, 
      totalCustomers,
      totalStock,
      salesOverTime 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
// User: Cancel order (e.g. if payment fails)
exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to cancel this order' });
      return;
    }
    
    if (order.isPaid) {
      res.status(400).json({ message: 'Cannot cancel a paid order' });
      return;
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Admin: Update payment status (e.g. for COD)
exports.updatePaymentStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = req.body.isPaid;
    if (order.isPaid) {
      order.paidAt = Date.now();
      order.paymentResult = { 
        id: 'MANUAL-' + Date.now(), 
        status: 'Paid',
        update_time: Date.now().toString()
      };
    } else {
      order.paidAt = undefined;
      order.isPaid = false;
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
