const commentRepository = require('../repositories/CommentRepository');

async function createComment({ postId, content, userId }) {
    return await commentRepository.createComment({ postId, content, userId });
}

async function deleteComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);
    if (!comment || comment.userId !== userId) return null;
    await commentRepository.delete(commentId);
    return true;
}

async function getCommentsByPost(postId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await commentRepository.findAll({
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
    return await commentRepository.findAll({
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
    const comment = await commentRepository.findById(commentId);
    if (!comment || comment.userId !== userId) return null;
    return await commentRepository.updateComment(commentId, content);
}

async function getCommentById(commentId) {
    return await commentRepository.findOne(
        { id: commentId },
        {
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: { select: { id: true, username: true, profilePic: true } },
                postId: true
            }
        }
    );
}

module.exports = {
    createComment,
    deleteComment,
    getCommentsByPost,
    getCommentsByUser,
    updateComment,
    getCommentById
};