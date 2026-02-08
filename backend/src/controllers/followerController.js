const {PrismaClient} = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();


//Todo: Takip et /Takipten çık işlemi yapıyorum

const toggleFollow = asyncHandler(async(req,res,next) =>{
    const {userId:targetUserId} = req.params;
    const {userId:currentUserId} = req.user;
    const targetId = parseInt(targetUserId);

    if(targetId === currentUserId)
        return next(new AppError('Kendinizi takip edemezsiniz',400));

    //Todo: Hedef kullanıcı var mı kontrol ediyorum
    const targetUser = await prisma.user.findUnique({
        where:{id:targetId}
    });

    if(!targetUser)
        return next(new AppError('Kullanıcı bulunamadı',400));
    //Todo: zaten takip ediyor mu diye kontrol ediyorum
    const existingFollow = await prisma.follow.findUnique({
        where:{
            followerId_followingId:{
                followerId:currentUserId,
                followingId:targetId
            }
        }
    });

    if(existingFollow){
        await prisma.$transaction([
            prisma.follow.delete({
                where:{id:existingFollow.id}
            }),
            prisma.user.update({
                where:{id:currentUserId},
                data:{followingCount:{decrement:1}}
            }),
            prisma.user.update({
                where:{id:targetId},
                data:{followerCount:{decrement:1}}
            })
        ]);

        return res.status(200).json({
            success:true,
            message:'Takipten çıkıldı',
            isFollowing:false
        });
    }else{
        await prisma.$transaction([
            prisma.follow.create({
                data:{
                    followerId:currentUserId,
                    followingId:targetId
                }
            }),

            prisma.user.update({
                where:{id:currentUserId},
                data:{followingCount:{increment:1}}
            }),

            prisma.user.update({
                where:{id:targetId},
                data:{followerCount:{increment:1}}
            })
        ]);

        return res.status(200).json({
            success:true,
            message:'Takip Edildi',
            isFollowing:true
        });
    }
});


//Todo: Takipçi listesini getiriyorum
const getFollowers = asyncHandler(async(req,res,next)=>{
    const {userId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;


    //Todo: Kullanıcı var mı kontrol ediyorum
    const user = await prisma.user.findUnique({
        where:{id:parseInt(userId)}
    });

    if(!user)
        return next(new AppError('Kullanıcı bulunamadı',404));

    const[followers, totalFollowers] = await Promise.all([
        prisma.follow.findMany({
            where:{followingId:parseInt(userId)},
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'},
            select :{
                id:true,
                createdAt:true,
                follower:{
                    select:{
                        id:true,
                        username:true,
                        profilePic:true,
                        followerCount:true,
                        followingCount:true
                    }
                }
            }
        }),

        prisma.follow.count({
            where:{followingId:parseInt(userId)}
        })
    ]);

    //Todo:Db yapısını direkt front'a vermiyorum
    const formattedFollowers = followers.map(follow =>({
        userId:follow.follower.id,
        username:follow.follower.username,
        profilePic:follow.follower.profilePic,
        followerCount:follow.follower.followerCount,
        followingCount:follow.follower.followingCount,
        followedAt:follow.createdAt
    }));

    res.status(200).json({
        success:true,
        data:formattedFollowers,
        pagination:{
            currentPage:page,
            totalPages:Math.ceil(totalFollowers/limit),
            totalFollowers,
            hasMore:page*limit<totalFollowers,
            limit
        }
    });
});


//Todo: Takip edilen listesi
const getFollowing = asyncHandler(async(req,res,next)=>{
    const {userId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20,100);
    const skip = (page-1)*limit;

    const user = await prisma.user.findUnique({
        where:{id:parseInt(userId)}
    });

    if(!user)
        return next(new AppError('Kullanıcı buluanamadı',404));

    const [following,totalFollowing,] = await Promise.all([
        prisma.follow.findMany({
            where:{followerId:parseInt(userId)},
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'},
            select:{
                id:true,
                createdAt:true,
                following:{
                    select:{
                        id:true,
                        username:true,
                        profilePic:true,
                        followerCount:true,
                        followingCount:true
                    }
                }
            }
        }),

        prisma.follow.count({
            where:{followerId:parseInt(userId)}
        })
    ]);

  const formattedFollowing = following.map(follow => ({
    userId: follow.following.id,
    username: follow.following.username,
    profilePic: follow.following.profilePic,
    followerCount: follow.following.followerCount,
    followingCount: follow.following.followingCount,
    followedAt: follow.createdAt
  }));

  res.status(200).json({
    success:true,
    data:formattedFollowing,
    pagination:{
        currentPage:page,
        totalPages:Math.ceil(totalFollowing/limit),
        hasMore:page*limit<totalFollowing,
        limit
    }
  });
});



const checkFollowStatus = asyncHandler(async(req,res,next)=>{
    const {userId:targetUserId} = req.params;
    const {userId:currentUserId} = req.user; //Todo: Token olduğu için req.user'dan alıyorum

    if(parseInt(targetUserId) ===currentUserId){
        return res.status(200).json({
            success:true,
            isFollowing:false,
            isSelf:true
        });
    }

    const follow = await prisma.follow.findUnique({
        where:{
            followerId_followingId:{
                followerId:currentUserId,
                followingId:parseInt(targetUserId)
            }
        }
    });

    res.status(200).json({
        success:true,
        isFollowing:!!follow,
        isSelf:false
    });
});

module.exports = {
    toggleFollow,
    getFollowers,
    getFollowing,
    checkFollowStatus
};