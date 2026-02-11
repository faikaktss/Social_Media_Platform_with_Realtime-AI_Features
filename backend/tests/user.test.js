const request = require('supertest');
const app = require('../src/app'); 


const timestamp = Date.now();
const uniqueUser = `user${timestamp}`;
const uniqueEmail = `mail${timestamp}@example.com`;

describe('User Endpoints', () =>{
    it('should return user profile with valid token', async() =>{
        await request(app)
             .post('/api/auth/register')
             .send({
                username:uniqueUser,
                email:uniqueEmail,
                password:'Testpass1'
             });

             //Todo: Şimdi kullanıcı profilini çekelim
             const res = await request(app)
                 .get(`/api/users/${uniqueUser}`);
                
             expect(res.statusCode).toBe(200);
             //Todo: Burada dönen kullanıcı bilgilerini kontrol edelim
             expect(res.body.user).toHaveProperty('id');
             expect(res.body.user).toHaveProperty('username',uniqueUser);
             expect(res.body.user).toHaveProperty('email',uniqueEmail);
             expect(res.body.user).not.toHaveProperty('password'); 
    });

    it('should return 404 for non-existing username',async() =>{
        const res = await request(app)
            .get('/api/users/nonexistentuser_' + Date.now());

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('success',false);
        expect(res.body).toHaveProperty('message');
    });

    it('should update user profile with valid token', async () => {
    //Todo: Önce kullanıcıyı kaydet
    const timestamp = Date.now();
    const uniqueUser = `user${timestamp}`;
    const uniqueEmail = `mail${timestamp}@example.com`;

    await request(app)
        .post('/api/auth/register')
        .send({
        username: uniqueUser,
        email: uniqueEmail,
        password: 'Testpass1'
        });

    // Todo:Login olup token al
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
        username: uniqueUser,
        password: 'Testpass1'
        });
    const token = loginRes.body.token;

    //Todo: Profil güncelle
    const newEmail = `new${timestamp}@example.com`;
    const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
        email: newEmail
        });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', newEmail);
    });

    it('should return 401 if token is missing when updating profile',async() =>{
        const res = await request(app)
            .put('/api/users/profile')
            .send({email:'test@example.com'});

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    })

    it('should return 401 if token is invalid when updating profile', async() =>{
        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization','Bearer invalidToken')
            .send({email:'test@example.com'});

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });


    it('should return 400 if required fields are missing when updating profile ',async() =>{
        const timestamp = Date.now();
        const uniqueUser = `user${timestamp}`;
        const uniqueEmail = `mail${timestamp}@example.com`;

        await request(app)
            .post('/api/auth/register')
            .send({
                username:uniqueUser,
                email:uniqueEmail,
                password:'Testpass1'
            });

        const loginRes= await request(app)
            .post('/api/auth/login')
            .send({
                username:uniqueUser,
                password:'Testpass1'
            });

        const token = loginRes.body.token;

        //Todo: Eksik alan ile güncelleme isteği
        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization',`Bearer ${token}`)
            .send({email:''});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(Array.isArray(res.body.errors)).toBe(true);
    });
});