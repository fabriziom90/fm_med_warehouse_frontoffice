import axios from 'axios';
import {router} from '../router';

// create custom axios api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// global response interceptor
api.interceptors.response.use(
  (response) => response, //response
  (error) => { // define error
    if (error.response && error.response.status === 401) {
      // expired or not valid token
      localStorage.removeItem("token"); // cleaning token
      router.push({ name: "login" }); // redirect
    }
    return Promise.reject(error); // return error as a promise
  }
);

export default api;
