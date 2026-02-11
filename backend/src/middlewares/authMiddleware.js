const jwt = require('jsonwebtoken');


const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
        return res.status(401).json({message:'Token olmadığı için erişim reddedildi.'});

    try {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';

        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (error) {
        console.error('Token doğrulama hatası: ', error);
        return res.status(401).json({message: 'Geçersiz token nedeniyle erişim reddedildi.'});
    }
}

module.exports = authenticateToken;