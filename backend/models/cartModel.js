const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    products: [
      {
        products_id: { type: mongoose.Schema.Types.ObjectId, ref: "allProducts", required: true },  // Updated to ObjectId
        productImageUrl: { type: String },
        productName: { type: String, required: true },
        productDescription: { type: String },
        productPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        totalPrice: { type: Number }
      },
    ], 
    discountCode: { type: String },
    totalPrice: { type: Number, default: 0 }, 
    totalQuantity: { type: Number, default: 0 },
    tax:{type: Number, default: 0} ,
    subtotal:{type: Number, default: 0},
    delivery:{type: Number, default: 0},
    dis:{type: Number, default: 0},
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
