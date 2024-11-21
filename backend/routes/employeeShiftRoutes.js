const express = require('express');
const {
    getAllShifts,
    getShiftById,
    createShift,
    updateShift,
    deleteShift
} = require('../controllers/employeeShiftController');

const router = express.Router();

router.get('/', getAllShifts); // Get all shifts
router.get('/:id', getShiftById); // Get a shift by ID
router.post('/', createShift); // Create a new shift
router.put('/:id', updateShift); // Update a shift by ID
router.delete('/:id', deleteShift); // Delete a shift by ID

module.exports = router;
