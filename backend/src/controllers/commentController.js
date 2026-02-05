const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

//Todo: Yorum ekleme
const createComment = asyncHandler(async (req, res, next) => {
    const {postId, content} = req.body;
    const {userId} = req.user;
    
    if (!content || content.trim().length === 0) {
        return next(new AppError('Yorum içeriği boş olamaz', 400));
    }

    const post = await prisma.post.findUnique({where: {id: parseInt(postId)}});
    if (!post) {
        return next(new AppError('Post bulunamadı', 404));
    }

    const newComment = await prisma.comment.create({
        data: {
            content: content.trim(),
            userId: userId,
            postId: parseInt(postId)
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profilePic: true
                }
            }
        }
    });

    res.status(201).json({
        success: true,
        message: 'Yorum eklendi',
        comment: newComment
    });
});

//Todo: Postun yorumlarını getirme
const getCommentsByPost = asyncHandler(async (req, res, next) => {
    const {postId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
        prisma.comment.findMany({
            where: {postId: parseInt(postId)},
            skip: skip,
            take: limit,
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true
                    }
                }
            }
        }),
        prisma.comment.count({where: {postId: parseInt(postId)}})
    ]);

    res.status(200).json({
        success: true,
        data: comments,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit),
            totalComments,
            hasMore: page * limit < totalComments,
            limit
        }
    });
});

//Todo: Yorum silme
const deleteComment = asyncHandler(async (req, res, next) => {
    const {commentId} = req.params;
    const {userId} = req.user;

    const comment = await prisma.comment.findUnique({where: {id: parseInt(commentId)}});

    if (!comment) {
        return next(new AppError('Yorum bulunamadı', 404));
    }

    if (comment.userId !== userId) {
        return next(new AppError('Bu yorumu silme yetkiniz yok', 403));
    }

    await prisma.comment.delete({where: {id: parseInt(commentId)}});

    res.status(200).json({
        success: true,
        message: 'Yorum silindi'
    });
});

module.exports = {createComment, getCommentsByPost, deleteComment};