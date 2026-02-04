const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async(req,res) =>{
    try {
        const {caption, imageUrl} = req.body;
        const { userId } = req.user; //Todo:  Giriş yapmış kullanıcının id'sini alıyoruz (Destructuring ile)
        
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

//Todo: Sorgu kısmı optimize edildi
const getAllPosts = async (req, res) => {
    try {
        // Todo:Query parametrelerinden sayfa ve limit al
        const page = parseInt(req.query.page) || 1;
        if(page<1) page = 1; //Todo:Güvenlik kontrolü
        const limit = parseInt(req.query.limit) || 10; //Todo: Sayfa başına öge sayısı
        if(limit>100) limit=100;
        if(limit<1) limit=10;
        const skip = (page - 1) * limit;

        // Todo: Paralel bir sorgu yaptım aynı anda çalışır daha hızlı çalışır
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
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Postlar getirilemedi.' });
    }
};

module.exports = {createPost, getAllPosts};