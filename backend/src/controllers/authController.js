const authService = require('../services/authService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    const existingUser = await authService.findExistingUser(username, email);
    if (existingUser) {
        return next(new AppError('Kullanıcı adı veya email zaten kayıtlı', 400));
    }

    const hashedPassword = await authService.hashPassword(password);
    const newUser = await authService.createUser(username, email, hashedPassword);
    const token = authService.generateToken(newUser);

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

    const user = await authService.findUserByUsername(username);
    if (!user) {
        return next(new AppError('Geçersiz kullanıcı adı veya şifre', 401));
    }

    const validPassword = await authService.comparePassword(password, user.password);
    if (!validPassword) {
        return next(new AppError('Geçersiz kullanıcı adı veya şifre', 401));
    }

    const token = authService.generateToken(user);

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

const search = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    if (!query) return next(new AppError('Arama sorgusu boş olamaz', 400));
    const users = await authService.searchUsers(query);
    res.status(200).json({
        success: true,
        data: users
    });
});

module.exports = { register, login, search };