const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartid: {
      type: String,
      required: true,
    },

    // Detailed Order Summary
    order_summary: {
      items: [
        {
          products_id: { type: String, required: true },
          productImageUrl: { type: String },
          productName: { type: String, required: true },
          quantity: { type: Number, required: true },
          productPrice: { type: Number, required: true },
          productDescription: { type: String },
        },
      ],
      total_price: {
        type: Number,
        required: true,
      },
      total_tax: {
        type: Number,
        required: true,
        default: 0,
      },
      shipping_fee: {
        type: Number,
        required: true,
        default: 0,
      },
      order_date: {
        type: Date,
        default: Date.now, // This will store date and time when the order is created
      },
      discount: {
        type: Number,
        default: 0,
      },
      final_price: {
        type: Number,
        required: true,
      },
      delivery_status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending',
      },
      payment_status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
      },
      // Payment History for complex payment handling
      payment_history: [
        {
          payment_method: { type: String }, // e.g., Credit Card, PayPal
          transaction_id: { type: String },
          payment_status: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
          },
          payment_date: {
            type: Date,
            default: Date.now, // This will store date and time for payment
          },
        },
      ],
    },
    // Billing Information
    billing_information: {
      billing_address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }, // Optionally add phone number to billing
      },
      payment_method: { type: String, default: '' },
      transaction_id: { type: String, default: '' },
    },
    // Shipping Information
    shipping_information: {
      shipping_address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
      },
      shipping_method: {
        type: String,
        enum: ['', 'Standard Shipping', 'Express Shipping', 'Next-Day Shipping'],
        default: 'Standard Shipping',
      },
      tracking_number: { type: String }, // Add this once available from the carrier
      estimated_delivery_date: { type: Date }, // To store the estimated delivery date and time
    },
    // Order History for tracking status changes over time
    order_history: [
      {
        status: {
          type: String,
          enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
          default: 'Pending',
        },
        updated_at: {
          type: Date,
          default: Date.now, // Store date and time of status updates
        },
        remarks: { type: String, default: '' }, // Optional remarks explaining status change
      },
    ],
    // Refund Information
    refund_information: {
      refund_status: {
        type: String,
        enum: ['None', 'Requested', 'Processed', 'Rejected','Refunded'],
        default: 'None',
      },
      refund_amount: { type: Number, default: 0 }, // Ensure this is a Number
      refund_date: { type: Date, default: Date.now }, // Store refund date and time
    },
    // Timestamps for created and updated dates
    timestamps: {
      created_at: { type: Date, default: Date.now }, // Automatically tracks creation date and time
      updated_at: { type: Date, default: Date.now }, // Automatically tracks last update date and time
    },
  },
  { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt' fields
);

// Middleware to automatically update 'updated_at' field on save
OrderSchema.pre('save', function (next) {
  this.updated_at = Date.now();

  if (this.shipping_information && this.shipping_information.shipping_address) {
    this.shipping_information.estimated_delivery_date = new Date(this.updated_at + 9 * 24 * 60 * 60 * 1000); // Add 9 days for estimated delivery
  }
  next();
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
