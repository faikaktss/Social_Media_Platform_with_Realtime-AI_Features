const request = require('supertest');
const app = require('../src/app');
const { describe } = require('node:test');

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
    })
});