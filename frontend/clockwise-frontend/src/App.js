// App.js
import React, {useEffect} from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SecureRoute from './components/SecureRoutes';
import ForgotPassword from './components/ForgotPassword';

function App() {
    
    return (
     
            <AuthProvider>
            <div className="App">
            
                <Routes>
                    <Route path="/" element={<Navigate to="/register" />} /> {/* Redirect to Register */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Ensure this route exists */}
                    <Route path="/components/dashboard" element={<SecureRoute component={Dashboard} />} />
                </Routes>
            </div>
            </AuthProvider>
    
    );
  }
  
  export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

// <