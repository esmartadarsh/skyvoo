import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightResultsHeader from '@/components/flight/FlightResultsHeader';
import FlightResultsSearchHeader from '@/components/flight/FlightResultsSearchHeader';
import FlightResultsSearchHeaderMobile from '@/components/flight/FlightResultsSearchHeaderMobile';
import Filters from '@/components/flight/Filters';
import FlightPriceDetailsModal from '@/components/common/Modals/FlightPriceDetailsModal';
import SignInModal from '@/components/common/Modals/SignInModal';
import { X, ChevronUp, Search, Pencil } from 'lucide-react';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import RipSide from '@/assets/imgs/ripSide.webp'
import Stopwatch from '@/assets/vectors/stopwatch.svg'
import Cheapest from '@/assets/vectors/Cheapest.svg'
import Nonstop from '@/assets/vectors/Nonstop.svg'
import Other from '@/assets/vectors/Other.svg'
import Preference from '@/assets/vectors/Preference.svg'
import Lock from '@/assets/vectors/lock.svg'
import ViewFlightDetails from '../components/flight/ViewFlightDetails.jsx'
import BookingFlightFormBg from "@/assets/imgs/flightresultsbg.webp";
import FlightsData from '../Data/FlightsData.js';
import { formatTime } from '../utils/formatDateTime.js';
import { useFlightFilters } from '../contexts/FlightFilterContext.jsx';
import LoadingBar from "../components/layout/LoadingBar.jsx";
import { useFilteredFlights } from "@/features/flights/hooks/useFilteredFlights";
import { useCompareFlights } from '../features/flights/contexts/CompareContext.jsx';

const sortOptions = [
    {
        key: "CHEAPEST",
        label: "CHEAPEST",
        info: "₹5.5k • 2h 50m",
        icon: Cheapest,
    },
    {
        key: "NONSTOP",
        label: "NON STOP",
        info: "₹9.9k • 2h 20m",
        icon: Nonstop,
    },
    {
        key: "BEST",
        label: "BEST",
        info: "₹7.9k • 1h 20m",
        icon: Preference,
    },
    {
        key: "OTHER",
        label: "OTHER",
        info: "Sort",
        icon: Other,
    },
];

const otherOptions = [
    { label: "Discounted Price", value: "CHEAPDEST" },
    { label: "Early Departure", value: "EARLY_DEPARTURE" },
    { label: "Late Departure", value: "LATE_DEPARTURE" },
    { label: "Early Arrival", value: "EARLY_ARRIVAL" },
    { label: "Late Arrival", value: "LATE_ARRIVAL" },
];

export default function FlightResults() {
    const loadMoreRef = useRef(null);

    const PAGE_SIZE = 10;

    const RawFlightDetails = FlightsData.TripDetails[0].Flights;

    const { state: filters } = useFlightFilters();

    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    const [selectedSorting, setSelectedSorting] = useState("");

    const [progress, setProgress] = useState(0);

    const [showLoader, setShowLoader] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    const [selectedFlightId, setSelectedFlightId] = useState(null);

    const { state, dispatch } = useCompareFlights();
    const selectedFlights = state.selectedFlights;

    const [isSignInModal, setIsSignInModal] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);

    const [showOtherMenu, setShowOtherMenu] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [showMobileSearch, setShowMobileSearch] = useState(false);


    const FlightDetails = useFilteredFlights({
        flights: RawFlightDetails,
        filters,
        sorting: selectedSorting,
    });

    const visibleFlights = useMemo(() => {
        return FlightDetails.slice(0, page * PAGE_SIZE);
    }, [FlightDetails, page]);

    const toggleCompare = (flight) => {
        const exists = selectedFlights.some(
            f => f.Flight_Id === flight.Flight_Id
        );

        if (!exists && selectedFlights.length >= 3) {
            alert("You can only compare up to 3 flights.");
            return;
        }

        dispatch({
            type: exists ? "REMOVE_FLIGHT" : "ADD_FLIGHT",
            payload: exists ? flight.Flight_Id : flight,
        });
    };

    const toggleFlightDetails = (flightId) => {
        setSelectedFlightId((prev) => (prev === flightId ? null : flightId));
    };

    const handleClick = (key) => {
        if (key === "OTHER") {
            setShowOtherMenu((prev) => !prev);
        } else {
            setSelectedSorting(key);
            setShowOtherMenu(false);
        }
    };

    const handleOtherSelect = (option) => {
        setSelectedSorting(option);
        setShowOtherMenu(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setPage(1);
    }, [selectedSorting, filters]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    page * PAGE_SIZE < FlightDetails.length
                ) {
                    setPage(prev => prev + 1);
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold: 0.1,
            }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [page, FlightDetails.length]);

    useEffect(() => {
        const sequence = [70, 90, 100];
        let index = 0;

        const timer = setInterval(() => {
            setProgress(sequence[index]);
            index++;

            if (index >= sequence.length) {
                clearInterval(timer);
                // hide loader after short delay
                setTimeout(() => setShowLoader(false), 500);
            }
        }, 800);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? 'hidden' : 'auto';
        return () => (document.body.style.overflow = 'auto');
    }, [isFilterOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 1000);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Mobile Filters Drawer */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `}
                onClick={() => setIsFilterOpen(false)} />

            <div
                className={`fixed top-0 left-0 z-[9999] bg-white transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-screen w-80 overflow-y-auto overscroll-contain">
                    <Filters />
                </div>
            </div>

            {selectedFlights.length > 0 && (
                <>
                    <div className='fixed cursor-pointer bottom-20 right-5 text-white z-9998 bg-[#78080B] hover:bg-red-700 h-10 w-10 xs:h-12 xs:w-12 rounded-full flex justify-center items-center' onClick={() => setCollapsed(prev => !prev)}>
                        <Search className="h-6 w-6 xs:h-8 xs:w-8" />
                    </div>

                    <div className={`fixed bottom-20 right-5 bg-white shadow-lg rounded-lg overflow-hidden z-9999 border border-gray-200 `}>
                        <div className='relative'>

                            <div id="FlightComparisonsSection" className={`${collapsed ? 'collapsed' : ''}`}>

                                {/* Header */}
                                <div className="bg-[#78080B] text-white px-4 py-2 flex justify-between items-center">
                                    <h4 className="font-semibold">Selected flights</h4>
                                    <button className="text-white cursor-pointer" onClick={() => setCollapsed(prev => !prev)}> — </button>
                                </div>

                                {/* Selected Comparison Flight list */}
                                <ul className="divide-y divide-gray-200 max-h-48">
                                    {selectedFlights.map(selectedFlight => (
                                        <li
                                            key={selectedFlight.Flight_Id}
                                            className="flex items-center justify-between px-4 py-3"
                                        >
                                            {/* Left side: Logo + Airline */}
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={AirlineLogo}
                                                    alt={selectedFlight.Segments[0].Airline_Name}
                                                    className="w-6 h-6 rounded"
                                                />
                                                <span className="font-medium text-gray-800">{selectedFlight.Segments[0].Airline_Name}</span>
                                            </div>

                                            {/* Middle: Times + Progress */}
                                            <div className="flex items-center ">
                                                <div className="text-xs xs:text-sm font-medium mr-4">{formatTime(selectedFlight.Segments[0].Departure_DateTime)}</div>
                                                <div className="h-1 w-10 xs:w-16 bg-green-400 mx-auto my-1 rounded" />
                                                <div className="text-xs xs:text-sm font-medium ml-4">{formatTime(selectedFlight.Segments[0].Arrival_DateTime)}</div>
                                            </div>

                                            {/* Remove button */}
                                            <button
                                                onClick={() =>
                                                    dispatch({
                                                        type: "REMOVE_FLIGHT",
                                                        payload: selectedFlight.Flight_Id,
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
                                    <button className="px-2 cursor-pointer text-xs bg-white text-[#78080B] font-bold py-1 rounded-full shadow hover:bg-gray-300 transition-colors" onClick={() => { navigate('/compare-flights') }}>
                                        COMPARE FLIGHTS
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </>

            )}

            {isFlightDetailsModalOpen && <FlightPriceDetailsModal onClose={() => setIsFlightDetailsModalOpen(false)} />}
            {isSignInModal && <SignInModal onClose={() => setIsSignInModal(false)} />}
            {/* Mobile Filter Button */}


            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="cursor-pointer z-9998 fixed bottom-6 right-6 bg-[#78080B] text-white px-2 py-1 xs:px-4 xs:py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                    <p className='flex font-medium text-xs xs:text-base'>
                        <ChevronUp size={16} className='mr-1 xs:hidden' />
                        <ChevronUp size={20} className='mr-1 hidden xs:block' />
                        TOP</p>
                </button>
            )}

            <div className="relative min-h-screen">

                <img
                    className="absolute right-0 z-1 max-w-full h-auto object-cover"
                    src={GrayFadedBg}
                    alt="gray faded background"
                />
                <FlightResultsHeader onOpen={() => setIsSignInModal(true)} />

                <div className="hidden lg:block">
                    <FlightResultsSearchHeader />
                </div>

                {/* Mobile Search Header */}
                <div className="block lg:hidden">
                    <FlightResultsSearchHeaderMobile
                        open={showMobileSearch}
                        onClose={() => setShowMobileSearch(false)}
                    />
                </div>

                {showLoader && (
                    <LoadingBar progress={progress} />
                )}

                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto px-5 sm:px-4 py-6 z-50">
                    <div className="flex gap-6">

                        {/* Filters Sidebar */}
                        <div className="hidden lg:block">
                            <Filters />
                        </div>

                        {/* Results Area */}
                        <div className="flex-1">
                            <div className="lg:hidden mb-4 flex justify-end items-center">
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="px-4 py-2 text-xs bg-[#78080B] text-white rounded-full font-medium shadow"
                                >
                                    Filters
                                </button>
                            </div>
                            {/* Flight Details */}
                            <div
                                className="lg:hidden filterglasseffect rounded-xl shadow-sm px-4 py-3 mb-2  cursor-pointer active:scale-[0.98] transition-transform"
                                style={{ zIndex: 2 }}
                            >
                                <div className="grid grid-cols-[1fr_auto] gap-3 items-center">

                                    {/* Search Summary */}
                                    <div className="flex flex-col">
                                        <span className="text-xs xs:text-sm font-semibold text-gray-900">
                                            New Delhi → Mumbai
                                        </span>
                                        <span className="text-xs xs:text-sm text-gray-600">
                                            16 Jan · 1 Adult · Economy
                                        </span>
                                    </div>

                                    {/* Edit Action */}
                                    <div className="flex flex-col items-center gap-1 text-xs xs:text-sm font-medium text-[#78080B]">
                                        <Pencil button size={16} onClick={() => setShowMobileSearch(true)} />
                                        <span>Edit</span>
                                    </div>

                                </div>
                            </div>

                            {/* Sorting Options */}
                            <div className="filterglasseffect rounded-lg shadow-sm px-4 py-3 mb-4 " style={{ overflow: 'visible', zIndex: 2 }}>
                                <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                                    {sortOptions.map((option) => (
                                        <div key={option.key} className="relative">
                                            {/* Button */}
                                            <button
                                                className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 rounded flex items-center justify-start w-full transition-all duration-200 ${selectedSorting === option.key ||
                                                    (option.key === "OTHER" && otherOptions.some((opt) => opt.value === selectedSorting))
                                                    ? "bg-white"
                                                    : "bg-gray-100"
                                                    }`}
                                                style={{
                                                    boxShadow: "3px 1px 4px 0px rgba(0, 0, 0, 0.25)",
                                                }}
                                                onClick={() => handleClick(option.key)}
                                            >
                                                <div className="mr-[2px] xs:mr-2 sm:mr-4 border border-solid border-[#A8A8A8] bg-[#D9D9D9] p-1 rounded-md flex items-center justify-center">
                                                    <img
                                                        src={option.icon}
                                                        alt={option.label}
                                                        className="w-2 h-2 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
                                                    />
                                                </div>
                                                <div className="text-start leading-tight">
                                                    <div className="text-[6px] xs:text-[10px] sm:text-base font-medium">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-[4px] xs:text-[7px] sm:text-xs text-gray-700">
                                                        {option.info}
                                                    </div>
                                                </div>

                                            </button>

                                            {/* Underline animation */}
                                            <div
                                                className={`absolute bottom-0 left-0 h-[3px] bg-[#78080B] rounded-full transition-all duration-1000 ease-out ${selectedSorting === option.key ||
                                                    (option.key === "OTHER" && otherOptions.some((opt) => opt.value === selectedSorting))
                                                    ? "w-full"
                                                    : "w-0"
                                                    }`}
                                            >
                                            </div>

                                            {/* Dropdown under OTHER */}
                                            {option.key === "OTHER" && showOtherMenu && (
                                                <div
                                                    className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-48 animate-fadeIn"
                                                    style={{ boxShadow: "0px 2px 6px rgba(0,0,0,0.15)" }}
                                                >
                                                    <ul className="py-2">
                                                        {otherOptions.map((item) => (
                                                            <li
                                                                key={item}
                                                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => handleOtherSelect(item.value)}
                                                            >
                                                                {item.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {/* Flight Results */}
                            <div className="space-y-4">
                                {FlightDetails.length > 0 ? (
                                    visibleFlights.map((flight) => (
                                        <div key={flight.Flight_Id} className="rounded-2xl">
                                            <div
                                                className="py-2 sm:py-4 relative bg-cover bg-center rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                                style={{
                                                    backgroundImage: `url(${BookingFlightFormBg})`,
                                                    boxShadow: "-3px 4px 20px 0px rgba(0, 0, 0, 0.25)",
                                                }}
                                                onClick={(e) => {
                                                    if (e.target.closest('button')) return;

                                                    if (window.matchMedia('(max-width: 767px)').matches) {
                                                        setIsFlightDetailsModalOpen(true);
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
                                                                background:
                                                                    "linear-gradient(90deg, rgba(196,36,36,0.5) 0%, rgba(255,255,255,0.5) 100%)",
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
                                                            <img src={AirlineLogo} alt="airline logo" />
                                                        </div>
                                                        <div>
                                                            <div className="w-max font-semibold text-[10px] xs:text-xl">{flight.Segments[0].Airline_Name}</div>
                                                            <div className="font-medium text-[8px] xs:text-base">{flight.Segments[0].Flight_Number}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center w-full md:w-auto gap-1 md:gap-6">

                                                        {/* Departure */}
                                                        <div className="text-center">
                                                            <div className="text-[9px] xs:text-base sm:text-xl md:text-2xl font-bold leading-tight">
                                                                {formatTime(flight.Segments[0].Departure_DateTime)}
                                                            </div>
                                                            <div className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                                                                {flight.Segments[0].Origin_City}
                                                            </div>
                                                        </div>

                                                        {/* Duration */}
                                                        <div className="flex flex-col items-center font-semibold px-2">
                                                            <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-medium mb-[1px] xs:mb-1 text-gray-700">
                                                                {flight.Segments[0].Duration}
                                                            </div>

                                                            <div className="relative w-10 xs:w-14 sm:w-16 md:w-24 h-0.5 rounded-xl bg-[#920000]" />

                                                            <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-medium mt-[1px] xs:mt-1 text-gray-700">
                                                                {flight.Segments[0].Stop_Over === null ? 'Non Stop' : flight.Segments[0].Stop_Over}
                                                            </div>
                                                        </div>

                                                        {/* Arrival */}
                                                        <div className="text-center">
                                                            <div className="text-[9px] xs:text-base sm:text-xl md:text-2xl font-bold leading-tight">
                                                                {formatTime(flight.Segments[0].Arrival_DateTime)}
                                                            </div>
                                                            <div className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                                                                {flight.Segments[0].Destination_City}
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:gap-2">
                                                            <div className="text-[10px] xs:text-base sm:text-xl md:text-2xl font-bold text-[#811919]">
                                                                ₹ {flight.Fares[0].FareDetails[0].Total_Amount}
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
                                                            setIsFlightDetailsModalOpen(true)
                                                        }}
                                                    >
                                                        VIEW PRICES
                                                    </button>
                                                </div>

                                                {/* ---- Mid Bottom Row ---- */}
                                                <div className="flex flex-row md:items-center justify-between  text-[10px] xs:text-xs sm:text-sm font-medium gap-2">
                                                    {selectedFlights.some((f) => f.Flight_Id === flight.Flight_Id) ? (
                                                        <div
                                                            className="ml-2 pr-3 cursor-pointer flex items-center px-3 py-1 rounded hover:bg-red-200 transition-colors duration-300 ease-in-out"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleCompare(flight);
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
                                                                toggleCompare(flight);
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
                                                            onClick={() => toggleFlightDetails(flight.Flight_Id)}
                                                        >
                                                            {selectedFlightId === flight.Flight_Id ? "Hide" : "View"} Flight Details
                                                        </button>

                                                    </div>

                                                </div>
                                            </div>

                                            {/* ---- Slide-Down Details ---- */}
                                            < div
                                                className={`shadow-2xl mt-5 overflow-hidden transition-[max-height] duration-900 ease-in-out ${selectedFlightId === flight.Flight_Id ? "max-h-96" : "max-h-0"}`}
                                            >
                                                {selectedFlightId === flight.Flight_Id && <ViewFlightDetails flight={flight} />}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-600 mt-10">
                                        No flights match your filters.
                                    </div>
                                )}
                                <div ref={loadMoreRef} className="h-10" />

                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}