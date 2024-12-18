// routes/userRoutes.js

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,resetPassword,
  requestPasswordReset,getAllUsers,updateUserByAdmin,deleteUserByAdmin,restoreUserByAdmin,
} = require("../controllers/userController");

const { protect ,isAdmin} = require("../middleware/authMiddleware");

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for getting the user profile
router.get("/profile", protect, getUserProfile);

// Route for updating the user profile
router.put("/profile", protect, updateUserProfile);

router.delete('/delete-user/:userId', isAdmin, deleteUserByAdmin);

router.get("/all-users",isAdmin, getAllUsers); // Route to get all users by only admin
router.put("/update-admin/:id", isAdmin, updateUserByAdmin); 
router.put('/restore-user/:userId', isAdmin, restoreUserByAdmin);

// Route for requesting password reset
router.post('/forgot-password', requestPasswordReset);

// Route for resetting password
router.patch('/reset-password/:resetToken', resetPassword);

module.exports = router;
