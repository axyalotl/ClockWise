const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Employee', 'Guest'], default: 'Guest' },
});

UserSchema.methods.getAvailableShifts = async function() {
  const EmployeeShift = require('./Employee_Shift');
  const Appointment = require('./Appointment');

  // Fetch all shifts and appointments for this user
  const shifts = await EmployeeShift.find({ employeeName: this.name });
  const appointments = await Appointment.find({ userId: this._id });

  // Helper function to parse time strings or date objects consistently
  const parseDateTime = (dateTime) => {
    if (typeof dateTime === 'string') {
      // Handle time-only strings (e.g., "14:00")
      if (dateTime.includes(':') && !dateTime.includes('-')) {
        const [hours, minutes] = dateTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
      // Handle full date strings
      return new Date(dateTime);
    }
    return new Date(dateTime);
  };

  // Filter shifts that do not conflict with appointments
  const availableShifts = shifts.filter(shift => {
    const shiftStart = parseDateTime(shift.startTime);
    const shiftEnd = parseDateTime(shift.endTime);

    return !appointments.some(appointment => {
      const appointmentStart = parseDateTime(appointment.date);
      const appointmentEnd = new Date(appointmentStart.getTime());
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration);

      // Check for overlap, excluding exact boundary matches
      // A shift is considered available if:
      // - The appointment ends exactly when the shift starts (appointmentEnd equals shiftStart)
      // - The appointment starts exactly when the shift ends (appointmentStart equals shiftEnd)
      const hasConflict = (
        appointmentStart < shiftEnd && // Appointment starts before shift ends
        appointmentEnd > shiftStart    // Appointment ends after shift starts
      );

      return hasConflict;
    });
  });

  return availableShifts;
};

module.exports = mongoose.model('User', UserSchema);