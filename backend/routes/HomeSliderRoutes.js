const express = require("express");

const router = express.Router();

const {
  gethome,
  createhome,
  deletehomeById,
} = require("../controllers/HomeSliderController");

router.route("/").get(gethome).post(createhome);
router
  .route("/:id")
  .delete(deletehomeById);

module.exports = router;
