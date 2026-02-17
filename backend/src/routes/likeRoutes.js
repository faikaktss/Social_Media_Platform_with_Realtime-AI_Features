const express = require('express');
const {toggleLike, getLikeCount, isPostLikedByUser, getLikesByPost} = require('../controllers/likeController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();


//Todo: beğenme işlemi sadece giriş yapmış kullanıcılar tarafından yapılabilir
router.post('/toggle', authenticateToken, toggleLike);

//Todo: Beğeni sayısını getir
router.get('/count/:postId', getLikeCount);

//Todo: Post beğenildi mi kontrol et
router.get('/check/:postId', authenticateToken, isPostLikedByUser);

//Todo: Postun beğenilerini listele
router.get('/post/:postId', getLikesByPost);

module.exports = router;