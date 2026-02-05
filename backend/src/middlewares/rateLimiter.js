const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max:100,
    message:{
        success:false,
        error:'Çok fazla istek gönderdiniz , Lütfen 15 dakika sonra tekrar deneyiniz.'
    },
    standardHeaders:true, //Todo: Modern standart format
    legacyHeaders:false //Todo: Eski format
})


//Todo: Kimlik doğrulama işlemleri için özel bir rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:5,
    skipSuccessfulRequests:true, //Todo: Başarılı istekleri saymaz
    message:{
        success:false,
        error:'Çok fazla başarısız giriş denemesi,Lütfen 15 dakika sonra tekrar deneyiniz.'
    }
})


//Todo: Post oluşturma işlemleri için özel bir rate limiter
const postLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:10,
    message:{
        success:false,
        error:'Çok fazla post oluşturma isteği, Lütfen 15 dakika sonra tekrar deneyiniz.'
    }
})

//Todo: Yorum oluşturma için limit
const commentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max:30,
    message:{
        success:false,
        error:'Çok fazla yorum gönderme isteği , Lütfen 15 dakika sonra tekrar deneyiniz'
    }
})


module.exports = {
    generalLimiter,
    authLimiter,
    postLimiter,
    commentLimiter
};