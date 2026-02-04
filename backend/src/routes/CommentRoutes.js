const express = require('express');
const {createComment, getCommnentsByPost , deleteComment} = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

//Todo: Yorum oluşturma
router.post('/', authenticateToken, createComment);

//Todo: Bir postun yorumlarını getirme
router.get('/post/:postId', getCommnentsByPost );

//Todo: Yorum silme
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;