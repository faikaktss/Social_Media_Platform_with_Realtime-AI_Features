const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const createPost = asyncHandler(async(req,res,next) =>{
    const {caption} = req.body;
    const {userId} = req.user;

    //Todo:dosyayı body'den almıyorum çünkü multer ile işlemi yapıp req.file içine atıyorum
    if(!req.file)
        return next(new AppError('Lütfen bir resim dosyası yükleyin',404));

    //Todo: Resim url'sini oluşturuyorum
    const imageUrl = `/uploads/${req.file.filename}`;

    const newPost = await prisma.post.create({
        data:{
            caption,
            imageUrl,
            userId:userId
        }
    });

    res.status(201).json({
        success:true,
        data:newPost
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