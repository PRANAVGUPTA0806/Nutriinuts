const asyncHandler = require("express-async-handler");

const allProductModel = require("../models/allProductsModel");

//@desc Get all Products
//@route GET /api/allProducts

const getProducts = asyncHandler(async (req, res) => {
  const products = await allProductModel.find({});
  res.status(200).json(products);
});

//@desc Create New Product
//@route POST /api/allProducts
//@access private
const createProducts = asyncHandler(async (req, res) => {
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
  const lastProduct = await allProductModel.findOne().sort({ products_id: -1 });  // Sort by products_id in descending order
  const newProductId = lastProduct ? lastProduct.products_id + 1 : 1;  // Increment the last ID or start with 1

  // Create the new product with the auto-generated products_id
  const products = await allProductModel.create({
    products_id: newProductId,
    productImageUrl,
    productName,
    productDescription,
    productPrice,
  });

  res.status(201).json(products);
});

//@desc GET Products by Id
//@route GET /api/allProducts/:id
//@access private

const getProductsById = asyncHandler(async (req, res) => {
  const products = await allProductModel.findById(req.params.id);
  if (!products) {
    res.status(404);
    throw new Error("Product Not Found");
  }
  res.status(200).json(products);
});

//@desc Update Products by Id
//@route PUT /api/allProducts/:id
//@access private

const updateProductsById = asyncHandler(async (req, res) => {
  // Fetch the product by ID
  const products = await allProductModel.findById(req.params.id);
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
  const updatedGifting = await allProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // Send the response with updated product
  res.status(200).json(updatedGifting);
});

//@desc Delete Products By Id
//@route DELETE /api/allProducts/:id
//@access/private

const deleteProductsById = asyncHandler(async (req, res) => {
  const products = await allProductModel.findById(req.params.id);
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
  await allProductModel.deleteOne({ _id: req.params.id });
  res.status(200).json(products);
});

module.exports = {
  getProducts,
  createProducts,
  getProductsById,
  updateProductsById,
  deleteProductsById,
};
