const express = require('express');
const {createComment, getCommentsByPost , deleteComment} = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authMiddleware');
const {commentLimiter} = require('../middlewares/rateLimiter');

const router = express.Router();

//Todo: Yorum oluşturma
router.post('/', commentLimiter, authenticateToken, createComment);

//Todo: Bir postun yorumlarını getirme
router.get('/post/:postId', getCommentsByPost );

//Todo: Yorum silme
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;