const request = require('supertest');
const app = require('../src/app');

const timestamp = Date.now();
const uniqueUser = `user${timestamp}`;
const uniqueEmail = `mail${timestamp}@example.com`;

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUser,
        email: uniqueEmail,
        password: 'Testpass1'
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', uniqueUser);
  });

  it('should login successfully with correct credentials', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: uniqueUser,
        password: 'Testpass1'
      });
    expect([200, 201]).toContain(loginRes.statusCode);
    expect(loginRes.body).toHaveProperty('success', true);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body.user).toHaveProperty('username', uniqueUser);
    expect(loginRes.body.user).toHaveProperty('email', uniqueEmail);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: uniqueUser,
        password: 'WrongPassword'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });

    it('should not register with missing fields', async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({
        username: '',
        email: '',
        password: ''
        });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
    });

  it('should not login with non-existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nonexistentuser',
        password: 'AnyPassword'
      });
    expect(res.statusCode).toBe(401); 
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });
});