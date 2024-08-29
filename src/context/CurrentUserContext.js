import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    // Function to fetch current user data
    const handleMount = async () => {
        try {
            const { data } = await axiosRes.get("dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    useEffect(() => {
        // Set up interceptors
        const requestInterceptor = axiosReq.interceptors.request.use(
            async (config) => {
                try {
                    await axios.post('/dj-rest-auth/token/refresh/');
                } catch (err) {
                    setCurrentUser((prevCurrentUser) => {
                        if (prevCurrentUser) {
                            history.push('/signin');
                        }
                        return null;
                    });
                }
                return config;
            },
            (err) => Promise.reject(err)
        );

        const responseInterceptor = axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401) {
                    try {
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch (err) {
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                history.push('/signin');
                            }
                            return null;
                        });
                    }
                    return axios(err.config);
                }
                return Promise.reject(err);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosReq.interceptors.request.eject(requestInterceptor);
            axiosRes.interceptors.response.eject(responseInterceptor);
        };
    }, [history]);

    // Logout function
    const handleLogout = async () => {
        try {
            await axios.post('/dj-rest-auth/logout/');
            setCurrentUser(null); // Clear the user from context
            history.push('/signin'); // Redirect to sign-in page
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
