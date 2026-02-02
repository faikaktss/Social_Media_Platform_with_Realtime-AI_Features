const express = require('express');
const {createPost, getAllPosts} = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/',authenticateToken,createPost);

router.get('/',getAllPosts);

module.exports = router;