const express = require('express');
const {register,login} = require('../controllers/authController');

const router = express.Router();

//Todo:Kullanıcı kayıt kısmı
router.post('/register',register);

//Todo:Kullanıcı giriş kısmı
router.post('/login',login);

module.exports = router;