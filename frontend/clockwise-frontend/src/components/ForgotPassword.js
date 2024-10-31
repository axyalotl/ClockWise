import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await resetPassword(email);
      setMessage("Check your inbox for further instructions.");
    } catch {
      setError("Failed to reset password. Please try again.");
    }
  };

  // Redirect after success message is displayed for 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer); // Clean up timer on component unmount
    }
  }, [message, navigate]);

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {!message && <Link to="/login">Back to Login</Link>}
    </div>
  );
};

export default ForgotPassword;
