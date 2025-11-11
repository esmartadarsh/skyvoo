import React, { useState } from "react";
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'

export default function FareRulesModal({ onClose }) {
    const [activeTab, setActiveTab] = useState("cancellation");

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        >
            <div
                className="relative bg-white rounded-lg px-6 py-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Top Row Buttons */}
                <div className="flex mb-6">
                    <div
                        className="flex justify-start rounded-lg bg-gray-200 p-1"
                        style={{
                            width: "fit-content",
                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                        }}
                    >
                        {[
                            { key: "cancellation", label: "CANCELLATION CHARGES" },
                            { key: "detailchange", label: "DETAIL CHANGE CHARGES" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`cursor-pointer py-2 px-4 text-sm font-medium rounded transition-all ${activeTab === key
                                    ? "bg-[#920000] text-white"
                                    : "text-gray-700 hover:text-white hover:bg-[#920000]"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "cancellation" && (
                    <div>
                        <div className="flex items-center mb-4">
                            <img src={AirlineLogo} alt="airline logo" />
                            <h3 className="ml-3 text-xl font-semibold text-gray-800">
                                HDO-BLR
                            </h3>
                        </div>

                        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white">
                            {/* Table Header */}
                            <div className="bg-gray-100 border-b border-gray-300">
                                <div className="grid grid-cols-2 gap-4 p-4">
                                    <div className="font-semibold text-gray-700">
                                        Time frame<br />
                                        <span className="text-sm font-normal">(From Scheduled flight departure)</span>
                                    </div>
                                    <div className="font-semibold text-gray-700">
                                        Airline Fee + sv Fee<br />
                                        <span className="text-sm font-normal">(Per passenger)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-gray-200">
                                <div className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50">
                                    <div className="text-gray-700">
                                        <span className="font-medium">0 hours to 2 hours*</span>
                                    </div>
                                    <div className="text-gray-700">
                                        <span className="font-medium text-red-600">ADULT: Non Refundable</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50">
                                    <div className="text-gray-700">
                                        <span className="font-medium">2 hours to 365 days*</span>
                                    </div>
                                    <div className="text-gray-700">
                                        <span className="font-medium">ADULT: ₹ 4,300 + ₹ 350</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="bg-gray-50 p-4 border-t border-gray-300">
                                <p className="text-xs text-gray-600">
                                    <strong>*Important:</strong> The airline fee is indicative. MakeMyTrip does not guarantee the accuracy of this information. All fees mentioned are per passenger. All refunds are subject to airline approval.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "detailchange" && (
                    <div>
                        <div className="flex items-center mb-4">
                            <img src={AirlineLogo} alt="airline logo" />
                            <h3 className="ml-3 text-xl font-semibold text-gray-800">
                                HDO-BLR
                            </h3>
                        </div>

                        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white">
                            {/* Table Header */}
                            <div className="bg-gray-100 border-b border-gray-300">
                                <div className="grid grid-cols-2 gap-4 p-4">
                                    <div className="font-semibold text-gray-700">
                                        Time frame<br />
                                        <span className="text-sm font-normal">(From Scheduled flight departure)</span>
                                    </div>
                                    <div className="font-semibold text-gray-700">
                                        Airline Fee + sv Fee + Fare difference<br />
                                        <span className="text-sm font-normal">(Per passenger)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-gray-200">
                                <div className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50">
                                    <div className="text-gray-700">
                                        <span className="font-medium">0 hours to 2 hours*</span>
                                    </div>
                                    <div className="text-gray-700">
                                        <span className="font-medium text-red-600">ADULT: Non Changeable</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50">
                                    <div className="text-gray-700">
                                        <span className="font-medium">2 hours to 365 days*</span>
                                    </div>
                                    <div className="text-gray-700">
                                        <div className="font-medium">
                                            ADULT: <span className="line-through text-gray-400">₹ 3,000 + ₹ 350</span>{" "}
                                            <span className="text-green-600 font-semibold">₹ 0 (With Free Date Change)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="bg-gray-50 p-4 border-t border-gray-300">
                                <p className="text-xs text-gray-600">
                                    <strong>*Important:</strong> The airline fee is indicative. MakeMyTrip does not guarantee the accuracy of this information. All fees mentioned are per passenger. Date change charges are applicable only on selecting the same airline on a new date. The difference in fares between the old and the new booking will also be payable by the user. Please refer to the Date Change Charges section above for details on the number of allowed free date changes, if applicable.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
}