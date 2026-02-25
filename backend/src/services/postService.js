const postRepository = require('../repositories/PostRepository');

async function createPost({ caption, imageUrl, userId }) {
    return await postRepository.createPost({ caption, imageUrl, userId });
}

async function getAllPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;//Todo:Veritabanı sorgularında sayfalama için skip ve take kullanımı
    return await postRepository.findAll({
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
    return await postRepository.findOne(
        { id },
        {
            select: {
                id: true,
                caption: true,
                imageUrl: true,
                likesCount: true,
                createdAt: true,
                user: { select: { id: true, username: true, profilePic: true } }
            }
        }
    );
}

async function updatePost(id, userId, data) {
    const post = await postRepository.findById(id);
    if (!post || post.userId !== userId) return null;
    return await postRepository.update(id, data);
}

async function deletePost(id, userId) {
    const post = await postRepository.findById(id);
    if (!post || post.userId !== userId) return null;
    await postRepository.delete(id);
    return true;
}

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };