import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SeatMapData from '../Data/SeatMapData.js';
import { Plus, LogOut } from 'lucide-react';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import { useNavigate } from 'react-router-dom';
import SeatGrid from '../components/FlightSeatMap/SeatGrid.jsx';
import SummaryPanel from '../components/FlightSeatMap/SummaryPanel.jsx';
import ServicePanel from '../components/FlightSeatMap/ServicePanel.jsx';
import { SSRTypes, seatLetters } from '../Data/ExtraData.js';
import { useSeatSelection } from "../hooks/useSeatSelection.js";
import SeatTooltip from '../components/FlightSeatMap/SeatTooltip.jsx';
{/* https://togmanga.com/manga/tower-of-god-chapter-303/ */ }

const FlightSeatMap = ({ onClose }) => {

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const legendItems = useMemo(() => [
        { label: "Available", color: "border-2 border-[#16a249] " },
        { label: "Selected", color: "border-2 border-[#07A3CE] shadow-md" },
        { label: "Booked", color: " border-2 border-[#B11515] text-gray-500" },
        { label: "Blocked", color: "border-2 border-[#B11515] text-gray-500" },
        {
            label: "Extra Legroom",
            color: "border-2 border-[#16a249] relative",
            icon: <Plus className="absolute -top-1 -right-1 w-3 h-3 text-white bg-indigo-800 rounded-full p-[1px]" />
        },
        {
            label: "Exit Row",
            color: "border-2 border-[#16a249] relative",
            icon: <LogOut className="absolute -top-1 -right-1 w-3 h-3 text-white bg-indigo-800 rounded-full p-[1px]" />
        },
    ], []);

    const [tooltipData, setTooltipData] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const seatData = useMemo(
        () => SeatMapData.AirSeatMaps[0].Seat_Segments[0].Seat_Row,
        []
    );

    const navigate = useNavigate();

    const AllTravellers = useMemo(() => ({
        Adults: 1,
        Childs: 1,
        Infants: 0,
    }), []);

    const { Adults, Childs } = AllTravellers;

    const totalTravellers = Adults + Childs;
    const { selectedSeats, handleSeatClick } = useSeatSelection(totalTravellers);
    const { processedRows, seatMap } = useMemo(() => {
        const rows = seatData.map((row, idx) => {
            const seats = row.Seat_Details.map(seat => {
                const isAvailable = seat.SSR_Status === 1;
                const isBlocked = seat.SSR_Status === 2;
                const isBooked = seat.SSR_Status === 3;
                const isIsle = seat.SSR_Status === 0;
                const isExtraLegroom = seat.SSR_TypeDesc.includes("XL");
                const isExitRow = seat.SSR_TypeDesc.includes("EXIT");
                const seatLetter = seat.SSR_TypeName.match(/[A-Z]+/i)?.[0] || seat.SSR_TypeName;
                return {
                    number: seat.SSR_TypeName,
                    letter: seatLetter,
                    price: seat.Total_Amount,
                    currency: seat.Currency_Code,
                    isAvailable,
                    isBooked,
                    isBlocked,
                    isIsle,
                    rowNumber: idx + 1,
                    classType: idx < 3 ? 'Premium' : idx < 13 ? 'Standard' : 'Economy',
                    isExtraLegroom,
                    isExitRow,
                    SSRType: seat.SSR_Type
                };
            });
            return { rowNumber: idx + 1, seats };
        });

        const seatLookup = Object.fromEntries(
            rows.flatMap(row => row.seats.map(seat => [seat.number, seat]))
        );

        return { processedRows: rows, seatMap: seatLookup };
    }, [seatData]);

    const totalAmount =
        Array.from(selectedSeats).reduce(
            (sum, seatNum) => sum + (seatMap[seatNum]?.price || 0),
            0
        ) +
        selectedServices.reduce((sum, s) => {
            const priceStr = s.price?.toString().trim() || "0";
            const isFree =
                priceStr.toLowerCase() === "free" ||
                priceStr === "" ||
                priceStr === "0";

            if (isFree) return sum;

            const numericPrice = parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
            return sum + numericPrice;
        }, 0);

    const getSeatVisual = useCallback((seat) => {
        if (selectedSeats.has(seat.number)) {
            return {
                fill: "#07A3CE",
                stroke: "#07A3CE",
                text: "text-[#4f46e5]"
            };
        }

        if (seat.isBooked) {
            return {
                fill: "#B11515",
                stroke: "#B11515x",
                text: "text-gray-500"
            };
        }

        if (seat.isBlocked) {
            return {
                fill: "#B11515",
                stroke: "#B11515",
                text: "text-gray-500"
            };
        }

        if (seat.isAvailable) {
            return {
                fill: "#16a249",
                stroke: "#16a249",
                text: "text-gray-900"
            };
        }

        return {
            fill: "transparent",
            stroke: "transparent",
            text: "text-gray-400"
        };
    }, [selectedSeats]);

    const handleSeatMouseEnter = (seat, e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setTooltipData({
            seat,
            pos: {
                top: rect.top,
                left: rect.left + rect.width / 2,
            },
        });
    };

    const handleSeatMouseLeave = () => setTooltipData(null);

    const handleRemoveService = (code) => {
        setSelectedServices((prev) => prev.filter((s) => s.code !== code));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={onClose}
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
        >
            <div
                className="bg-white w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-none sm:rounded-sm shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="min-h-screen">

                    {/* Header */}
                    <div className='bg-[#f1f0f29e] shadow-sm'>
                        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center max-w-7xl mx-auto">

                            {/* Flight Info */}
                            <div className="flex items-center gap-3">
                                <img src={AirlineLogo} className="w-10 h-10 sm:w-12 sm:h-12" />
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">AI 304</h2>
                                    <p className="text-xs sm:text-sm text-gray-500">Airbus A320</p>
                                </div>
                            </div>


                            <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-6">
                                {/* From */}
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-500">From</p>
                                    <p className="text-lg font-semibold text-gray-800">DEL</p>
                                    <p className="text-xs text-gray-400">14:30</p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 w-10 mr-2 ml-6"></div>

                                {/* Duration */}
                                <div className="text-center text-gray-600">
                                    <p className="text-sm">2h 15m</p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 w-10 ml-2 mr-6"></div>

                                {/* To */}
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-500">To</p>
                                    <p className="text-lg font-semibold text-gray-800">BOM</p>
                                    <p className="text-xs text-gray-400">16:45</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="max-w-7xl mx-2 sm:mx-4 my-2">
                        {/* Header */}
                        <div className="text-start my-6">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                                Select Your Seat
                            </h1>
                            <p className="text-sm sm:text-md text-gray-600">
                                Choose your preferred seats
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-10">

                            <div className='lg:col-span-7 flex flex-col'>

                                <div className="bg-[#f1f0f29e] shadow-sm rounded-xl border border-gray-200 p-4 mb-5">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Legend</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {legendItems.map((item) => (
                                            <div key={item.label} className="flex items-center">
                                                <div className={`w-6 h-6 sm:w-7 sm:h-7 mr-2 rounded-md flex items-center justify-center relative ${item.color}`}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-sm text-gray-700">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Seat Map */}
                                <div className="overflow-x-auto pb-4">
                                    <SeatGrid
                                        processedRows={processedRows}
                                        seatLetters={seatLetters}
                                        selectedSeats={selectedSeats}
                                        seatMap={seatMap}
                                        getSeatVisual={getSeatVisual}
                                        onSeatClick={handleSeatClick}
                                        onSeatHover={handleSeatMouseEnter}
                                        onSeatLeave={handleSeatMouseLeave}
                                    />
                                </div>

                            </div>


                            <div className="lg:col-span-3 flex flex-col gap-4">

                                {/* Summary Panel */}
                                <div className="sticky bottom-0 bg-white z-20">
                                    <SummaryPanel
                                        selectedSeats={selectedSeats}
                                        seatMap={seatMap}
                                        SSRTypes={SSRTypes}
                                        selectedServices={selectedServices}
                                        onRemoveService={handleRemoveService}
                                        totalAmount={totalAmount}
                                        onContinue={() => navigate('/payment', { state: { selectedSeats, selectedServices } })}
                                    />
                                </div>

                                {/* Service Panel */}
                                <ServicePanel
                                    setSelectedServices={setSelectedServices}
                                />

                            </div>

                        </div>
                    </div>
                    {tooltipData && window.innerWidth > 768 && (
                        <SeatTooltip seat={tooltipData.seat} position={tooltipData.pos} />
                    )}

                </div >

            </div>
        </div >


    );

};

export default FlightSeatMap;
