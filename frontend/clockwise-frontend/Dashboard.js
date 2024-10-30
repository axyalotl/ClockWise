import React, { useState } from "react";
import { Button, Navbar, Container, Nav, NavDropdown, Form, FormControl, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Dashboard.css';

const SignupScreen = () => {
    return (
        <div className="header">
            <h1>Clockwise</h1>
            <p>Please input your login information</p>

            <input
                // ...
                className="normal"
            />
            <p></p>
            <input
                // ...
                className="normal"
            />
            <p></p>
            <button className="normal">Login</button>
            <p></p>
            <button className="normal">Create Account</button>
        </div>
    );
};

export default function Dashboard(){

}
