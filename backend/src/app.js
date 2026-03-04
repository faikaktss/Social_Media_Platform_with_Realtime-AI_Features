require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const followRoutes = require('./routes/followRoutes');
const feedRoutes = require('./routes/feedRoutes');

app.use(helmet());

app.use(cors());
// Todo: 10KB'dan büyük request body'leri reddeder (DoS koruması)
app.use(express.json({ limit: '10kb' }));

// Todo: Genel API rate limit aynı IP 15 dakikada 100'den fazla istek yapamaz
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.' }
});

// Todo:Rate-Limit için login kısmı
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Çok fazla giriş denemesi, lütfen 15 dakika sonra tekrar deneyin.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
            obj[key] = obj[key].replace(/\$/g, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitize(obj[key]);
        }
    }
};
app.use((req, res, next) => {
    sanitize(req.body);
    sanitize(req.params);
    next();
});

//Todo: Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Todo: Yüklenen resimleri public yapmak istiyoruz
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//Todo: Auth route'ları
app.use('/api/auth',authRoutes);
//Todo: Kullanıcı profili route'ları
app.use('/api/users',userRoutes);
//Todo: Post route'ları
app.use('/api/posts',postRoutes);
//Todo: Beğeni route'ları
app.use('/api/likes',likeRoutes);
//Todo: Comment route'ları
app.use('/api/comments', commentRoutes);
//Todo: Follow route'ları
app.use('/api/users', followRoutes);
//Todo: Feed route'ları
app.use('/api/feed', feedRoutes);

app.get('/', (req,res) =>{
    res.send('Instagram backend apı ile çalışıyor');
})

//Todo:Tüm routler için oluşturulmuş bir 404 handler
app.use((req, res, next) => {
    next(new AppError(`${req.originalUrl} yolu bulunamadı`, 404));
});

app.use(globalErrorHandler);


module.exports = app;