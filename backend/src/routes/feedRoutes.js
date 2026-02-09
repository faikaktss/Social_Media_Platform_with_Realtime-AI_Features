const express = require('express');
const {getHomeFeed} = require('../controllers/feedController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/home',authenticateToken,getHomeFeed);

module.exports = router;