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

const FlightSeatMap = () => {

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []); 

    const legendItems = useMemo(() => [
        { label: "Available", color: "border-2 border-[#16a249] bg-white" },
        { label: "Selected", color: "bg-indigo-600 border-indigo-600 text-white shadow-md" },
        { label: "Booked", color: "bg-[#ef434333] border-2 border-[#ef434366]" },
        { label: "Blocked", color: "bg-gray-300 text-gray-500" },
        {
            label: "Extra Legroom",
            color: "border-2 border-[#16a249] bg-white relative",
            icon: <Plus className="absolute -top-1 -right-1 w-3 h-3 text-white bg-indigo-800 rounded-full p-[1px]" />
        },
        {
            label: "Exit Row",
            color: "border-2 border-[#16a249] bg-white relative",
            icon: <LogOut className="absolute -top-1 -right-1 w-3 h-3 text-white bg-indigo-800 rounded-full p-[1px]" />
        },
    ], []);

    const [tooltipData, setTooltipData] = useState(null);
    // console.log(tooltipData, 'see the seat data')
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

            if (isFree) return sum; // skip adding if free

            const numericPrice = parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
            return sum + numericPrice;
        }, 0);

    const getSeatColor = useCallback((seat) => {
        const base = "border-2 border-[#16a249] bg-white";
        if (selectedSeats.has(seat.number)) return "bg-indigo-600 border-indigo-600 text-white shadow-md";
        if (seat.isBooked) return "bg-[#ef434333] border-2 border-[#ef434366] text-white";
        if (seat.isBlocked) return "bg-gray-300 text-gray-500";
        if (seat.isExtraLegroom || seat.isExitRow) return `${base} relative`;
        if (seat.isAvailable) return base;
        if (seat.isIsle) return "bg-gray-50";
        return "bg-transparent";
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
        <div className="min-h-screen">

            <div className='bg-[#f1f0f29e] shadow-sm'>
                <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">

                    {/* Flight Info */}
                    <div className="flex items-center gap-4">
                        <div>
                            <img
                                src={AirlineLogo}
                                className="w-12 h-12"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">AI 304</h2>
                            <p className="text-sm text-gray-500">Airbus A320</p>
                        </div>
                    </div>

                    <div className="flex items-center">
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

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-start my-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">Select Your Seat</h1>
                    <p className="text-gray-600 text-md">Choose your preferred seats for a more comfortable journey</p>
                </div>

                <div className="grid lg:grid-cols-10 gap-10">

                    <div className='lg:col-span-7 flex flex-col'>

                        <div className="bg-[#f1f0f29e] shadow-sm rounded-xl border border-gray-200 p-4 mb-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Legend</h3>
                            <div className="flex space-x-5">
                                {legendItems.map((item) => (
                                    <div key={item.label} className="flex items-center">
                                        <div className={`w-7 h-7 mr-2 rounded-md flex items-center justify-center relative ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seat Map */}
                        <SeatGrid
                            processedRows={processedRows}
                            seatLetters={seatLetters}
                            selectedSeats={selectedSeats}
                            seatMap={seatMap}
                            getSeatColor={getSeatColor}
                            onSeatClick={handleSeatClick}
                            onSeatHover={handleSeatMouseEnter}
                            onSeatLeave={handleSeatMouseLeave}
                        />

                    </div>


                    <div className='lg:col-span-3'>

                        {/* Summary Panel */}
                        <SummaryPanel
                            selectedSeats={selectedSeats}
                            seatMap={seatMap}
                            SSRTypes={SSRTypes}
                            selectedServices={selectedServices}
                            onRemoveService={handleRemoveService}
                            totalAmount={totalAmount}
                            onContinue={() => navigate('/payment', { state: { selectedSeats, selectedServices } })}
                        />

                        {/* Service Panel */}
                        <ServicePanel
                            setSelectedServices={setSelectedServices}
                        />

                    </div>

                </div>
            </div>
            {tooltipData && (
                <SeatTooltip seat={tooltipData.seat} position={tooltipData.pos} />
            )}

        </div >
    );

};

export default FlightSeatMap;
