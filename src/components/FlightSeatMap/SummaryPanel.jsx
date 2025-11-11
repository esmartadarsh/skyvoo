import React from 'react'
import { Plus, LogOut, Check, UtensilsCrossed, Briefcase, Clock, Accessibility, ChevronDown, X } from 'lucide-react';

function SummaryPanel({ selectedSeats, seatMap, SSRTypes, selectedServices, onRemoveService, totalAmount, onContinue }) {
    // console.log(selectedSeats, 'see the selected seats')
    return (
        <div className="lg:col-span-3 bg-[#f1f0f29e] shadow-sm rounded-xl p-4 border border-gray-200 h-auto mb-5">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Selection</h3>

            {/* Empty State */}
            {selectedSeats.size === 0 ? (
                <div className="py-10 text-center text-gray-500">
                    <p className="text-base mb-1">No seat selected</p>
                    <p className="text-sm">Click on an available seat to select</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Array.from(selectedSeats).map((seatNumber) => {
                        const seat = seatMap[seatNumber];
                        if (!seat) return null;

                        const seatSSRTypes = seat?.SSRType
                            ? (Array.isArray(seat.SSRType)
                                ? seat.SSRType.map((id) => SSRTypes[id] || "Unknown")
                                : [SSRTypes[seat.SSRType] || "Unknown"])
                            : [];

                        return (
                            <div
                                key={seatNumber}
                                className="flex justify-between p-3 rounded-lg border border-gray-100 shadow-sm"
                            >
                                {/* Seat Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-800">Seat {seatNumber}</h4>
                                    <p className="text-sm text-gray-500">{seat.classType}</p>

                                    {seatSSRTypes.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {seatSSRTypes.map((type, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs font-medium border border-gray-300 rounded px-2 py-0.5 text-gray-700"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Seat Price */}
                                <div className="mt-4 flex justify-end">
                                    <span className="text-gray-700 font-semibold text-base">
                                        ₹{seat.price || 0}
                                    </span>
                                </div>

                            </div>
                        );
                    })}




                </div>
            )}

            {/* Additional Services */}
            {selectedServices.length > 0 && (
                <div className="mt-4">
                    <p className="text-base font-semibold text-gray-800 mb-2">
                        Additional Services
                    </p>
                    <ul className="space-y-2">
                        {selectedServices.map((service) => (
                            <li
                                key={service.code}
                                className="flex justify-between items-center p-2 rounded-md border border-gray-100 hover:bg-gray-100 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">
                                        {service.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Code: {service.code}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {service.price}
                                    </p>
                                    <button
                                        onClick={() => onRemoveService(service.code)}
                                        className="text-red-500 hover:text-red-700 transition"
                                        aria-label={`Remove ${service.name}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Total Amount */}
            <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-gray-900">₹{totalAmount}</span>
                </div>
            </div>

            {/* Continue Button */}
            <button
                type="button"
                onClick={onContinue}
                disabled={selectedSeats.size === 0}
                className={`flex justify-center items-center gap-2 w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md text-md ${selectedSeats.size === 0 ? 'opacity-50 !cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <Check className="w-5 h-5" />
                Continue to Payment
            </button>
        </div>
    )
}

export default SummaryPanel