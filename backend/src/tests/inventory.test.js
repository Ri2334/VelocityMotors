const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

describe('Inventory & Search API', () => {
  const registerRoute = '/api/auth/register';
  const searchRoute = '/api/vehicles/search';
  const purchaseRoute = (id) => `/api/vehicles/${id}/purchase`;
  const restockRoute = (id) => `/api/vehicles/${id}/restock`;

  let userToken;
  let adminToken;
  
  let vehicleSedan; // Toyota Camry, Sedan, price 25000, quantity 5
  let vehicleSuv1;  // Honda CR-V, SUV, price 30000, quantity 3
  let vehicleSuv2;  // Toyota RAV4, SUV, price 28000, quantity 0

  const standardUser = {
    name: 'Regular User',
    email: 'user_inv@example.com',
    password: 'Pass123!',
    role: 'user'
  };

  const adminUser = {
    name: 'Admin User',
    email: 'admin_inv@example.com',
    password: 'Pass123!',
    role: 'admin'
  };

  // Re-seed database and get fresh tokens before each test
  beforeEach(async () => {
    // 1. Create users
    const resUser = await request(app).post(registerRoute).send(standardUser);
    userToken = resUser.body.data.token;

    const resAdmin = await request(app).post(registerRoute).send(adminUser);
    adminToken = resAdmin.body.data.token;

    // 2. Seed vehicles
    vehicleSedan = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5
    });

    vehicleSuv1 = await Vehicle.create({
      make: 'Honda',
      model: 'CR-V',
      category: 'SUV',
      price: 30000,
      quantity: 3
    });

    vehicleSuv2 = await Vehicle.create({
      make: 'Toyota',
      model: 'RAV4',
      category: 'SUV',
      price: 28000,
      quantity: 0
    });
  });

  describe('GET /api/vehicles/search - Search Filters', () => {
    it('✓ Search by make (Toyota)', async () => {
      const res = await request(app)
        .get(searchRoute)
        .query({ make: 'Toyota' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      const models = res.body.data.map(v => v.model);
      expect(models).toContain('Camry');
      expect(models).toContain('RAV4');
    });

    it('✓ Search by category (SUV)', async () => {
      const res = await request(app)
        .get(searchRoute)
        .query({ category: 'SUV' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      const models = res.body.data.map(v => v.model);
      expect(models).toContain('CR-V');
      expect(models).toContain('RAV4');
    });

    it('✓ Search by minimum price (30000)', async () => {
      const res = await request(app)
        .get(searchRoute)
        .query({ minPrice: 29000 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('CR-V');
    });

    it('✓ Search by maximum price (26000)', async () => {
      const res = await request(app)
        .get(searchRoute)
        .query({ maxPrice: 26000 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('Camry');
    });

    it('✓ Combined search (make=Toyota & category=SUV)', async () => {
      const res = await request(app)
        .get(searchRoute)
        .query({ make: 'Toyota', category: 'SUV' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('RAV4');
    });
  });

  describe('POST /api/vehicles/:id/purchase - Vehicle Purchase', () => {
    it('✓ Purchase decreases quantity by 1', async () => {
      const res = await request(app)
        .post(purchaseRoute(vehicleSedan._id))
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(4); // 5 -> 4
      
      // Verify in DB
      const updated = await Vehicle.findById(vehicleSedan._id);
      expect(updated.quantity).toBe(4);
    });

    it('✓ Cannot purchase when quantity is zero', async () => {
      const res = await request(app)
        .post(purchaseRoute(vehicleSuv2._id))
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('stock');
    });
  });

  describe('POST /api/vehicles/:id/restock - Vehicle Restock', () => {
    it('✓ Quantity increases on restock (Admin)', async () => {
      const res = await request(app)
        .post(restockRoute(vehicleSedan._id))
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(15); // 5 + 10 = 15

      // Verify in DB
      const updated = await Vehicle.findById(vehicleSedan._id);
      expect(updated.quantity).toBe(15);
    });

    it('✓ Restock fails for regular user (403)', async () => {
      const res = await request(app)
        .post(restockRoute(vehicleSedan._id))
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('✓ Restock validation check - negative quantity fails', async () => {
      const res = await request(app)
        .post(restockRoute(vehicleSedan._id))
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
