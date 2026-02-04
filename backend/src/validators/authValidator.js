const Joi = require('joi');

// Todo: Register için validation kuralları
const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()             
        .min(3)           
        .max(30)            
        .required()            
        .messages({
            'string.alphanum': 'Kullanıcı adı sadece harf ve rakam içerebilir',
            'string.min': 'Kullanıcı adı en az 3 karakter olmalı',
            'string.max': 'Kullanıcı adı en fazla 30 karakter olabilir',
            'any.required': 'Kullanıcı adı zorunludur'
        }),

    email: Joi.string()
        .email()              
        .required()
        .messages({
            'string.email': 'Geçerli bir email adresi giriniz',
            'any.required': 'Email adresi zorunludur'
        }),

    password: Joi.string()
        .min(6)                
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))  
        .required()
        .messages({
            'string.min': 'Şifre en az 6 karakter olmalı',
            'string.pattern.base': 'Şifre en az 1 küçük harf, 1 büyük harf ve 1 rakam içermelidir',
            'any.required': 'Şifre zorunludur'
        })
});

// Todo:Login için validation kuralları (daha basit)
const loginSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'any.required': 'Kullanıcı adı zorunludur'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Şifre zorunludur'
        })
});

module.exports = {
    registerSchema,
    loginSchema
};