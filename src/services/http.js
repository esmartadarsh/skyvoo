import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 15000,
});

// Request interceptor (auth later)
http.interceptors.request.use(
    (config) => {
        // const token = authStore.getToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (global errors later)
http.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // central error handling
        return Promise.reject(error);
    }
);
