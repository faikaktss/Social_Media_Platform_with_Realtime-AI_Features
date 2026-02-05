const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

//Todo: Kullanıcı kaydı yapıyorum (faik)
const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    //Todo: Kullanıcı var mı kontrol et (faik)
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
            ]
        }
    });

    if (existingUser) {
        return next(new AppError('Kullanıcı adı veya email zaten kayıtlı', 400));
    }

    //Todo: Şifre hashleme (faik)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    //Todo: Kullanıcı için bir jwt token oluştur
    const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});


const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    //Todo: Kullanıcıyı bul (faik)
    const user = await prisma.user.findUnique({
        where: { username: username }
    });

    if (!user) {
        return next(new AppError('Geçersiz kullanıcı adı veya şifre', 401));
    }

    //Todo: Şifre kontrolü
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return next(new AppError('Geçersiz kullanıcı adı veya şifre', 401));
    }

    //Todo: JWT token oluştur (faik)
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    res.status(200).json({
        success: true,
        message: 'Giriş başarılı',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});



module.exports = { register, login };