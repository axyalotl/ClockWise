const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const EmployeeShift = require('../models/Employee_Shift');
const Appointment = require('../models/Appointment');

describe('Availability API', () => {
  let userId;

  // Clear collections before each test
  beforeEach(async () => {
    await User.deleteMany({});
    await EmployeeShift.deleteMany({});
    await Appointment.deleteMany({});
  });

  // Close the mongoose connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case: Return available shifts with no conflicts
  it('should return available shifts with no conflicts', async () => {
    // Create a user
    const user = await User.create({
      name: 'Availability User',
      email: 'availability.user@example.com',
      password: 'password123',
    });
    userId = user._id;

    // Create shifts for the user with all required fields
    await EmployeeShift.create([
      { 
        employeeName: 'Availability User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'Availability User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);

    // Create an appointment that conflicts with the first shift
    await Appointment.create({
      userId: userId,
      date: new Date('2024-11-17T10:30:00'), 
      duration: 60, // 1 hour
      title: 'Test Appointment' // Add the required title field
    });

    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // Only one shift should be available
    expect(response.body[0]).toHaveProperty('startTime', '14:00');
  });

  // Test case: Return all shifts if there are no appointments
  it('should return all shifts if there are no appointments', async () => {
    // Create a user
    const user = await User.create({
      name: 'No Conflict User',
      email: 'noconflict.user@example.com',
      password: 'password123',
    });
    userId = user._id;

    // Create shifts for the user with all required fields
    await EmployeeShift.create([
      { 
        employeeName: 'No Conflict User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'No Conflict User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);

    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // Both shifts should be available
  });

  // Test case: Return no available shifts if all shifts have conflicts
  it('should return no available shifts if all shifts have conflicts', async () => {
    // Create a user
    const user = await User.create({
      name: 'Full Conflict User',
      email: 'fullconflict.user@example.com',
      password: 'password123',
    });
    userId = user._id;

    // Create shifts for the user with all required fields
    await EmployeeShift.create([
      { 
        employeeName: 'Full Conflict User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'Full Conflict User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);

    // Create appointments that conflict with all shifts
    await Appointment.create([
      { 
        userId: userId, 
        date: new Date('2024-11-17T10:30:00'), 
        duration: 120, // 2-hour appointment, conflicts with first shift
        title: 'Morning Conflict' // Add the required title field
      },
      { 
        userId: userId, 
        date: new Date('2024-11-17T14:00:00'), 
        duration: 180, // 3-hour appointment, conflicts with second shift
        title: 'Afternoon Conflict' // Add the required title field
      },
    ]);

    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0); // No shifts should be available
  });

  // Test case: Return no shifts if the user has no assigned shifts
it('should return no shifts if the user has no assigned shifts', async () => {
    // Create a user with no shifts
    const user = await User.create({
      name: 'No Shift User',
      email: 'noshift.user@example.com',
      password: 'password123',
    });
    userId = user._id;
  
    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0); // No shifts should be available
  });
  
  // Test case: Return shifts correctly when the appointment duration spans multiple shifts
  it('should handle an appointment that spans multiple shifts', async () => {
    // Create a user
    const user = await User.create({
      name: 'Spanning Appointment User',
      email: 'spanning.user@example.com',
      password: 'password123',
    });
    userId = user._id;
  
    // Create shifts for the user
    await EmployeeShift.create([
      { 
        employeeName: 'Spanning Appointment User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'Spanning Appointment User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);
  
    // Create an appointment that spans both shifts
    await Appointment.create({
      userId: userId,
      date: new Date('2024-11-17T12:00:00'),
      duration: 360, // 6-hour appointment, spanning both shifts
      title: 'Spanning Appointment' // Add the required title field
    });
  
    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0); // No shifts should be available
  });
  
  // Test case: Return shifts correctly if the appointment ends exactly when a shift starts
  it('should return shifts if an appointment ends exactly when a shift starts', async () => {
    // Create a user
    const user = await User.create({
      name: 'Edge Time User',
      email: 'edgetime.user@example.com',
      password: 'password123',
    });
    userId = user._id;
  
    // Create shifts for the user
    await EmployeeShift.create([
      { 
        employeeName: 'Edge Time User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'Edge Time User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);
  
    // Create an appointment that ends exactly when the afternoon shift starts
    await Appointment.create({
      userId: userId,
      date: new Date('2024-11-17T12:00:00'),
      duration: 120, // 2-hour appointment, ends at 14:00
      title: 'Ends at Shift Start' // Add the required title field
    });
  
    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // One shift should be available
    expect(response.body[0]).toHaveProperty('startTime', '14:00');
  });
  
  // Test case: Return shifts correctly if an appointment starts exactly when a shift ends
  it('should return shifts if an appointment starts exactly when a shift ends', async () => {
    // Create a user
    const user = await User.create({
      name: 'Exact Start User',
      email: 'exactstart.user@example.com',
      password: 'password123',
    });
    userId = user._id;
  
    // Create shifts for the user
    await EmployeeShift.create([
      { 
        employeeName: 'Exact Start User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Morning', 
        startTime: '10:00', 
        endTime: '14:00' 
      },
      { 
        employeeName: 'Exact Start User', 
        date: new Date('2024-11-17'), 
        shiftType: 'Afternoon', 
        startTime: '14:00', 
        endTime: '18:00' 
      },
    ]);
  
    // Create an appointment that starts exactly when the morning shift ends
    await Appointment.create({
      userId: userId,
      date: new Date('2024-11-17T14:00:00'),
      duration: 60, // 1-hour appointment, starts at 14:00
      title: 'Starts at Shift End' // Add the required title field
    });
  
    // Make a request to get available shifts
    const response = await request(app).get(`/api/users/${userId}/availability`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // One shift should be available
    expect(response.body[0]).toHaveProperty('startTime', '10:00');
  });  
});
