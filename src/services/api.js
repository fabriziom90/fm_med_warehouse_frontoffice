import axios from 'axios';
import {router} from '../router';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor di risposta globale
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem("token"); // pulizia token
      router.push({ name: "login" }); // redirect
    }
    return Promise.reject(error);
  }
);

export default api;
