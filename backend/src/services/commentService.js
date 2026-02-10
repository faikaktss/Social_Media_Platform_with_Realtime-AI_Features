const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createComment({ postId, content, userId }) {
    return await prisma.comment.create({
        data: { postId, content, userId }
    });
}

async function deleteComment(commentId, userId) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== userId) return null;
    await prisma.comment.delete({ where: { id: commentId } });
    return true;
}

async function getCommentsByPost(postId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, username: true, profilePic: true } }
        }
    });
}

async function getCommentsByUser(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await prisma.comment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            postId: true
        }
    });
}

async function updateComment(commentId, userId, content) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== userId) return null;
    return await prisma.comment.update({
        where: { id: commentId },
        data: { content }
    });
}

async function getCommentById(commentId) {
    return await prisma.comment.findUnique({
        where: { id: commentId },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, username: true, profilePic: true } },
            postId: true
        }
    });
}

module.exports = {
    createComment,
    deleteComment,
    getCommentsByPost,
    getCommentsByUser,
    updateComment,
    getCommentById
};