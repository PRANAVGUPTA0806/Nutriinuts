const asyncHandler = require("express-async-handler");

const HomeSliderModel = require("../models/HomeSliderModel");

//@desc Get all home pic
//@route GET /api/home

const gethome = asyncHandler(async (req, res) => {
  const products = await HomeSliderModel.find({});
  res.status(200).json(products);
});

//@desc Create New home pic
//@route POST /api/home
//@access private
const createhome = asyncHandler(async (req, res) => {
 
  const {
    productImageUrl,
    productName,
  } = req.body;

  // Check if all required fields are present
  if (!productImageUrl || !productName) {
    res.status(400);
    throw new Error("All Fields are mandatory!");
  }

  // Get the last inserted product to generate the next products_id (or handle it differently)
  const lastProduct = await HomeSliderModel.findOne().sort({ products_id: -1 });  // Sort by products_id in descending order
  const newProductId = lastProduct ? lastProduct.products_id + 1 : 1;  // Increment the last ID or start with 1

  // Create the new product with the auto-generated products_id
  const products = await HomeSliderModel.create({
    products_id: newProductId,
    productImageUrl,
    productName
  });

  res.status(201).json(products);
});


//@desc Delete home By Id
//@route DELETE /api/home/:id
//@access/private

const deletehomeById = asyncHandler(async (req, res) => {
  const products = await HomeSliderModel.findById(req.params.id);
  if (!products) {
    res.status(404);
    throw new Error("Product Not Found");
  }

  if (products._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other Product Details"
    );
  }
  await HomeSliderModel.deleteOne({ _id: req.params.id });
  res.status(200).json(products);
});

module.exports = {
  gethome,
  createhome,
  deletehomeById,
};
