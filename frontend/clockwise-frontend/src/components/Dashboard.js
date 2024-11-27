import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import UserDashboard from "./UserDashboard"; // Import UserDashboard

import user_icon from "./person.png";
import email_icon from "./email.png";
import password_icon from "./password.png";

import "./Dashboard.css";



export default function Dashboard() {
    const { login, signup, currentUser } = useAuth(); // Get currentUser, signup, and login from AuthContext
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(true);
    const [showJoinCreate, setShowJoinCreate] = useState(false);
    const [showUserDashboard, setShowUserDashboard] = useState(false); // Add state for showing the user dashboard

    // Handle Signup or Login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (isSignup) {
                // Signup the user using Firebase Auth
                await signup(email, password);
                console.log("User signed up successfully:", currentUser);
            } else {
                // Login the user using Firebase Auth
                await login(email, password);
                console.log("User logged in successfully:", currentUser);
            }

            // Redirect to User Dashboard after successful login/signup
            navigate("/user-dashboard");
        } catch (error) {
            console.error("Error during authentication:", error);
            setError("Failed to authenticate. Please try again.");
        }
    };


    // Handle Create Company logic
    const handleCreateCompany = async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.uid) {
            alert("No valid user ID found. Please log in.");
            return;
        }

        const ownerId = currentUser.uid;
        const companyName = e.target.elements.companyName.value;

        try {
            const response = await fetch("http://localhost:3003/api/companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: companyName, ownerId }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Company and team created successfully:", data);
                alert(`Company created successfully!\nTeam Code: ${data.team.code}`);
                navigate("/user-dashboard"); // Ensure navigation happens here
            } else {
                console.error("Failed to create company:", data.message);
                setError(data.message || "Failed to create the company.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while creating the company.");
        }
    };



    // Render User Dashboard
    if (showUserDashboard) {
        return <UserDashboard />;
    }

    // Render Join/Create page
    if (showJoinCreate) {
        return (
            <div className="join-create-page">
                <h1>Join or Create a Team</h1>
                <div className="join-create-options">
                    <Form
                        onSubmit={(e) => {
                            ////.preventDefault();
                            //const companyName = e.target.elements.companyName.value;
                            handleCreateCompany(e);
                        }}
                    >
                        <Form.Group>
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                placeholder="Enter company name"
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary">
                            Create Company
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

    // Render Login/Signup form
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
                                <Button type="submit">{isSignup ? "Sign Up" : "Login"}</Button>
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
