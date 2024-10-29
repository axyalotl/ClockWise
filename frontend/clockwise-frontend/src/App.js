// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Import your components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SecureRoute from './components/SecureRoutes';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>

            {/* Wrap the Router and provide auth context */}
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Protect the dashboard route with SecureRoute */}
                        <Route path="/dashboard" element={<SecureRoute component={Dashboard} />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
