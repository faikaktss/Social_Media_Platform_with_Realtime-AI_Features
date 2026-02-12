const upload  =require('../config/multer');
const {processImage} = require('../utils/imageProcessor');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { patch } = require('../routes/likeRoutes');



const uploadSingleImage = (fieldName) =>{
    return [
        //Todo:ilk başta dosyayı buraya yüklüyorum
        upload.single(fieldName),

    
        asyncHandler(async(req,res,next)=>{
            if(!req.file)
                return next(new AppError('Lütfen bir resim dosyası yükleyin',404))
            
            const optimizedFileName = await processImage(req.file.path);

            req.file.fileName = optimizedFileName;
            req.file.path = `uploads/${optimizedFileName}`;

            next();
        })
    ];
};




//Todo: Çoklu fotoğraf için bir middleware
const uploadMultipleImages = (fieldName,maxCount = 10)=>{
    return [
        upload.array(fieldName,maxCount),

        asyncHandler(async(req,res,next)=>{
            if(!req.files || req.files.lenght === 0)
                return next(new AppError('Lütfen en az bir resim dosyası yükleyin'))

            const proccessPromises = req.files.map(file=>proccessImage(file.path));
            const optimizeFileNames = await Promise.all(proccessPromises);

            //Todo: İşlenmiş tüm dosya bilgilerini güncelliyorum
            req.files = req.files.map((file, index) => ({
                ...file,
                filename: optimizedFileNames[index],
                path: `uploads/${optimizedFileNames[index]}`
            }));

            next();

        })
    ];
};


module.exports = {
    uploadSingleImage,
    uploadMultipleImages
}