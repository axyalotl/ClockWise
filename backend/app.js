const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const employeeShiftRoutes = require('./routes/employeeShiftRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Connect to the database
connectDB();

// Use routes
app.use('/api/Users', userRoutes);
app.use('/api/Appointments', appointmentRoutes);
app.use('/api/Employee_Shifts', employeeShiftRoutes);

app.get('/', (req, res) => {
  res.send('ClockWise Backend Running');
});

module.exports = app;
