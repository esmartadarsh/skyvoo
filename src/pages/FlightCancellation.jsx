import React from "react";

export default function FlightCancellation() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg font-bold">!</div>
                    <h1 className="text-2xl font-semibold">Cancel Flight</h1>
                </div>

                <p className="text-gray-600 text-sm">
                    Please review the flight details below. Once you confirm, the cancellation will be processed and may be subject to airline policies.
                </p>

                <div className="border rounded-xl p-4 space-y-2">
                    <h2 className="font-medium text-lg">Flight Details</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <p><span className="font-semibold">Flight:</span> AI 203</p>
                        <p><span className="font-semibold">Date:</span> 22 Nov 2025</p>
                        <p><span className="font-semibold">From:</span> New Delhi (DEL)</p>
                        <p><span className="font-semibold">To:</span> Mumbai (BOM)</p>
                        <p><span className="font-semibold">Passenger:</span> Adarsh Joshi</p>
                        <p><span className="font-semibold">Booking ID:</span> BKD98234</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-gray-700 text-sm font-medium">Reason for Cancellation</p>
                    <textarea
                        className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                        placeholder="Optional: Add a reason..."
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm">Go Back</button>
                    <button className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm">Confirm Cancellation</button>
                </div>
            </div>
        </div>
    );
}
