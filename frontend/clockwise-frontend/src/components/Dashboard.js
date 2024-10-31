import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import user_icon from './person.png';
import email_icon from './email.png';
import password_icon from './password.png';

import './Dashboard.css';

export default function Dashboard() {
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(''); // Separate state for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(true); // Ensure isSignup is defined

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: username, // Make sure these variables have the right values
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:3003/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('User created successfully:', data);
            } else {
                console.error('Failed to create user:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
    <div> 
        <header className="app-header">ClockWise</header>
        <div className="container">
        <Card>
            <div className="header">
            <div className="text">{isSignup ? "Sign Up" : "Login"}</div>
            <div className="underline"></div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <Form onSubmit={handleSubmit}>
            <div className="inputs">
                {isSignup && (
                <div className="input">
                    <img src={user_icon} alt="User Icon" />
                    <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isSignup} // Required only for signup
                    />
                </div>
                )}
                <div className="input">
                <img src={email_icon} alt="Email Icon" />
                <input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="input">
                <img src={password_icon} alt="Password Icon" />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <div className="submit-container">
                <Button type="submit">
                    {isSignup ? "Sign Up" : "Login"}
                </Button>
                <div className="toggle-text" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </div>
                </div>
            </div>
            </Form>
        </Card>
        </div>
    </div>
  );
}
/*
<Button type="button" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </Button>
               <Link to="/forgot-password">Forgot password?</Link>
              */