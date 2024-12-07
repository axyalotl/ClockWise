import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";

import "./Dashboard.css";
import "./Register"
import Dashboard from "./Dashboard";

import { Link } from "react-router-dom";

const Login = ({ setIsLogin }) => { // Receive setIsLogin as a prop
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const firebaseUser = await login(email, password);
            const user = {
                uid: firebaseUser.user.uid, // Use Firebase UID
                username, // Username entered by the user
                email,
            };

            const response = await fetch("http://localhost:3003/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to authenticate user");

            console.log("Login Successful. Backend Response:", data);

            navigate("/user-dashboard");
        } catch (err) {
            console.error("Login Error:", err);
            setError("Failed to login. Please try again.");
        }
    };

    return (
        <div>
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
                    <div className="submit-container" style = {{ display: 'flex', gap: '50px' }}>
                        <Button type="submit" className="submit">
                            Login
                        </Button>

                        <Button className="text-button">
                            Reset Password
                        </Button>

                    </div>
                </Form>

            </div>
        </div>
    );
};

export default Login;