import React from 'react';
import RipSide from "@/assets/imgs/ripSide.webp";
import BookingFlightFormBg from "@/assets/imgs/flightresultsbg.webp";

const logos = import.meta.glob('../../../assets/imgs/AirlinesLogos/*.png', {
    eager: true,
    import: 'default'
});

const getAirlineLogo = (code) => {
    const path = `../../../assets/imgs/AirlinesLogos/${code}.png`;
    return logos[path];
};

function CompactFlightCard({ flight, label, isDetailsOpen, onToggleDetails }) {
    return (
        <div className="flex-1 min-w-0 rounded-xl">
            <div
                className="relative bg-cover bg-center rounded-xl h-full"
                style={{
                    backgroundImage: `url(${BookingFlightFormBg})`,
                    boxShadow: "-3px 4px 20px 0px rgba(0, 0, 0, 0.25)",
                }}
            >
                {/* Ticket tear effect */}
                <img
                    className="absolute h-[82%] -right-[3px] top-[9%]"
                    src={RipSide}
                    alt="ribbon side"
                />

                {/* DEP / RETURN label banner */}
                <div className="pl-3 pr-6 py-[3px] relative">
                    <div
                        style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%", height: "100%",
                            background: "linear-gradient(90deg, rgba(196,36,36,0.55) 0%, rgba(255,255,255,0.4) 100%)",
                            pointerEvents: "none",
                            zIndex: 0,
                            borderRadius: "0.75rem 0.75rem 0 0",
                        }}
                    />
                    <p
                        className="relative z-10 text-[8px] sm:text-[10px] font-bold tracking-widest text-[#5a0000]"
                        style={{ zIndex: 1 }}
                    >
                        ✈ {label}
                    </p>
                </div>

                {/* Main content */}
                <div className="px-3 pt-2 pb-3">

                    {/* Airline row */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 flex items-center justify-center">
                            <img
                                src={getAirlineLogo(flight.AirlineLogo)}
                                alt={flight.AirlineName}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-[9px] sm:text-xs leading-tight truncate">
                                {flight.AirlineName}
                            </div>
                            <div className="text-[7px] sm:text-[9px] text-gray-500 leading-tight">
                                {flight.AirlineCodeAndId}
                            </div>
                        </div>
                    </div>

                    {/* Flight times */}
                    <div className="flex items-center justify-between gap-1 pr-2">

                        {/* Departure */}
                        <div className="text-center flex-shrink-0">
                            <div className="text-[12px] sm:text-[15px] md:text-base font-bold leading-none">
                                {flight.DepartureTime}
                            </div>
                            <div className="text-[6px] sm:text-[8px] text-gray-600 leading-tight mt-[2px] max-w-[52px] sm:max-w-[68px] truncate">
                                {flight.AirlineDeparture?.city}
                            </div>
                        </div>

                        {/* Duration line */}
                        <div className="flex flex-col items-center flex-1 px-1 min-w-0">
                            <span className="text-[6px] sm:text-[8px] text-gray-500 leading-none mb-[2px]">
                                {flight.AirlineDuration}
                            </span>
                            <div className="w-full h-[1.5px] bg-[#920000] rounded-full" />
                            <span className="text-[6px] sm:text-[8px] text-gray-500 leading-none mt-[2px]">
                                {flight.Airlinestops === 0 ? "Non Stop" : `${flight.Airlinestops} Stop`}
                            </span>
                        </div>

                        {/* Arrival */}
                        <div className="text-center flex-shrink-0">
                            <div className="text-[12px] sm:text-[15px] md:text-base font-bold leading-none">
                                {flight.ArrivalTime}
                            </div>
                            <div className="text-[6px] sm:text-[8px] text-gray-600 leading-tight mt-[2px] max-w-[52px] sm:max-w-[68px] truncate">
                                {flight.AirlineArrival?.city}
                            </div>
                        </div>
                    </div>

                    {/* Price + View Details */}
                    <div className="flex items-center justify-between mt-2 pr-2">
                        <div className="text-[10px] sm:text-sm font-bold text-[#811919]">
                            ₹ {flight.AirlineMinNetPrice?.toLocaleString('en-IN')}
                        </div>
                        <button
                            className="text-[#811919] cursor-pointer hover:underline text-[7px] sm:text-[9px] font-medium whitespace-nowrap"
                            onClick={onToggleDetails}
                        >
                            {isDetailsOpen ? "Hide" : "View"} Details
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default React.memo(CompactFlightCard);
