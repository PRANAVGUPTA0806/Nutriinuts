// models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  discountCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dis: {
    type: Number,
    required: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
