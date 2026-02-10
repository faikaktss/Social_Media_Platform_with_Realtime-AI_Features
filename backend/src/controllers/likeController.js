const likeService = require('../services/likeService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const toggleLike = asyncHandler(async (req, res, next) => {
    const { postId } = req.body;
    const { userId } = req.user;
    if (!postId) return next(new AppError('postId eksik', 400));
    const result = await likeService.toggleLike(parseInt(postId), userId);
    res.status(200).json({ success: true, ...result });
});

const getLikeCount = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const count = await likeService.getLikeCount(parseInt(postId));
    res.status(200).json({ success: true, count });
});

const isPostLikedByUser = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const liked = await likeService.isPostLikedByUser(parseInt(postId), userId);
    res.status(200).json({ success: true, liked });
});

const getLikesByPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const likes = await likeService.getLikesByPost(parseInt(postId), page, limit);
    res.status(200).json({ success: true, data: likes });
});

module.exports = {
    toggleLike,
    getLikeCount,
    isPostLikedByUser,
    getLikesByPost
};