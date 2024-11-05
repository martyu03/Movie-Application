import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({}); // Initialize as an empty object

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({ id: decodedToken.id, isAdmin: decodedToken.isAdmin });
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUser({}); // Reset to empty object if token is invalid
            }
        } else {
            setUser({}); // No token found
        }
    }, []);

    const unsetUser = () => {
        setUser({}); // Reset user to an empty object
        localStorage.removeItem('token'); // Optionally, remove the token from localStorage
    };

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
