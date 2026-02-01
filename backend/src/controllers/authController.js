const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const { error } = require('node:console');

const prisma = new PrismaClient();

//Todo:Kullanıcı kaydı yapıyorum(faik)
const register = async(req,res) =>{
    try {
        const {username, email, password} = req.body;

        //Todo:Kontrol (faik)
        if(!username || !email || !password)
            return res.status(400).json({error:'Tüm alanlar zorunludur.'});

        //Todo:Kullanıcı var mı kontorl et(faik)
        const existingUser = await prisma.user.findFirst({
            where:{
                OR:[
                    {username:username},
                    {email:email}
                ]
            }
        });

        if(existingUser)
            return res.status(400).json({error:'Kullanıcı adı veya email zaten kayıtlı.'});

        //Todo: Şifre hashleme(faik)
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword
            }
        });

        //Todo: Kullanıcı için bir jwt token oluştur
        const token = jwt.sign(
            {userId: newUser.id , username: newUser.username},
            process.env.JWT_SECRET || 'your-secret-key',
            {expiresIn:'7d'}
        );

        res.status(201).json({
            message:'Kullanıcı başarıyla oluşturuldu',
            token,
            user:{
                id:newUser.id,
                username:newUser.username,
                email:newUser.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({error:'Sunucu hatası'});
    }
};


const login = async(req,res) =>{
    try {
        const {username, password} = req.body;

        //Todo: Kontrol(faik)
        if(!username || !password) 
            return res.status(400).json({error:'Tüm alanlar zorunludur.'});

        //Todo: Kullanıcıyı bul (faik)
        const user = await prisma.user.findUnique({
            where:{username:username}
        });

        if(!user)
            return res.status(400).json({error:'Geçersiz kullanıcı adı veya şifre.'});

        //Todo: Şifre kontorlü
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword)
            return res.status(400).json({error:'Geçersiz kullanıcı adı veya şifre'});

        //Todo:JWT token oluştur(faik)
        const token = jwt.sign(
            {userId: user.id, username:user.username},
            process.env.JWT_SECRET || 'your-secret-key',
            {expiresIn:'7d'}
        );
        res.status(200).json({
            message:'Giriş başarılı',
            token,
            user:{
                id:user.id,
                username:user.username,
                email:user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error:'Sunucu hatası'});
    }
};



module.exports = {register,login};