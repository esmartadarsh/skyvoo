import React from "react";
import {
    Briefcase,
    HeartPulse,
    Clock,
    Plane,
    AlertTriangle,
    Stethoscope,
    Phone,
    UserCheck,
    Ambulance,
} from "lucide-react";

export default function BaggageModal({ onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] secondary-font"
            onClick={onClose}
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
        >
            <div
                className="bg-white shadow-xl p-8 w-[30%] relative"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "scaleIn 0.3s ease-out forwards" }}
            >
                {/* Close button */}
                <button
                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4">Add Extra Baggage</h2>

                {/* Flight Info Banner */}
                <div className="bg-blue-500 text-white p-3 mb-4 flex items-start gap-2">
                    <Plane size={20} className="mt-0.5" />
                    <div>
                        <div className="font-semibold">New Delhi-Bengaluru</div>
                        <div className="text-sm text-blue-100">Selection pending</div>
                    </div>
                </div>

                {/* Included Baggage Info */}
                <div className="text-sm text-gray-700 mb-6">
                    Included Check-in baggage per person - <span className="text-blue-600 font-medium">15 KGS</span>
                </div>

                {/* Baggage Options List */}
                <div className="space-y-3 overflow-y-auto relative max-h-[35vh]">
                    <BaggageOption
                        weight="Additional 3 KG"
                        price="₹ 1,935"
                    />
                    <BaggageOption
                        weight="Additional 5 KG"
                        price="₹ 3,225"
                    />
                    <BaggageOption
                        weight="Additional 10 KG"
                        price="₹ 6,450"
                    />
                    <BaggageOption
                        weight="Additional 15 KG"
                        price="₹ 9,675"
                    />
                    <BaggageOption
                        weight="Additional 20 KG"
                        price="₹ 9,675"
                    />
                    <BaggageOption
                        weight="Additional 30 KG"
                        price="₹ 9,675"
                    />
                    <BaggageOption
                        weight="Additional 40 KG"
                        price="₹ 14,675"
                    />
                    <BaggageOption
                        weight="Additional 50 KG"
                        price="₹ 19,675"
                    />
                </div>

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

          /* Custom scrollbar */
          .scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 3px;
          }
        `}
            </style>
        </div>
    );
}

function BaggageOption({ weight, price }) {
    return (
        <div className="flex items-center justify-between py-5 px-4 border border-gray-200 hover:border-gray-300">
            <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-gray-400" />
                <span className="text-gray-700">{weight}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{price}</span>
                <button className="px-4 py-1 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50">
                    Add
                </button>
                <button className="cursor-pointer w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 text-lg">
                    +
                </button>
            </div>
        </div>
    );
}