const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes'); 
require('dotenv').config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
connectDB();

// Use routes
app.use('/api/Users', userRoutes);
app.use('/api/Appointments', appointmentRoutes); 

app.get('/', (req, res) => {
  res.send('ClockWise Backend Running');
});

module.exports = app;