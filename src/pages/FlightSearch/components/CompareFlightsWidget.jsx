import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AirlineLogo from "@/assets/imgs/airlinelogo.webp";
import { useCompareFlights } from "@/features/flights/contexts/CompareContext.jsx";

export default function CompareFlightsWidget({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const { state: compareState, dispatch } = useCompareFlights();
    const selectedFlights = compareState.selectedFlights;

    if (selectedFlights.length === 0) return null;

    return (
        <>
            <div
                className='fixed cursor-pointer bottom-20 right-5 text-white z-9998 bg-[#78080B] hover:bg-red-700 h-10 w-10 xs:h-12 xs:w-12 rounded-full flex justify-center items-center'
                onClick={() => setCollapsed(prev => !prev)}
            >
                <Search className="h-6 w-6 xs:h-8 xs:w-8" />
            </div>

            <div className={`fixed bottom-20 right-5 bg-white shadow-lg rounded-lg overflow-hidden z-9999 border border-gray-200`}>
                <div className='relative'>

                    <div id="FlightComparisonsSection" className={`${collapsed ? 'collapsed' : ''}`}>

                        {/* Header */}
                        <div className="bg-[#78080B] text-white px-4 py-2 flex justify-between items-center">
                            <h4 className="font-semibold">Selected flights</h4>
                            <button
                                className="text-white cursor-pointer"
                                onClick={() => setCollapsed(prev => !prev)}
                            >
                                —
                            </button>
                        </div>

                        {/* Selected Comparison Flight list */}
                        <ul className="divide-y divide-gray-200 max-h-48">
                            {selectedFlights.map(selectedFlight => (
                                <li
                                    key={selectedFlight.AirlineCodeAndId}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    {/* Left side: Logo + Airline */}
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={AirlineLogo}
                                            alt={selectedFlight.AirlineName}
                                            className="w-6 h-6 rounded"
                                        />
                                        <span className="font-medium text-gray-800">
                                            {selectedFlight.AirlineName}
                                        </span>
                                    </div>

                                    {/* Middle: Times + Progress */}
                                    <div className="flex items-center ">
                                        <div className="text-xs xs:text-sm font-medium mr-4">
                                            {selectedFlight.ArrivalTime}
                                        </div>
                                        <div className="h-1 w-10 xs:w-16 bg-green-400 mx-auto my-1 rounded" />
                                        <div className="text-xs xs:text-sm font-medium ml-4">
                                            {selectedFlight.DepartureTime}
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() =>
                                            dispatch({
                                                type: "REMOVE_FLIGHT",
                                                payload: selectedFlight.AirlineCodeAndId
                                            })
                                        }
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Footer button */}
                        <div className="p-2 bg-[#78080B] border-t border-gray-200 flex justify-end">
                            <button
                                className="px-2 cursor-pointer text-xs bg-white text-[#78080B] font-bold py-1 rounded-full shadow hover:bg-gray-300 transition-colors"
                                onClick={() => {
                                    navigate('/compare-flights')
                                }}
                            >
                                COMPARE FLIGHTS
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}