const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');

describe('User API', () => {
  let userId;

  // Before each test, clear the Users collection
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // After all tests are done, close the mongoose connection
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test user creation with valid data
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'password123',
        role: 'Admin', // Valid role
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    userId = response.body._id;
  });

  // Test user creation with duplicate email
  it('should not allow creating a user with a duplicate email', async () => {
    // First, create the user
    await request(app).post('/api/users').send({
      name: 'Original User',
      email: 'duplicate@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Duplicate User',
        email: 'duplicate@example.com', // Same email as before
        password: 'password123',
        role: 'Employee',
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User with this email already exists');
  });

  // Test user creation with missing required fields
  it('should not allow creating a user without required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: '', // Missing name
        email: 'invalid.user@example.com',
        password: '',
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // Test retrieving all users
  it('should get all users', async () => {
    await User.create({
      name: 'Sample User',
      email: 'sample.user@example.com',
      password: 'password123',
      role: 'Guest',
    });

    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test retrieving a single user by ID
  it('should get a user by ID', async () => {
    const user = await User.create({
      name: 'Single User',
      email: 'single.user@example.com',
      password: 'password123',
      role: 'Employee',
    });
    userId = user._id;

    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', userId.toString());
    expect(response.body).toHaveProperty('email', 'single.user@example.com');
  });

  // Test retrieving a user with an invalid ID
  it('should return 404 for a non-existing user ID', async () => {
    const response = await request(app).get('/api/users/61e2f7b4c59f5b001f4e0912');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  // Test updating a user
  it('should update the user', async () => {
    const user = await User.create({
      name: 'Updatable User',
      email: 'updatable.user@example.com',
      password: 'password123',
      role: 'Employee',
    });
    userId = user._id;

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: 'Updated User',
        email: 'updated.user@example.com',
        role: 'Admin',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated User');
    expect(response.body).toHaveProperty('email', 'updated.user@example.com');
  });

  // Test updating a user with invalid data
  it('should not update the user with invalid data', async () => {
    const user = await User.create({
      name: 'Invalid Update User',
      email: 'invalid.update@example.com',
      password: 'password123',
      role: 'Employee',
    });
    userId = user._id;

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        email: 'invalid-email-format', // Invalid email format
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // Test deleting a user
  it('should delete the user', async () => {
    const user = await User.create({
      name: 'Deletable User',
      email: 'deletable.user@example.com',
      password: 'password123',
      role: 'Guest',
    });
    userId = user._id;

    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');
  });

  it('should return 404 for a non-existing user ID', async () => {
    const nonExistentId = '614c1b234f1c4f001dcdc0b5'; // Example of a valid MongoDB ObjectID format
    const response = await request(app).get(`/api/users/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
