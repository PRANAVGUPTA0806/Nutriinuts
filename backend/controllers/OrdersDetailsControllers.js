const Order = require('../models/OrdersDetailModel');
const User = require('../models/userModel');
// Create a new order
const createOrder = async (req, res) => {
  try {
    const { cartid, order_summary, billing_information, shipping_information } = req.body;

    // Check if an order with the same cartid already exists
    const existingOrder = await Order.findOne({ cartid: cartid, userId: req.user._id });

    if (existingOrder) {
      // Update the existing order
      existingOrder.order_summary = order_summary; // Update necessary fields
      existingOrder.billing_information = billing_information;
      existingOrder.shipping_information = shipping_information;

      const updatedOrder = await existingOrder.save();

      return res.status(200).json({ message: 'Order updated successfully', order: updatedOrder, id: updatedOrder._id });
    }

    // If no existing order, create a new order
    const newOrder = new Order({
      userId: req.user._id,
      cartid: cartid,
      order_summary,
      billing_information,
      shipping_information
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: savedOrder, id: savedOrder._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
};


// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email phoneNumber').sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
// Get all orders for a user
const getOrders = async (req, res) => { 
  try {
    let userId = req.user?._id; // Check if req.user._id exists

    // If userId is undefined, use the email from the request body to find the user
    if (!userId && req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        userId = user._id;
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Retrieve orders that belong to the user
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    
    if (orders && orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: 'No orders found for this user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Get a single order by ID for a user
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the order', details: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.order_history.push({ status, updated_at: Date.now(), remarks: req.body.remarks });
    order.order_summary.delivery_status = status;
    await order.save();
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.order_summary.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be canceled' });
    }
    order.order_summary.status = 'Cancelled';
    order.order_history.push({ status: 'Cancelled', updated_at: Date.now(), remarks: 'Order cancelled by user' });
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel the order', details: error.message });
  }
};

// Add payment information
const addPaymentInfo = async (req, res) => {
  try {
    const { payment_method, transaction_id, payment_status } = req.body;
    
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.order_summary.payment_status = payment_status || 'Pending';
    order.order_summary.payment_history.push({
      payment_method,
      transaction_id,
      payment_status,
      payment_date: Date.now()
    });

    await order.save();
    res.status(200).json({ message: 'Payment added successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add payment', details: error.message });
  }
};

// Update shipping details
const updateShippingDetails = async (req, res) => {
  try {
    const { shipping_method, tracking_number, estimated_delivery_date } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.shipping_information.shipping_method = shipping_method;
    order.shipping_information.tracking_number = tracking_number;
    order.shipping_information.estimated_delivery_date = estimated_delivery_date;

    order.order_history.push({ status: 'Shipped', updated_at: Date.now(), remarks: 'Shipping details updated' });

    await order.save();
    res.status(200).json({ message: 'Shipping details updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipping details', details: error.message });
  }
};

// Process refund
const processRefund = async (req, res) => {
  const { refund_status, refund_amount } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.refund_information.refund_status = refund_status || 'Requested';
    order.refund_information.refund_amount = refund_amount;
    order.refund_information.refund_date = Date.now();
    order.order_summary.payment_status = 'Refunded';

    order.order_history.push({ status: 'Refunded', updated_at: Date.now(), remarks: `Refund of $${refund_amount} processed` });

    await order.save();
    res.status(200).json({ message: 'Refund processed successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process refund', details: error.message });
  }
};
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const {
    delivery_status,
    shipping_method,
    tracking_number,
    estimated_delivery_date,
    refund_status,
    refund_amount,
  } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields only if they exist in the request body
    if (delivery_status) order.order_summary.delivery_status = delivery_status;

    if (shipping_method) order.shipping_information.shipping_method = shipping_method;
    if (tracking_number) order.shipping_information.tracking_number = tracking_number;
    if (estimated_delivery_date) {
      order.shipping_information.estimated_delivery_date = new Date(estimated_delivery_date);
    }

    if (refund_status) order.refund_information.refund_status = refund_status || 'Requested';
    if (refund_amount) {
      order.refund_information.refund_amount = refund_amount;
      order.refund_information.refund_date = refund_status === 'Refunded' ? Date.now() : null;

      order.order_summary.payment_status = 'Refunded';

      // Add refund status to order history
      order.order_history.push({
        status: 'Refunded',
        updated_at: Date.now(),
        remarks: `Refund of $${refund_amount} processed`,
      });
    }

    await order.save();
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  addPaymentInfo,
  updateShippingDetails,
  processRefund,
  getOrders,updateOrder
};