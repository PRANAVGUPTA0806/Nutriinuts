const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  applyDiscount,removeFromCart1,removeDiscount,
} = require("../controllers/cartController");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/", protect, removeFromCart);
router.delete("/clear", protect, clearCart);
router.post("/apply-discount", protect, applyDiscount);
router.post("/remove1", protect, removeFromCart1);
router.post("/remove-discount", protect, removeDiscount);

module.exports = router;
