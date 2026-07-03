import axios from "axios";

// Base Axios Instance
const api = axios.create({
    baseURL: "https://localhost:44344/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request Interceptor
 * Attaches the Bearer token (stored in localStorage) to every outgoing request.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("skyvoo_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Global error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else if (error.request) {
            console.error("Network Error: No response received");
        } else {
            console.error("Axios Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
