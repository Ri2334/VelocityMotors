const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('User Authentication API', () => {
  const registerRoute = '/api/auth/register';
  const loginRoute = '/api/auth/login';
  const testProtected = '/api/auth/me';
  const testAdmin = '/api/auth/admin-only';

  const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Pass123!',
    role: 'user'
  };

  const testAdminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  };

  it('✓ Register user - success', async () => {
    const res = await request(app)
      .post(registerRoute)
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('name', testUser.name);
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
    expect(res.body.data.user).toHaveProperty('role', 'user');
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('✓ Duplicate email - register failure', async () => {
    // Register first user
    await request(app).post(registerRoute).send(testUser);

    // Try registering duplicate
    const res = await request(app)
      .post(registerRoute)
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('email');
  });

  it('✓ Register user - validation failure (short password & invalid email)', async () => {
    const res = await request(app)
      .post(registerRoute)
      .send({
        name: 'Short Pass',
        email: 'invalid-email',
        password: 'Pass1!'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('✓ Register user - validation failure (password lacks uppercase)', async () => {
    const res = await request(app)
      .post(registerRoute)
      .send({
        name: 'No Upper',
        email: 'noupper@example.com',
        password: 'pass123!'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('✓ Register user - validation failure (password lacks lowercase)', async () => {
    const res = await request(app)
      .post(registerRoute)
      .send({
        name: 'No Lower',
        email: 'nolower@example.com',
        password: 'PASS123!'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('✓ Register user - validation failure (password lacks special char)', async () => {
    const res = await request(app)
      .post(registerRoute)
      .send({
        name: 'No Special',
        email: 'nospecial@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('✓ Login success', async () => {
    // Register user
    await request(app).post(registerRoute).send(testUser);

    const res = await request(app)
      .post(loginRoute)
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('✓ Invalid password - login failure', async () => {
    // Register user
    await request(app).post(registerRoute).send(testUser);

    const res = await request(app)
      .post(loginRoute)
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('credentials');
  });

  it('✓ Invalid JWT - route protection', async () => {
    // Test access to protected route with invalid token
    const res = await request(app)
      .get(testProtected)
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('✓ Missing JWT - route protection', async () => {
    const res = await request(app).get(testProtected);
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('✓ User role - accessing admin route gets forbidden', async () => {
    // Register and login user
    await request(app).post(registerRoute).send(testUser);
    const loginRes = await request(app)
      .post(loginRoute)
      .send({ email: testUser.email, password: testUser.password });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get(testAdmin)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('✓ Admin role - accessing admin route succeeds', async () => {
    // Register and login admin
    await request(app).post(registerRoute).send(testAdminUser);
    const loginRes = await request(app)
      .post(loginRoute)
      .send({ email: testAdminUser.email, password: testAdminUser.password });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get(testAdmin)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
