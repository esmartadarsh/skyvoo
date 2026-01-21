import React, { useEffect, useRef, useState } from 'react'
import Select, { components } from "react-select";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { X, Search } from 'lucide-react';

const AirportOptions = [
    {
        airportCode: "BOM",
        airportName: "Chhatrapati Shivaji International Airport",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "DEL",
        airportName: "Indira Gandhi International Airport",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "IATA",
        airportName: "Safdarjung Airport",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "HDO",
        airportName: "Hindon Airport",
        city: "Ghaziabad",
        state: "Delhi",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "BLR",
        airportName: "Kempegowda International Airport",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "MAA",
        airportName: "Chennai International Airport",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "CCU",
        airportName: "Netaji Subhas Chandra Bose International Airport",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "PQQ",
        airportName: "Lune Airport",
        city: "Tune",
        state: "Unknown",
        country: "India",
        countryCode: "IN"
    },
    {
        airportCode: "BKK",
        airportName: "Suvarnabhumi Airport",
        city: "Bangkok",
        state: "Bangkok",
        country: "Thailand",
        countryCode: "TH"
    },
    {
        airportCode: "LHR",
        airportName: "Heathrow Airport",
        city: "London",
        state: "England",
        country: "United Kingdom",
        countryCode: "GB"
    },
    {
        airportCode: "JFK",
        airportName: "John F. Kennedy International Airport",
        city: "New York",
        state: "New York",
        country: "USA",
        countryCode: "US"
    },
    {
        airportCode: "CDG",
        airportName: "Charles de Gaulle Airport",
        city: "Paris",
        state: "Île-de-France",
        country: "France",
        countryCode: "FR"
    },
    {
        airportCode: "DXB",
        airportName: "Dubai International Airport",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        countryCode: "AE"
    },
    {
        airportCode: "SYD",
        airportName: "Sydney Kingsford Smith Airport",
        city: "Sydney",
        state: "New South Wales",
        country: "Australia",
        countryCode: "AU"
    },
    {
        airportCode: "HND",
        airportName: "Tokyo Haneda Airport",
        city: "Tokyo",
        state: "Tokyo",
        country: "Japan",
        countryCode: "JP"
    },
    {
        airportCode: "FRA",
        airportName: "Frankfurt am Main Airport",
        city: "Frankfurt",
        state: "Hesse",
        country: "Germany",
        countryCode: "DE"
    },
    {
        airportCode: "SIN",
        airportName: "Changi Airport",
        city: "Singapore",
        state: "Singapore",
        country: "Singapore",
        countryCode: "SG"
    }
];

function FlightResultsSearchHeaderMobile({ open, onClose }) {


    const [flightSearchInfo, setFlightSearchInfo] = useState({
        from: '',
        to: '',
        depart: null,
        return: null,
        traveller: 1,
    });

    const [isSwapping, setIsSwapping] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [tripType, setTripType] = useState('roundTrip');
    const [showTravellerBox, setShowTravellerBox] = useState(false);


    const [departSelected, setDepartSelected] = useState(flightSearchInfo.depart);

    const [departOpen, setDepartOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);

    const [fareTypeHeight, setFareTypeHeight] = useState(0);

    const fareTypeRef = useRef(null);
    const contentRef = useRef(null);
    const departRef = useRef();
    const returnRef = useRef();

    const travellerBoxRef = useRef(null);

    const [travellers, setTravellers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        classType: 'Economy/Premium Economy',
    });


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

    const handleFlightInputChange = (field, value) => {
        setFlightSearchInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleDepartSelect = (date) => {
        setDepartSelected(date);
        handleFlightInputChange("depart", date);

        // Auto-close and adjust Return if needed
        if (flightSearchInfo.return && date > flightSearchInfo.return) {
            handleFlightInputChange("return", null);
        }
        setDepartOpen(false);
    };

    const handleReturnSelect = (date) => {
        handleFlightInputChange("return", date);
        setReturnOpen(false);
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
        const handleClickOutside = (e) => {
            if (departRef.current && !departRef.current.contains(e.target)) {
                setDepartOpen(false);
            }
            if (returnRef.current && !returnRef.current.contains(e.target)) {
                setReturnOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const CustomOption = (props) => (
        <components.Option {...props}>
            <div className="flex justify-between w-full">
                <div className="flex flex-col">
                    <span className="text-gray-900">{props.data.city}, {props.data.country}</span>
                    <span className="text-gray-400 text-sm">{props.data.airportName}</span>
                </div>
                <span className="font-medium text-gray-700">{props.data.airportCode}</span>
            </div>
        </components.Option>
    );

    const handleSwap = () => {
        setRotation(prevRotation => prevRotation + 180);
        setIsSwapping(prev => !prev);

        setFlightSearchInfo(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from,
        }));
    };


    return (
        <>
            <div className={`fixed inset-0 z-[9999] transition-all  duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'} `} >
                {/* Background Blur */}
                <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Sliding Panel */}
                <div
                    className={` absolute top-0 left-0 right-0 bg-[#78080B] text-white transform transition-transform duration-300 max-h-[80vh] overflow-hidden ${open ? 'translate-y-0' : '-translate-y-full'} `}>
                    <div className="max-h-[80vh] overflow-y-auto overscroll-contain touch-pan-y">
                        <div className="flex items-center justify-between px-4 py-3">

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="p-2 -ml-2 rounded-full active:scale-95 transition"
                                aria-label="Close modify search"
                            >
                                <X size={20} />
                            </button>

                            {/* Title */}
                            <h2 className="text-sm font-semibold tracking-wide">
                                Modify Flight Search
                            </h2>

                            {/* Spacer to balance layout */}
                            <div className="w-8" />
                        </div>


                        <div className="flex gap-2 px-4 pb-2">
                            {['oneWay', 'roundTrip', 'multiCity'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setTripType(type)}
                                    className={` flex-1 py-2 rounded-full text-sm font-semibold ${tripType === type ? 'bg-white text-[#78080B]' : 'bg-white/20 text-white'}`}>
                                    {type === 'oneWay' && 'One Way'}
                                    {type === 'roundTrip' && 'Round Trip'}
                                    {type === 'multiCity' && 'Multi City'}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-5 gap-2 px-4">
                            {/* From */}
                            <div className="col-span-2">
                                <label className="block text-lg text-white">From</label>
                                <Select
                                    options={AirportOptions}
                                    value={flightSearchInfo.from} // store full object
                                    onChange={(option) => { handleFlightInputChange("from", option) }}
                                    placeholder="Origin"
                                    isSearchable
                                    menuPlacement="bottom"
                                    getOptionLabel={(option) => `${option.city} - ${option.airportName}`}
                                    components={{
                                        Option: CustomOption,
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                    }}
                                    filterOption={(option, inputValue) => {
                                        const { airportCode, airportName, city, state, country, countryCode } = option.data;
                                        const search = inputValue.toLowerCase();
                                        return (
                                            airportCode.toLowerCase().includes(search) ||
                                            airportName.toLowerCase().includes(search) ||
                                            city.toLowerCase().includes(search) ||
                                            state.toLowerCase().includes(search) ||
                                            country.toLowerCase().includes(search) ||
                                            countryCode.toLowerCase().includes(search)
                                        );
                                    }}
                                    classNamePrefix="flight-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            backgroundColor: "transparent",
                                            border: "none",
                                            borderBottom: "1px solid",
                                            borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
                                            borderRadius: 0,
                                            boxShadow: "none",
                                            padding: "2px 0",
                                            fontSize: "1.25rem",
                                            color: "#ffffffff",
                                            cursor: "pointer",
                                            "&:hover": { borderColor: "#ffffff" },
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#ffffff", // 👈 white placeholder text
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? "#e5e7eb" : "transparent",
                                            color: "#111827",
                                            cursor: "pointer",
                                            "&:active": { backgroundColor: "#d1d5db" },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            zIndex: 50,
                                            width: "400px",
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            padding: 0,
                                        }),
                                    }}
                                />

                            </div>

                            {/* Swap - Hidden on mobile */}
                            <div className="flex col-span-1 justify-center my-2 sm:my-0">
                                <button
                                    type="button"
                                    onClick={handleSwap}
                                    aria-label="Swap origin and destination"
                                    className={`p-2 rounded-full transition-transform duration-300`}
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
                            <div className="col-span-2">
                                <label className="block text-lg text-white">To</label>
                                <Select
                                    options={AirportOptions}
                                    value={flightSearchInfo.to || null}
                                    onChange={(option) => { handleFlightInputChange("to", option || null) }}
                                    placeholder="Destination"
                                    isSearchable
                                    menuPlacement="bottom"
                                    getOptionLabel={(option) => `${option.city} - ${option.airportName}`}
                                    components={{
                                        Option: CustomOption,
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                    }}
                                    filterOption={(option, inputValue) => {
                                        const { airportCode, airportName, city, state, country, countryCode } = option.data;
                                        const search = inputValue.toLowerCase();
                                        return (
                                            airportCode.toLowerCase().includes(search) ||
                                            airportName.toLowerCase().includes(search) ||
                                            city.toLowerCase().includes(search) ||
                                            state.toLowerCase().includes(search) ||
                                            country.toLowerCase().includes(search) ||
                                            countryCode.toLowerCase().includes(search)
                                        );
                                    }}
                                    classNamePrefix="flight-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            backgroundColor: "transparent",
                                            border: "none",
                                            borderBottom: "1px solid",
                                            borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
                                            borderRadius: 0,
                                            boxShadow: "none",
                                            padding: "2px 0",
                                            cursor: "pointer",
                                            fontSize: "1.25rem",
                                            color: "#ffffffff",
                                            "&:hover": { borderColor: "#ffffff" },
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#ffffff", // 👈 white placeholder 
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? "#e5e7eb" : "transparent",
                                            color: "#2066ffff",
                                            cursor: "pointer",
                                            "&:active": { backgroundColor: "#d1d5db" },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            zIndex: 50,
                                            width: "400px",
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            padding: 0,
                                        }),
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 px-4 mt-4">
                            {/* Depart */}
                            <div className="col-span-1 relative" ref={departRef}>
                                <label className="block text-lg text-white mb-1 flex items-center gap-2">
                                    Depart
                                </label>

                                <input
                                    type="text"
                                    readOnly
                                    value={departSelected ? format(departSelected, "PPP") : ""}
                                    placeholder="Select Depart"
                                    onClick={() => { setDepartOpen(prev => !prev); }}
                                    className="w-full text-xl text-white border-b border-white focus:outline-none placeholder-white p-2 cursor-pointer"
                                />

                                {departOpen && (
                                    <div className="absolute top-full mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
                                        <DayPicker
                                            mode="single"
                                            selected={departSelected}
                                            onSelect={handleDepartSelect}
                                            disabled={{ before: new Date(), after: flightSearchInfo.return || undefined }}
                                            numberOfMonths={2}
                                            captionLayout="dropdown-buttons"
                                            className="text-gray-800"
                                            classNames={{ months: "flex gap-4" }}
                                            menu
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Return (conditionally rendered) */}
                            {tripType === 'roundTrip' && (
                                <div className="col-span-1 relative" ref={returnRef}>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-lg text-white flex items-center gap-2">Return</label>
                                        {flightSearchInfo.return && (
                                            <div
                                                className="bg-[#0a223d] rounded-full w-4 h-4 flex justify-center items-center cursor-pointer hover:bg-[#12345a]"
                                                onClick={() => { handleFlightInputChange("return", null); }}>
                                                <X className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        readOnly
                                        value={flightSearchInfo.return ? format(flightSearchInfo.return, "PPP") : ""}
                                        placeholder="Select Return"
                                        onClick={() => { setReturnOpen(prev => !prev) }}
                                        className="w-full text-xl text-white border-b border-white focus:outline-none placeholder-white p-2 cursor-pointer"
                                    />

                                    {returnOpen && (
                                        <div className="absolute top-full mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
                                            <DayPicker
                                                mode="single"
                                                selected={flightSearchInfo.return}
                                                onSelect={handleReturnSelect}
                                                disabled={{ before: departSelected || new Date() }}
                                                numberOfMonths={2}
                                                captionLayout="dropdown-buttons"
                                                className="text-gray-800"
                                                classNames={{ months: "flex gap-4" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>

                        <div className="px-4 mt-4">
                            {/* Traveler */}
                            <div className="col-span-2 relative">
                                <label className="block text-sm sm:text-base mb-2">Travelers & Class</label>
                                <div
                                    onClick={() => { setShowTravellerBox(prev => !prev) }}
                                    className={`border-b border-white text-white font-medium text-base sm:text-lg flex justify-between items-center`}>

                                    <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis p-2">
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

                                {showTravellerBox && (
                                    <div
                                        className="absolute left-0 right-0 lg:right-0 lg:left-auto z-999 mt-2 w-full lg:w-[45rem] bg-white rounded-md shadow-lg px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6 text-black overflow-hidden transition-all duration-500"
                                        style={{ height: showTravellerBox ? `${travellerBoxRef.current?.scrollHeight}px` : '0px' }}
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
                                                <span className="cursor-pointer button-text text-white  text-sm sm:text-base">D O N E</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-4 mt-4 space-y-2">
                            {/* Fare Type */}
                            <div
                                className="filter-section max-w-7xl mx-auto mt-4 font-medium overflow-hidden transition-all duration-500"
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

                        <div className="p-4">
                            <button
                                onClick={() => {
                                    // trigger search
                                    onClose();
                                }}
                                className="w-full bg-white text-[#78080B] py-3 rounded-xl font-bold"
                            >
                                SEARCH FLIGHTS

                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </>

    )
}

export default FlightResultsSearchHeaderMobile