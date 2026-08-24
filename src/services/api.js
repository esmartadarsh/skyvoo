import axios from "axios";

const TOKEN_KEY = "skyvoo_token";
const REFRESH_TOKEN_KEY = "skyvoo_refresh_token";
const USER_INFO_KEY = "skyvoo_user";


// Base Axios Instance
const api = axios.create({
    baseURL: "https://skyvoo.esmartbazaar.in/api",
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
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// ─── Token Refresh Logic ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


/**
 * Response Interceptor
 * – On 401: attempts a silent token refresh, then retries the original request.
 * – Multiple concurrent 401s are queued behind a single refresh attempt.
 * – If the refresh itself fails the user is logged out.
 */
api.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 and if we haven't already tried for this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            // No refresh token available – log out immediately
            if (!storedRefreshToken) {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                localStorage.removeItem(USER_INFO_KEY);
                return Promise.reject(error);
            }

            // If a refresh is already in flight, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint directly (no interceptors on this call)
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/Auth/refresh`,
                    { RefreshToken: storedRefreshToken },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (data?.Status === "SUCCESS" && data?.Token) {
                    const newToken = data.Token;
                    const newRefreshToken = data.RefreshToken;

                    // Persist new tokens
                    localStorage.setItem(TOKEN_KEY, newToken);
                    if (newRefreshToken) {
                        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                    }

                    // Update default header for future requests
                    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } else {
                    // Refresh returned FAILED – clear session
                    processQueue(new Error("Refresh failed"), null);
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                    localStorage.removeItem(USER_INFO_KEY);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                localStorage.removeItem(USER_INFO_KEY);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Non-401 errors: log and propagate
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
