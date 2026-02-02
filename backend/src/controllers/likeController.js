const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const toggleLike = async(req,res) =>{
    try {
        const {postId} = req.body;
        const {userId} = req.user.userId; //Todo: Giriş yapmış kullanıcının id'sini alıyoruz

        const post = await prisma.post.findUnique({
            where:{id:parseInt(postId)}
        });

        if(!post)
            return res.status(404).json({message:'Post bulunamadı.'});

        //Todo: Kullanıcı bu postu daha önce beğendi mi Kontrol et
        const existingLike = await prisma.like.findFirst({
            where:{
                userId_postId: {
                    userId:userId,
                    postId:parseInt(postId)
                }
            }
        });

        if(existingLike){
            //Todo: Beğeniyi geri alacağız 
            //todo: İki işlem ya aynı anda olur ya da olmaz
            await prisma.$transaction([
                prisma.like.delete({
                    where:{id:existingLike.id}
                }),
                prisma.post.update({
                    where:{id:parseInt(postId)},
                    data:{likesCount:{decrement:1}} // Todo: sayacı bir azalt
                })
            ]);

            return res.status(200).json({message:'Beğeni kaldırıldı'});
        }else{
            await prisma.$transaction([
                prisma.like.create({
                    data:{userId:userId,postId:parseInt(postId)}
                }),
                prisma.post.update({
                    where:{id:parseInt(postId)},
                    data:{likesCount:{increment:1}} //Todo: sayacı bir artır
                })
            ]);

            return res.status(200).json({message:'Post beğenildi'});
        }
    } catch (error) {
        console.error('Beğeni işlemi hatası: ', error);
        res.status(500).json({message:'Beğeni işlemi sırasında sunucu hatası oluştu.'});
    }
}


module.exports = {toggleLike};