// routes/offerRoutes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { protect,isAdmin } = require("../middleware/authMiddleware");

// Route to create an offer
router.post('/offers',isAdmin, offerController.createOffer);

// Route to get all offers
router.get('/offers', offerController.getOffers);

// Route to get an offer by ID
router.get('/offers/:id', offerController.getOfferById);

// Route to update an offer by ID
router.put('/offers/:id',isAdmin, offerController.updateOffer);

// Route to delete an offer by ID
router.delete('/offers/:id',isAdmin, offerController.deleteOffer);

module.exports = router;
