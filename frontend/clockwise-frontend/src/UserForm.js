import React, { useState } from 'react';
import { createUser } from './api'; // Import the API function you created


const UserForm = () => {
  const [formUID, setFormUID] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('Employee');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        uid: formUID,
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      };
      await createUser(userData);
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. UserForm');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formEmail}
        onChange={(e) => setFormEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formPassword}
        onChange={(e) => setFormPassword(e.target.value)}
        required
      />
      <select value={formRole} onChange={(e) => setFormRole(e.target.value)}>
        <option value="Employee">Employee</option>
        <option value="Admin">Admin</option>
        <option value="Guest">Guest</option>
      </select>
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
