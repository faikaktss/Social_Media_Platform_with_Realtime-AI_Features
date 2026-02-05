const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const createPost = asyncHandler(async (req, res, next) => {
    const {caption, imageUrl} = req.body;
    const { userId } = req.user;
    
    if (!imageUrl) {
        return next(new AppError('Görsel URL si gerekli', 400));
    }

    const newPost = await prisma.post.create({
        data: {
            caption,
            imageUrl,
            userId: userId
        }
    });

    res.status(201).json({
        success: true,
        message: 'Post başarıyla oluşturuldu',
        post: newPost
    });
});

const getAllPosts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
            skip: skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                caption: true,
                imageUrl: true,
                likesCount: true,
                createdAt: true,
                user: {
                    select: { 
                        id: true,
                        username: true, 
                        profilePic: true 
                    }
                },
                _count: {
                    select: { likes: true }
                }
            }
        }),
        prisma.post.count()
    ]);

    res.status(200).json({
        success: true,
        data: posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            hasMore: page * limit < totalPosts,
            limit
        }
    });
});

module.exports = {createPost, getAllPosts};