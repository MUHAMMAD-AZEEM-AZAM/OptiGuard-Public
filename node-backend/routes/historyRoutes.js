const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const History = require('../models/history');
const { getUserHistory ,clearHistory,addFeedback} = require('../controllers/historyController');


router.get('/', auth, getUserHistory);
router.post('/feedback',auth,addFeedback)
router.delete('/', auth, clearHistory); 

module.exports = router; 