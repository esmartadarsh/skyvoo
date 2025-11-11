import { useState } from "react";
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import { formatDate, formatMonth, formatDay, formatTime } from '../../utils/formatDateTime';

const ViewFlightDetails = ({ flight }) => {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <div
            className="bg-white px-6 py-4 secondary-font">
            {/* Top Row Buttons */}
            <div className="flex mb-2">
                <div
                    className="flex justify-start mb-4 rounded-lg bg-[#D9D9D9]"
                    style={{
                        width: "fit-content",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                    }}
                >

                    {[
                        { key: "details", label: "FLIGHT DETAILS" },
                        { key: "fare", label: "FARE SUMMARY" },
                        { key: "cancel", label: "CANCELLATION" },
                        { key: "date", label: "DATE CHANGE" },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={` cursor-pointer py-2 px-4 text-sm font-medium ${activeTab === key
                                ? "bg-[#920000] text-white rounded-sm"
                                : "border-transparent hover:text-white hover:rounded-sm hover:bg-[#920000]"}`}>
                            {label}
                        </button>
                    ))}
                </div>

            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
                <div>
                    {/* Top Row */}
                    <div className="flex justify-between mb-1">
                        <h3 className="font-semibold">
                            {flight.Segments[0].Origin_City} to {flight.Segments[0].Destination_City}, {formatDate(flight.Segments[0].Departure_DateTime)} {formatDay(flight.Segments[0].Departure_DateTime)}
                        </h3>
                    </div>

                    <div className="border border-black/30 rounded-2xl shadow-sm p-4 bg-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                <img src={AirlineLogo} alt="airline logo" />
                            </div>
                            <div>
                                <div className="font-semibold">{flight.Segments[0].Airline_Name} <span className="text-sm text-gray-500"> {flight.Segments[0].Flight_Number}</span></div>
                            </div>
                        </div>
                        <div className="flex items-start justify-between space-x-6 text-sm mb-4 mt-2">

                            {/* Departure */}
                            <div className="text-start">
                                <div className="text-xl font-bold">{formatTime(flight.Segments[0].Departure_DateTime)}</div>
                                <div className="text-base text-[#78080B] font-medium">{formatDay(flight.Segments[0].Departure_DateTime)}, {formatMonth(flight.Segments[0].Departure_DateTime)} {formatDate(flight.Segments[0].Departure_DateTime)}</div>
                                <div className="text-sm text-gray-500">{flight.Segments[0].Origin_City}</div>
                            </div>

                            {/* Flight duration and stops */}
                            <div className="flex flex-col items-center font-semibold">
                                <div className="text-sm text-gray-500 mb-2">{flight.Segments[0].Duration}</div>
                                <div className="relative w-24 h-0.5 bg-[#920000] rounded">
                                </div>
                                <div className="text-sm text-gray-500 mt-2">{flight.Segments[0].Stop_Over}</div>
                            </div>

                            {/* Arrival */}
                            <div className="text-start">
                                <div className="text-xl font-bold">{formatTime(flight.Segments[0].Arrival_DateTime)}</div>
                                <div className="text-base text-[#78080B] font-medium">{formatDay(flight.Segments[0].Arrival_DateTime)}, {formatMonth(flight.Segments[0].Arrival_DateTime)} {formatDate(flight.Segments[0].Arrival_DateTime)}</div>
                                <div className="text-sm text-gray-500">{flight.Segments[0].Destination_City}</div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                <div className="text-xl font-bold">
                                    Baggage:
                                    <br />
                                    <p className="text-base text-[#78080B] font-medium ">Adult</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold">
                                    Check-in:
                                    <br />
                                    <p className="text-base text-[#78080B] font-medium ">15 kg</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold">
                                    Cabin:
                                    <br />
                                    <p className="text-base text-[#78080B] font-medium ">7 kg</p>
                                </div>
                            </div>

                        </div>


                    </div>

                </div>
            )}

            {activeTab === "fare" && (
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Fare Break Up
                        </h3>
                    </div>

                    {/* Fare Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-4 bg-white">
                        <div className="flex justify-between w-full">
                            {/* Labels */}
                            <div className="space-y-2">
                                <p className="text-base font-medium text-gray-700">Base Fare</p>
                                <p className="text-base font-medium text-gray-700">Taxes</p>
                                <hr className="my-2 border-gray-300" />
                                <p className="text-lg font-semibold text-[#78080B]">Total</p>
                            </div>

                            {/* Values */}
                            <div className="text-right space-y-2">
                                <p className="text-base text-gray-700">{flight.Fares[0].FareDetails[0].Basic_Amount}</p>
                                <p className="text-base text-gray-700">{flight.Fares[0].FareDetails[0].GST}</p>
                                <hr className="my-2 border-gray-300" />
                                <p className="text-lg font-bold text-[#78080B]">
                                    {flight.Fares[0].FareDetails[0].Total_Amount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "cancel" && (
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Cancellation Policy
                        </h3>
                    </div>

                    {/* Cancellation Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-4 bg-white text-sm">
                        {/* Route */}
                        <p className="font-medium text-gray-700 mb-2">
                            {`${flight.Origin} - ${flight.Destination}`}
                        </p>

                        {/* Info Text */}
                        <p className="text-gray-600 mb-4">
                            (From Scheduled Flight Departure)
                        </p>

                        {/* Table-like Layout */}
                        <div className="divide-y divide-gray-300">
                            {/* 0 to 2 hours */}
                            <div className="flex justify-between py-2">
                                <p className="text-gray-700">0 hours to 2 hours*</p>
                                <p className="text-gray-700 font-medium">ADULT: Non Refundable</p>
                            </div>

                            {/* 2 to 365 days */}
                            <div className="flex justify-between py-2">
                                <p className="text-gray-700">2 hours to 365 days*</p>
                                <p className="text-gray-700 font-medium">
                                    ADULT: ₹ 4,300 + ₹ 350
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <p className="text-xs text-gray-500 mt-3">
                            *From the Time of Departure
                        </p>
                    </div>
                </div>
            )}


            {activeTab === "date" && (
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Date Change Policy
                        </h3>
                    </div>

                    {/* Date Change Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-4 bg-white text-sm">
                        {/* Route */}
                        <p className="font-medium text-gray-700 mb-2">
                            {`${flight.Origin} - ${flight.Destination}`}
                        </p>

                        {/* Info Text */}
                        <p className="text-gray-600 mb-4">
                            (From Scheduled Flight Departure)
                        </p>

                        {/* Table-like Layout */}
                        <div className="divide-y divide-gray-300">
                            {/* 0 to 2 hours */}
                            <div className="flex justify-between py-2">
                                <p className="text-gray-700">0 hours to 2 hours*</p>
                                <p className="text-gray-700 font-medium">
                                    ADULT: Non Changeable
                                </p>
                            </div>

                            {/* 2 to 365 days */}
                            <div className="flex justify-between py-2">
                                <p className="text-gray-700">2 hours to 365 days*</p>
                                <p className="text-gray-700 font-medium">
                                    ADULT: ₹ 3,000 + ₹ 350 + Fare difference
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <p className="text-xs text-gray-500 mt-3">
                            *From the Time of Departure
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewFlightDetails;
