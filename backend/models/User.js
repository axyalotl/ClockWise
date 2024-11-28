const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const UserSchema = new mongoose.Schema(
    {
      uid: { type: String, required: true, unique: true }, // Firebase UID
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['Admin', 'Employee', 'Guest'], default: 'Guest' },
    },
    { timestamps: true } // Add timestamps for createdAt and updatedAt
);

// Middleware: Hash password before saving to the database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password field is modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Method: Check if the password is correct
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: Get available shifts for the user
UserSchema.methods.getAvailableShifts = async function () {
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
  const availableShifts = shifts.filter((shift) => {
    const shiftStart = parseDateTime(shift.startTime);
    const shiftEnd = parseDateTime(shift.endTime);

    return !appointments.some((appointment) => {
      const appointmentStart = parseDateTime(appointment.date);
      const appointmentEnd = new Date(appointmentStart.getTime());
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration);

      // Check for overlap
      const hasConflict =
          appointmentStart < shiftEnd && // Appointment starts before shift ends
          appointmentEnd > shiftStart; // Appointment ends after shift starts

      return hasConflict;
    });
  });

  return availableShifts;
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
