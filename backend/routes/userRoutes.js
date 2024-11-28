const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,
  getUserAvailability,
  syncUser // Import the new controller function
} = require('../controllers/userController');

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Sync user with Firebase UID to MongoDB
router.post('/sync', syncUser); // New route to sync users

// Existing CRUD routes
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// New route for user availability
router.get('/:id/availability', getUserAvailability);

module.exports = router;
