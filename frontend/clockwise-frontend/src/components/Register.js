import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthState';
import { createUserWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './firebaseConfig'; // Ensure this file exports the Firebase auth instance

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login, auth } = useContext(AuthContext); // This login function should set the auth state in your app

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.username, form.password);
            const user = userCredential.user;
            login(user); // Log in the user after successful registration
        } catch (err) {
            console.error('Error registering with Firebase:', err);
            alert('Registration failed. Please try again.');
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
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
