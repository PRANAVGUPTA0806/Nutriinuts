const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProducts,
  getProductsById,
  updateProductsById,
  deleteProductsById,
} = require("../controllers/allProductsController");

router.route("/").get(getProducts).post(createProducts);
router
  .route("/:id")
  .get(getProductsById)
  .put(updateProductsById)
  .delete(deleteProductsById);

module.exports = router;
