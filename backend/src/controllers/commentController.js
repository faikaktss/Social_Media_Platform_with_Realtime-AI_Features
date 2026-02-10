const commentService = require('../services/commentService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const createComment = asyncHandler(async (req, res, next) => {
    const { postId, content } = req.body;
    const { userId } = req.user;
    if (!content || !postId) return next(new AppError('Yorum veya postId eksik', 400));
    const comment = await commentService.createComment({ postId: parseInt(postId), content, userId });
    res.status(201).json({ success: true, data: comment });
});

const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = req.user;
    const deleted = await commentService.deleteComment(parseInt(commentId), userId);
    if (!deleted) return next(new AppError('Yorum silme yetkiniz yok veya yorum bulunamadı', 403));
    res.status(200).json({ success: true, message: 'Yorum silindi' });
});

const getCommentsByPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const comments = await commentService.getCommentsByPost(parseInt(postId), page, limit);
    res.status(200).json({ success: true, data: comments });
});

const getCommentsByUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const comments = await commentService.getCommentsByUser(parseInt(userId), page, limit);
    res.status(200).json({ success: true, data: comments });
});

const updateComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;
    if (!content) return next(new AppError('Yorum içeriği boş olamaz', 400));
    const updated = await commentService.updateComment(parseInt(commentId), userId, content);
    if (!updated) return next(new AppError('Yorum güncelleme yetkiniz yok veya yorum bulunamadı', 403));
    res.status(200).json({ success: true, data: updated });
});

const getCommentById = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await commentService.getCommentById(parseInt(commentId));
    if (!comment) return next(new AppError('Yorum bulunamadı', 404));
    res.status(200).json({ success: true, data: comment });
});

module.exports = {
    createComment,
    deleteComment,
    getCommentsByPost,
    getCommentsByUser,
    updateComment,
    getCommentById
};