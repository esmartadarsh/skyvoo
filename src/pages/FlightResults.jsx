import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightResultsHeader from '@/components/flight/FlightResultsHeader';
import Filters from '@/components/flight/Filters';
import FlightPriceDetailsModal from '@/components/common/Modals/FlightPriceDetailsModal';
import SignInModal from '@/components/common/Modals/SignInModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Search } from 'lucide-react';
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

const sortOptions = [
    {
        key: "CHEAPEST",
        label: "CHEAPEST",
        info: "₹ 5,500 | 2h 50m",
        icon: Cheapest,
    },
    {
        key: "NONSTOP",
        label: "NON STOP FIRST",
        info: "₹ 9,900 | 02h 20m",
        icon: Nonstop,
    },
    {
        key: "BEST",
        label: "BEST PICK",
        info: "₹ 7,900 | 01h 20m",
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

const TimeRanges = {
    "Early Morning": { start: 0, end: 6 },
    "Morning": { start: 6, end: 12 },
    "Afternoon": { start: 12, end: 18 },
    "Night": { start: 18, end: 24 },
};

export default function FlightResults() {

    const [selectedSorting, setSelectedSorting] = useState("");

    const [progress, setProgress] = useState(0);
    const [showLoader, setShowLoader] = useState(true);

    const RawFlightDetails = FlightsData.TripDetails[0].Flights;

    const { selectedStops, selectedAirlines, selectedAircraftSizes, selectedPriceRange, selectedDepartureTime, selectedArrivalTime } = useFlightFilters();

    const filteredFlights = useMemo(() => {
        return RawFlightDetails.filter((flight) => {
            const airlineName = flight.Airline_Code || '';
            const lowestFare = Math.min(...flight.Fares.map(f => f.FareDetails[0].Total_Amount));
            const stopsCount = Array.isArray(flight?.Segments?.[0]?.Stop_Over)
                ? flight.Segments[0].Stop_Over.length
                : 0;

            const depHour = new Date(flight.Segments[0].Departure_DateTime).getHours();
            const arrHour = new Date(flight.Segments[0].Arrival_DateTime).getHours();

            // 1️⃣ Airline filter
            if (selectedAirlines.length && !selectedAirlines.includes(airlineName)) return false;

            // 2️⃣ Price range
            if (selectedPriceRange.length === 2 && !(selectedPriceRange[0] === 0 && selectedPriceRange[1] === Infinity)) {
                const [min, max] = selectedPriceRange;
                if (lowestFare < min || lowestFare > max) return false;
            }

            // 3️⃣ Stops filter
            if (selectedStops.includes('Non Stop') && stopsCount !== 0) return false;
            if (selectedStops.includes('1 Stop') && stopsCount !== 1) return false;
            if (selectedStops.includes('2+ Stops') && stopsCount < 2) return false;

            // 4️⃣ Departure time
            if (selectedDepartureTime) {
                const { start, end } = TimeRanges[selectedDepartureTime];
                if (depHour < start || depHour >= end) return false;
            }

            // 5️⃣ Arrival time
            if (selectedArrivalTime) {
                const { start, end } = TimeRanges[selectedArrivalTime];
                if (arrHour < start || arrHour >= end) return false;
            }

            return true;
        });
    }, [
        RawFlightDetails,
        selectedAirlines,
        selectedStops,
        selectedPriceRange,
        selectedAircraftSizes,
        selectedDepartureTime,
        selectedArrivalTime,
    ]);

    const FlightDetails = useMemo(() => {
        const sorted = [...filteredFlights];

        switch (selectedSorting) {
            case "CHEAPEST":
                sorted.sort((a, b) => {
                    const fareA = Math.min(...a.Fares.map(f => f.FareDetails[0].Total_Amount));
                    const fareB = Math.min(...b.Fares.map(f => f.FareDetails[0].Total_Amount));
                    return fareA - fareB;
                });
                break;

            case "NONSTOP":
                sorted.sort((a, b) => {
                    const stopsA = Array.isArray(a.Segments[0]?.Stop_Over) ? a.Segments[0].Stop_Over.length : 0;
                    const stopsB = Array.isArray(b.Segments[0]?.Stop_Over) ? b.Segments[0].Stop_Over.length : 0;
                    return stopsA - stopsB;
                });
                break;

            case "EARLY_DEPARTURE":
                sorted.sort((a, b) => new Date(a.Segments[0].Departure_DateTime) - new Date(b.Segments[0].Departure_DateTime));
                break;

            case "LATE_DEPARTURE":
                sorted.sort((a, b) => new Date(b.Segments[0].Departure_DateTime) - new Date(a.Segments[0].Departure_DateTime));
                break;

            case "EARLY_ARRIVAL":
                sorted.sort((a, b) => new Date(a.Segments[0].Arrival_DateTime) - new Date(b.Segments[0].Arrival_DateTime));
                break;

            case "LATE_ARRIVAL":
                sorted.sort((a, b) => new Date(b.Segments[0].Arrival_DateTime) - new Date(a.Segments[0].Arrival_DateTime));
                break;

            default:
                break;
        }

        return sorted;
    }, [filteredFlights, selectedSorting]);

    const navigate = useNavigate();

    const [isSwapping, setIsSwapping] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [tripType, setTripType] = useState('roundTrip');
    const [rotation, setRotation] = useState(0);

    const [showTravellerBox, setShowTravellerBox] = useState(false);

    const travellerBoxRef = useRef(null);

    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [selectedFlights, setSelectedFlights] = useState([]);

    const [isSignInModal, setIsSignInModal] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);

    const [isEditable, setIsEditable] = useState(false);
    const fareTypeRef = useRef(null);
    const contentRef = useRef(null);
    const [fareTypeHeight, setFareTypeHeight] = useState(0);

    const [showOtherMenu, setShowOtherMenu] = useState(false);
    const handleModifySearch = () => setIsEditable(true);

    const toggleCompare = (flight) => {
        setSelectedFlights((prev) => {
            const exists = prev.some((f) => f.Flight_Id === flight.Flight_Id);
            if (exists) {
                return prev.filter((f) => f.Flight_Id !== flight.Flight_Id);
            }
            if (prev.length >= 3) {
                alert("You can only select up to 3 flights to compare.");
                return prev;
            }
            return [...prev, flight];
        });
    };

    const toggleFlightDetails = (flightId) => {
        setSelectedFlightId((prev) => (prev === flightId ? null : flightId));
    };

    const [flightSearchInfo, setFlightSearchInfo] = useState({
        from: '',
        to: '',
        depart: null,
        return: null,
        traveller: 1,
    });

    const [travellers, setTravellers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        classType: 'Economy/Premium Economy',
    });

    const handleFlightInputChange = (field, value) => {
        setFlightSearchInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSwap = () => {
        setRotation(prevRotation => prevRotation + 180);
        setIsSwapping(prev => !prev);

        setFlightSearchInfo(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from,
        }));
    };

    const validateTravellers = () => {
        // Interpret '>9' as 10, '>6' as 7 for validation and totals
        setShowTravellerBox(!showTravellerBox)
        const adultsVal = travellers.adults === '>9' ? 10 : travellers.adults;
        const childrenVal = travellers.children === '>6' ? 7 : travellers.children;
        const infantsVal = travellers.infants === '>6' ? 7 : travellers.infants;

        // 1️⃣ At least one adult
        if (adultsVal < 1) {
            alert('Please select at least one adult.');
            return false;
        }

        // 2️⃣ Infants cannot exceed adults
        if (infantsVal > adultsVal) {
            alert('Infants cannot exceed the number of adults.');
            return false;
        }

        // 3️⃣ Optional overall cap (adjust if needed)
        const total = adultsVal + childrenVal + infantsVal;
        if (total > 20) {
            alert('Total passengers cannot exceed 20.');
            return false;
        }

        return true;
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

    useEffect(() => {
        function handleDocClick(e) {
            if (travellerBoxRef.current && !travellerBoxRef.current.contains(e.target)) {
                setShowTravellerBox(false);
            }
        }
        function handleEsc(e) {
            if (e.key === 'Escape') setShowTravellerBox(false);
        }
        document.addEventListener('mousedown', handleDocClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleDocClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200 // near bottom
            ) {
                setVisibleCount(prev => prev + 10); // load 10 more
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isEditable && contentRef.current) {
            setFareTypeHeight(contentRef.current.scrollHeight);
        } else {
            setFareTypeHeight(0);
        }
    }, [isEditable]);

    // Loader
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

    return (
        <>
            {selectedFlights.length > 0 && (
                <>
                    <div className='fixed cursor-pointer bottom-20 right-5 text-white z-9998 bg-[#78080B] hover:bg-red-700 h-12 w-12 rounded-full flex justify-center items-center' onClick={() => setCollapsed(prev => !prev)}><Search className="h-8 w-8" /></div>

                    <div className={`fixed bottom-20 right-5 bg-white shadow-lg rounded-lg overflow-hidden z-9999 border border-gray-200 secondary-font`}>
                        <div className='relative'>

                            <div id="FlightComparisonsSection" className={`${collapsed ? 'collapsed' : ''}`}>

                                {/* Header */}
                                <div className="bg-[#0A2B4E] text-white px-4 py-2 flex justify-between items-center">
                                    <h4 className="font-semibold">Selected flights</h4>
                                    <button className="text-white cursor-pointer" onClick={() => setCollapsed(prev => !prev)}> — </button>
                                </div>

                                {/* Selected Comparison Flight list */}
                                <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto">
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
                                                <div className="text-sm font-medium mr-4">{formatTime(selectedFlight.Segments[0].Departure_DateTime)}</div>
                                                <div className="h-1 w-16 bg-green-400 mx-auto my-1 rounded" />
                                                <div className="text-sm font-medium ml-4">{formatTime(selectedFlight.Segments[0].Arrival_DateTime)}</div>
                                            </div>

                                            {/* Remove button */}
                                            <button
                                                className="text-gray-400 hover:text-red-500 ml-3"
                                                onClick={() =>
                                                    setSelectedFlights(prev =>
                                                        prev.filter(f => f.Flight_Id !== selectedFlight.Flight_Id)
                                                    )
                                                }
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer button */}
                                <div className="p-3 bg-[#0A2B4E] border-t border-gray-200 flex justify-end">
                                    <button className="w-[60%] cursor-pointer bg-blue-600 text-white font-bold py-2 rounded-full shadow hover:bg-blue-700 transition-colors" onClick={() => { navigate('/compare-flights') }}>
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

            <div className="relative min-h-screen bg-gray-100">

                <img
                    className="absolute right-0 z-1 max-w-full h-auto object-cover"
                    src={GrayFadedBg}
                    alt="gray faded background"
                />
                <FlightResultsHeader onOpen={() => setIsSignInModal(true)} />

                {/* Search Header */}
                <div className="relative bg-[#78080B] text-white px-2 sm:px-4 py-3 sm:py-5 z-999 mb-4" style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        {/* Main Search Grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-15 gap-3 sm:gap-4 lg:gap-6 items-end secondary-font font-semibold">

                            {/* Trip Type */}
                            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                <label className="block text-sm sm:text-base text-white">Trip Type</label>
                                <select
                                    value={tripType}
                                    onChange={(e) => setTripType(e.target.value)}
                                    className="w-full bg-transparent font-medium text-base sm:text-lg border-b border-white text-white placeholder-white focus:outline-none"
                                    disabled={!isEditable}
                                >
                                    <option value="oneWay" className='text-black font-medium'>One Way</option>
                                    <option value="roundTrip" className='text-black font-medium'>Round Trip</option>
                                    <option value="multiCity" className='text-black font-medium'>Multi City</option>
                                </select>
                            </div>

                            {tripType === 'multiCity' ? (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-11 flex flex-col items-start">
                                    <label className="block text-sm sm:text-base text-white">From (Multi City)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter multiple destinations"
                                        value={flightSearchInfo.from}
                                        onChange={(e) => handleFlightInputChange('from', e.target.value)}
                                        className="w-full bg-transparent font-medium text-base sm:text-lg border-b border-white text-white placeholder-white focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <>
                                    {/* From */}
                                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                        <label className="block text-sm sm:text-base text-white">From</label>
                                        <input
                                            type="text"
                                            placeholder="Origin"
                                            value={flightSearchInfo.from}
                                            onChange={(e) => handleFlightInputChange('from', e.target.value)}
                                            className="w-full bg-transparent font-medium text-base sm:text-lg border-b border-white text-white placeholder-white focus:outline-none"
                                            disabled={!isEditable}
                                        />
                                    </div>

                                    {/* Swap - Hidden on mobile */}
                                    <div className="hidden lg:flex lg:col-span-1 justify-center my-2 sm:my-0">
                                        <button
                                            type="button"
                                            onClick={handleSwap}
                                            aria-label="Swap origin and destination"
                                            className="cursor-pointer p-2 rounded-full transition-transform duration-300"
                                        >
                                            <div
                                                className="relative w-6 h-6 transition-transform duration-500"
                                                style={{ transform: `rotate(${rotation}deg)` }}
                                            >
                                                <svg className="absolute top-0 left-0 w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translate(4px,-4px) rotate(90deg)' }}>
                                                    <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                                                </svg>
                                                <svg className="absolute top-0 left-0 w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translate(4px,10px) rotate(-90deg)' }}>
                                                    <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>

                                    {/* To */}
                                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                        <label className="block text-sm sm:text-base text-white">To</label>
                                        <input
                                            type="text"
                                            placeholder="Destination"
                                            value={flightSearchInfo.to}
                                            onChange={(e) => handleFlightInputChange('to', e.target.value)}
                                            className="w-full bg-transparent text-base sm:text-lg font-medium border-b border-white text-white focus:outline-none placeholder-white"
                                            disabled={!isEditable}
                                        />
                                    </div>

                                    {/* Depart */}
                                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                        <label className="block text-sm sm:text-base text-white">Depart</label>
                                        <DatePicker
                                            selected={flightSearchInfo.depart}
                                            onChange={(date) => handleFlightInputChange('depart', date)}
                                            minDate={new Date()}
                                            monthsShown={2}
                                            placeholderText="Select Depart"
                                            className="w-full bg-transparent font-medium text-base sm:text-lg text-white border-b border-white focus:outline-none placeholder-white react-datepicker-popper"
                                            disabled={!isEditable}
                                        />
                                    </div>

                                    {/* Return (conditionally rendered) */}
                                    {tripType === 'roundTrip' && (
                                        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                            <label className="block text-sm sm:text-base text-white">Return</label>
                                            <div className="flex items-center justify-between">
                                                <DatePicker
                                                    selected={flightSearchInfo.return}
                                                    onChange={(date) => handleFlightInputChange('return', date)}
                                                    minDate={flightSearchInfo.depart ?? new Date()}
                                                    monthsShown={2}
                                                    placeholderText="Select Return"
                                                    className="w-full bg-transparent font-medium text-base sm:text-lg text-white border-b border-white focus:outline-none placeholder-white react-datepicker-popper"
                                                    disabled={!isEditable}
                                                />
                                                {flightSearchInfo.return && (
                                                    <div
                                                        className="bg-[#0a223d] rounded-full w-4 h-4 flex justify-center items-center cursor-pointer hover:bg-[#12345a]"
                                                        onClick={() => handleFlightInputChange('return', null)}
                                                    >
                                                        <X className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Traveler */}
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 relative">
                                        <label className="block text-sm sm:text-base">Travelers & Class</label>
                                        <div onClick={() => setShowTravellerBox(!showTravellerBox)} className="cursor-pointer border-b border-white text-white font-medium text-base sm:text-lg flex justify-between items-center">
                                            <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                                {(() => {
                                                    const toNumber = v => {
                                                        if (typeof v === 'string' && v.startsWith('>')) {
                                                            const parsed = parseInt(v.slice(1), 10);
                                                            return Number.isNaN(parsed) ? 0 : parsed;
                                                        }
                                                        const n = Number(v);
                                                        return Number.isNaN(n) ? 0 : n;
                                                    };
                                                    const totalTravellers = [travellers.adults, travellers.children, travellers.infants].reduce((acc, v) => acc + toNumber(v), 0);
                                                    return `${totalTravellers} Traveller${totalTravellers > 1 ? 's' : ''} • ${travellers.classType}`;
                                                })()}
                                            </span>
                                        </div>

                                        {isEditable && showTravellerBox && (
                                            <div
                                                className="absolute left-0 right-0 lg:right-0 lg:left-auto z-999 mt-2 w-full lg:w-[45rem] bg-white rounded-md shadow-lg px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6 text-black overflow-hidden transition-all duration-500"
                                                style={{ height: isEditable && showTravellerBox ? `${travellerBoxRef.current?.scrollHeight}px` : '0px' }}
                                                ref={travellerBoxRef}
                                            >
                                                {/* Adults Section */}
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                        ADULTS (12y+) <br /> <span className='text-xs sm:text-sm font-medium'> on the day of travel </span>
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                                                        <div className="flex border rounded-md overflow-hidden flex-wrap">
                                                            {Array.from({ length: 9 }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => setTravellers(t => ({ ...t, adults: i + 1 }))}
                                                                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                        ${travellers.adults === i + 1 ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                                >
                                                                    {i + 1}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div
                                                            onClick={() => setTravellers(t => ({ ...t, adults: '>9' }))}
                                                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md
                                                ${travellers.adults === '>9' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                        >
                                                            &gt;9
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Children & Infants */}
                                                <div className="flex flex-col">
                                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                                                        {/* Children */}
                                                        <div className='flex flex-col w-full lg:w-auto'>
                                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                                CHILDREN (2y - 12y) <br /> <span className='text-xs sm:text-sm font-medium'>on the day of travel</span>
                                                            </p>
                                                            <div className='flex justify-between items-start mt-2 gap-2'>
                                                                <div className="flex border rounded-md overflow-hidden flex-wrap">
                                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                                        <div
                                                                            key={i}
                                                                            onClick={() => setTravellers(t => ({ ...t, children: i }))}
                                                                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                                ${travellers.children === i ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                                        >
                                                                            {i}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div
                                                                    onClick={() => setTravellers(t => ({ ...t, children: '>6' }))}
                                                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md 
                                                        ${travellers.children === '>6' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                                >
                                                                    &gt;6
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Infants */}
                                                        <div className='flex flex-col items-start w-full lg:w-auto'>
                                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                                INFANTS (below 2y) <br />  <span className='text-xs sm:text-sm font-medium'> on the day of travel </span>
                                                            </p>
                                                            <div className='flex justify-between items-start mt-2 gap-2'>
                                                                <div className="flex border rounded-md overflow-hidden flex-wrap">
                                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                                        <div
                                                                            key={i}
                                                                            onClick={() => setTravellers(t => ({ ...t, infants: i }))}
                                                                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                                ${travellers.infants === i ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                                        >
                                                                            {i}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div
                                                                    onClick={() => setTravellers(t => ({ ...t, infants: '>6' }))}
                                                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md
                                                        ${travellers.infants === '>6' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'}`}
                                                                >
                                                                    &gt;6
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="border-gray-200" />

                                                {/* Class Selector */}
                                                <div>
                                                    <p className="font-semibold text-gray-800 mb-3 uppercase tracking-wide text-sm sm:text-base">
                                                        Choose Travel Class
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Economy/Premium Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                                                            <button
                                                                key={cls}
                                                                onClick={() => setTravellers(t => ({ ...t, classType: cls }))}
                                                                className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition-colors 
                                                    ${travellers.classType === cls ? 'bg-[#78080B] text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                                            >
                                                                {cls}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Done Button */}
                                                <div onClick={validateTravellers} className="cursor-pointer flex justify-center bg-[#78080B] rounded-sm p-1">
                                                    <button className='btn'>
                                                        <span className="cursor-pointer button-text text-white secondary-font text-sm sm:text-base">D O N E</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Search Button */}
                            <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex justify-center relative">
                                <a href="#" id='ModifySearchButton' onClick={handleModifySearch} className="text-sm sm:text-base">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    {isEditable ? "SEARCH" : "MODIFY SEARCH"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Fare Type */}
                    <div
                        className="filter-section max-w-7xl mx-auto mt-4 font-medium overflow-hidden transition-all duration-500"
                        style={{ height: isEditable ? `${fareTypeHeight}px` : '0px' }}
                        ref={fareTypeRef}
                    >
                        <div ref={contentRef}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start space-y-3 sm:space-y-0 sm:space-x-6">
                                <span className="text-sm sm:text-base">Fare Type</span>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 rounded-xl filterglasseffect px-3 sm:px-4 w-full sm:w-auto">
                                    {[
                                        { value: "regular", label: "Regular", checked: true },
                                        { value: "student", label: "Student" },
                                        { value: "senior", label: "Senior Citizen" },
                                        { value: "armed", label: "Armed Forces" },
                                        { value: "doctor", label: "Doctor and Nurses" },
                                    ].map(({ value, label, checked }, i) => (
                                        <div key={value} className={`${i !== 0 ? "sm:border-l border-white" : ""}`}>
                                            <label className="flex py-2 sm:ml-2 items-center space-x-1 cursor-pointer text-sm sm:text-base">
                                                <input
                                                    type="radio"
                                                    name="fareType"
                                                    value={value}
                                                    defaultChecked={checked}
                                                    className="mr-2 text-red-600 focus:ring-0"
                                                    disabled={!isEditable}
                                                />
                                                <span>{label}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showLoader && (
                    <LoadingBar progress={progress} />
                )}

                {/* Main Content */}
                < div className="relative max-w-7xl mx-auto px-4 py-6 z-50" >
                    <div className="flex gap-6">
                        {/* Filters Sidebar */}
                        <Filters />
                        {/* Results Area */}
                        <div className="flex-1">

                            {/* Sorting Options */}
                            <div className="filterglasseffect rounded-lg shadow-sm px-8 py-3 mb-4 secondary-font" style={{ overflow: 'visible', zIndex: 1 }}>
                                <div className="grid grid-cols-4 gap-4">
                                    {sortOptions.map((option) => (
                                        <div key={option.key} className="relative">
                                            {/* Button */}
                                            <button
                                                className={`cursor-pointer px-4 py-2 rounded flex items-center justify-start w-full transition-all duration-200 ${selectedSorting === option.key || otherOptions.includes(selectedSorting)
                                                    ? selectedSorting === option.key ||
                                                        (option.key === "OTHER" && otherOptions.includes(selectedSorting))
                                                        ? "bg-white"
                                                        : "bg-gray-100"
                                                    : selectedSorting === option.key
                                                        ? "bg-white"
                                                        : "bg-gray-100"
                                                    }`}
                                                style={{
                                                    boxShadow: "3px 1px 4px 0px rgba(0, 0, 0, 0.25)",
                                                }}
                                                onClick={() => handleClick(option.key)}
                                            >
                                                <div className="mr-4 border border-solid border-[#A8A8A8] bg-[#D9D9D9] p-1 rounded-md">
                                                    <img src={option.icon} alt={option.label} />
                                                </div>
                                                <div className="text-start">
                                                    <div className="text-base font-medium">{option.label}</div>
                                                    <div className="text-xs">{option.info}</div>
                                                </div>
                                            </button>

                                            {/* Underline animation */}
                                            <div
                                                className={`absolute bottom-0 left-0 h-[3px] bg-blue-500 rounded-full transition-all duration-1000 ease-out ${selectedSorting === option.key ||
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

                                <h2 className="text-xl font-bold mt-4">
                                    Flights from New Delhi to Mumbai
                                </h2>
                            </div>

                            {/* Flight Results */}
                            <div className="space-y-4">
                                {FlightDetails.length > 0 ? (
                                    FlightDetails.slice(0, visibleCount).map((flight) => (
                                        <div key={flight.Flight_Id} className="rounded-2xl">
                                            <div
                                                className="py-4 relative bg-cover bg-center rounded-xl shadow-sm hover:shadow-md transition-shadow secondary-font"
                                                style={{
                                                    backgroundImage: `url(${BookingFlightFormBg})`,
                                                    boxShadow: "-3px 4px 20px -2px rgba(0, 0, 0, 0.25)",
                                                }}
                                            >
                                                <img
                                                    className="absolute -right-[0.330rem] top-1/2 -translate-y-1/2 h-[90%] hidden lg:block"
                                                    src={RipSide}
                                                    alt="ribbon side"
                                                />

                                                {/* ---- Top Row ---- */}
                                                <div className="flex items-center justify-between text-sm font-medium">
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
                                                            <p className="text-xs">Free Seat With VISA Card*</p>
                                                        </div>
                                                    </div>

                                                    <div className="pr-5 flex items-center px-3 py-1 rounded">
                                                        <img src={Stopwatch} alt="stopwatch" className="w-4 h-4 mr-2" />
                                                        <span className="text-gray-800 font-medium">96% on Time</span>
                                                    </div>
                                                </div>

                                                {/* ---- Main Row ---- */}
                                                <div className="py-5 px-3 flex items-center justify-between space-x-6">
                                                    {/* Airline info */}
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                                            <img src={AirlineLogo} alt="airline logo" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{flight.Segments[0].Airline_Name}</div>
                                                            <div className="text-sm font-medium">{flight.Segments[0].Flight_Number}</div>
                                                        </div>
                                                    </div>

                                                    {/* Departure */}
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold">
                                                            {formatTime(flight.Segments[0].Departure_DateTime)}
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {flight.Segments[0].Origin_City}
                                                        </div>
                                                    </div>

                                                    {/* Duration */}
                                                    <div className="flex flex-col items-center font-semibold">
                                                        <div className="text-sm font-medium mb-2">
                                                            {flight.Segments[0].Duration}
                                                        </div>
                                                        <div className="relative w-24 h-0.5 rounded-xl bg-[#920000]" />
                                                        <div className="text-sm font-medium mt-2">
                                                            {flight.Segments[0].Stop_Over === null ? 'Non Stop' : flight.Segments[0].Stop_Over}
                                                        </div>
                                                    </div>

                                                    {/* Arrival */}
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold">
                                                            {formatTime(flight.Segments[0].Arrival_DateTime)}
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {flight.Segments[0].Destination_City}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">
                                                            ₹ {flight.Fares[0].FareDetails[0].Total_Amount}
                                                        </div>
                                                        <div className="text-sm font-medium">Per Adult</div>
                                                    </div>

                                                    {/* Button */}
                                                    <button
                                                        className="cursor-pointer bg-[#811919] hover:bg-[#741111] text-white px-4 py-1 rounded-full font-medium text-sm"
                                                        onClick={() => setIsFlightDetailsModalOpen(true)}
                                                    >
                                                        VIEW PRICES
                                                    </button>
                                                </div>

                                                {/* ---- Mid Bottom Row ---- */}
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <div className="ml-2 pr-3 flex items-center px-3 py-1 rounded hover:bg-red-200 transition-colors duration-300 ease-in-out">
                                                        {selectedFlights.some((f) => f.Flight_Id === flight.Flight_Id) ? (
                                                            <span className="flex items-center">
                                                                <span>Added</span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleCompare(flight);
                                                                    }}
                                                                    className="ml-2 text-[#910E0E] font-bold w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                                                                >
                                                                    <X size={12} strokeWidth={3} />
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="text-[#811919] font-semibold cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleCompare(flight);
                                                                }}
                                                            >
                                                                Add Compare More +
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="pr-25 relative rounded-full">
                                                        <div
                                                            className="rounded-l-full"
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                background:
                                                                    "linear-gradient(90deg, rgba(205 205 205) 0%, rgba(255,255,255,0.5) 100%)",
                                                                pointerEvents: "none",
                                                                zIndex: 0,
                                                            }}
                                                        />
                                                        <div className="flex flex-row" style={{ position: "relative", zIndex: 1 }}>
                                                            <img src={Lock} alt="LOCK" className="px-2" />
                                                            <p className="text-xs">Lock this price starting from ₹ 413</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ---- Bottom Row ---- */}
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <div className="pl-5 pr-55 relative">
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                background:
                                                                    "linear-gradient(90deg, rgba(205 205 205) 0%, rgba(255,255,255,0.5) 100%)",
                                                                pointerEvents: "none",
                                                                zIndex: 0,
                                                            }}
                                                        />
                                                        <div
                                                            style={{ position: "relative", zIndex: 1 }}
                                                            className="flex flex-row items-center"
                                                        >
                                                            <div className="bg-[#720E0E] w-2 h-2 rounded-full mr-2"></div>
                                                            <p className="text-xs">FLAT ₹177 OFF using SkyvooSUPER</p>
                                                        </div>
                                                    </div>

                                                    <div className="pr-5 flex items-center px-3 py-1 rounded">
                                                        <button
                                                            className="text-[#811919] cursor-pointer hover:underline text-sm"
                                                            onClick={() => toggleFlightDetails(flight.Flight_Id)}
                                                        >
                                                            {selectedFlightId === flight.Flight_Id ? "Hide" : "View"} Flight Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ---- Slide-Down Details ---- */}
                                            <div
                                                className={`shadow-2xl mt-5 overflow-hidden transition-[max-height] duration-900 ease-in-out ${selectedFlightId === flight.Flight_Id ? "max-h-96" : "max-h-0"
                                                    }`}
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
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}