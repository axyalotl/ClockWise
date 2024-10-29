import React, { useContext } from 'react';
import { AuthContext } from './components/AuthState';

const Logout = () => {
    const { logout, auth } = useContext(AuthContext);
    const handleLogout = async () => {
        try {
          await logout();
          alert('Logout successful');
        } catch (error) {
          alert(error.message);
        }
      };
    return auth.isAuthenticated ? (
        <button onClick={logout}>Logout</button>
    ) : null;
};

export default Logout;
