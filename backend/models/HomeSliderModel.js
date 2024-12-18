const mongoose = require("mongoose");

const HomeSliderSchema = mongoose.Schema(
  {
    products_id: {
      type: String,
      required: true,
    },
    productImageUrl: {
      type: String,
      required: [true, "Please Add Product Image URL"],
    },
    productName: {
      type: String,
      require: [true, "Please Add Product Name"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeSlider", HomeSliderSchema);
