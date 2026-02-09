const {PrismaClient} = require('@prisma/client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const calculateTimeAgo = (date) =>{
    const seconds = Math.floor((new Date()- new Date(date)) / 1000);

  const intervals = {
    yıl: 31536000,
    ay: 2592000,
    hafta: 604800,
    gün: 86400,
    saat: 3600,
    dakika: 60
  };

  for (const[unit,secondsInUnit] of Object.entries(intervals)){
    const interval = Math.floor(seconds / secondsInUnit);
    if(interval >=1)
        return `${interval} ${unit} önce`;
  }

  return 'Az önce';
}

const getHomeFeed = asyncHandler(async(req,res,next) =>{
    const{userId:currentUserId} = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10,50);
    const skip = (page - 1) * limit;

    const {filterUserId , sortBy} = req.query; //Todo: sortBy : 'newest' veya 'oldest' olabilir

    //Todo:Kullanıcıların takip ettiği kişilerin id'lerini bul
    const following = await prisma.follow.findMany({
        where:{followerId:currentUserId},
        select:{followingId:true}
    });

    //Todo: Takip edilen kullanıcıların id'lerini bir diziye atıyorum
    const followingIds = following.map(f =>f.followingId);
    followingIds.push(currentUserId);

    //Todo: Kimseyi takip etmiyorsa kendi postlarını görecek şekilde düzenleme yapıyorum
    if(followingIds.length === 1 && followingIds[0] === currentUserId){
        const hasPosts = await prisma.post.count({
            where:{userId:currentUserId}
        });

        if(hasPosts === 0){
            return res.status(200).json({
                success:true,
                data:[],
                message:'Henüz takip ettiğiniz kullanıcı yok ve siz de hiç paylaşım yapmadınız. Takip etmeye başlayarak veya paylaşım yaparak feedinizi doldurabilirsiniz!',
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalPosts: 0,
                    hasMore: false,
                    limit
                }
            });
        }
    }

    //Todo: Where koşulunu dinamik olarak oluşturuyorum
    const whereCondition = filterUserId
        ? {userId:parseInt(filterUserId)}
        : {userId:{in:followingIds}};

    //Todo: Sıralama kısmı ile popüler bir feed oluşturuyorum
    const orderBy = sortBy === 'popular'
    ?[{likesCount:'desc'},{createdAt:'desc'}]
    :[{createdAt:'desc'}];

    //Todo: 2. Postları getir
    const [posts,totalPosts] = await Promise.all([
        prisma.post.findMany({
            where:whereCondition,
            skip:skip,
            take:limit,
            orderBy:orderBy,
            include: {
                user: {
                select: {
                    id: true,
                    username: true,
                    profilePic: true,
                    followerCount: true
                }
                },
                _count: {
                select: { 
                    comments: true 
                }
                }
            }
        }),
        prisma.post.count({
            where:whereCondition
        })
    ]);

    //Todo: Her post için ek bilgiler ekliyorum
    const postsWithDetails = await Promise.all(
        posts.map(async(post) =>{
            const isLiked = await prisma.like.findUnique({
                where:{
                    userId_postId:{
                        userId:currentUserId,
                        postId:post.id
                    }
                }
            });

            //Todo: Post sahibini takip ediyor musun
            const isFollowingOwner = post.userId === currentUserId
            ? null
            : following.some(f => f.followingId === post.userId);

            return {
                id:post.id,
                caption:post.caption,
                imageUrl:post.imageUrl,
                likesCount:post.likesCount,
                commentsCount:post._count.comments,
                createdAt:post.createdAt,
                timeAgo:calculateTimeAgo(post.createdAt),
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    profilePic: post.user.profilePic,
                    followerCount: post.user.followerCount
                },
                isLikedByCurrentUser: !!isLiked,
                isFollowingOwner: isFollowingOwner,
                isOwnPost: post.userId === currentUserId
            };
        })
    );

    res.status(200).json({
        success:true,
        data:postsWithDetails,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            hasMore: page * limit < totalPosts,
            limit
        }
    });
});

module.exports = {
    getHomeFeed
}