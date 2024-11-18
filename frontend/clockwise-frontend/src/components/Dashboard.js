// Dashboard.js
import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import user_icon from './person.png';
import email_icon from './email.png';
import password_icon from './password.png';

import './Dashboard.css';

export default function Dashboard() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { email, password };

        try {
            const response = await fetch('http://localhost:3003/api/login', { // Ensure correct login endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Non-JSON response from server');
            }

            console.log('Response data:', data); // Log response for debugging

            if (response.ok) {
                console.log('Login successful');
                navigate('/welcome'); // Redirect to Welcome page after successful login
            } else {
                setError(data.message || 'Failed to login');
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Login failed due to network error');
        }
    };

    return (
        <div> 
            <header className="app-header">ClockWise</header>
            <div className="container">
                <Card>
                    <div className="header">
                        <div className="text">Login</div>
                        <div className="underline"></div>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <div className="inputs">
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
                            <div className="submit-container">
                                <Button type="submit">
                                    Login
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
