// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes'); // Import the schedule routes

require('dotenv').config(); // Ensure dotenv is configured

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({ origin: "http://localhost:3000" }));


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
