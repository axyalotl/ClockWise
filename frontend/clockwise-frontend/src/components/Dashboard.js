import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
main
import './Dashboard.css';

export default function Dashboard() {
  const { login, signup } = useAuth(); // Remove currentUser
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // Navigate to the main dashboard after successful login
    } catch {
      setError("Failed to log in. Please check your credentials and try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate("/dashboard"); // Navigate to the main dashboard after successful signup
    } catch {
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className="welcome-screen">
      <h1>Clockwise</h1>
      <p>Please select an option:</p>
      <Button variant="primary" onClick={() => { setShowLogin(true); setShowSignup(false); }}>Login</Button>
      <Button variant="secondary" onClick={() => { setShowSignup(true); setShowLogin(false); }}>Signup</Button>

      {/* Login Form Popup */}
      {showLogin && (
        <div className="popup">
          <Card className="form-container">
            <Card.Body>
              <h3>Login to Clockwise</h3>
              {error && <p className="error-text">{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formLoginEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formLoginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Login
                </Button>
              </Form>
              <Button variant="link" onClick={() => setShowLogin(false)}>Cancel</Button>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Signup Form Popup */}
      {showSignup && (
        <div className="popup">
          <Card className="form-container">
            <Card.Body>
              <h3>Create an Account</h3>
              {error && <p className="error-text">{error}</p>}
              <Form onSubmit={handleSignup}>
                <Form.Group controlId="formSignupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formSignupPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Signup
                </Button>
              </Form>
              <Button variant="link" onClick={() => setShowSignup(false)}>Cancel</Button>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
