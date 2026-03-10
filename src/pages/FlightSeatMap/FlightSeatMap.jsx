import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, LogOut, ChevronRight } from 'lucide-react';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import { useNavigate } from 'react-router-dom';
import SeatGrid from './components/SeatGrid.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import ServicePanel from './components/ServicePanel.jsx';
import { SSRTypes, seatLetters } from '../../Data/ExtraData.js';
import SeatMapData from '../../Data/SeatMapData.js';
import { useSeatSelection } from "../../hooks/useSeatSelection.js";
import SeatTooltip from './components/SeatTooltip.jsx';
import Modal from '@/components/modals/Modal.jsx';

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

    const [openSummaryModal, setOpenSummaryModal] = useState(false);
    const [openServiceModal, setOpenServiceModal] = useState(false);

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
        <>

            <Modal
                open={openSummaryModal}
                onClose={() => setOpenSummaryModal(false)}
                title="Your Selection"
            >
                <SummaryPanel
                    selectedSeats={selectedSeats}
                    seatMap={seatMap}
                    SSRTypes={SSRTypes}
                    selectedServices={selectedServices}
                    onRemoveService={handleRemoveService}
                    totalAmount={totalAmount}
                    onContinue={() =>
                        navigate("/payment", {
                            state: { selectedSeats, selectedServices },
                        })
                    }
                />
            </Modal>

            <Modal
                open={openServiceModal}
                onClose={() => setOpenServiceModal(false)}
                title="Special Services"
            >
                <ServicePanel setSelectedServices={setSelectedServices} />
            </Modal>


            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
                onClick={() => {
                    if (!openSummaryModal && !openServiceModal) {
                        onClose();
                    }
                }}
                style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                <div className="bg-white w-full max-w-7xl h-full xs:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-sm shadow-xl relative" onClick={(e) => e.stopPropagation()}>

                    <div className="min-h-screen pb-20 lg:pb-0">

                        {/* Mobile Bottom Price Bar */}
                        <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-[#78080B] text-white px-4 py-4 sm:py-5 shadow-[0_-4px_8px_rgba(0,0,0,0.25)]">
                            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                                {/* Price Section */}
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold">₹ {totalAmount}</span>

                                            {/* Info Icon → Open Summary */}
                                            <button type="button"
                                                aria-label="Price information"
                                                className="flex items-center"
                                                onClick={() => setOpenSummaryModal(true)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80 hover:opacity-100 transition"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                </svg>
                                            </button>
                                        </div>
                                        <span className="text-xs opacity-90">
                                            FOR {totalTravellers} TRAVELLER{totalTravellers > 1 ? "S" : ""}
                                        </span>

                                    </div>


                                </div>

                                {/* CTA */}
                                <button
                                    type="button"
                                    className="bg-[#D9D9D9] text-[#78080B] font-semibold px-6 py-3 rounded-full flex items-center gap-2"
                                    onClick={() => setOpenSummaryModal(true)}
                                >
                                    CONTINUE
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                            </div>
                        </div>

                        {/* Header */}
                        <div className='bg-[#f1f0f29e] shadow-sm  rounded-b-4xl border border-2 border-[#920000]'>
                            <div className="p-4 flex flex-col gap-4 xs:flex-row xs:justify-between sm:items-center max-w-7xl mx-auto">

                                {/* Flight Info */}
                                <div className="flex items-center justify-center gap-3">
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

                                <div className='lg:col-span-7 flex flex-col '>

                                    <div className="bg-[#f1f0f29e] shadow-sm rounded-3xl xs:rounded-2xl border border-2 border-[#920000] p-4 mb-5">
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
                                    <div className="pb-4">
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


                                <div className="lg:col-span-3 flex flex-col gap-4 hidden lg:flex">

                                    {/* Summary Panel */}
                                    <div className="sticky lg:static bottom-0 bg-white z-20">
                                        <SummaryPanel
                                            selectedSeats={selectedSeats}
                                            seatMap={seatMap}
                                            SSRTypes={SSRTypes}
                                            selectedServices={selectedServices}
                                            onRemoveService={handleRemoveService}
                                            totalAmount={totalAmount}
                                            onContinue={() => {
                                                setOpenSummaryModal(false);
                                                navigate("/payment", { state: { selectedSeats, selectedServices } });
                                            }}
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

                        <button
                            type="button"
                            onClick={() => setOpenServiceModal(true)}
                            aria-label="Add services"
                            className=" lg:hidden fixed bottom-24 right-4 z-[9999] w-14 h-14 rounded-full bg-[#78080B] text-white flex items-center justify-center shadow-lg active:scale-95 transition"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div >

                </div>
            </div >
        </>
    );

};

export default FlightSeatMap;
