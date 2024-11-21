// App.js
import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

import Dashboard from './components/Dashboard';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Dashboard />
            </div>
        </AuthProvider>
    );
}

export default App;
