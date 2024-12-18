const express = require('express');
const { saveRating,getUserRating } = require('../controllers/ratingController');

const router = express.Router();

// GET request to get user rating for a product
router.get('/rating/:userId/:productId', getUserRating);

// POST request to save a rating
router.post('/save-rating', saveRating);

module.exports = router;