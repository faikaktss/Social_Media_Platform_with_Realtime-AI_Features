class AppError extends Error{
    constructor(message,statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; //Todo: Operasyonel bir hata mı diye kontrol edilir


        //Todo: Hata hangi satırda oluştuğunu bilmem lazım
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = AppError;