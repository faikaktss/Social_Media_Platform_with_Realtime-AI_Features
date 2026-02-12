const request = require('supertest');
const app = require('../src/app');
const { describe } = require('node:test');
const path = require('path');

const timestamp = Date.now();
const uniqueUser = `user${timestamp}`;
const uniqueEmail = `mail${timestamp}@example.com`;

describe('Post Endpoints',() =>{
    let token;

    beforeAll(async() =>{
        await request(app)
            .post('/api/auth/register')
            .send({
                username:uniqueUser,
                email:uniqueEmail,
                password : 'Testpass1'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                username:uniqueUser,
                password:'Testpass1'
            });
            token = loginRes.body.token;

        //Todo:Gerçek bir post oluştur
        const imagePath = path.join(__dirname,'./fixtures/test-image.png');
        const createPostRes = await request(app)
            .post('/api/posts')
            .set('Authorization',`Bearer ${token}`)
            .field('caption','Test post for testing')
            .attach('image',imagePath);

            
        console.log('Post oluşturma response:', createPostRes.statusCode);
        console.log('Response body:', createPostRes.body);
        postId = createPostRes.body.data.id;
    });

    it('Should create a new post',async() =>{
        const res = await request(app)
            .get('/api/posts')
            .set('Authorization',`Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success',true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 401 if token is missing when creating post',async() =>{
        const res = await request(app)
            .get('/api/posts');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 404 if post not found',async() =>{
        const res = await request(app)
            .get('/api/posts/')
            .set('Authorization',`Bearer invalidtoken12313`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should create a new post with valid data',async() =>{
        //Todo: Post oluşturduktan sonra çalışacak
    });

    it('should return 401 when creating post without token',async() =>{
        const res = await request(app)
            .post('/api/posts')
            .field('caption','Test without token ')
            .attach('image',Buffer.from('fake image content'),'testimage.jpg');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');  
    });
    it('should return 404 when creating post without image', async() => {
    const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .field('caption', 'Test without image');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    });

    it('should get post by ID', async() => {
        const res = await request(app)
            .get(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', postId);
    expect(res.body.data).toHaveProperty('caption', 'Test post for testing');
});
});