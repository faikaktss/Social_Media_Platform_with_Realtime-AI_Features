const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//Todo: Yorum ekleme
const createComment = async(req,res) =>{
    try {
        const {postId,content} = req.body;
        const {userId} = req.user; //Todo: Giriş yapmış kullanıcının id'sini alıyoruz
        
        if(!content || content.trim().length === 0)
            return res.status(400).json({message:'Yorum içeriği boş olamaz. '});
        //Todo: Post var mı kontrol et
        const post = await prisma.post.findUnique({where:{id:parseInt(postId)}});
        if(!post)
            return res.status(404).json({message:'Post bulunamadı'});

        const newComment = await prisma.comment.create({
            data:{
                content:content.trim(),
                userId:userId,
                postId:parseInt(postId)
            },
            include:{
                user:{
                    select:{
                        id:true,
                        username:true,
                        profilePic:true
                    }
                }
            }
        });

        res.status(201).json({
            success:true,
            message:'Yorum eklendi',
            comment:newComment
        });
        
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({message:'Yorum eklenirken sunucu hatası oluştu'})
    }
};


//Todo: Postun yorumlarını getirme
const getCommnentsByPost = async(req,res) =>{
    try {
        const{postId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20 ,50) //Todo: max 50
        const skip = (page - 1) * limit;


        const [comments,totalComments] = await Promise.all([
            prisma.comment.findMany({
                where:{postId:parseInt(postId)},
                skip:skip,
                take:limit,
                orderBy:{createdAt:'desc'},
                select:{
                    id:true,
                    content:true,
                    createdAt:true,
                    user:{
                        select:{
                            id:true,
                            username:true,
                            profilePic:true
                        }
                    }
                }

            }),
            prisma.comment.count({where:{postId:parseInt(postId)}})
        ]);


        res.status(200).json({
            success:true,
            data:comments,
            pagination:{
                currentPage:page,
                totalPages:Math.ceil(totalComments/limit),
                totalComments,
                hasMore:page*limit<totalComments,
                limit
            }
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({message:'Yorumlar getirilirken sunucu hatası oluştu'});
    }
}


//Todo: Yorum silme
const deleteComment = async(req,res) =>{
    try {
        const {commentId} = req.params;
        const {userId} = req.user;

        const comment = await prisma.comment.findUnique({where:{id:parseInt(commentId)}});

        if(!comment)
            return res.status(404).json({message:'Yorum bulunamadı'});

        //Todo: Yorum sahibi mi kontrol et
        if(comment.userId !== userId)
            return res.status(403).json({message:'Bu yorumu silme yetkiniz yok.'});

        await prisma.comment.delete({where:{id:parseInt(commentId)}});

        res.status(200).json({
            success:true,
            message:'Yorum silindi'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({message:'Yorum silinirken sunucu hatası oluştu.'});
    }
};

module.exports = {createComment, getCommnentsByPost, deleteComment};