const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrdersDetailsControllers.js');
const { isAdmin, protect } = require('../middleware/authMiddleware.js');

// Route to create a new order
router.post('/orders', protect, orderController.createOrder);

// Route to get all orders (Admin only)
router.get('/admin/orders', isAdmin, orderController.getAllOrders);

// Route to get a single order by ID for a user
router.get('/my-orders/:orderId', protect, orderController.getOrderById);

// Route to update order status (Admin only)
router.patch('/admin/order-status/:orderId', isAdmin, orderController.updateOrderStatus);

// Route to cancel an order (User only)
router.patch('/my-orders/cancel/:orderId', protect, orderController.cancelOrder);

// Route to add payment information (User only)
router.patch('/my-orders/payment/:orderId', protect, orderController.addPaymentInfo);

// Route to update shipping details (Admin only)
router.patch('/admin/order-shipping/:orderId', isAdmin, orderController.updateShippingDetails);

// Route to process refund (Admin only)
router.patch('/admin/refund-order/:orderId', isAdmin, orderController.processRefund);
router.patch('/:orderId', isAdmin, orderController.updateOrder);
// Route to get all orders (user)
router.post('/my-orders', protect, orderController.getOrders);

module.exports = router;
