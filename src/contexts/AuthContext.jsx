import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const USER_INFO_KEY = "skyvoo_user";
const TOKEN_KEY = "skyvoo_token";
const REFRESH_TOKEN_KEY = "skyvoo_refresh_token";

// Helper — load persisted user from localStorage
const loadStoredUser = () => {
    try {
        const raw = localStorage.getItem(USER_INFO_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadStoredUser);

    /**
     * Call this after a successful login API response.
     * Persists user info + token to localStorage.
     */
    const login = useCallback((authResponse) => {
        const {
            Token,
            RefreshToken,
            RetailerId,
            OutletName,
            OutletCode,
            TokenExpiryTime,
        } = authResponse;

        const userInfo = { RetailerId, OutletName, OutletCode, TokenExpiryTime };

        localStorage.setItem(TOKEN_KEY, Token);
        localStorage.setItem(REFRESH_TOKEN_KEY, RefreshToken);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

        setUser(userInfo);
    }, []);

    /**
     * Call this after the api.js interceptor silently refreshes the token.
     * Updates the stored tokens without touching user profile info.
     */
    const refreshSession = useCallback((newToken, newRefreshToken) => {
        if (newToken) localStorage.setItem(TOKEN_KEY, newToken);
        if (newRefreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        // Re-hydrate user from localStorage to stay in sync
        setUser(loadStoredUser());
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        setUser(null);
    }, []);

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};
