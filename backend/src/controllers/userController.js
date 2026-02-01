const {PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Todo: Kullanıcı profilini görüntüleme
const getProfile = async(req,res) =>{
    try {
        const {username} = req.params;

        const user = await prisma.user.findUnique({
            where:{username:username},
            select:{
                id:true,
                username:true,
                email:true,
                profilePic:true,
                bio:true,
                createdAt:true
            }
        });


        if(!user)
            return res.status(404).json({error:'Kullanıcı buluanamdı'});

        res.status(200).json({user});
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({error:'Sunucu hatası'});
    }
};


//Todo: Profil Güncelleme (faik )
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user; // JWT middleware'den gelecek
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
      message: 'Profil güncellendi',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
 

module.exports = {getProfile, updateProfile};