import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import email_icon from "./email.png";
import password_icon from "./password.png";
import user_icon from "./person.png";

import "./Dashboard.css";
import "./Login"
const Signup = ({ setIsLogin }) => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setError(""); // Clear any previous error

            // Create user in Firebase
            const firebaseUser = await signup(email, password);

            if (!firebaseUser || !firebaseUser.user) {
                throw new Error("Firebase authentication failed.");
            }

            // Prepare user data to send to the backend
            const user = {
                uid: firebaseUser.user.uid, // Firebase UID
                name: username,
                email,
            };

            // Send user data to MongoDB via backend API
            const response = await fetch("http://localhost:3003/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to save user to database.");
            }

            // Redirect to user dashboard on successful signup
            navigate("/user-dashboard");
        } catch (err) {
            // Display detailed error message
            setError(err.message || "Failed to signup. Please try again.");
        }
    };

    return (
        <div>
            <div className="container">
                <div className="header">
                    <div className="text">Signup</div>
                    <div className="underline"></div>
                </div>
                <Form onSubmit={handleSignup}>
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
                            Signup
                        </Button>
                    </div>
                </Form>

            </div>
        </div>
    );
};

export default Signup;
