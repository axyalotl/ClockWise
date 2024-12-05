import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import "./Dashboard.css";
import "./Welcome.css";

const Dashboard = () => {
    const [isSignup, setIsSignup] = useState(false); // Default to Login page
    const navigate = useNavigate(); // For redirection to user dashboard

    // Callback function to handle redirection
    const handleAuthSuccess = () => {
        navigate("/user-dashboard"); // Redirect to UserDashboard after successful auth and MongoDB connection
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <header className="app-header">ClockWise</header>
                {isSignup ? (
                    <Signup onAuthSuccess={handleAuthSuccess} />
                ) : (
                    <Login onAuthSuccess={handleAuthSuccess} />
                )}
                <div className="container">
                    {isSignup ? (
                        <button
                            onClick={() => setIsSignup(false)}
                            className="welcome-button">
                            Already have an account? Login
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsSignup(true)}
                            className="welcome-button">
                            Don't have an account? Signup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
