const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; // Amount is passed in request body
  const options = {
    amount: amount * 100, // amount in paise (smallest unit of INR)
    currency: "INR",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order); // Send the order details back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating payment order.");
  }
});

// Verify Payment Signature
router.post("/verify-signature", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generatedSignature = crypto.createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.status(200).send("Payment verified successfully");
  } else {
    res.status(400).send("Invalid payment signature");
  }
});

  
module.exports = router;