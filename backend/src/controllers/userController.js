const e = require('express');
const userService = require('../services/userService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res, next) => {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user) return next(new AppError('Kullanıcı bulunamadı', 404));
    res.json({ user });
});

const updateProfile = asyncHandler(async (req, res, next) => {
    const errors = [];
    const { email } = req.body;
    if (email === undefined || String(email).trim() === '') {
        errors.push('Email zorunlu ve boş olamaz');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Eksik veya hatalı alanlar var',
            errors
        });
    }

    const { userId } = req.user;
    const updated = await userService.updateProfile(userId, req.body);
    res.json({ user: updated });
});

const search = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    if (!query) return next(new AppError('Arama sorgusu boş olamaz', 400));
    const users = await userService.searchUsers(query);
    res.status(200).json({ success: true, data: users });
});

const getUserList = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const users = await userService.getUsers(page, limit);
    res.status(200).json({ success: true, data: users });
});

const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.user;
    await userService.deleteUser(userId);
    res.status(204).send();
});

module.exports = {
    getProfile,
    updateProfile,
    search,
    getUserList,
    deleteUser
};