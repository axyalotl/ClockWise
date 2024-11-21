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
    const { currentUser} = useAuth(); // Get currentUser from AuthContext
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(true);
    const [showUserDashboard, setShowUserDashboard] = useState(false); // Add state for showing the user dashboard
    const [showJoinCreate, setShowJoinCreate] = useState(false);

    // Handle form submission for Login/Signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: username,
            email: email,
            password: password,
        };

        try {
            const response = await fetch("http://localhost:3003/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("User created successfully:", data);
                setShowJoinCreate(true); // Show Join/Create page on success
                //need to log in after creating an account



            } else {
                console.error("Failed to create user:", data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    // Handle Join Team logic
    const handleJoinTeam = async (teamCode) => {
        try {
            if (!currentUser || !currentUser.uid) {
                alert("No valid user ID found. Please log in.");
                return;
            }

            const userId = currentUser.uid;

            const response = await fetch("http://localhost:3003/api/teams/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: teamCode, userId }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Successfully joined team:", data);
                setShowUserDashboard(true); // Trigger User Dashboard
            } else {
                console.error("Failed to join team:", data.message);
                alert(data.message || "Failed to join the team.");
            }
        } catch (error) {
            console.error("Error joining team:", error);
            alert("An error occurred while joining the team.");
        }
    };

    // Handle Create Company logic
    const handleCreateCompany = async (e) => {
        e.preventDefault();

        // Ensure the current user is authenticated
        if (!currentUser || !currentUser.uid) {
            alert("No valid user ID found. Please log in.");
            return;
        }

        const ownerId = currentUser.uid; // Dynamically fetched user ID
        const companyName = e.target.elements.companyName.value; // Get company name from the form

        const companyData = {
            name: companyName,
            //ownerId: ownerId,
        };

        try {
            const response = await fetch("http://localhost:3003/api/companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Company and team created successfully:", data);
                alert(`Company created successfully!\nTeam Code: ${data.team.code}`);
                setShowJoinCreate(false); // Hide the Join/Create page or navigate to another page
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
                            e.preventDefault();
                            const teamCode = e.target.elements.teamCode.value;
                            handleJoinTeam(teamCode);
                        }}
                    >
                        <Form.Group>
                            <Form.Label>Enter Team Code</Form.Label>
                            <Form.Control type="text" name="teamCode" placeholder="Enter team code" required />
                        </Form.Group>
                        <Button type="submit">Join Team</Button>
                    </Form>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const companyName = e.target.elements.companyName.value;
                            handleCreateCompany(companyName);
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
                            {isSignup && (
                                <div className="input">
                                    <img src={user_icon} alt="User Icon" />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
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
