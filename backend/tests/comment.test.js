const request = require('supertest');
const app = require('../src/app');
const path = require('path');

const timestamp = Date.now();
const uniqueUser1 = `user${timestamp}`;
const uniqueEmail1 = `mail${timestamp}@example.com`;
const uniqueUser2 = `user${timestamp + 1}`;
const uniqueEmail2 = `mail${timestamp + 1}@example.com`;

describe('Comment Endpoints', () => {
    let token1, token2, postId, commentId;

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

        // Todo: Kullanıcı 1 bir post oluştursun
        const imagePath = path.join(__dirname, 'fixtures', 'test-image.png');
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token1}`)
            .field('caption', 'Test post for comments')
            .attach('image', imagePath);
        
        postId = postRes.body.data.id;
    });

    it('should create a comment with valid data', async() => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                postId: postId,
                content: 'This is a test comment'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('content', 'This is a test comment');
        expect(res.body.data).toHaveProperty('postId', postId);
        
        commentId = res.body.data.id;
    });

    it('should return 401 when creating comment without token', async() => {
        const res = await request(app)
            .post('/api/comments')
            .send({
                postId: postId,
                content: 'Comment without token'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when content is missing', async() => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                postId: postId
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when postId is missing', async() => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                content: 'Comment without postId'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should get comments by post', async() => {
        const res = await request(app)
            .get(`/api/comments/post/${postId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a specific comment by id', async() => {
        const res = await request(app)
            .get(`/api/comments/${commentId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', commentId);
        expect(res.body.data).toHaveProperty('content', 'This is a test comment');
    });

    it('should update own comment', async() => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                content: 'Updated comment content'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('content', 'Updated comment content');
    });

    it('should return 403 when updating other user\'s comment', async() => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token2}`)
            .send({
                content: 'Trying to update someone else\'s comment'
            });

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when updating comment with empty content', async() => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                content: ''
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should get comments by user', async() => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                username: uniqueUser1,
                password: 'Testpass1'
            });
        
        const userId = loginRes.body.user.id;

        const res = await request(app)
            .get(`/api/comments/user/${userId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should delete own comment', async() => {
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message', 'Yorum silindi');
    });

    it('should return 403 when deleting other user\'s comment', async() => {
        //Todo:  Önce user1 yeni bir comment oluştur
        const createRes = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                postId: postId,
                content: 'Another comment to test delete'
            });

        const newCommentId = createRes.body.data.id;

        // Todo: User2 ile silmeye çalış
        const res = await request(app)
            .delete(`/api/comments/${newCommentId}`)
            .set('Authorization', `Bearer ${token2}`);

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when deleting comment without token', async() => {
        // Todo: Önce bir comment oluştur
        const createRes = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                postId: postId,
                content: 'Comment to test unauthorized delete'
            });

        const newCommentId = createRes.body.data.id;

        // Todo: Token olmadan silmeye çalış
        const res = await request(app)
            .delete(`/api/comments/${newCommentId}`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });
});