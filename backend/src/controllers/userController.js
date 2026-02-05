const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

//Todo: Kullanıcı profilini görüntüleme 
const getProfile = asyncHandler(async (req, res, next) => {
    const {username} = req.params;

    // Todo: Paralel sorgular: Kullanıcı bilgisi Post sayısı Like sayısı
    const [user, postCount, likeCount] = await Promise.all([
        prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                username: true,
                email: true,
                profilePic: true,
                bio: true,
                createdAt: true
            }
        }),
        prisma.post.count({ where: { user: { username } } }),
        prisma.like.count({ where: { user: { username } } })
    ]);

    if (!user) {
        return next(new AppError('Kullanıcı bulunamadı', 404));
    }

    res.status(200).json({
        success: true,
        user: {
            ...user,
            stats: {
                postsCount: postCount,
                likesGiven: likeCount
            }
        }
    });
});

//Todo: Profil Güncelleme
const updateProfile = asyncHandler(async (req, res, next) => {
    const { userId } = req.user;
    const { profilePic, bio } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(profilePic && { profilePic }),
            ...(bio && { bio })
        },
        select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            bio: true
        }
    });

    res.status(200).json({
        success: true,
        message: 'Profil güncellendi',
        user: updatedUser
    });
});
 
module.exports = {getProfile, updateProfile};