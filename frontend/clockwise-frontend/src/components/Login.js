import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this file exports the Firebase auth instance
import email_icon from './email.png';
import password_icon from './password.png';
import './Dashboard.css';

const Login = () => {
const [form, setForm] = useState({ email: '', password: '' });
const { login } = useAuth(); // This login function should handle setting the auth state in your app
const navigate = useNavigate();


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
                <div className="forgot-password">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">Login</button>
                    <div className="toggle-text">
                        <button type="button" onClick={() => navigate('/register')}>Don't have an account? Sign Up</button>

                    </div>
                </div>
            </form>
        </div>
      </form>
    </div>
  );
};

export default Login;
