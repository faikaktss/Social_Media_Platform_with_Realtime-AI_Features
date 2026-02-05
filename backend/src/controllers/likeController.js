const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const toggleLike = asyncHandler(async (req, res, next) => {
    const {postId} = req.body;
    const {userId} = req.user;

    const post = await prisma.post.findUnique({
        where: {id: parseInt(postId)}
    });

    if (!post) {
        return next(new AppError('Post bulunamadı', 404));
    }

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: userId,
                postId: parseInt(postId)
            }
        }
    });

    if (existingLike) {
        await prisma.$transaction([
            prisma.like.delete({
                where: {id: existingLike.id}
            }),
            prisma.post.update({
                where: {id: parseInt(postId)},
                data: {likesCount: {decrement: 1}}
            })
        ]);

        return res.status(200).json({
            success: true,
            message: 'Beğeni kaldırıldı',
            isLiked: false
        });
    } else {
        await prisma.$transaction([
            prisma.like.create({
                data: {userId: userId, postId: parseInt(postId)}
            }),
            prisma.post.update({
                where: {id: parseInt(postId)},
                data: {likesCount: {increment: 1}}
            })
        ]);

        return res.status(200).json({
            success: true,
            message: 'Post beğenildi',
            isLiked: true
        });
    }
});

module.exports = {toggleLike};