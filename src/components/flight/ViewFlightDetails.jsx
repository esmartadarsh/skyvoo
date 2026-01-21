import { useState } from "react";
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import { formatDate, formatMonth, formatDay, formatTime } from '../../utils/formatDateTime';

const ViewFlightDetails = ({ flight }) => {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <div
            className="bg-white py-4">
            {/* Top Row Buttons */}
            <div className="flex justify-center xs:justify-start item-center mb-4">
                <div
                    className="flex mx-6 rounded-lg bg-[#D9D9D9] overflow-x-auto sm:overflow-visible w-fit"
                    style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
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
                            className={`cursor-pointer py-1 px-1 xs:px-2 sm:py-2 sm:px-4 text-[8px] sm:text-sm font-medium whitespace-nowrap ${activeTab === key
                                ? "bg-[#920000] text-white rounded-sm"
                                : "hover:text-white hover:rounded-sm hover:bg-[#920000]"
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>

            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
                <div className="mx-3 xs:mx-4 sm:mx-6">
                    {/* Top Row */}
                    <div className="flex justify-between mb-1">
                        <h3 className="font-semibold text-xs sm:text-base">
                            {flight.Segments[0].Origin_City} to {flight.Segments[0].Destination_City},{" "}
                            {formatDate(flight.Segments[0].Departure_DateTime)}{" "}
                            {formatDay(flight.Segments[0].Departure_DateTime)}
                        </h3>
                    </div>

                    <div className="border border-black/30 rounded-2xl shadow-sm px-2 xs:px-4 py-2 sm:py-4 bg-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center">
                                <img src={AirlineLogo} alt="airline logo" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm xs:text-xl">{flight.Segments[0].Airline_Name} <span className="text-[10px] text-gray-500"> {flight.Segments[0].Flight_Number}</span></div>
                            </div>
                        </div>
                        <div className="my-2 flex flex-row sm:items-start justify-around">

                            {/* Departure */}
                            <div className="text-start">
                                <div className="text-[9px] xs:text-xs sm:text-xl font-bold">{formatTime(flight.Segments[0].Departure_DateTime)}</div>
                                <div className="text-[8px] xs:text-[10px] sm:text-base text-[#78080B] font-medium">{formatDay(flight.Segments[0].Departure_DateTime)}, {formatMonth(flight.Segments[0].Departure_DateTime)} {formatDate(flight.Segments[0].Departure_DateTime)}</div>
                                <div className="text-[9px] xs:text-xs text-gray-500">{flight.Segments[0].Origin_City}</div>
                            </div>

                            {/* Flight duration and stops */}
                            <div className="flex flex-col items-center justify-start font-semibold">
                                <div className="text-[10px] sm:text-sm text-gray-500 mb-1">{flight.Segments[0].Duration}</div>
                                <div className="relative w-8 xs:w-12 sm:w-24 h-0.5 bg-[#920000] rounded">
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{flight.Segments[0].Stop_Over}</div>
                            </div>

                            {/* Arrival */}
                            <div className="text-start">
                                <div className="text-[9px] xs:text-xs sm:text-xl font-bold">{formatTime(flight.Segments[0].Arrival_DateTime)}</div>
                                <div className="text-[8px] xs:text-[10px] sm:text-base text-[#78080B] font-medium">{formatDay(flight.Segments[0].Arrival_DateTime)}, {formatMonth(flight.Segments[0].Arrival_DateTime)} {formatDate(flight.Segments[0].Arrival_DateTime)}</div>
                                <div className="text-[9px] xs:text-xs sm:text-sm text-gray-500">{flight.Segments[0].Destination_City}</div>
                            </div>

                            {/* Price */}
                            <div className="grid grid-cols-3 sm:flex gap-3 sm:gap-6 text-[8px] xs:text-[10px] sm:text-sm">

                                <div className="text-left sm:text-right">
                                    <div className="font-semibold">
                                        Baggage:
                                        <br />
                                        <p className="text-[#78080B] font-medium ">Adult</p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <div className="font-semibold">
                                        Check-in:
                                        <br />
                                        <p className="text-[#78080B] font-medium ">15 kg</p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <div className="font-semibold">
                                        Cabin:
                                        <br />
                                        <p className="text-[#78080B] font-medium ">7 kg</p>
                                    </div>
                                </div>

                            </div>


                        </div>


                    </div>

                </div>
            )}

            {activeTab === "fare" && (
                <div className="mx-3 xs:mx-4 sm:mx-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h3 className="font-semibold text-[11px] xs:text-xs sm:text-base">
                            Fare Break Up
                        </h3>
                    </div>

                    {/* Fare Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-3 xs:p-4 bg-white">
                        <div className="flex flex-row justify-between py-1 sm:py-2 gap-2 sm:gap-1">

                            {/* Labels */}
                            <div className="space-y-1 xs:space-y-2">
                                <p className="text-[11px] xs:text-sm sm:text-base font-medium text-gray-700">
                                    Base Fare
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base font-medium text-gray-700">
                                    Taxes
                                </p>
                                <hr className="my-1 sm:my-2 border-gray-300" />
                                <p className="text-sm xs:text-base sm:text-lg font-semibold text-[#78080B]">
                                    Total
                                </p>
                            </div>

                            {/* Values */}
                            <div className="text-left sm:text-right space-y-1 xs:space-y-2">
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    {flight.Fares[0].FareDetails[0].Basic_Amount}
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    {flight.Fares[0].FareDetails[0].GST}
                                </p>
                                <hr className="my-1 sm:my-2 border-gray-300" />
                                <p className="text-sm xs:text-base sm:text-lg font-bold text-[#78080B]">
                                    {flight.Fares[0].FareDetails[0].Total_Amount}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {activeTab === "cancel" && (
                <div className="mx-3 xs:mx-4 sm:mx-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h3 className="font-semibold text-[11px] xs:text-xs sm:text-base">
                            Cancellation Policy
                        </h3>
                    </div>

                    {/* Cancellation Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-3 xs:p-4 bg-white">

                        {/* Route */}
                        <p className="font-medium text-[11px] xs:text-sm sm:text-base text-gray-700 mb-1 sm:mb-2">
                            {`${flight.Origin} - ${flight.Destination}`}
                        </p>

                        {/* Info Text */}
                        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            (From Scheduled Flight Departure)
                        </p>

                        {/* Table-like Layout */}
                        <div className="divide-y divide-gray-300">

                            {/* 0 to 2 hours */}
                            <div className="flex justify-between py-2 gap-2">
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    0 hours to 2 hours*
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700 font-medium text-right">
                                    ADULT: Non Refundable
                                </p>
                            </div>

                            {/* 2 to 365 days */}
                            <div className="flex justify-between py-2 gap-2">
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    2 hours to 365 days*
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700 font-medium text-right">
                                    ADULT: ₹ 4,300 + ₹ 350
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <p className="text-[10px] xs:text-xs text-gray-500 mt-2 sm:mt-3">
                            *From the Time of Departure
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "date" && (
                <div className="mx-3 xs:mx-4 sm:mx-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h3 className="font-semibold text-[11px] xs:text-xs sm:text-base">
                            Date Change Policy
                        </h3>
                    </div>

                    {/* Date Change Card */}
                    <div className="border border-black/30 rounded-2xl shadow-sm p-3 xs:p-4 bg-white">

                        {/* Route */}
                        <p className="font-medium text-[11px] xs:text-sm sm:text-base text-gray-700 mb-1 sm:mb-2">
                            {`${flight.Origin} - ${flight.Destination}`}
                        </p>

                        {/* Info Text */}
                        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            (From Scheduled Flight Departure)
                        </p>

                        {/* Table-like Layout */}
                        <div className="divide-y divide-gray-300">

                            {/* 0 to 2 hours */}
                            <div className="flex justify-between py-2 gap-2">
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    0 hours to 2 hours*
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700 font-medium text-right">
                                    ADULT: Non Changeable
                                </p>
                            </div>

                            {/* 2 to 365 days */}
                            <div className="flex justify-between py-2 gap-2">
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700">
                                    2 hours to 365 days*
                                </p>
                                <p className="text-[11px] xs:text-sm sm:text-base text-gray-700 font-medium text-right">
                                    ADULT: ₹ 3,000 + ₹ 350 + Fare difference
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <p className="text-[10px] xs:text-xs text-gray-500 mt-2 sm:mt-3">
                            *From the Time of Departure
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ViewFlightDetails;
