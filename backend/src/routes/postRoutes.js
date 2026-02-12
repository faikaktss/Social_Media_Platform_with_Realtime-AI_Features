const express = require('express');
const {createPost, getAllPosts} = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware');
const { postLimiter } = require('../middlewares/rateLimiter');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.post('/',postLimiter,authenticateToken,...uploadSingleImage('image'),createPost);

router.get('/',authenticateToken,getAllPosts);

module.exports = router;