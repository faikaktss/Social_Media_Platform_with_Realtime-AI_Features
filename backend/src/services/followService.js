const followRepository = require('../repositories/FollowRepository');
const userRepository = require('../repositories/UserRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function toggleFollow(currentUserId, targetUserId) {
    const existingFollow = await followRepository.findByFollowerAndFollowing(currentUserId, targetUserId);
    if (existingFollow) {
        await prisma.$transaction([
            prisma.follow.delete({ where: { id: existingFollow.id } }),
            prisma.user.update({
                where: { id: currentUserId },
                data: { followingCount: { decrement: 1 } }
            }),
            prisma.user.update({
                where: { id: targetUserId },
                data: { followerCount: { decrement: 1 } }
            })
        ]);
        return { isFollowing: false };
    } else {
        await prisma.$transaction([
            prisma.follow.create({
                data: { followerId: currentUserId, followingId: targetUserId }
            }),
            prisma.user.update({
                where: { id: currentUserId },
                data: { followingCount: { increment: 1 } }
            }),
            prisma.user.update({
                where: { id: targetUserId },
                data: { followerCount: { increment: 1 } }
            })
        ]);
        return { isFollowing: true };
    }
}

async function getFollowers(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await followRepository.findAll({
        where: { followingId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            createdAt: true,
            follower: {
                select: {
                    id: true,
                    username: true,
                    profilePic: true,
                    followerCount: true,
                    followingCount: true
                }
            }
        }
    });
}

async function getFollowing(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await followRepository.findAll({
        where: { followerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            createdAt: true,
            following: {
                select: {
                    id: true,
                    username: true,
                    profilePic: true,
                    followerCount: true,
                    followingCount: true
                }
            }
        }
    });
}

async function checkFollowStatus(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) return { isFollowing: false, isSelf: true };
    const follow = await followRepository.findByFollowerAndFollowing(currentUserId, targetUserId);
    return { isFollowing: !!follow, isSelf: false };
}

module.exports = {
    toggleFollow,
    getFollowers,
    getFollowing,
    checkFollowStatus
};