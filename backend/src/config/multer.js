//Todo: Hangi dosya tiplerini Kabul edeceğiz 
//Todo: Maksimum dosya boyutu ne  olacak


const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

//Todo: multer Disk storage yapılandırması
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/'); //Todo: Bu klasöre kaydedilecek
    },

    //Todo: Benzersiz bir isim olur
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random()*1E9);
        cb(null,'post-'+uniqueSuffix + path.extname(file.originalname));
    }
})

//Todo: Dosya filtreleme (Belirtilen dosyayı kabul edeceğiz)
const fileFilter = (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png|gif/;
    //Todo: Hem uzantı hem de içeriğine bakıyorum
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = allowedTypes.test(file.mimetype);

    if(extname&&mimetype)
        return cb(null,true);
    else
        return cb(new AppError('Sadece resim dosyaları yüklenebilir(jpg,png,gif)',400));
};


const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:5*1024*1024} 
});

module.exports=upload