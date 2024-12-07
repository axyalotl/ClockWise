import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";

import "./Dashboard.css";

const Login = ({ setIsLogin }) => { 
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");

            // Authenticate user with Firebase
            const firebaseUser = await login(email, password);

            if (!firebaseUser) {
                throw new Error("Firebase authentication failed.");
            }

            // Validate user with backend
            const response = await fetch("http://localhost:3003/api/Users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to authenticate user.");
            }

            console.log("Login successful:", data);
            navigate("/user-dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Failed to login. Please check your email or password.");
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <Form onSubmit={handleLogin}>
                <div className="inputs">
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
                <div className="submit-container" style={{ display: 'flex', gap: '50px' }}>
                    <Button type="submit" className="submit">
                        Login
                    </Button>

                    <Button className="text-button">
                        Reset Password
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;