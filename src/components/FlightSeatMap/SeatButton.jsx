import React from "react";
import { Plus, LogOut } from "lucide-react";
import FlightSeatIcon from "./FlightSeat";

function SeatButton({ seat, onClick, onHover, onLeave, getSeatColor }) {
    return (
        <button
            onClick={onClick}
            disabled={!seat.isAvailable}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onTouchStart={onHover}
            onTouchEnd={onLeave}
            className={`relative w-16 h-16 flex items-center justify-center rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${getSeatColor(seat)} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {/* SVG seat icon */}
            <FlightSeatIcon className="absolute inset-0 w-full h-full text-gray-600 opacity-70" />

            {/* Seat number overlay */}
            <span className="relative z-10 font-semibold text-base text-gray-900">
                {`${seat.rowNumber}${seat.letter}`}
            </span>

            {/* Indicators */}
            {seat.isExtraLegroom && (
                <Plus className="absolute -top-1 -right-1 w-5 h-5 text-white bg-indigo-700 rounded-full p-[1px]" />
            )}
            {seat.isExitRow && (
                <LogOut className="absolute -top-1 -right-1 w-5 h-5 text-white bg-indigo-700 rounded-full p-[1px]" />
            )}
        </button>
    );
}

export default SeatButton;
