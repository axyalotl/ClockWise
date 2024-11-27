import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
    );
}

export default App;
