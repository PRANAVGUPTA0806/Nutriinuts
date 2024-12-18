const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { isAdmin, protect } = require("../middleware/authMiddleware");

// Route to create a new blog (Protected route for authenticated users)
router.post("/", isAdmin, blogController.createblog); 

// Route to get all blogs (Public route)
router.get("/", blogController.getblog);

// Route to get a single blog by ID (Public route)
router.get("/:id", blogController.getblogById);

// Route to update a blog by ID (Admin only)
router.put("/:id", isAdmin, blogController.updateblogById);

// Route to delete a blog by ID (Admin only)
router.delete("/:id", isAdmin, blogController.deleteblogById);


module.exports = router;
