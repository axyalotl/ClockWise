import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase-config.js';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { updateProfile } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the auth status is determined
    });

    return unsubscribe;
  }, []);


  const signup = async (email, password, username) => {
    const auth = getAuth(); // Ensure auth is correctly initialized

    try {
      // Firebase Authentication: Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally update the display name in Firebase
      //await updateProfile(user, { displayName: username });

      // Send user data to the backend for MongoDB storage
      const response = await fetch("http://localhost:3003/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: username,
          password, // Send plain text password (if backend hashes it)
          email: user.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save user to the database.");
      }

      return user; // Return Firebase user object on success
    } catch (error) {
      const errorCode = error.code || "Unknown_Error";
      const errorMessage = error.message || "Unknown error occurred during signup.";
      console.error(`Signup Error (${errorCode}): ${errorMessage}`);
      throw new Error(errorMessage); // Throw error to be caught in `Signup` component
    }
  };



  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send user data to backend for MongoDB validation/logging
    await fetch("http://localhost:3003/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
      }),
    });

    return user;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
      <AuthContext.Provider value={{ currentUser, signup, login, logout, resetPassword }}>
        {!loading && children}
      </AuthContext.Provider>
  );
}