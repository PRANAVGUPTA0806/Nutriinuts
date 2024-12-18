const express = require("express");

const router = express.Router();

const {
  getgifting,
  creategifting,
  getgiftingById,
  updategiftingById,
  deletegiftingById,
} = require("../controllers/giftingController");

router.route("/").get(getgifting).post(creategifting);
router
  .route("/:id")
  .get(getgiftingById)
  .put(updategiftingById)
  .delete(deletegiftingById);

module.exports = router;
