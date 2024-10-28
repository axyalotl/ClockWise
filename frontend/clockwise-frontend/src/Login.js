import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthState';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3003/api/users/login', {
               //Need to fix the actual routes your backend provides for registration and login
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) login(data.user); // Log in the user if successful
        } catch (err) {
            console.error('Error logging in:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" type="text" placeholder="Username" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
