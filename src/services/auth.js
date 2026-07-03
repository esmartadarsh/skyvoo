import api from "./api";

/**
 * Login user with username and password.
 * POST /api/auth/login
 */
export const loginUser = async ({ username, password }) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
};
