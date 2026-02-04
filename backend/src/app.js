const express = require('express');
const cors = require('cors') // Başka bir originden gelen istekleri kabul etmek için CORS middleware'i kullanıyoruz

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/CommentRoutes');

app.use(cors());
app.use(express.json());
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

app.get('/', (req,res) =>{
    res.send('Instagram backend apı ile çalışıyor');
})

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})