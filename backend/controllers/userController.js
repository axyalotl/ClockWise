const mongoose = require('mongoose');
const User = require('../models/user');
//const bcrypt = require('bcrypt');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user' });
    }
  };



// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role = 'User' } = req.body; // Default role to 'User' if not provided

  // Log the incoming request body
  console.log('POST request received at /api/users with data:', req.body);

  // Validate required fields
  if (!name || !email || !password) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create and save a new user
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    console.log('User saved to database successfully');
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

module.exports = { createUser };


// Other controller functions...


// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Validate required fields for update
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required for update' });
  }

  // Check if the email is in a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
