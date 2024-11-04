import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({ isAdmin: decodedToken.isAdmin }); // Adjust according to your token structure
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUser(null); // Reset user if token is invalid
            }
        } else {
            setUser(null); // No token found
        }
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
