const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware.js');
const { submitFeedback, getAllFeedback,deleteFeedback } = require('../controllers/feedbackControllers');

const router = express.Router();

router.post('/submit', submitFeedback);
router.get('/feedbacks', isAdmin,getAllFeedback); // GET route to retrieve feedback
router.delete('/feedback/:id', isAdmin, deleteFeedback); 

module.exports = router;
