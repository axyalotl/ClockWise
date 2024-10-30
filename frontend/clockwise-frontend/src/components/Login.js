import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthState';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './firebaseConfig'; // Ensure this file exports the Firebase auth instance

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login, auth } = useContext(AuthContext); // This login function should handle setting the auth state in your app

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.username, form.password);
            const user = userCredential.user;
            login(user); // Log in the user if authentication is successful
        } catch (err) {
            console.error('Error logging in with Firebase:', err);
            alert('Failed to log in. Please check your credentials and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.username}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
