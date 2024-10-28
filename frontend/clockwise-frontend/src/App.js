// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Import your components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SecureRoute from './SecureRoute';

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

            {/* Add routing here */}
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    {/* Protect the dashboard route with SecureRoute */}
                    <SecureRoute path="/dashboard" component={Dashboard} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
