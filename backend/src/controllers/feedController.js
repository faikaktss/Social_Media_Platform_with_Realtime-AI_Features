const feedService = require('../services/feedService');
const asyncHandler = require('../utils/asyncHandler');

const getHomeFeed = asyncHandler(async (req, res, next) => {
    const { userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { filterUserId, sortBy } = req.query;

    const result = await feedService.getHomeFeed(userId, page, limit, filterUserId, sortBy);

    if (result.emptyFeed) {
        return res.status(200).json({
            success: true,
            data: [],
            message: 'Henüz takip ettiğiniz kullanıcı yok ve siz de hiç paylaşım yapmadınız. Takip etmeye başlayarak veya paylaşım yaparak feedinizi doldurabilirsiniz!',
            pagination: {
                currentPage: page,
                totalPages: 0,
                totalPosts: 0,
                hasMore: false,
                limit
            }
        });
    }

    res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.totalPosts / limit),
            totalPosts: result.totalPosts,
            hasMore: page * limit < result.totalPosts,
            limit
        }
    });
});

module.exports = { getHomeFeed };