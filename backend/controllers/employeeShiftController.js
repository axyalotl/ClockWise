const mongoose = require('mongoose');
const EmployeeShift = require('../models/Employee_Shift');

// Get all shifts
const getAllShifts = async (req, res) => {
    try {
        const shifts = await EmployeeShift.find();
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shifts', error });
    }
};

// Get a shift by ID
const getShiftById = async (req, res) => {
    try {
        const shift = await EmployeeShift.findById(req.params.id);
        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shift', error });
    }
};

// Create a new shift
const createShift = async (req, res) => {
    const { employeeName, date, shiftType } = req.body;

    if (!employeeName || !date || !shiftType) {
        return res.status(400).json({ message: 'Employee name, date, and shift type are required' });
    }

    try {
        const newShift = new EmployeeShift({ employeeName, date, shiftType });
        await newShift.save();
        res.status(201).json(newShift);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create shift', error });
    }
};

// Update a shift
const updateShift = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid shift ID' });
    }

    try {
        const updatedShift = await EmployeeShift.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json(updatedShift);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update shift', error });
    }
};

// Delete a shift
const deleteShift = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid shift ID' });
    }

    try {
        const deletedShift = await EmployeeShift.findByIdAndDelete(req.params.id);
        if (!deletedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete shift', error });
    }
};

module.exports = {
    getAllShifts,
    getShiftById,
    createShift,
    updateShift,
    deleteShift,
};
