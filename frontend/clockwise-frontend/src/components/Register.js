import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure firebaseConfig exports the Firebase auth instance
import user_icon from './person.png';
import email_icon from './email.png';
import password_icon from './password.png';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios

const Register = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef(); // Add a ref for username
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            const username = usernameRef.current.value; // Get username value
            const email = emailRef.current.value; // Get email value
            const password = passwordRef.current.value; // Get password value
            
            // Create user with email and password
            await createUserWithEmailAndPassword(auth, email, password);
            
            // Now, send the username to your backend
            await axios.post('http://localhost:3003/api/users', {
                name: username,
                email: email,
                password: password
            });
            
            // Log in the user after successful registration
            await login(email, password);
            navigate("/dashboard"); // Navigate to the dashboard after successful registration
        } catch (error) {
            console.error("Error registering user:", error);
            setError("Failed to create an account");
        }

        setLoading(false);
    }

    return (
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
            {error && <p className="error-text">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="inputs">
                <div className="input">
                    <img src={user_icon} alt="User Icon" />
                    <input
                        type="text"
                        name="username"
                        placeholder="Name"
                        ref={usernameRef} // Attach ref for username
                        required
                    />
                </div>
                <div className="input">
                    <img src={email_icon} alt="Email Icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email ID"
                        ref={emailRef} // Attach ref for email
                        required
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password Icon" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        ref={passwordRef} // Attach ref for password
                        required
                    />
                </div>
                <div className="forgot-password">Forgot password?</div>
                <div className="submit-container">
                    <button type="submit" className="submit" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    <button type="button" className="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;