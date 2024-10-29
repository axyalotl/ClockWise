const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/user');

describe('Appointment API', () => {
  let userId;
  let appointmentId;

  // Setup: Create a user for associating appointments
  beforeAll(async () => {
    const user = await User.create({ name: 'Test User', email: 'testuser@example.com', password: 'password' });
    userId = user._id;
  });

  // Cleanup: Remove all test data
  afterEach(async () => {
    await Appointment.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // Test case to create a new appointment successfully
  it('should create a new appointment', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        title: 'Meeting',
        description: 'Project discussion',
        date: new Date(),
        duration: 60, // 1 hour
        userId,
        location: 'Office',
        status: 'Scheduled',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    appointmentId = response.body._id;
  });

  // Test case for creating an appointment with missing required fields
  it('should return 400 for missing required fields', async () => {
    const response = await request(app).post('/api/appointments').send({
      title: '',
      duration: 60,
      userId,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  // Test case for creating an appointment with an invalid user ID
  it('should return 400 for invalid user ID', async () => {
    const response = await request(app).post('/api/appointments').send({
      title: 'Meeting',
      description: 'Invalid User ID test',
      date: new Date(),
      duration: 30,
      userId: '12345', // Invalid userId
      location: 'Online',
      status: 'Scheduled',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid user ID');
  });

  // Test case for creating an appointment with time conflict
  it('should return 400 for appointment time conflict', async () => {
    const date = new Date();

    // Create initial appointment
    await Appointment.create({
      title: 'Existing Appointment',
      description: 'Conflict test',
      date,
      duration: 60, // 1 hour
      userId,
      location: 'Office',
      status: 'Scheduled',
    });

    // Attempt to create conflicting appointment
    const response = await request(app).post('/api/appointments').send({
      title: 'Conflicting Appointment',
      description: 'Test conflict',
      date, // Same start time as the existing appointment
      duration: 30,
      userId,
      location: 'Office',
      status: 'Scheduled',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Time conflict with an existing appointment');
  });

  // Test case to retrieve all appointments
  it('should retrieve all appointments', async () => {
    await Appointment.create({
      title: 'Team Meeting',
      description: 'Weekly sync-up',
      date: new Date(),
      duration: 45,
      userId,
      location: 'Conference Room',
      status: 'Scheduled',
    });

    const response = await request(app).get('/api/appointments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test case to retrieve an appointment by ID
  it('should retrieve an appointment by ID', async () => {
    const appointment = await Appointment.create({
      title: 'One-on-One',
      description: 'Performance review',
      date: new Date(),
      duration: 30,
      userId,
      location: 'Manager\'s Office',
      status: 'Scheduled',
    });

    const response = await request(app).get(`/api/appointments/${appointment._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', appointment._id.toString());
  });

  // Test case to retrieve appointments for a specific user
  it('should retrieve all appointments for a specific user', async () => {
    await Appointment.create({
      title: 'Review Meeting',
      description: 'Quarterly review',
      date: new Date(),
      duration: 90,
      userId,
      location: 'Online',
      status: 'Scheduled',
    });

    const response = await request(app).get(`/api/appointments/user/${userId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test case for updating an appointment
  it('should update an appointment', async () => {
    const appointment = await Appointment.create({
      title: 'Check-in',
      description: 'Monthly check-in',
      date: new Date(),
      duration: 30,
      userId,
      location: 'Office',
      status: 'Scheduled',
    });

    const response = await request(app)
      .put(`/api/appointments/${appointment._id}`)
      .send({
        title: 'Updated Check-in',
        duration: 45,
        location: 'Updated Location',
        status: 'Completed',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Check-in');
    expect(response.body).toHaveProperty('status', 'Completed');
  });

  // Test case for updating an appointment with invalid ID
  it('should return 400 for invalid appointment ID on update', async () => {
    const response = await request(app).put('/api/appointments/12345').send({
      title: 'Invalid Update',
      duration: 45,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid appointment ID');
  });

  // Test case for deleting an appointment
  it('should delete an appointment', async () => {
    const appointment = await Appointment.create({
      title: 'Removable Appointment',
      description: 'To be deleted',
      date: new Date(),
      duration: 30,
      userId,
      location: 'Temporary Room',
      status: 'Scheduled',
    });

    const response = await request(app).delete(`/api/appointments/${appointment._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Appointment deleted successfully');
  });

  // Test case for deleting an appointment with an invalid ID
  it('should return 400 for invalid appointment ID on delete', async () => {
    const response = await request(app).delete('/api/appointments/12345');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid appointment ID');
  });
});
