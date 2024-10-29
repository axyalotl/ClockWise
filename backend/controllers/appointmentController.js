const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    console.log("Retrieved appointments:", appointments); // Log data retrieved from DB
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error retrieving appointments:', error.message);
    res.status(500).json({ message: 'Failed to retrieve appointments' });
  }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID' });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error retrieving appointment:', error.message);
    res.status(500).json({ message: 'Failed to retrieve appointment' });
  }
};

// Get all appointments for a specific user
const getAppointmentsByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const appointments = await Appointment.find({ userId });
    res.status(200).json(appointments); // Return 200 with empty array if none are found
  } catch (error) {
    console.error('Error retrieving appointments for user:', error.message);
    res.status(500).json({ message: 'Failed to retrieve appointments for the user' });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    const { title, description, date, duration, userId, location, status } = req.body;
  
    if (!title || !description || !date || !duration || !userId || !location || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
  
    try {
      const appointmentStart = new Date(date);
      const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);
  
      const conflict = await Appointment.findOne({
        userId,
        date: { $lt: appointmentEnd },
        $expr: {
          $gt: [{ $add: ["$date", { $multiply: ["$duration", 60000] }] }, appointmentStart]
        }
      });
  
      if (conflict) {
        return res.status(400).json({ message: 'Time conflict with an existing appointment' });
      }
  
      const newAppointment = new Appointment({
        title,
        description,
        date: appointmentStart,
        duration,
        userId,
        location,
        status,
        end: appointmentEnd // Set 'end' here in the schema
      });
  
      await newAppointment.save();
      res.status(201).json(newAppointment); // Return 'end' in the response
    } catch (error) {
      console.error('Error creating appointment:', error.message);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
};  

// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, duration, location, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID' });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { title, description, date, duration, location, status }, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID' });
  }

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error.message);
    res.status(500).json({ message: 'Failed to delete appointment' });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  getAppointmentsByUserId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
