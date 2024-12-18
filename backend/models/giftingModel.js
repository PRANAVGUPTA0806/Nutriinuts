const mongoose = require("mongoose");

const giftingSchema = mongoose.Schema(
  {
    products_id: {
      type: String,
      required: true,
      ref: "User",
    },
    productImageUrl: {
      type: String,
      required: [true, "Please Add Product Image URL"],
    },
    productName: {
      type: String,
      require: [true, "Please Add Product Name"],
    },
    productDescription: {
      type: String,
      require: [true, "Please Add Product Description"],
    },
    productPrice: {
      type: String,
      required: [true, "Please Add Product Price"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("gifting", giftingSchema);
