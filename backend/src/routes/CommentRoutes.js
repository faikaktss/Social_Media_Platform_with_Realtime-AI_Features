const express = require('express');
const {createComment, getCommentsByPost, deleteComment, updateComment, getCommentsByUser, getCommentById} = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authMiddleware');
const {commentLimiter} = require('../middlewares/rateLimiter');

const router = express.Router();

//Todo: Yorum oluşturma
router.post('/', commentLimiter, authenticateToken, createComment);

//Todo: Bir postun yorumlarını getirme
router.get('/post/:postId', getCommentsByPost);

//Todo: Belirli bir yorumu getirme
router.get('/:commentId', getCommentById);

//Todo: Kullanıcının yorumlarını getirme
router.get('/user/:userId', getCommentsByUser);

//Todo: Yorum güncelleme
router.put('/:commentId', authenticateToken, updateComment);

//Todo: Yorum silme
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;