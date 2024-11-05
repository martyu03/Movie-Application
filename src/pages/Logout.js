import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
    const { unsetUser } = useContext(UserContext);

    useEffect(() => {
        unsetUser(); // Call unsetUser to clear user data
    }, [unsetUser]); // Include unsetUser in dependencies

    return <Navigate to='/login' />;
}
