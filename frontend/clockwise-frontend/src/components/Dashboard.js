import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Dashboard.css";

const Dashboard = () => {
    const [isSignup, setIsSignup] = useState(false); // Default to Login page

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <header className="app-header">ClockWise</header>
                {isSignup ? (
                    <Signup />
                ) : (
                    <Login />
                )}
                <div className="auth-toggle">
                    {isSignup ? (
                        <button
                            onClick={() => setIsSignup(false)}
                            className="auth-toggle-button">
                            Already have an account? Login
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsSignup(true)}
                            className="auth-toggle-button">
                            Don't have an account? Signup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
