import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase-config.js';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send user data to backend for MongoDB storage
    await fetch("http://localhost:3003/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
      }),
    });

    return user;
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
};
