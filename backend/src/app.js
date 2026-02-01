const express = require('express');
const cors = require('cors') // Başka bir originden gelen istekleri kabul etmek için CORS middleware'i kullanıyoruz

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);

app.get('/', (req,res) =>{
    res.send('Instagram backend apı ile çalışıyor');
})

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})