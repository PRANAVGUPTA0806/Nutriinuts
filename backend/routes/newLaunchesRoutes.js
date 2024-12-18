const express = require("express");

const router = express.Router();

const {
  getnewLaunches,
  createnewLaunches,
  getnewLaunchesById,
  updatenewLaunchesById,
  deletenewLaunchesById,
} = require("../controllers/newLaunchesController");

router.route("/").get(getnewLaunches).post(createnewLaunches);
router
  .route("/:id")
  .get(getnewLaunchesById)
  .put(updatenewLaunchesById)
  .delete(deletenewLaunchesById);

module.exports = router;
