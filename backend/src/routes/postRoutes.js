const express = require('express');
const {createPost, getAllPosts} = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware');
const { postLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/',postLimiter,authenticateToken,createPost);

router.get('/',getAllPosts);

module.exports = router;