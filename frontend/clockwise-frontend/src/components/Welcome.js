import React from 'react';
import './Welcome.css';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/dashboard'); // Redirects to dashboard or another page
    };

    return (
        <div className="welcome-screen">
            <h1>Welcome to ClockWise</h1>
            <p className="welcome-message">Your time management, reimagined.</p>
            <button className="welcome-button" onClick={handleGetStarted}>Get Started</button>
        </div>
    );
}