const Appointment = require('../models/Appointment');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve appointments' });
  }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve appointment' });
  }
};

// Get all appointments for a specific user
const getAppointmentsByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const appointments = await Appointment.find({ userId });
      if (appointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found for this user' });
      }
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve appointments for the user' });
    }
  };

// Create a new appointment
const createAppointment = async (req, res) => {
    const { title, description, date, duration, userId, location, status } = req.body;
  
    try {
      // Calculate the end time of the new appointment
      const appointmentStart = new Date(date);
      const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000); // duration is in minutes
  
      // Check for conflicting appointments
      const conflict = await Appointment.findOne({
        userId,
        $or: [
          { // Overlaps with an existing appointment's start time
            date: { $lt: appointmentEnd },
            $expr: { $gte: [{ $add: ["$date", "$duration"] }, appointmentStart] }
          },
          { // Starts during an existing appointment
            date: { $gte: appointmentStart, $lt: appointmentEnd }
          }
        ]
      });
  
      if (conflict) {
        return res.status(400).json({ message: 'The user already has an appointment that conflicts with the requested time' });
      }
  
      // If no conflicts, create the new appointment
      const newAppointment = new Appointment({ title, description, date, duration, userId, location, status });
      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  };
  
// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, duration, location, status } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { title, description, date, duration, location, status }, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
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