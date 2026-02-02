const express = require('express');
const {getProfile, updateProfile} = require('../controllers/userController');

const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

//Todo: Herkes profili görebilir Korumaya gerek yok 
router.get('/:username', getProfile)
//Todoo:Sadece giriş yapmış kullanıcı kendi profilini güncelleyebilir
router.put('/profile',authenticateToken, updateProfile);


module.exports = router;