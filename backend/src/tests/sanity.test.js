const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Sanity & Environment Tests', () => {
  it('should pass a basic Jest assertion', () => {
    expect(true).toBe(true);
  });

  it('should fetch the health check endpoint and get 200 success', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      success: true,
      message: 'Server is healthy and running'
    }));
    expect(res.body.data).toHaveProperty('uptime');
    expect(res.body.data).toHaveProperty('timestamp');
  });

  it('should get 404 for an invalid route', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should verify MongoDB is connected and running', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});
