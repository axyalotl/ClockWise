import React, { useContext } from 'react';
import { AuthContext } from './AuthState';

const Logout = () => {
    const { logout, auth } = useContext(AuthContext);

    return auth.isAuthenticated ? (
        <button onClick={logout}>Logout</button>
    ) : null;
};

export default Logout;
