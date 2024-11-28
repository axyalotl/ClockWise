import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {Button, Form} from "react-bootstrap";
import user_icon from "./person.png";
import email_icon from "./email.png";
import password_icon from "./password.png";
import "./Login"
import { Link } from "react-router-dom";

export default function Register() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            navigate('/user-dashboard');
        } catch (error) {
            setError('Failed to create account. Please try again.');
        }
    };

    return (
        <div>
            <div className="container">
                <div className="header">
                    <div className="text">Register</div>
                    <div className="underline"></div>
                </div>
                <Form onSubmit={handleRegister}>
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="Username Icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="Email Icon" />
                            <input
                                type="email"
                                placeholder="Email"
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
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <div className="submit-container">
                        <Button type="submit" className="submit">
                            Register
                        </Button>
                    </div>
                </Form>

            </div>
        </div>
    );
}
