import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

    const login = (user) => setAuth({ isAuthenticated: true, user });
    const logout = () => setAuth({ isAuthenticated: false, user: null });

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
