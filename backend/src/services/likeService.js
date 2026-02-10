const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function toggleLike(postId, userId) {
    const existingLike = await prisma.like.findUnique({
        where: { userId_postId: { userId, postId } }
    });
    if (existingLike) {
        await prisma.$transaction([
            prisma.like.delete({ where: { id: existingLike.id } }),
            prisma.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            })
        ]);
        return { isLiked: false };
    } else {
        await prisma.$transaction([
            prisma.like.create({ data: { userId, postId } }),
            prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            })
        ]);
        return { isLiked: true };
    }
}

async function getLikeCount(postId) {
    return await prisma.like.count({ where: { postId } });
}

async function isPostLikedByUser(postId, userId) {
    const like = await prisma.like.findUnique({
        where: { userId_postId: { userId, postId } }
    });
    return !!like;
}

async function getLikesByPost(postId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await prisma.like.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            createdAt: true,
            user: { select: { id: true, username: true, profilePic: true } }
        }
    });
}

module.exports = {
    toggleLike,
    getLikeCount,
    isPostLikedByUser,
    getLikesByPost
};