import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const { data } = await axiosRes.get("/dj-rest-auth/user/");
                setCurrentUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    useMemo(() => {
        axiosReq.interceptors.request.use(
            async (config) => {
                try {
                    await axios.post('/dj-rest-auth/token/refresh/');
                } catch (err) {
                    setCurrentUser(null);
                    history.push('/signin');
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        axiosRes.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    try {
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch (err) {
                        setCurrentUser(null);
                        history.push('/signin');
                    }
                    return axios(error.config);
                }
                return Promise.reject(error);
            }
        );
    }, [history]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
