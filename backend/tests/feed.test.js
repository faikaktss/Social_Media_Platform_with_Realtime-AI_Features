const request = require('supertest');
const app = require('../src/app');
const path = require('path');

const timestamp = Date.now();
const uniqueUser1 = `user${timestamp}`;
const uniqueEmail1 = `mail${timestamp}@example.com`;
const uniqueUser2 = `user${timestamp + 1}`;
const uniqueEmail2 = `mail${timestamp + 1}@example.com`;

describe('Feed Endpoints', () => {
    let token1, token2, userId1, userId2;

    //Todo: Gerçek bir ortam oluşturuyoruz
    beforeAll(async() => {
        // Todo: Kullanıcı 1 oluştur ve login
        await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUser1,
                email: uniqueEmail1,
                password: 'Testpass1'
            });

        const loginRes1 = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUser1,
                password: 'Testpass1'
            });
        token1 = loginRes1.body.token;
        userId1 = loginRes1.body.user.id;

        // Todo: Kullanıcı 2 oluştur ve login
        await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUser2,
                email: uniqueEmail2,
                password: 'Testpass2'
            });

        const loginRes2 = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUser2,
                password: 'Testpass2'
            });
        token2 = loginRes2.body.token;
        userId2 = loginRes2.body.user.id;

        // Todo: User1, User2'yi takip etsin
        await request(app)
            .post(`/api/users/${userId2}/follow`)
            .set('Authorization', `Bearer ${token1}`);

        // Todo: User2 bir post oluştursun
        const imagePath = path.join(__dirname, 'fixtures', 'test-image.png');
        await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token2}`)
            .field('caption', 'Test post for feed')
            .attach('image', imagePath);
    });

    it('should get home feed with valid token', async() => {
        const res = await request(app)
            .get('/api/feed/home')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('pagination');
        expect(res.body.pagination).toHaveProperty('currentPage');
        expect(res.body.pagination).toHaveProperty('totalPages');
        expect(res.body.pagination).toHaveProperty('totalPosts');
        expect(res.body.pagination).toHaveProperty('hasMore');
    });

    it('should return 401 when getting feed without token', async() => {
        const res = await request(app)
            .get('/api/feed/home');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should return empty feed message for new user with no posts and no following', async() => {
        // Todo: Yeni kullanıcı oluştur
        const newTimestamp = Date.now() + 1000;
        const newUser = `user${newTimestamp}`;
        const newEmail = `mail${newTimestamp}@example.com`;

        await request(app)
            .post('/api/auth/register')
            .send({
                username: newUser,
                email: newEmail,
                password: 'Testpass3'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                username: newUser,
                password: 'Testpass3'
            });

        const newToken = loginRes.body.token;

        const res = await request(app)
            .get('/api/feed/home')
            .set('Authorization', `Bearer ${newToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual([]);
        expect(res.body).toHaveProperty('message');
    });

    it('should support pagination with page parameter', async() => {
        const res = await request(app)
            .get('/api/feed/home?page=1&limit=5')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('pagination');
        expect(res.body.pagination.currentPage).toBe(1);
        expect(res.body.pagination.limit).toBe(5);
    });

    it('should include followed users posts in feed', async() => {
        const res = await request(app)
            .get('/api/feed/home')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data.length).toBeGreaterThan(0);
        
        //Todo:  User1 takip ettiği User2'nin postunu görmeli
        const hasFollowedUserPost = res.body.data.some(post => post.user.id === userId2);
        expect(hasFollowedUserPost).toBe(true);
    });

    it('should limit results based on limit parameter', async() => {
        const res = await request(app)
            .get('/api/feed/home?limit=2')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.pagination.limit).toBe(2);
    });

    it('should not exceed maximum limit of 50', async() => {
        const res = await request(app)
            .get('/api/feed/home?limit=100')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.pagination.limit).toBe(50);
    });
});
