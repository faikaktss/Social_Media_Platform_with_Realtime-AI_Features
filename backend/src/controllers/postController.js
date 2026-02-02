const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async(req,res) =>{
    try {
        const { caption, imageUrl } = req.body;
        const { userId } = req.user; // Giriş yapmış kullanıcının id'sini alıyoruz (Destructuring ile)
        
        if(!imageUrl)
            return res.status(400).json({message:'Görsel URl si gerekli '});

        const newPost = await prisma.post.create({
            data:{
                caption,
                imageUrl,
                userId:userId
            }
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Post oluşturma hatası: ', error );
        res.status(500).json({message:'Post oluşturulurken sunucu hatası oluştu.'});
    }
};


const getAllPosts = async(req,res) =>{
    try {
        const posts = await prisma.post.findMany({
            orderBy:{createdAt:'desc'},
            include:{
                user:{
                    select:{username:true, profilePicture:true}
                }
            }
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Postları getirme hatası: ', error);
        res.status(500).json({message:'Postlar getirilirken sunucu hatası oluştu.'});
    }
}

module.exports = {createPost, getAllPosts};