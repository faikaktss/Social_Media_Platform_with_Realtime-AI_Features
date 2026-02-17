const request = require('supertest');
const app = require('../src/app');
const path = require('path');

const timestamp = Date.now();
const uniqueUser = `user${timestamp}`;
const uniqueEmail = `mail${timestamp}@example.com`;

describe('Like Endpoints', () => {
    let token;
    let postId;

    beforeAll(async() => {
        //Todo:  Kullanıcı oluştur ve login
        await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUser,
                email: uniqueEmail,
                password: 'Testpass1'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUser,
                password: 'Testpass1'
            });
        token = loginRes.body.token;

        //Todo:  Test için post oluştur
        const imagePath = path.join(__dirname, 'fixtures', 'test-image.png');
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .field('caption', 'Test post for likes')
            .attach('image', imagePath);
        
        postId = postRes.body.data.id;
    });

    it('should like a post with valid token', async() => {
        const res = await request(app)
            .post('/api/likes/toggle')
            .set('Authorization', `Bearer ${token}`)
            .send({ postId });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('isLiked', true);
    });

    //Todo: Aynı postu tekrar like yaparak unlike test et
    it('should unlike a post when toggling again', async() => {
    const res = await request(app)
        .post('/api/likes/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ postId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('isLiked', false);
    });

    //Todo: Token olmadan like yapmaya çalış    
    it('should return 401 when liking without token', async() => {
    const res = await request(app)
        .post('/api/likes/toggle')
        .send({ postId });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    });


    //Todo: Geçersiz token ile like yapmaya çalış
    it('should return 401 when liking with invalid token', async() => {
    const res = await request(app)
        .post('/api/likes/toggle')
        .set('Authorization', 'Bearer invalidToken123')
        .send({ postId });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    });

    //Todo: PostId olmadan like yapmaya çalış
    it('should return 400 when postId is missing', async() => {
    const res = await request(app)
        .post('/api/likes/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    });

    it('should get like count for a post', async() => {
    // Todo: Önce postu tekrar beğenelim sonra like cont sayısını kontrol edelim
    await request(app)
        .post('/api/likes/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ postId });

    const res = await request(app)
        .get(`/api/likes/count/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('count', 1);
    });

    //Todo: Post beğenildi mi kontrol et
    it('should check if post is liked by user', async() => {
    const res = await request(app)
        .get(`/api/likes/check/${postId}`)
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('liked', true);
    });

    //Todo: Beğeni listesini getir
    it('should get list of likes for a post', async() => {
    const res = await request(app)
        .get(`/api/likes/post/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    });
});