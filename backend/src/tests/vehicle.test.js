const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

describe('Vehicle CRUD API', () => {
  const registerRoute = '/api/auth/register';
  const vehiclesRoute = '/api/vehicles';

  let userToken;
  let adminToken;
  let testVehicleId;

  const standardUser = {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'Pass123!',
    role: 'user'
  };

  const adminUser = {
    name: 'Admin User',
    email: 'admin_crud@example.com',
    password: 'Pass123!',
    role: 'admin'
  };

  const sampleVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5
  };

  // Setup tokens before running tests
  beforeEach(async () => {
    // Register standard user
    const resUser = await request(app).post(registerRoute).send(standardUser);
    userToken = resUser.body.data.token;

    // Register admin user
    const resAdmin = await request(app).post(registerRoute).send(adminUser);
    adminToken = resAdmin.body.data.token;
  });

  describe('POST /api/vehicles - Create Vehicle', () => {
    it('✓ Unauthorized access - fail with 401', async () => {
      const res = await request(app)
        .post(vehiclesRoute)
        .send(sampleVehicle);
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('✓ Create vehicle - success', async () => {
      const res = await request(app)
        .post(vehiclesRoute)
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.make).toBe(sampleVehicle.make);
      expect(res.body.data.price).toBe(sampleVehicle.price);
      
      testVehicleId = res.body.data._id; // Store for read, update, delete tests
    });

    it('✓ Validation check - price cannot be negative', async () => {
      const res = await request(app)
        .post(vehiclesRoute)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...sampleVehicle, price: -500 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('✓ Validation check - quantity cannot be negative', async () => {
      const res = await request(app)
        .post(vehiclesRoute)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...sampleVehicle, quantity: -1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/vehicles - List Vehicles', () => {
    it('✓ List vehicles - success', async () => {
      // Seed a vehicle
      await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .get(vehiclesRoute)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/vehicles/:id - Get Single Vehicle', () => {
    it('✓ Get single vehicle - success', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .get(`${vehiclesRoute}/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(vehicle._id.toString());
      expect(res.body.data.model).toBe(sampleVehicle.model);
    });

    it('✓ Get single vehicle - not found (404)', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`${vehiclesRoute}/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/vehicles/:id - Update Vehicle', () => {
    it('✓ Update vehicle - success', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .put(`${vehiclesRoute}/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ make: 'Honda', price: 26000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe('Honda');
      expect(res.body.data.price).toBe(26000);
    });

    it('✓ Update vehicle - not found (404)', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`${vehiclesRoute}/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ make: 'Honda' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('✓ Update validation check - negative price fails', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .put(`${vehiclesRoute}/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: -100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/vehicles/:id - Delete Vehicle', () => {
    it('✓ Regular user delete - forbidden (403)', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .delete(`${vehiclesRoute}/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('✓ Admin user delete - success', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .delete(`${vehiclesRoute}/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is deleted
      const checkRes = await request(app)
        .get(vehiclesRoute)
        .set('Authorization', `Bearer ${userToken}`);
      
      const found = checkRes.body.data.find(v => v._id === vehicle._id.toString());
      expect(found).toBeUndefined();
    });

    it('✓ Delete vehicle - not found (404)', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`${vehiclesRoute}/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
