const express = require('express');
const {createPost, getAllPosts, getPost, updatePost, deletePost} = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware');
const { postLimiter } = require('../middlewares/rateLimiter');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.post('/',postLimiter,authenticateToken,...uploadSingleImage('image'),createPost);

router.get('/',authenticateToken,getAllPosts);

router.get('/:id',authenticateToken,getPost);

router.put('/:id',authenticateToken,updatePost);

router.delete('/:id',authenticateToken,deletePost);

module.exports = router;