// uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Multer Configuration (Memory storage)
const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage });

// POST route for image upload
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;