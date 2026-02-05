//Todo: Express içinde hata veren async promisleri yakalamak ve bunları 
//Todo: merkezi bir hata yönteim middleware'ine göndermek için kullanılır

const asyncHandler = (fn) =>{
    return (req,res,next) =>{
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}

module.exports = asyncHandler;