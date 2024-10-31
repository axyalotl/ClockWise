import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthState';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this file exports the Firebase auth instance
import email_icon from './email.png';
import password_icon from './password.png';
import './Dashboard.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext); // This login function should handle setting the auth state in your app

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;
            login(user); // Log in the user if authentication is successful
        } catch (err) {
            console.error('Error logging in with Firebase:', err);
            alert('Failed to log in. Please check your credentials and try again.');
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