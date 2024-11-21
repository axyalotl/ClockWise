// components/UserDashboard.js
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './UserDashboard.css';

const UserDashboard = () => {
    return (
        <div className="user-dashboard">
            <div className="sidebar">
                <h2>ClockWise</h2>
                <ul>
                    <li className="active">Dashboard</li>
                    <li>My Shifts</li>
                    <li>Settings</li>
                </ul>
                <Button variant="outline-primary" className="add-button">
                    + Add Company/Team
                </Button>
            </div>
            <div className="main-content">
                <div className="header">
                    <h1>Dashboard</h1>
                </div>
                <div className="cards">
                    <Card className="card">
                        <Card.Body>
                            <Card.Title>Team A</Card.Title>
                            <Card.Text>View team details and schedules</Card.Text>
                            <Button variant="primary">View</Button>
                        </Card.Body>
                    </Card>
                    <Card className="card">
                        <Card.Body>
                            <Card.Title>Company A</Card.Title>
                            <Card.Text>Manage company settings</Card.Text>
                            <Button variant="primary">Manage</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
