import axios from "axios";

axios.defaults.baseURL = 'https://lwm-api-43aad69bd928.herokuapp.com/';
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();