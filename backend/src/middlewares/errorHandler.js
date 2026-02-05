const AppError = require('../utils/AppError');

//Todo: Geliştirici modunda hata gönderme sistemi
const sendErrorDev = (err,res) =>{
    res.status(err.statusCode).json({
        success:false,
        statusCode:err.statusCode,
        message:err.message,
        stack:err.stack, 
        error:err 
    });
};


//Todo:Canlı ortamdaki hata gönderme sistemi
const sendErrorProd = (err,res) =>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            success:false,
            statusCode:err.statusCode,
            message:err.message
        });
    }
    else{
        console.error('ERROR ', error);

        res.status(500).json({
            success:false,
            statusCode:500,
            message:'Bir hata oluştu Lütfen daha sonra tekrar deneyiniz.'
        });
    }
};


const globalErrorHandler = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //Todo: Geliştirme ortamında mı yoksa canlıda mı
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }else{
        let.error({...err});
        error.message = err.message;

        if(err.code === 'P2002')
            error = new AppError('Bu kayıt zaten mevcut',404)
        if(err.code === 'P2025')
            error = new AppError('Kayıt bulunamadı',404)
        sendErrorProd(error,res);
    
    }
};


module.exports = globalErrorHandler;