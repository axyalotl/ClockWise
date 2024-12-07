const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');

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
  const {uid, name , password, email, role = 'Guest' } = req.body;

  if ( !name || !email || !password) {
    // not giving a name? for some reason
    return res.status(400).json({ message: 'Name, email, and password are required' + name + email + password });
  }

  try {

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      uid,
      name,
      email,
      password: hashedPassword,
      role
    });

    // removing this results in no saving to Mongo but without it can push to the next page
    await newUser.save();

    return res.status(201).json(newUser);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }

    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: 'Email already in use.' });
    }
    return res.status(500).json({ message: 'Failed to create user. UserController', error: error.message });
  }


};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt received:", { email });

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log("User fetched from database:", user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log(`Password mismatch for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("Login successful for email:", email);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required for update' });
  }

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

// Get user availability
const getUserAvailability = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call the method to get available shifts
    const availableShifts = await user.getAvailableShifts();

    // Respond with the available shifts
    res.status(200).json(availableShifts);
  } catch (error) {
    console.error('Error retrieving user availability:', error.message);
    res.status(500).json({ message: 'Failed to retrieve availability', error });
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserAvailability,
};
