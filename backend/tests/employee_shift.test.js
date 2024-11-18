const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const EmployeeShift = require('../models/Employee_Shift');

describe('Employee Shift API', () => {
  let shiftId;

  // Cleanup: Remove all test data
  afterEach(async () => {
    await EmployeeShift.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case to create a new shift successfully
  it('should create a new shift', async () => {
    const response = await request(app)
      .post('/api/Employee_Shifts')
      .send({
        employeeName: 'John Doe',
        date: new Date(),
        shiftType: 'Full', // Full shift
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    shiftId = response.body._id;
  });

  // Test case for creating a shift with missing required fields
  it('should return 400 for missing required fields', async () => {
    const response = await request(app).post('/api/Employee_Shifts').send({
      employeeName: '',
      date: new Date(),
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Employee name, date, and shift type are required');
  });

  // Test case to retrieve all shifts
  it('should retrieve all shifts', async () => {
    await EmployeeShift.create({
      employeeName: 'Jane Smith',
      date: new Date(),
      shiftType: 'Morning', // Half shift (morning)
    });

    const response = await request(app).get('/api/Employee_Shifts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test case to retrieve a shift by ID
  it('should retrieve a shift by ID', async () => {
    const shift = await EmployeeShift.create({
      employeeName: 'Alice Johnson',
      date: new Date(),
      shiftType: 'Afternoon', // Half shift (afternoon)
    });

    const response = await request(app).get(`/api/Employee_Shifts/${shift._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', shift._id.toString());
  });

  // Test case to update a shift
  it('should update a shift', async () => {
    const shift = await EmployeeShift.create({
      employeeName: 'Bob Brown',
      date: new Date(),
      shiftType: 'Full', // Full shift
    });

    const response = await request(app)
      .put(`/api/Employee_Shifts${shift._id}`)
      .send({
        employeeName: 'Updated Bob Brown',
        shiftType: 'Morning', // Update to half shift (morning)
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('employeeName', 'Updated Bob Brown');
    expect(response.body).toHaveProperty('shiftType', 'Morning');
  });

  // Test case for updating a shift with invalid ID
  it('should return 400 for invalid shift ID on update', async () => {
    const response = await request(app).put('/api/Employee_Shifts/12345').send({
      employeeName: 'Invalid Update',
      shiftType: 'Afternoon',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid shift ID');
  });

  // Test case for deleting a shift
  it('should delete a shift', async () => {
    const shift = await EmployeeShift.create({
      employeeName: 'Charlie Davis',
      date: new Date(),
      shiftType: 'Afternoon', // Half shift (afternoon)
    });

    const response = await request(app).delete(`/api/Employee_Shifts/${shift._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Shift deleted successfully');
  });

  // Test case for deleting a shift with an invalid ID
  it('should return 400 for invalid shift ID on delete', async () => {
    const response = await request(app).delete('/api/Employee_Shifts/12345');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid shift ID');
  });
});
