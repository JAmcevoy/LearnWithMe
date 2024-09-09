import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const handleMount = async () => {
        try {
            const { data } = await axiosRes.get("dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleMount();
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

    if (loading) {
        return <LoadingSpinner />; 
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};

