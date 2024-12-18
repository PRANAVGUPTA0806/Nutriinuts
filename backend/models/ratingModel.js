const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productModel: {
    type: String,
    required: true,
    enum: ['allProducts', 'newLaunches', 'gifting'],  // List of models the productId can refer to
  },
  rating: {
    type: Number,
    required: true,
    default: 5,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Use refPath to dynamically reference the correct model
ratingSchema.virtual('product', {
  ref: function(doc) {
    return doc.productModel; // Use productModel to determine which model to reference
  },
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
