const express = require('express');
const router = express.Router();
const { contactUs, submitFeedback } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { subscribe } = require('../controllers/mailChimpController');

// Protected routes - require authentication
router.post('/contact', auth, contactUs);
router.post('/feedback', auth, submitFeedback);
router.post('/subscribe', auth, subscribe)

module.exports = router;