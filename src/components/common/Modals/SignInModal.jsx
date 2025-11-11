import React, { useState } from "react";
import { Mail, LockKeyhole, Eye, LogOut } from 'lucide-react';

export default function SignInModal({ onClose }) {

    const [passwordVisibility, setPasswordVisibility] = useState(false)
    
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility)
    }
    
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
                <h2 className="secondary-font text-2xl font-semibold text-center mb-2">
                    SIGN IN WITH EMAIL
                </h2>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Make a new doc to bring your words, data, and teams together. For free
                </p>

                {/* Form */}
                <form>
                    <div className="space-y-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <Mail className="text-gray-500 mr-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent w-full outline-none text-gray-700"
                                autoComplete="email"
                            />
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <LockKeyhole className="text-gray-500 mr-2" />
                            <input
                                type={passwordVisibility ? 'text' : 'password'}
                                placeholder="Password"
                                className="bg-transparent w-full outline-none text-gray-700"
                                autoComplete="current-password"
                            />
                            <button type="button" className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={togglePasswordVisibility}>
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-gray-500 hover:text-black">
                                Forgot password?
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center my-6 secondary-font">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-3 text-gray-400 text-sm"><span className="underline">sign up</span></span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                            Get Started
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
