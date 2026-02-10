const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getHomeFeed(userId,page = 1, limit = 10, sortBy ='newest'){
    const following = await prisma.follow.findMany({
        where:{followerId:userId},
        select:{followingId:true}
    });
    const followingIds = following.map(f =>f.followingId);
    followingIds.push(userId); //Todo: Kendi gönderilerini de dahil etmek için kullanıcı ID'sini ekle

    const skip = (page - 1)*limit;
    const orderBy = sortBy === 'popular'
        ? [{likesCount:'desc'} , {createdAt:'desc'}]
        : {createdAt:'desc'};

    const [posts,totalPosts] = await Promise.all([
        prisma.post.findMany({
            where:{userId:{in:followingIds}},
            skip,
            take:limit,
            orderBy,
            include:{
                user:{select:{id:true , username:true, profilePic:true}},
                _count: {select:{comments:true}}
            }
        }),
        prisma.post.count({where: {userId:{in:followingIds}}})
    ]);
    return {posts,totalPosts};
}

module.exports = {getHomeFeed};