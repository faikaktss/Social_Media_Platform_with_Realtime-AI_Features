const followRepository = require('../repositories/FollowRepository');
const postRepository = require('../repositories/PostRepository');
const likeRepository = require('../repositories/LikeRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function calculateTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        yıl: 31536000,
        ay: 2592000,
        hafta: 604800,
        gün: 86400,
        saat: 3600,
        dakika: 60
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) return `${interval} ${unit} önce`;
    }
    return 'Az önce';
}

async function getHomeFeed(currentUserId, page = 1, limit = 10, filterUserId, sortBy = 'newest') {
    const skip = (page - 1) * limit;

    // Takip edilen kullanıcılar
    const followingIds = await followRepository.getFollowingUserIds(currentUserId);
    followingIds.push(currentUserId);

    // Kimseyi takip etmiyorsa ve postu yoksa
    if (followingIds.length === 1 && followingIds[0] === currentUserId) {
        const hasPosts = await postRepository.count({ userId: currentUserId });
        if (hasPosts === 0) {
            return {
                posts: [],
                totalPosts: 0,
                emptyFeed: true
            };
        }
    }

    const whereCondition = filterUserId
        ? { userId: parseInt(filterUserId) }
        : { userId: { in: followingIds } };

    const orderBy = sortBy === 'popular'
        ? [{ likesCount: 'desc' }, { createdAt: 'desc' }]
        : [{ createdAt: 'desc' }];

    const [posts, totalPosts] = await Promise.all([
        postRepository.findAll({
            where: whereCondition,
            skip,
            take: limit,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true,
                        followerCount: true
                    }
                },
                _count: { select: { comments: true } }
            }
        }),
        postRepository.count(whereCondition)
    ]);

    // Her post için ek bilgiler
    const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
            const isLiked = await likeRepository.findByUserAndPost(currentUserId, post.id);
            const isFollowingOwner = post.userId === currentUserId
                ? null
                : followingIds.includes(post.userId);

            return {
                id: post.id,
                caption: post.caption,
                imageUrl: post.imageUrl,
                likesCount: post.likesCount,
                commentsCount: post._count.comments,
                createdAt: post.createdAt,
                timeAgo: calculateTimeAgo(post.createdAt),
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    profilePic: post.user.profilePic,
                    followerCount: post.user.followerCount
                },
                isLikedByCurrentUser: !!isLiked,
                isFollowingOwner: isFollowingOwner,
                isOwnPost: post.userId === currentUserId
            };
        })
    );

    return {
        posts: postsWithDetails,
        totalPosts,
        emptyFeed: false
    };
}

module.exports = { getHomeFeed };