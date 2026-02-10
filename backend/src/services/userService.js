const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true,
            followerCount: true,
            followingCount: true,
            createdAt: true
        }
    });
}

async function getUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true,
            followerCount: true,
            followingCount: true,
            createdAt: true
        }
    });
}

async function updateProfile(userId, data) {
    return await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true,
            followerCount: true,
            followingCount: true,
            createdAt: true
        }
    });
}

async function searchUsers(query, limit = 10) {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: query,
                mode: 'insensitive' //Todo: Büyük/küçük harf duyarsız arama
            }
        },
        take: limit,
        select: {
            id: true,
            username: true,
            profilePic: true,
            bio: true
        }
    });
}

async function getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
        skip,
        take: limit,
        select: {
            id: true,
            username: true,
            profilePic: true,
            bio: true
        }
    });
}

async function deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
}

module.exports = {
    getUserById,
    getUserByUsername,
    updateProfile,
    searchUsers,
    getUsers,
    deleteUser
};