const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPost({ caption, imageUrl, userId }) {
    return await prisma.post.create({
        data: { caption, imageUrl, userId }
    });
}

async function getAllPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;//Todo:Veritabanı sorgularında sayfalama için skip ve take kullanımı
    return await prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            caption: true,
            imageUrl: true,
            likesCount: true,
            createdAt: true,
            user: { select: { id: true, username: true, profilePic: true } }
        }
    });
}

async function getPostById(id) {
    return await prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            caption: true,
            imageUrl: true,
            likesCount: true,
            createdAt: true,
            user: { select: { id: true, username: true, profilePic: true } }
        }
    });
}

async function updatePost(id, userId, data) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) return null;
    return await prisma.post.update({ where: { id }, data });
}

async function deletePost(id, userId) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) return null;
    await prisma.post.delete({ where: { id } });
    return true;
}

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };