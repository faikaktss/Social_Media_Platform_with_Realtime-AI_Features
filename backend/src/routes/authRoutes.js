const express = require('express');
const {register,login} = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const {registerSchema,loginSchema} = require('../validators/authValidator');
const {authLimiter} = require('../middlewares/rateLimiter');

const router = express.Router();

//Todo:Kullanıcı kayıt kısmı
router.post('/register',authLimiter,validate(registerSchema),register);
//Todo:Kullanıcı giriş kısmı
router.post('/login',authLimiter,validate(loginSchema),login);

module.exports = router;


