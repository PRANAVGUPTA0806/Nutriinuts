const asyncHandler = require("express-async-handler");

const giftingModel = require("../models/giftingModel");

//@desc Get all gifting
//@route GET /api/allgifting

const getgifting = asyncHandler(async (req, res) => {
  const products = await giftingModel.find({});
  res.status(200).json(products);
});

//@desc Create New Gifting
//@route POST /api/gifting
//@access private
const creategifting = asyncHandler(async (req, res) => {
 
  const {
    productImageUrl,
    productName,
    productDescription,
    productPrice,
  } = req.body;

  // Check if all required fields are present
  if (!productImageUrl || !productName || !productDescription || !productPrice) {
    res.status(400);
    throw new Error("All Fields are mandatory!");
  }

  // Get the last inserted product to generate the next products_id (or handle it differently)
  const lastProduct = await giftingModel.findOne().sort({ products_id: -1 });  // Sort by products_id in descending order
  const newProductId = lastProduct ? lastProduct.products_id + 1 : 1;  // Increment the last ID or start with 1

  // Create the new product with the auto-generated products_id
  const products = await giftingModel.create({
    products_id: newProductId,
    productImageUrl,
    productName,
    productDescription,
    productPrice,
  });

  res.status(201).json(products);
});

//@desc GET gifting by Id
//@route GET /api/gifting/:id
//@access private

const getgiftingById = asyncHandler(async (req, res) => {
  const products = await giftingModel.findById(req.params.id);
  if (!products) {
    res.status(404);
    throw new Error("Product Not Found");
  }
  res.status(200).json(products);
});

//@desc Update gifting by Id
//@route PUT /api/gifting/:id
//@access private

const updategiftingById = asyncHandler(async (req, res) => {

  // Fetch the product by ID
  const products = await giftingModel.findById(req.params.id);
  // If product not found, throw an error
  if (!products) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the product belongs to the user (optional check)
  if (products._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update other products");
  }

  // Perform the update
  const updatedGifting = await giftingModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // Send the response with updated product
  res.status(200).json(updatedGifting);
});


//@desc Delete gifting By Id
//@route DELETE /api/gifting/:id
//@access/private

const deletegiftingById = asyncHandler(async (req, res) => {
  const products = await giftingModel.findById(req.params.id);
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
  await giftingModel.deleteOne({ _id: req.params.id });
  res.status(200).json(products);
});

module.exports = {
  getgifting,
  creategifting,
  getgiftingById,
  updategiftingById,
  deletegiftingById,
};
