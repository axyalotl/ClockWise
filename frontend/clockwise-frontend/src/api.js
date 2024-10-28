import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003/api';

// Function to get all users
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

// Function to create a new user
export const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

// Function to get all appointments for a specific user
export const getAppointmentsByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/appointments/user/${userId}`);
  return response.data;
};
