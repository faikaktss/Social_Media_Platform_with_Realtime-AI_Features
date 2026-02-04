const express = require('express');
const {toggleLike} = require('../controllers/likeController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();


//Todo: beğenme işlemi sadece giriş yapmış kullanıcılar tarafından yapılabilir
router.post('/toggle', authenticateToken,toggleLike);

module.exports = router;