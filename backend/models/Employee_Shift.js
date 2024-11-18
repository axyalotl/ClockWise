const mongoose = require('mongoose');

const employeeShiftSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    shiftType: {
        type: String,
        enum: ['Full', 'Morning', 'Afternoon'],
        required: true
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates HH:mm format
            },
        message: 'Start time must be in the format HH:mm'
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates HH:mm format
            },
            message: 'End time must be in the format HH:mm'
        }
    }
});

employeeShiftSchema.pre('validate', function (next) {
    if (this.shiftType === 'Full') {
        this.startTime = '10:00';
        this.endTime = '18:00';
    } else if (this.shiftType === 'Morning') {
        this.startTime = '10:00';
        this.endTime = '14:00';
    } else if (this.shiftType === 'Afternoon') {
        this.startTime = '14:00';
        this.endTime = '18:00';
    }
    next();
});

const EmployeeShift = mongoose.model('EmployeeShift', employeeShiftSchema);

module.exports = EmployeeShift;
