import React, { useState } from "react";
import { Mail, LockKeyhole, Eye, LogOut, EyeOff, Loader2 } from 'lucide-react';
import { loginUser } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInModal({ onClose }) {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => setPasswordVisibility((v) => !v);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser({ username, password });
            const authResponse = data?.authResponse;

            if (authResponse?.Status === "SUCCESS" && authResponse?.Token) {
                login(authResponse);   // saves to localStorage + context
                onClose();
            } else {
                setError(authResponse?.ErrorMessage || "Login failed. Please try again.");
            }
        } catch (err) {
            const msg =
                err?.response?.data?.authResponse?.ErrorMessage ||
                err?.response?.data?.message ||
                "Network error. Please check your connection.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-8 w-[400px] relative"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
            >
                {/* Close button */}
                <button
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black"
                    onClick={onClose}
                    aria-label="Close sign in modal"
                >
                    ✕
                </button>

                {/* Top Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 shadow-md rounded-2xl p-4">
                        <LogOut className="w-8 h-8 text-gray-700" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-semibold text-center mb-2">
                    SIGN IN WITH EMAIL
                </h2>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Welcome back! Enter your credentials to continue.
                </p>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <Mail className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                id="login-username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-700"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <LockKeyhole className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                id="login-password"
                                type={passwordVisibility ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-700"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="cursor-pointer text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                                onClick={togglePasswordVisibility}
                                aria-label={passwordVisibility ? "Hide password" : "Show password"}
                            >
                                {passwordVisibility ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-gray-500 hover:text-black">
                                Forgot password?
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-3 text-gray-400 text-sm"><span className="underline">sign up</span></span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Get Started"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); }
            to { transform: scale(1); }
          }
        `}
            </style>
        </div>
    );
}
