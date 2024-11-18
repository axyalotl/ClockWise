// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome'
import SecureRoute from './components/SecureRoutes';

function App() {
    return (
        <div className="App">
            <Dashboard />
        </div>

    );
}


export default App;