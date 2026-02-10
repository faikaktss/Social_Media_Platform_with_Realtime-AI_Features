const followService = require('../services/followService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const toggleFollow = asyncHandler(async (req, res, next) => {
    const { userId: targetUserId } = req.params;
    const { userId: currentUserId } = req.user;
    if (parseInt(targetUserId) === currentUserId)
        return next(new AppError('Kendinizi takip edemezsiniz', 400));
    const result = await followService.toggleFollow(currentUserId, parseInt(targetUserId));
    res.status(200).json({ success: true, ...result });
});

const getFollowers = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const followers = await followService.getFollowers(parseInt(userId), page, limit);
    res.status(200).json({ success: true, data: followers });
});

const getFollowing = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const following = await followService.getFollowing(parseInt(userId), page, limit);
    res.status(200).json({ success: true, data: following });
});

const checkFollowStatus = asyncHandler(async (req, res, next) => {
    const { userId: targetUserId } = req.params;
    const { userId: currentUserId } = req.user;
    const status = await followService.checkFollowStatus(currentUserId, parseInt(targetUserId));
    res.status(200).json({ success: true, ...status });
});

module.exports = {
    toggleFollow,
    getFollowers,
    getFollowing,
    checkFollowStatus
};