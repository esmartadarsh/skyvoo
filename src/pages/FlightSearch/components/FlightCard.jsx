import React from 'react';
import { lazy, Suspense } from "react";
import { X } from "lucide-react";
import RipSide from "@/assets/imgs/ripSide.webp";
import Lock from "@/assets/vectors/lock.svg";
import BookingFlightFormBg from "@/assets/imgs/flightresultsbg.webp";

const ViewFlightDetails = lazy(() => import("./ViewFlightDetails"));

const logos = import.meta.glob('../../../assets/imgs/AirlinesLogos/*.png', {
    eager: true,
    import: 'default'
});

const getAirlineLogo = (code) => {
    const path = `../../../assets/imgs/AirlinesLogos/${code}.png`;
    const logo = logos[path];

    return logo;
};

function FlightCard({ flight, isSelected, isCompared, onToggleDetails, onToggleCompare, onViewPrices }) {

    return (
        <div className="rounded-2xl">
            <div
                className="py-2 sm:py-4 relative bg-cover bg-center rounded-xl shadow-sm hover:shadow-md transition-shadow"
                style={{
                    backgroundImage: `url(${BookingFlightFormBg})`,
                    boxShadow: "-3px 4px 20px 0px rgba(0, 0, 0, 0.25)",
                }}
                onClick={(e) => {
                    if (e.target.closest('button')) return;

                    if (window.matchMedia('(max-width: 767px)').matches) {
                        onViewPrices(flight.totalPriceList);
                    }
                }}
            >
                <img
                    className="absolute h-[85%] md:h-[90%] -right-[3px] md:-right-[5px] top-[7%] md:top-[5%]"
                    src={RipSide}
                    alt="ribbon side"
                />

                {/* ---- Top Row ---- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm font-medium gap-2">
                    <div className="pl-5 pr-40 relative">
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(90deg, rgba(196,36,36,0.5) 0%, rgba(255,255,255,0.5) 100%)",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <p className="text-[8px] xs:text-xs">Free Seat With VISA Card*</p>
                        </div>
                    </div>

                </div>

                {/* ---- Main Row ---- */}
                <div className="py-2 px-3 sm:py-5 flex flex-row md:items-center md:justify-between gap-1 xs:gap-4 md:gap-6">
                    {/* Airline info */}
                    <div className="flex items-center space-x-4 justify-start">
                        <div className="w-9 h-9 xs:w-12 xs:h-12 rounded-full flex items-center justify-center">
                            <img
                                src={getAirlineLogo(flight.AirlineLogo)}
                                alt={flight.AirlineName}
                            />
                        </div>
                        <div>
                            <div className="w-max font-semibold text-[10px] xs:text-xl">{flight.AirlineName} </div>
                            <div className="font-medium text-[8px] xs:text-base">{flight.AirlineCodeAndId}</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full md:w-auto gap-1 md:gap-6">

                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-[9px] xs:text-base sm:text-xl md:text-2xl font-bold leading-tight">
                                {flight.DepartureTime}
                            </div>
                            <div className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                                {flight.AirlineDeparture?.city}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col items-center font-semibold px-2">
                            <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-medium mb-[1px] xs:mb-1 text-gray-700">
                                {flight.AirlineDuration}
                            </div>

                            <div className="relative w-10 xs:w-14 sm:w-16 md:w-24 h-0.5 rounded-xl bg-[#920000]" />

                            <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-medium mt-[1px] xs:mt-1 text-gray-700">
                                {flight.Airlinestops === 0 ? "Non Stop" : `${flight.Airlinestops} Stop`}
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <div className="text-[9px] xs:text-base sm:text-xl md:text-2xl font-bold leading-tight">
                                {flight.ArrivalTime}
                            </div>
                            <div className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                                {flight.AirlineArrival?.city}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:gap-2">
                            <div className="text-[10px] xs:text-base sm:text-xl md:text-2xl font-bold text-[#811919]">
                                ₹ {flight.AirlineMinNetPrice}
                            </div>
                            <div className="hidden lg:block text-xs font-medium text-gray-600">
                                Per Adult
                            </div>
                        </div>

                    </div>

                    <button
                        className="w-full hidden md:flex md:w-auto cursor-pointer bg-[#811919] hover:bg-[#741111] text-white px-4 py-2 md:py-1 rounded-full font-medium text-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewPrices(flight.totalPriceList)
                        }}
                    >
                        VIEW PRICES
                    </button>
                </div>

                {/* ---- Mid Bottom Row ---- */}
                <div className="flex flex-row md:items-center justify-between  text-[10px] xs:text-xs sm:text-sm font-medium gap-2">
                    {isCompared ? (
                        <div
                            className="ml-2 pr-3 cursor-pointer flex items-center px-3 py-1 rounded hover:bg-red-200 transition-colors duration-300 ease-in-out"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCompare(flight)
                            }}
                        >
                            <span className="flex items-center">
                                <span>Added</span>
                                <span

                                    className="ml-2 text-[#910E0E] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                                >
                                    <X size={12} strokeWidth={3} />
                                </span>
                            </span>
                        </div>

                    ) : (
                        <div
                            className="ml-2 cursor-pointer pr-3 flex items-center px-3 py-1 rounded hover:bg-red-200 transition-colors duration-300 ease-in-out"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCompare(flight)
                            }}
                        >
                            <span className="text-[#811919] font-semibold " >
                                Add Compare More +
                            </span>
                        </div>

                    )}
                    <div className="mr-2 xs:mr-5 relative rounded-full flex flex-row justify-center items-center">
                        <div
                            className="absolute top-1/2 left-0 w-full h-[65%] md:h-full -translate-y-1/2 rounded-l-full"
                            style={{
                                background: "linear-gradient(90deg, rgba(205 205 205) 0%, rgba(255,255,255,0.5) 100%)",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        />
                        <div className="flex flex-row" style={{ position: "relative", zIndex: 1 }}>
                            <img src={Lock} alt="LOCK" className="px-2" />
                            <p className="text-[8px] xs:text-xs">Lock this price starting from ₹ 413</p>
                        </div>
                    </div>
                </div>

                {/* ---- Bottom Row ---- */}
                <div className="flex flex-row justify-between md:flex-row md:items-center text-sm font-medium gap-2">
                    <div className="pl-2 md:pl-5 md:pr-55 relative rounded-full flex flex-row justify-center items-center">

                        <div
                            className="absolute top-1/2 left-0 w-full h-[65%] md:h-full -translate-y-1/2 "
                            style={{
                                background: "linear-gradient(90deg, rgba(205 205 205) 0%, rgba(255,255,255,0.5) 100%)",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        />

                        <div
                            style={{ position: "relative", zIndex: 1 }}
                            className="flex flex-row items-center"
                        >
                            <div className="bg-[#720E0E] w-2 h-2 rounded-full mx-2 sm:mx-0 sm:mr-2"></div>

                            <p className="text-[8px] xs:text-xs">FLAT ₹177 OFF using SkyvooSUPER</p>
                        </div>
                    </div>

                    <div className="pr-5 flex flex-row justify-between md:justify-start sm:items-center gap-2 sm:gap-0 px-3 py-1 rounded">

                        {/* View / Hide Flight Details */}
                        <button
                            className="text-[#811919] cursor-pointer hover:underline text-[10px] xs:text-xs sm:text-sm text-left"
                            onClick={() => onToggleDetails(flight.AirlineCodeAndId)}
                        >
                            {isSelected ? "Hide" : "View"} Flight Details
                        </button>

                    </div>

                </div>
            </div>

            {/* ---- Slide-Down Details ---- */}
            <div
                className={`shadow-2xl mt-5 overflow-hidden transition-[max-height] duration-900 ease-in-out ${isSelected ? "max-h-96" : "max-h-0"}`}
            >
                {isSelected && (
                    <Suspense fallback={<div className="p-4 text-sm">Loading details...</div>}>
                        <ViewFlightDetails flight={flight} />
                    </Suspense>
                )}
            </div>
        </div>
    );
}

export default React.memo(FlightCard);