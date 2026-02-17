require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const followRoutes = require('./routes/followRoutes');
const feedRoutes = require('./routes/feedRoutes');

app.use(cors());
app.use(express.json());


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