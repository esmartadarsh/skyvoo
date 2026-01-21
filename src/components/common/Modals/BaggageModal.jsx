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
            className="
        fixed inset-0 z-[9999]
        bg-black/50
        flex items-center justify-center
        px-2 sm:px-4
      "
            onClick={onClose}
        >
            <div
                className="p-8 bg-white shadow-xl w-full sm:max-w-lg lg:max-w-xl rounded-2xl max-h-[90vh] flex flex-col animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-base sm:text-lg font-semibold">
                        Add Extra Baggage
                    </h2>
                    <button
                        className="text-gray-500 hover:text-black text-xl"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Flight Info */}
                <div className="bg-blue-500 text-white p-3 flex items-start gap-2">
                    <Plane size={18} className="mt-0.5 shrink-0" />
                    <div>
                        <div className="font-semibold text-sm sm:text-base">
                            New Delhi → Bengaluru
                        </div>
                        <div className="text-xs sm:text-sm text-blue-100">
                            Selection pending
                        </div>
                    </div>
                </div>

                {/* Included baggage */}
                <div className="py-4 text-xs sm:text-sm text-gray-700">
                    Included Check-in baggage per person —
                    <span className="text-blue-600 font-medium ml-1">
                        15 KGS
                    </span>
                </div>

                {/* Options */}
                <div className="flex-1 overflow-y-auto pb-4 space-y-2">
                    {[
                        ["Additional 3 KG", "₹ 1,935"],
                        ["Additional 5 KG", "₹ 3,225"],
                        ["Additional 10 KG", "₹ 6,450"],
                        ["Additional 15 KG", "₹ 9,675"],
                        ["Additional 20 KG", "₹ 9,675"],
                        ["Additional 30 KG", "₹ 9,675"],
                        ["Additional 40 KG", "₹ 14,675"],
                        ["Additional 50 KG", "₹ 19,675"],
                    ].map(([weight, price]) => (
                        <BaggageOption
                            key={weight}
                            weight={weight}
                            price={price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


function BaggageOption({ weight, price }) {
    return (
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 hover:border-gray-300 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
                <Briefcase size={18} className="text-gray-400 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 truncate">
                    {weight}
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-semibold text-sm sm:text-base text-gray-900 whitespace-nowrap">
                    {price}
                </span>

                <button className=" px-3 py-1.5 text-xs sm:text-sm font-medium border border-gray-300 rounded hover:bg-gray-50">
                    Add
                </button>
            </div>
        </div>
    );
}
