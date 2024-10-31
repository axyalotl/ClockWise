const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, getUserById } = require('../controllers/userController');
const router = express.Router();
//const User = require('../models/user');

// Define the routes for the CRUD operations
router.get('/', getUsers); // GET all users
router.post('/', createUser); // CREATE a new user
router.get('/:id', getUserById); // GET a user by ID
router.put('/:id', updateUser); // UPDATE a user by ID
router.delete('/:id', deleteUser); // DELETE a user by ID


module.exports = router;
