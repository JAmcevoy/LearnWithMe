import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    const fetchCurrentUser = async () => {
        try {
            const { data } = await axios.get("/dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/dj-rest-auth/logout/');
            setCurrentUser(null);
            // Clear any cookies or tokens if needed
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("authToken");
            history.push('/signin');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={{ setCurrentUser, handleLogout }}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
