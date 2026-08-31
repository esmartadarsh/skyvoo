import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, LogOut, ChevronRight, PlaneTakeoff, PlaneLanding, ArrowRight, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SeatGrid from './components/SeatGrid.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import { SSRTypes, seatLetters } from '../../Data/ExtraData.js';
import { useSeatSelection } from "../../hooks/useSeatSelection.js";
import SeatTooltip from './components/SeatTooltip.jsx';
import Modal from '@/components/modals/Modal.jsx';
import { bookingStore } from '@/store/bookingStore.js';
import api from '@/services/api.js';
import { getAirlineLogo } from "@/utils/airlineCode";


const legendItems = [
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
]

/** Parse SeatInfo array into { processedRows, seatMap } */
const parseSeatInfo = (rawSeatInfo) => {
    if (!Array.isArray(rawSeatInfo) || rawSeatInfo.length === 0) {
        return { processedRows: [], seatMap: {} };
    }

    const rowMap = {};
    rawSeatInfo.forEach((s) => {
        if (s.IsNoSeat) return;

        const match = s.SeatNo?.match(/^(\d+)([A-Z]+)$/i);
        const rowNum = match
            ? parseInt(match[1], 10)
            : (s.SeatPosition?.Row || parseInt(s.RowNumber, 10) || 1);
        const letter = match
            ? match[2].toUpperCase()
            : (typeof s.SeatPosition?.Column === 'string'
                ? s.SeatPosition.Column.toUpperCase()
                : (s.SeatCode?.replace(/\d/g, '') || 'A'));

        if (!rowMap[rowNum]) {
            rowMap[rowNum] = { rowNumber: rowNum, seats: [] };
        }

        const isBooked = Boolean(s.IsBooked);
        const isBlocked = Boolean(s.IsBlocked);
        const isAvailable = s.IsAvailable !== undefined
            ? Boolean(s.IsAvailable)
            : (!isBooked && !isBlocked);
        const isExtraLegroom = Boolean(s.IsLegroom || s.IsExtraLegroom);
        const isExitRow = Boolean(s.IsExit || s.IsEmergencyExit || s.IsExitRow);
        const price = Number(s.Amount || s.Price || s.Total_Amount || s.SeatAmount || 0);
        const currency = s.Currency || s.CurrencyCode || 'INR';

        rowMap[rowNum].seats.push({
            number: s.SeatNo || s.SeatCode,
            letter,
            price,
            currency,
            isAvailable,
            isBooked,
            isBlocked,
            isIsle: Boolean(s.IsAisle),
            isWindow: Boolean(s.IsWindow),
            rowNumber: rowNum,
            classType: s.SeatClass || s.CabinClass || (rowNum < 3 ? 'Business' : rowNum < 10 ? 'Premium Economy' : 'Economy'),
            isExtraLegroom,
            isExitRow,
            raw: s,
        });
    });

    const rows = Object.values(rowMap).sort((a, b) => a.rowNumber - b.rowNumber);
    const seatLookup = Object.fromEntries(
        rows.flatMap((row) => row.seats.map((seat) => [seat.number, seat]))
    );
    return { processedRows: rows, seatMap: seatLookup };
};

const FlightSeatMap = ({ onClose, flightLegs, onSeatsContinue, initialSelectedSeats }) => {

    const navigate = useNavigate();
    const bookingData = bookingStore.get();

    const flightKeys = bookingData.flightKeyList;
    const flightId = bookingData.flightId;

    // Index of the currently shown flight leg (for connecting flights)
    const [activeFlightIndex, setActiveFlightIndex] = useState(0);

    const {
        data: apiSeatMapData,
        isLoading: loadingSeatMap,
        error: seatMapError,
    } = useQuery({
        queryKey: ["seatMap", flightId, flightKeys],
        queryFn: async () => {
            const payload = {
                FlightKeys: Array.isArray(flightKeys) ? flightKeys : [flightKeys],
                FlightId: flightId,
            };
            const res = await api.post("/flight/GetSeatMap", payload);
            if (!res.data?.IsSuccess) {
                throw new Error(res.data?.ErrorMessage || "Failed to fetch seat map.");
            }

            const rawData = res.data?.Data;

            // Handle empty string, null or undefined response Data
            if (!rawData || (typeof rawData === "string" && !rawData.trim())) {
                return null;
            }

            if (typeof rawData === "object") {
                return rawData;
            }

            try {
                return JSON.parse(rawData);
            } catch (err) {
                console.error("Failed to parse seat map data:", err);
                return null;
            }
        },
        enabled: Boolean(flightId || (Array.isArray(flightKeys) && flightKeys.length > 0)),
    });


    const [tooltipData, setTooltipData] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const [openSummaryModal, setOpenSummaryModal] = useState(false);
    const [openServiceModal, setOpenServiceModal] = useState(false);

    // ── Detect connecting flights ─────────────────────────────────────────────
    const tripSeats = useMemo(() => {
        return apiSeatMapData?.TripSeatMap?.TripSeat || null;
    }, [apiSeatMapData]);

    const isConnecting = useMemo(
        () => Boolean(tripSeats && Object.keys(tripSeats).length > 1),
        [tripSeats]
    );

    // ── Old seatData path (non-TripSeat format) ───────────────────────────────
    const seatData = useMemo(() => {
        if (apiSeatMapData) {
            const rows =
                apiSeatMapData?.AirSeatMaps?.[0]?.Seat_Segments?.[0]?.Seat_Row ||
                apiSeatMapData?.Seat_Segments?.[0]?.Seat_Row ||
                apiSeatMapData?.Seat_Row ||
                apiSeatMapData?.TripInfo?.[0]?.Seat_Row;
            if (Array.isArray(rows) && rows.length > 0) return rows;
        }
        return [];
    }, [apiSeatMapData]);

    const totalTravellers = useMemo(() => {
        const { totalSeatCount, passengers, travellers } = bookingData || {};

        // Prefer the explicit count stored by ReviewDetails (Adults + Childs from API, no Infants)
        if (totalSeatCount && totalSeatCount > 0) return totalSeatCount;

        // Fallback: count from filled-in passenger form entries (Childs only, no Infants)
        if (passengers) {
            const adultCount = passengers.Adults?.length || 0;
            const childCount = passengers.Childs?.length || 0;
            const count = adultCount + childCount;
            if (count > 0) return count;
        }

        // Fallback: search params / older store shape
        if (travellers) {
            const count = (Number(travellers.adults) || 0) + (Number(travellers.children) || 0);
            if (count > 0) return count;
        }
        return 1;
    }, [bookingData]);

    // Restore previously selected seats when re-opening
    const previouslySelected = initialSelectedSeats ?? bookingData.selectedSeats ?? [];
    const { selectedSeats, handleSeatClick } = useSeatSelection(totalTravellers, previouslySelected);

    // ── Build processedRows / seatMap for the ACTIVE flight leg ──────────────
    const { processedRows, seatMap } = useMemo(() => {
        // --- TripSeatMap format (single OR connecting) ---
        if (tripSeats && Object.keys(tripSeats).length > 0) {
            const tripSeatKeys = Object.keys(tripSeats);

            const idx = Math.min(activeFlightIndex, tripSeatKeys.length - 1);
            const seat = tripSeats[tripSeatKeys[idx]];

            const rawSeatInfo =
                seat?.SeatInfo ||
                seat?.SeatData?.SeatInfo ||
                seat?.Seat_Row;

            if (Array.isArray(rawSeatInfo) && rawSeatInfo.length > 0) {
                return parseSeatInfo(rawSeatInfo);
            }
        }

        // --- Alternative Seat_Row / Seat_Details format ---
        const altRows = seatData || [];
        if (altRows.length > 0) {
            const rows = altRows.map((row, idx) => {
                const rowNum = row.RowNo ? parseInt(row.RowNo, 10) : idx + 1;
                const seats = (row.Seat_Details || []).map((seat) => {
                    const isAvailable = seat.SSR_Status === 1;
                    const isBlocked = seat.SSR_Status === 2;
                    const isBooked = seat.SSR_Status === 3;
                    const isIsle = seat.SSR_Status === 0;
                    const isExtraLegroom = seat.SSR_TypeDesc?.includes('XL') || false;
                    const isExitRow = seat.SSR_TypeDesc?.includes('EXIT') || false;
                    const seatLetter = seat.SSR_TypeName?.match(/[A-Z]+/i)?.[0] || seat.SSR_TypeName;
                    return {
                        number: seat.SSR_TypeName,
                        letter: seatLetter,
                        price: Number(seat.Total_Amount || seat.Amount || 0),
                        currency: seat.Currency_Code || 'INR',
                        isAvailable,
                        isBooked,
                        isBlocked,
                        isIsle,
                        rowNumber: rowNum,
                        classType: seat.SSR_TypeDesc || (idx < 3 ? 'Business' : idx < 10 ? 'Premium Economy' : 'Economy'),
                        isExtraLegroom,
                        isExitRow,
                        SSRType: seat.SSR_Type,
                    };
                });
                return { rowNumber: rowNum, seats };
            });
            const seatLookup = Object.fromEntries(
                rows.flatMap((row) => row.seats.map((seat) => [seat.number, seat]))
            );
            return { processedRows: rows, seatMap: seatLookup };
        }

        return { processedRows: [], seatMap: {} };
    }, [apiSeatMapData, seatData, tripSeats, activeFlightIndex]);

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

    // ── Connecting-flight tab label helper ────────────────────────────────────
    const getFlightTabLabel = (idx) => {
        // Prefer real data from flightLegs prop
        if (Array.isArray(flightLegs) && flightLegs[idx]) {
            const leg = flightLegs[idx];
            const dep = leg.AirlineDeparture?.code || leg.AirlineDeparture?.cityCode || '';
            const arr = leg.AirlineArrival?.code || leg.AirlineArrival?.cityCode || '';
            if (dep && arr) return `${dep} → ${arr}`;
            if (dep) return dep;
        }
        // Fallback to TripSeat object keys
        const leg = tripSeats?.[idx];
        const dep = leg?.Origin || leg?.DepartureCode || leg?.From || `Flight ${idx + 1}`;
        const arr = leg?.Destination || leg?.ArrivalCode || leg?.To || '';
        if (arr) return `${dep} → ${arr}`;
        return `Leg ${idx + 1}: ${dep}`;
    };

    const flightSummary = useMemo(() => {
        // If real flight leg data was passed in, use it directly
        if (Array.isArray(flightLegs) && flightLegs.length > 0) {
            const leg = flightLegs[activeFlightIndex] || flightLegs[0];
            return {
                airlineName: leg.AirlineName || '',
                airlineCode: leg.AirlineCode || '',
                airlineLogoCode: leg.AirlineLogo || leg.AirlineCode || '',
                flightNo: leg.FlightNo || '',
                craft: leg.Equipment || leg.Craft || '',
                depCode: leg.AirlineDeparture?.code || leg.AirlineDeparture?.cityCode || '',
                depCity: leg.AirlineDeparture?.city || '',
                depTime: leg.DepartureTime || '',
                depDate: leg.DepartureDate || '',
                arrCode: leg.AirlineArrival?.code || leg.AirlineArrival?.cityCode || '',
                arrCity: leg.AirlineArrival?.city || '',
                arrTime: leg.ArrivalTime || '',
                arrDate: leg.ArrivalDate || '',
                duration: leg.AirlineDuration || '',
                stops: leg.Stops ?? null,
            };
        }

        const storeSummary = bookingData?.flightSummary || location.state?.flightSummary;
        if (storeSummary) return storeSummary;

        const flight = bookingData?.flight || bookingData?.outboundFlight;
        if (flight) {
            const logoArray = Array.isArray(flight.AirlineLogo) ? flight.AirlineLogo : [flight.AirlineLogo].filter(Boolean);
            const dep = flight.AirlineDeparture || {};
            const arr = flight.AirlineArrival || {};
            return {
                airlineName: flight.AirlineName || '',
                airlineCode: flight.AirlineCodeAndId || flight.AirlineCode || '',
                airlineLogoCode: logoArray[0] || flight.AirlineCode || '',
                flightNo: flight.FlightNumber || flight.FlightNo || '',
                craft: flight.Equipment || flight.Craft || flight.AirlineCraft || '',
                depCode: dep.code || flight.DepartureAirportCode || flight.Origin || '',
                depCity: dep.city || '',
                depTime: flight.DepartureTime || dep.time || '',
                arrCode: arr.code || flight.ArrivalAirportCode || flight.Destination || '',
                arrCity: arr.city || '',
                arrTime: flight.ArrivalTime || arr.time || '',
                duration: flight.AirlineDuration || flight.Duration || '',
            };
        }

        return {};
    }, [bookingData, location.state, flightLegs, activeFlightIndex]);

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
                    hasSeatsAvailable={processedRows.length > 0}
                    onContinue={() => {
                        if (onSeatsContinue) {
                            const selectedSeatDetails = Array.from(selectedSeats).map((seatNum) => seatMap[seatNum]).filter(Boolean);
                            onSeatsContinue({ selectedSeats, selectedServices, totalAmount, selectedSeatDetails });
                        } else {
                            navigate("/payment", { state: { selectedSeats, selectedServices } });
                        }
                    }}
                />
            </Modal>




            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
                onClick={() => {
                    if (!openSummaryModal && !openServiceModal) {
                        if (onClose) onClose();
                        else navigate(-1);
                    }
                }}
                style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
                <div
                    className="bg-white w-full max-w-7xl h-full xs:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-sm shadow-xl relative custom-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                >

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
                                    onClick={() => {
                                        if (onSeatsContinue) {
                                            const selectedSeatDetails = Array.from(selectedSeats).map((seatNum) => seatMap[seatNum]).filter(Boolean);
                                            onSeatsContinue({ selectedSeats, selectedServices, totalAmount, selectedSeatDetails });
                                        } else {
                                            setOpenSummaryModal(true);
                                        }
                                    }}
                                >
                                    CONTINUE
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                            </div>
                        </div>

                        {/* Header */}
                        <div className='bg-[#f1f0f29e] shadow-sm rounded-b-4xl border border-2 border-[#920000] relative'>
                            {/* Close Button */}
                            {/* <button
                                type="button"
                                onClick={() => {
                                    if (onClose) onClose();
                                    else navigate(-1);
                                }}
                                aria-label="Close"
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition z-10"
                            >
                                <X className="w-5 h-5" />
                            </button> */}

                            <div className="p-4 flex flex-col gap-4 xs:flex-row xs:justify-between sm:items-center max-w-7xl mx-auto">

                                {/* Flight Info */}
                                <div className="flex items-center justify-center gap-3">
                                    {flightSummary.airlineLogoCode && (
                                        <img
                                            src={getAirlineLogo(flightSummary.airlineLogoCode)}
                                            alt={flightSummary.airlineName}
                                            className="rounded-full w-9 h-9 xs:w-10 xs:h-10"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                            {flightSummary.airlineName || flightSummary.airlineCode}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {[flightSummary.airlineCode, flightSummary.flightNo].filter(Boolean).join(' ')}
                                            {flightSummary.craft ? ` · ${flightSummary.craft}` : ''}
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-6">
                                    {/* From */}
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-gray-500">From</p>
                                        <p className="text-lg font-semibold text-gray-800">{flightSummary.depCode}</p>
                                        {flightSummary.depCity && <p className="text-xs text-gray-400">{flightSummary.depCity}</p>}
                                        <p className="text-xs text-gray-400">{flightSummary.depTime}</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-300 w-10 mr-2 ml-6"></div>

                                    {/* Duration */}
                                    <div className="text-center text-gray-600">
                                        <p className="text-sm font-medium">{flightSummary.duration}</p>
                                        {flightSummary.stops === 0 && <p className="text-xs text-green-600">Non-stop</p>}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-300 w-10 ml-2 mr-6"></div>

                                    {/* To */}
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-gray-500">To</p>
                                        <p className="text-lg font-semibold text-gray-800">{flightSummary.arrCode}</p>
                                        {flightSummary.arrCity && <p className="text-xs text-gray-400">{flightSummary.arrCity}</p>}
                                        <p className="text-xs text-gray-400">{flightSummary.arrTime}</p>
                                    </div>
                                </div>

                            </div>

                            {/* ── Connecting-flight segment switcher tabs ────────────────── */}
                            {isConnecting && (
                                <div className="border-t border-[#92000040] px-4 pb-3 pt-2 max-w-7xl mx-auto">
                                    <p className="text-xs text-[#920000] font-semibold mb-2 flex items-center gap-1">
                                        <PlaneTakeoff className="w-3.5 h-3.5" />
                                        Connecting Flight — select seats for each leg
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(tripSeats).map((key, idx) => {
                                            const leg = flightLegs?.[idx] || tripSeats[key];
                                            const isActive = activeFlightIndex === idx;
                                            const depCode = leg?.AirlineDeparture?.code || leg?.AirlineDeparture?.cityCode || leg?.Origin || leg?.From || `Leg ${idx + 1}`;
                                            const arrCode = leg?.AirlineArrival?.code || leg?.AirlineArrival?.cityCode || leg?.Destination || leg?.To || '';
                                            const airline = leg?.AirlineName || leg?.AirlineCode || '';
                                            const flightNo = leg?.FlightNo || '';
                                            const depTime = leg?.DepartureTime || '';
                                            const arrTime = leg?.ArrivalTime || '';
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    id={`flight-leg-tab-${idx}`}
                                                    onClick={() => setActiveFlightIndex(idx)}
                                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
                                                        ${isActive
                                                            ? 'bg-[#920000] text-white border-[#920000] shadow-md scale-105'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#920000] hover:text-[#920000]'
                                                        }
                                                    `}
                                                >
                                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                                                        ${isActive ? 'bg-white text-[#920000]' : 'bg-gray-100 text-gray-600'}`}
                                                    >
                                                        {idx + 1}
                                                    </span>
                                                    <span className="flex flex-col items-start leading-tight">
                                                        <span className="flex items-center gap-1 font-semibold">
                                                            {depCode}
                                                            {arrCode && <><ArrowRight className="w-3 h-3 opacity-60" />{arrCode}</>}
                                                        </span>
                                                        {(airline || flightNo || depTime) && (
                                                            <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                                                {[airline, flightNo].filter(Boolean).join(' ')}
                                                                {depTime && arrTime ? ` · ${depTime}–${arrTime}` : depTime ? ` · ${depTime}` : ''}
                                                            </span>
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="max-w-7xl mx-2 sm:mx-4 my-2">
                            {/* Header */}
                            <div className="text-start my-6">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                                    {isConnecting
                                        ? `Select Seat — ${getFlightTabLabel(activeFlightIndex)}`
                                        : 'Select Your Seat'}
                                </h1>
                                <p className="text-sm sm:text-md text-gray-600">
                                    {isConnecting
                                        ? `Leg ${activeFlightIndex + 1} of ${Object.keys(tripSeats).length} — select ${totalTravellers} seat${totalTravellers > 1 ? 's' : ''}`
                                        : `Select ${totalTravellers} seat${totalTravellers > 1 ? 's' : ''} (${selectedSeats.size}/${totalTravellers} selected)`}
                                </p>

                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-10">

                                <div className='lg:col-span-7 flex flex-col '>

                                    {processedRows.length > 0 && (
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
                                    )}

                                    {/* Seat Map */}
                                    <div className="pb-4">
                                        {loadingSeatMap ? (
                                            <div className="flex justify-center items-center py-20">
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#920000] border-t-transparent"></div>
                                                <span className="ml-3 text-gray-600 text-sm">Loading seat map...</span>
                                            </div>
                                        ) : seatMapError ? (
                                            <div className="text-center py-16 text-red-600">
                                                <p className="font-semibold text-lg">Failed to load seat map.</p>
                                                <p className="text-sm text-gray-500 mt-1">{seatMapError.message}</p>
                                            </div>
                                        ) : processedRows.length === 0 ? (
                                            <div className="text-center py-16 px-4 text-gray-500 flex flex-col items-center justify-center bg-gray-50/70 rounded-2xl border border-gray-200">
                                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-[#920000]">
                                                    <PlaneTakeoff className="w-8 h-8" />
                                                </div>
                                                <p className="font-bold text-lg text-gray-800">No seat map available for this flight.</p>
                                                <p className="text-sm text-gray-500 mt-1.5 max-w-md">
                                                    Seat selection is not available for this flight. You can proceed directly or your seats will be assigned at airport check-in.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (onSeatsContinue) {
                                                            const selectedSeatDetails = Array.from(selectedSeats).map((seatNum) => seatMap[seatNum]).filter(Boolean);
                                                            onSeatsContinue({ selectedSeats, selectedServices, totalAmount, selectedSeatDetails });
                                                        } else if (onClose) {
                                                            onClose();
                                                        } else {
                                                            navigate(-1);
                                                        }
                                                    }}
                                                    className="mt-6 px-6 py-2.5 bg-[#920000] text-white rounded-lg font-medium hover:bg-[#780000] transition-colors shadow-sm cursor-pointer"
                                                >
                                                    Continue Without Seat Selection
                                                </button>
                                            </div>
                                        ) : (
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
                                        )}
                                    </div>

                                    {/* Connecting flight — next leg nudge */}
                                    {isConnecting && activeFlightIndex < Object.keys(tripSeats).length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveFlightIndex(activeFlightIndex + 1)}
                                            className="mt-2 mb-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-full bg-[#920000] text-white font-semibold text-sm shadow hover:bg-[#780000] transition-all"
                                        >
                                            <PlaneLanding className="w-4 h-4" />
                                            Next: Select seat for Leg {activeFlightIndex + 2}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}

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
                                            hasSeatsAvailable={processedRows.length > 0}
                                            onContinue={() => {
                                                setOpenSummaryModal(false);
                                                if (onSeatsContinue) {
                                                    const selectedSeatDetails = Array.from(selectedSeats).map((seatNum) => seatMap[seatNum]).filter(Boolean);
                                                    onSeatsContinue({ selectedSeats, selectedServices, totalAmount, selectedSeatDetails });
                                                } else {
                                                    navigate("/payment", { state: { selectedSeats, selectedServices } });
                                                }
                                            }}
                                        />
                                    </div>

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
