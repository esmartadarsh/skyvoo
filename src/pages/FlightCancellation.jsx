import React, { useState } from "react";
import Header from '@/components/layout/Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp';

export default function FlightCancellation() {
    const [refundMethod, setRefundMethod] = useState("wallet");
    const [reason, setReason] = useState("");

    // Example fare values
    const baseFare = 4500;
    const taxes = 800;
    const convenienceFee = 200;
    const cancellationFee = 1500;

    const totalPaid = baseFare + taxes + convenienceFee;
    const refundAmount = totalPaid - cancellationFee;

    return (
        <div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-900">
                {/* Page Title */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg sm:text-xl font-bold flex-shrink-0">!</div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cancel Flight Booking</h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 ml-0 sm:ml-16">
                        Please review the details below before confirming your cancellation. Refund will be processed according to airline policy.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Flight & Fare Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flight Details Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Flight Details</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Flight Number</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">AI 203</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Departure</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">New Delhi (DEL)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Passenger Name</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">Adarsh Joshi</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Travel Date</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">22 November 2025</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Arrival</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">Mumbai (BOM)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Booking Reference</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">BKD98234</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fare Breakup Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Fare Breakup</h2>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm sm:text-base text-gray-700">Base Fare</span>
                                    <span className="text-sm sm:text-base text-gray-900 font-medium">₹{baseFare.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm sm:text-base text-gray-700">Taxes & Surcharges</span>
                                    <span className="text-sm sm:text-base text-gray-900 font-medium">₹{taxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm sm:text-base text-gray-700">Convenience Fee</span>
                                    <span className="text-sm sm:text-base text-gray-900 font-medium">₹{convenienceFee.toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm sm:text-base text-gray-900 font-semibold">Total Amount Paid</span>
                                        <span className="text-base sm:text-lg text-gray-900 font-semibold">₹{totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm sm:text-base text-red-600 font-semibold">Cancellation Fee</span>
                                        <span className="text-base sm:text-lg text-red-600 font-semibold">-₹{cancellationFee.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-gray-300 pt-3 sm:pt-4 mt-3 sm:mt-4">
                                    <div className="flex justify-between items-center py-2 sm:py-3 bg-green-50 rounded-xl px-3 sm:px-4">
                                        <span className="text-base sm:text-lg text-green-700 font-bold">Refund Amount</span>
                                        <span className="text-xl sm:text-2xl text-green-600 font-bold">₹{refundAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Reason */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Reason for Cancellation</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Optional: Please share why you're cancelling this booking</p>
                            <textarea
                                className="w-full border border-gray-300 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78080B] focus:border-transparent resize-none"
                                rows="4"
                                placeholder="Enter your reason here..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column - Refund Method & Actions */}
                    <div className="space-y-6">
                        {/* Refund Method Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 lg:sticky lg:top-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Refund Method</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Choose how you'd like to receive your refund</p>

                            <div className="space-y-3">
                                <label className={`flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${refundMethod === "wallet" ? "border-[#78080B] bg-red-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="refundMethod"
                                        value="wallet"
                                        checked={refundMethod === "wallet"}
                                        onChange={(e) => setRefundMethod(e.target.value)}
                                        className="mt-1 accent-[#78080B]"
                                    />
                                    <div>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">Wallet</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Instant refund</p>
                                    </div>
                                </label>

                                <label className={`flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${refundMethod === "bank" ? "border-[#78080B] bg-red-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                    <input
                                        type="radio"
                                        name="refundMethod"
                                        value="bank"
                                        checked={refundMethod === "bank"}
                                        onChange={(e) => setRefundMethod(e.target.value)}
                                        className="mt-1 accent-[#78080B]"
                                    />
                                    <div>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">Bank Account</p>
                                        <p className="text-xs sm:text-sm text-gray-600">2–5 business days</p>
                                    </div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t">
                                <button className="w-full py-2.5 sm:py-3 rounded-xl bg-[#78080B] hover:bg-red-800 text-white text-sm sm:text-base font-semibold transition-colors shadow-sm">
                                    Confirm Cancellation
                                </button>
                                <button className="w-full py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold transition-colors">
                                    Go Back
                                </button>
                            </div>

                            {/* Note */}
                            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <p className="text-xs text-yellow-800">
                                    <strong>Note:</strong> Cancellation is irreversible. Please review all details carefully before confirming.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}