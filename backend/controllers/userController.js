const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { userPhoneNoValidation } = require("../config/phoneNoConfig");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,  // SMTP server from .env
    port: process.env.SMTP_PORT,  // SMTP port from .env
    secure: process.env.SMTP_PORT == 465,  // True for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from .env
        pass: process.env.EMAIL_PASS,  // Your email password from .env
    },
});

// Verify the SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Error connecting to SMTP:', error);
    } else {
        console.log('SMTP1 connection successful:', success);
    }
});

// const validatePhoneNumber = require("../models/userModel");
// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password || !phoneNumber) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  if(!userPhoneNoValidation(phoneNumber)){
    res.status(400);
    // throw new Error("Please provide a valid phone number");
  }
 
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,

  });

  if (user) {
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      imageUrl: user.imageUrl,
      token,
    });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (user.isDeleted) {
    return res.status(400).json({ success: false, error: "User account is deleted. Please contact support." });
  }
  if (user && (await bcrypt.compare(password, user.password))) {
    const tokenExpiry = rememberMe ? "7d" : "1d";
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });
    let role1;
    if (user.isAdmin){
      role1='admin'
    }else {
      role1='user'
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      token,
      role:role1
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    let role1;
    if (user.isAdmin){
      role1='admin'
    }else {
      role1='user'
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      imageUrl:user.imageUrl,
      role:role1
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Request password reset link
// @route   POST /api/user/forgot-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isDeleted) {
    res.status(403);
    throw new Error("Cannot reset password for a deleted user.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiration
  await user.save();

  const frontendUrl = req.headers.origin; // Get the request origin (domain)
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `Hello ${user.name},<br><br>
      You requested a password reset.<br>
      Click <a href="${resetUrl}">here</a> to reset your password.<br>
      Please note that this link will expire in 1 hour.<br>
      If you did not request a password reset, please ignore this email.<br>
      Thank you!<br><br>
      Best regards,<br>
      The NutriiNuts Team`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send reset email." });
  }
});


// @desc    Reset user password
// @route   POST /api/user/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    if (user.isDeleted) {
      return res.status(400).json({ success: false, message: 'User account is deleted. Please contact support.' });
    }

    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
    user.resetToken = undefined; // Clear reset token
    user.resetTokenExpire = undefined; // Clear token expiration
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Error in resetting password:', error); // Log the actual error
    res.status(500).json({ success: false, message: 'Server error while resetting password' });
  }
});
// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.imageUrl = req.body.avatar || user.imageUrl;


    const updatedUser = await user.save();

    // Generate new JWT token
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber:updatedUser.phoneNumber,
      imageUrl: updatedUser.imageUrl,
      token,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});
// @desc    Get all users (Admin only)
// @route   GET /api/user/all-users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // Exclude password field

  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("No users found");
  }
});

// @desc    Update user by Admin
// @route   PUT /api/user/update-admin/:id
// @access  Private/Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, isAdmin,phoneNumber, imageUrl } = req.body;

  // Find the user by id
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Update user fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber=phoneNumber||user.phoneNumber;
  user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
  user.imageUrl = imageUrl || user.imageUrl;
  
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    updatedUser,
  });
});


const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set isDeleted to true
    user.isDeleted = true;
    user.userStatus='Deactivated';

    await user.save();

    res.status(200).json({ message: 'User marked as deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set isDeleted to false
    user.isDeleted = false;
    user.userStatus='Active';

    await user.save();

    res.status(200).json({ message: 'User restored successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  requestPasswordReset,getAllUsers,updateUserByAdmin,deleteUserByAdmin,restoreUserByAdmin,
};
