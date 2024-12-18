const mongoose = require("mongoose");

const allProductsSchema = mongoose.Schema(
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
      required: [true, "Please Add Product Name"],
    },
    productDescription: {
      type: String,
      required: [true, "Please Add Product Description"],
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

module.exports = mongoose.model("allProducts", allProductsSchema);
