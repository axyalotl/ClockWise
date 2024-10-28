const request = require('supertest');
const app = require('../app');

describe('User API', () => {
    let userIds = [];
    let appointmentId;

    // Create multiple test users before running appointment tests
    beforeAll(async () => {
        const usersToCreate = [
            { name: 'User One', email: 'user.one@example.com', password: 'password123', role: 'Admin' },
            { name: 'User Two', email: 'user.two@example.com', password: 'password123', role: 'Employee' },
            { name: 'User Three', email: 'user.three@example.com', password: 'password123', role: 'Guest' },
        ];

        // Create each user and store their IDs
        for (const userData of usersToCreate) {
            const userResponse = await request(app).post('/api/users').send(userData);
            userIds.push(userResponse.body._id);
        }
    });

    // Test appointment creation
    it('should create a new appointment', async () => {
        const response = await request(app)
        .post('/api/users')
        .send({
            title: 'Test Appointment',
            description: 'test.user@example.com',
            date: '2024-01-01T08:00:00Z',
            duration: '60',
            userId: userIds[0],
            location: 'Office',
            status: 'Scheduled',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        appointmentId = response.body._id;
    });

    // Test creating appointment with an invalid user ID
    it('should not allow creating an appointment with an invalid user ID', async () => {
        const response = await request(app)
        .post('/api/appointments')
        .send({
            title: 'Invalid User Test',
            description: 'This should fail due to invalid user ID',
            date: '2024-01-01T10:00:00Z',
            duration: '30',
            userId: 'invalidUserId',
            location: 'Clinic',
            status: 'Scheduled',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid user ID');
    });

    // Test appointment creation with time conflict for same user
    it('should not allow creating appointment with time conflict for same user', async () => {
        const response = await request(app)
        .post('/api/users')
        .send({
            title: 'Test Appointment 2',
            description: 'This should fail due to time conflict',
            date: '2024-01-01T08:30:00Z',
            duration: '60',
            userId: userIds[0],
            location: 'Office',
            status: 'Scheduled',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Time conflict with an existing appointment');
    });

    it('should allow overlapping appointments for different users', async () => {
        const response = await request(app)
        .post('/api/appointments')
        .send({
            title: 'Overlap Test',
            description: 'Overlap appointment for a different user',
            date: '2024-01-01T08:30:00Z',
            duration: '60',
            userId: userIds[1],
            location: 'Office',
            status: 'Scheduled',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });  

    // Test appointment creation with missing required fields
    it('should not allow creating an appointment without required fields', async () => {
        const response = await request(app)
        .post('/api/users')
        .send({
            title: '',
            description: 'test.user@example.com',
            date: '',
            duration: '60',
            userId: userIds[0],
            location: 'Office',
            status: 'Scheduled',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    // Test retrieving all appointments
    it('should get all appointments', async () => {
        const response = await request(app).get('/api/appointments');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test retrieving a single appointment by ID
    it('should get an appointment by ID', async () => {
        const response = await request(app).get(`/api/appointments/${appointmentId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', appointmentId);
    });

    // Test retrieving an appointment with an invalid ID
    it('should return 404 for a non-existing appointment ID', async () => {
        const response = await request(app).get('/api/users/invalidAppointmentId');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Appointment not found');
    });

    // Test updating an appointment
    it('should update the appointment', async () => {
        const response = await request(app)
        .put(`/api/appointment/${appointmentId}`)
        .send({
            title: 'Updated Title',
            date: '2025-05-05T08:30:00Z',
            duration: '90',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Title');
        expect(response.body).toHaveProperty('date', '2025-05-05T08:30:00Z');
        expect(response.body).toHaveProperty('duration', '90');
    });

    // Test updating an appointment with invalid data
    it('should not update the appointment with invalid data', async () => {
        const response = await request(app)
        .put(`/api/appointment/${appointmentId}`)
        .send({
            date: 'invalid-date-format',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    // Test deleting an appointment
    it('should delete the user', async () => {
        const response = await request(app).delete(`/api/appointment/${appointmentId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Appointment deleted successfully');
    });

});
