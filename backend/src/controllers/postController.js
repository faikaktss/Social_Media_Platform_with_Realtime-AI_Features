const postService = require('../services/postService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const createPost = asyncHandler(async (req, res, next) => {
    const { caption } = req.body;
    const { userId } = req.user;
    if (!req.file) return next(new AppError('Lütfen bir resim dosyası yükleyin', 404));
    const imageUrl = `/uploads/${req.file.filename}`;
    const newPost = await postService.createPost({ caption, imageUrl, userId });
    res.status(201).json({ success: true, data: newPost });
});

const getAllPosts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const posts = await postService.getAllPosts(page, limit);
    res.status(200).json({ success: true, data: posts });
});

const getPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await postService.getPostById(parseInt(id));
    if (!post) return next(new AppError('Post bulunamadı', 404));
    res.status(200).json({ success: true, data: post });
});

const updatePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.user;
    const updated = await postService.updatePost(parseInt(id), userId, req.body);
    if (!updated) return next(new AppError('Post güncelleme yetkiniz yok veya post bulunamadı', 403));
    res.status(200).json({ success: true, data: updated });
});

const deletePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.user;
    const deleted = await postService.deletePost(parseInt(id), userId);
    if (!deleted) return next(new AppError('Post silme yetkiniz yok veya post bulunamadı', 403));
    res.status(200).json({ success: true, message: 'Post silindi' });
});

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };