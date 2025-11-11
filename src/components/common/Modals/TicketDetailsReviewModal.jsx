import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TicketDetailsReviewModal({ onClose }) {
    const navigate = useNavigate()
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] secondary-font"
            onClick={onClose}
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
        >
            <div
                className="bg-white shadow-2xl p-8 w-[60%] rounded-2xl relative max-h-[80vh] overflow-y-auto scrollbar"
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
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">
                    ✈️ Flight Ticket Details
                </h2>

                {/* Passenger Information */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">👤 Passenger Information</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Name:</span> Adarsh Joshi</p>
                        <p><span className="font-medium">Email:</span> adarshjoshi200513@gmail.com</p>
                        <p><span className="font-medium">Phone:</span> +91 9667576778</p>
                        <p><span className="font-medium">Gender:</span> Male</p>
                    </div>
                </div>

                {/* Flight Information */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🛫 Flight Information</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Airline:</span> Qatar Airways</p>
                        <p><span className="font-medium">Flight No:</span> QR908</p>
                        <p><span className="font-medium">Departure:</span> Doha (DOH)</p>
                        <p><span className="font-medium">Arrival:</span> London Heathrow (LHR)</p>
                        <p><span className="font-medium">Date:</span> 15 Nov 2025</p>
                        <p><span className="font-medium">Duration:</span> 7h 40m</p>
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-gray-600">
                        <div>
                            <p className="font-medium">Departure Time</p>
                            <p>08:45 AM</p>
                        </div>
                        <div className="text-center">———— ✈ ————</div>
                        <div className="text-right">
                            <p className="font-medium">Arrival Time</p>
                            <p>01:25 PM</p>
                        </div>
                    </div>
                </div>

                {/* Seat and Class */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">💺 Seat & Class</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Seat:</span> 14A (Window)</p>
                        <p><span className="font-medium">Class:</span> Business</p>
                        <p><span className="font-medium">Meal Preference:</span> Vegetarian</p>
                        <p><span className="font-medium">Baggage Allowance:</span> 40kg</p>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">💳 Price Summary</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Base Fare</span>
                            <span>₹9980.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>₹1120.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#78080B] border-t pt-2">
                            <span>Total Amount</span>
                            <span>₹11,100.00</span>
                        </div>
                    </div>
                </div>

                {/* Booking Info */}
                <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">📄 Booking Details</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Booking ID:</span> BKTY98234</p>
                        <p><span className="font-medium">Payment:</span> Visa **** 4821</p>
                        <p><span className="font-medium">Booking Date:</span> 20 Oct 2025</p>
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span className="text-green-600 font-semibold">Confirmed</span>
                        </p>
                    </div>
                </div>

                <div className='flex mt-4'>
                    <button
                        type="button"
                        className="cursor-pointer bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base px-6 py-2.5 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={() => navigate('/flight-seat-map')}
                    >
                        CONTINUE
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Inline styles */}
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
    )
}
