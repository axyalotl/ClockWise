const express = require('express');
const { 
  getAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  getAppointmentsByUserId // Import the new function
} = require('../controllers/appointmentController');
const router = express.Router();

router.get('/', getAppointments); // GET all appointments
router.post('/', createAppointment); // CREATE a new appointment
router.get('/:id', getAppointmentById); // GET an appointment by ID
router.get('/user/:userId', getAppointmentsByUserId); // GET appointments by user ID
router.put('/:id', updateAppointment); // UPDATE an appointment by ID
router.delete('/:id', deleteAppointment); // DELETE an appointment by ID

module.exports = router;