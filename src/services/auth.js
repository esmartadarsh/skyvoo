import api from "./api";

/**
 * Login user with username and password.
 * POST /api/auth/login
 * The API requires PascalCase keys: Username, Password
 */
export const loginUser = async ({ username, password }) => {
    const response = await api.post("/auth/login", {
        Username: username,
        Password: password,
    });
    return response.data.Data;
};

/**
 * Refresh the access token using the stored refresh token.
 * POST /api/Auth/refresh
 */
export const refreshToken = async (refreshToken) => {
    const response = await api.post("/Auth/refresh", {
        RefreshToken: refreshToken,
    });
    return response.data;
};
