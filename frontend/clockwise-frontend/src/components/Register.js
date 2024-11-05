import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import user_icon from './person.png';
import email_icon from './email.png';
import password_icon from './password.png';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios
const Register = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            const username = usernameRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            
            await createUserWithEmailAndPassword(auth, email, password);
            
            // Now, send the username to your backend
            await axios.post('http://localhost:3003/api/users', {
                name: username,
                email: email,
                password: password
            });
            
            // Log in the user after successful registration
            await login(email, password);
            navigate("/dashboard"); 
        } catch (error) {
            console.error("Error registering user:", error);
            setError("Failed to create an account");
        }

        setLoading(false);
    }

    return (
        <div>
            <header className="app-header">ClockWise</header>
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit} className="inputs">
                <div className="input">
                    <img src={user_icon} alt="User Icon" />
                    <input
                        type="text"
                        name="username"
                        placeholder="Name"
                        ref={usernameRef}
                        required
                    />
                </div>
                <div className="input">
                    <img src={email_icon} alt="Email Icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email ID"
                        ref={emailRef}
                        required
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="Password Icon" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        ref={passwordRef}
                        required
                    />
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    <div className="toggle-text">
                        <button type="button" onClick={() => navigate('/login')}>Already have an account? Login</button>

                    </div>
                </div>
            </form>
        </div>
        </div>
    );
};

export default Register;