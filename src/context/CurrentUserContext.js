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

    const fetchCurrentUser = async () => {
        try {
            const { data } = await axiosRes.get("dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        // Check for token existence before fetching user
        const checkToken = async () => {
            try {
                const response = await axios.post('/dj-rest-auth/token/check/');
                if (response.status === 200) {
                    await fetchCurrentUser();
                } else {
                    setCurrentUser(null);
                }
            } catch (err) {
                setCurrentUser(null);
            }
        };

        checkToken();
    }, []);

    useEffect(() => {
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

        return () => {
            axiosReq.interceptors.request.eject(requestInterceptor);
            axiosRes.interceptors.response.eject(responseInterceptor);
        };
    }, [history]);

    const handleLogOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
            history.push('/signin');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={{ setCurrentUser, handleLogOut }}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
