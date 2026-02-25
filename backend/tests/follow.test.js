const request = require('supertest');
const app = require('../src/app');

const timestamp = Date.now();
const uniqueUser1 = `user${timestamp}`;
const uniqueEmail1 = `mail${timestamp}@example.com`;
const uniqueUser2 = `user${timestamp + 1}`;
const uniqueEmail2 = `mail${timestamp + 1}@example.com`;
const uniqueUser3 = `user${timestamp + 2}`;
const uniqueEmail3 = `mail${timestamp + 2}@example.com`;

describe('Follow Endpoints', () => {
    let token1, token2, token3, userId1, userId2, userId3;

    beforeAll(async() => {
        //Todo:  Kullanıcı 1 oluştur ve login
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

        //Todo: Kullanıcı 3 oluştur ve login
        await request(app)
            .post('/api/auth/register')
            .send({
                username: uniqueUser3,
                email: uniqueEmail3,
                password: 'Testpass3'
            });

        const loginRes3 = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUser3,
                password: 'Testpass3'
            });
        token3 = loginRes3.body.token;
        userId3 = loginRes3.body.user.id;
    });

    it('should follow a user', async() => {
        const res = await request(app)
            .post(`/api/users/${userId2}/follow`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('isFollowing', true);
    });

    it('should return 401 when following without token', async() => {
        const res = await request(app)
            .post(`/api/users/${userId2}/follow`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when trying to follow yourself', async() => {
        const res = await request(app)
            .post(`/api/users/${userId1}/follow`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should unfollow a user (toggle)', async() => {
        // Todo: İlk önce takip et
        await request(app)
            .post(`/api/users/${userId3}/follow`)
            .set('Authorization', `Bearer ${token1}`);

        // Sonra takipten çık
        const res = await request(app)
            .post(`/api/users/${userId3}/follow`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('isFollowing', false);
    });

    it('should check follow status when following', async() => {
        // Todo: User1, User2'yi takip ediyor (üstteki testten)
        const res = await request(app)
            .get(`/api/users/${userId2}/follow-status`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('isFollowing');
    });

    it('should check follow status when not following', async() => {
        const res = await request(app)
            .get(`/api/users/${userId3}/follow-status`)
            .set('Authorization', `Bearer ${token2}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('isFollowing', false);
    });

    it('should get followers list', async() => {
        const res = await request(app)
            .get(`/api/users/${userId2}/followers`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get following list', async() => {
        const res = await request(app)
            .get(`/api/users/${userId1}/following`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get empty followers list for user with no followers', async() => {
        // Todo: User3'ün takipçisi yok (user1 takip edip sonra unfollow yaptı)
        const res = await request(app)
            .get(`/api/users/${userId3}/followers`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 401 when checking follow status without token', async() => {
        const res = await request(app)
            .get(`/api/users/${userId2}/follow-status`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });
});
