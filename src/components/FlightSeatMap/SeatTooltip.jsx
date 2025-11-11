import React from 'react'
import { SSRTypes } from '../../Data/ExtraData';

const SeatTooltip = ({ seat, position }) => {
    // console.log(seat, 'see the tool tip data')
    const seatSSRTypes = Array.isArray(seat.SSRType)
        ? seat.SSRType.map(t => SSRTypes[t] || 'Unknown')
        : [SSRTypes[seat.SSRType] || 'Unknown'];


    return (
        <div
            className="fixed z-50 transform transition-all duration-200"
            style={{
                top: `${position.top - 15}px`,
                left: `${position.left}px`,
                transform: 'translate(-50%, -100%)',
            }}
        >
            <div className="p-4 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 text-sm pointer-events-none transform transition-all duration-200 animate-fade-in">

                {/* Seat Number */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-700">Seat:</span>
                    <span className="ml-1 font-medium text-gray-900">{seat.number}</span>
                </div>

                {/* Class Type */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-700">Class:</span>
                    <span className="ml-1 font-medium text-gray-900">{seat.classType}</span>
                </div>

                {/* Price */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-700">Price:</span>
                    <span className="ml-1 font-medium text-gray-900">₹{seat.price || 'Free'}</span>
                </div>

                {/* SSR Types */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-700">SSR Types:</span>
                    <div className="ml-1 mt-1 max-h-16 overflow-y-auto text-gray-800">
                        {seatSSRTypes.join(', ')}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className={`ml-1 font-medium ${seat.isAvailable ? 'text-green-600' :
                        seat.isBooked ? 'text-red-600' :
                            seat.isBlocked ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                        {seat.isAvailable ? 'Available' : seat.isBooked ? 'Booked' : seat.isBlocked ? 'Blocked' : 'Aisle'}
                    </span>
                </div>

            </div>
        </div>
    );
};


export default SeatTooltip