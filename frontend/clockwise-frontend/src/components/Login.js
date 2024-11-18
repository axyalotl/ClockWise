import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthState';
import email_icon from './email.png';
import password_icon from './password.png';
import './Dashboard.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your backend login endpoint
      const response = await fetch('http://localhost:3003/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
      } else {
        alert(data.message || 'Failed to log in. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Error logging in with backend:', err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
          />
        </div>
        <div className="forgot-password">Forgot password?</div>
        <div className="submit-container">
          <button type="submit" className="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
