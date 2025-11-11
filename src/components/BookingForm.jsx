import React, { useState, useRef, useEffect } from 'react';
import Select, { components } from "react-select";
import clsx from 'clsx';
import { X, CirclePlus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Plane from '@/assets/vectors/Plane.svg';
import Bed from '@/assets/vectors/Bed.svg';
import Car from '@/assets/vectors/Car.svg';
import Mic from '@/assets/vectors/Mic.svg';
import FlyingPlane from '@/assets/vectors/FlyingPlane.svg';
import Person from '@/assets/vectors/Person.svg';
import RipSide from '@/assets/imgs/ripSide.webp';
import BookingFlightFormBg from "@/assets/imgs/bookingForm.webp";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

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


const CoachOptions = [
    { value: 0, label: "Economy" },
    { value: 3, label: "Premium Economy" },
    { value: 1, label: "Business" },
    { value: 2, label: "First Class" },
];


function BookingForm() {
    const navigate = useNavigate();

    const [startAnimation, setStartAnimation] = useState(false);

    const [flightSearchInfo, setFlightSearchInfo] = useState({
        from: null,
        to: null,
        depart: new Date(),
        return: null,
        coach: 0,
        traveller: 1
    });

    const [travellers, setTravellers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });

    const [tripType, setTripType] = useState('ONE_WAY');
    const [fareType, setFareType] = useState('regular');
    const [isSwapping, setIsSwapping] = useState(false);
    const [rotation, setRotation] = useState(0);

    const [departOpen, setDepartOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [departSelected, setDepartSelected] = useState(flightSearchInfo.depart);

    const [showTravellerBox, setShowTravellerBox] = useState(false);

    const departRef = useRef();
    const returnRef = useRef();
    const travellerBoxRef = useRef(null);

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
            const triggerPoint = 100;

            if (window.scrollY >= triggerPoint && !startAnimation) {
                setStartAnimation(true);
                window.removeEventListener('scroll', handleScroll); // stop listening
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
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

    const handleFlightInputChange = (field, value) => {
        setFlightSearchInfo(prev => {
            let updated = { ...prev, [field]: value };

            // Enforce logical consistency
            if (field === "depart" && updated.return && value && value > updated.return) {
                updated.return = null; // clear return if it’s before new depart
            }

            if (field === "return" && updated.depart && value && value < updated.depart) {
                updated.depart = null; // clear depart if it’s after new return (optional)
            }

            return updated;
        });
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

    const validateTravellers = () => {
        const { adults, children, infants } = travellers;

        const adultCount = adults === '>9' ? 9 : Number(adults);
        const childrenCount = children === '>6' ? 6 : Number(children);
        const infantsCount = infants === '>6' ? 6 : Number(infants);

        if (adultCount < 1) {
            alert('At least 1 adult is required for the booking.');
            return;
        }

        if (infantsCount > adultCount) {
            alert('Number of infants cannot exceed number of adults.');
            return;
        }

        const totalTravellers = adultCount + childrenCount + infantsCount;
        if (totalTravellers > 20) {
            alert('Maximum 20 travelers allowed.');
            return;
        }

        handleFlightInputChange('traveller', totalTravellers);
        setTravellers({ adults: adultCount, children: childrenCount, infants: infantsCount });
        setFlightSearchInfo(prev => ({
            ...prev,
            traveller: { adults: adultCount, children: childrenCount, infants: infantsCount }
        }));
        setShowTravellerBox(false);
    };

    const buildFlightDataFormat = () => {
        const TravelType = flightSearchInfo.to?.countryCode?.toUpperCase() !== 'IN' ? 1 : 0;
        const BookingType = tripType;
        let TravelDate = flightSearchInfo.depart
            ? (() => {
                const date = new Date(flightSearchInfo.depart);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            })()
            : null;

        return {
            Travel_Type: TravelType,
            Booking_Type: BookingType,
            TripInfo: [
                {
                    Origin: flightSearchInfo.from.airportCode,
                    Destination: flightSearchInfo.to.airportCode,
                    TravelDate,
                    Trip_Id: 0
                }
            ],
            Adult_Count: flightSearchInfo.traveller.adults,
            Child_Count: flightSearchInfo.traveller.children,
            Infant_Count: flightSearchInfo.traveller.infants,
            Class_Of_Travel: flightSearchInfo.coach,
            InventoryType: 0,
            Source_Type: 0,
            Filtered_Airline: [{ Airline_Code: "" }]
        };
    };

    const validateFlightInfoInputs = () => {
        const { from, to, depart, traveller, coach } = flightSearchInfo;

        if (!from) return alert('Please select origin');
        if (!to) return alert('Please select destination');
        if (!depart) return alert('Please select a departure date');
        if (!traveller) return alert('Please select travelers');
        if (coach === null || coach === undefined) return alert('Please select a travel class');

        return true;
    };

    const searchFlightResults = () => {
        if (!validateFlightInfoInputs()) return;

        // defer heavy computation
        setTimeout(() => {
            const dataformat = buildFlightDataFormat();

            // optional: log only small parts
            console.log({
                TravelDate: dataformat.TripInfo[0].TravelDate,
                Adults: dataformat.Adult_Count,
            });

            navigate('/flight-results');
        }, 0);
    };

    return (
        <div
            className="relative grid grid-cols-12 gap-4 sm:gap-6 md:gap-8 bg-no-repeat bg-cover bg-center rounded-[30px] md:rounded-[45px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ backgroundImage: `url(${BookingFlightFormBg})` }}
        >
            <img
                className="absolute -right-2 top-1/2 -translate-y-1/2 h-[77%] hidden lg:block"
                src={RipSide}
                alt="ribbon side"
            />

            <div className="col-span-12 p-4 sm:p-6 lg:pt-10 lg:pb-5 lg:px-10 ">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-black text-base sm:text-lg font-semibold">
                    <button className="secondary-font flex items-center space-x-1 bg-[#D9D9D9] rounded-md px-3 sm:px-4 py-1 cursor-pointer text-black border-2 border-black">
                        <img src={Plane} alt="plane" className="w-5 h-5" />
                        <span>Flights</span>
                    </button>
                    <button className="secondary-font flex items-center space-x-1 rounded-md px-3 sm:px-4 py-1 cursor-pointer border-2 border-transparent hover:bg-[#D9D9D9] hover:border-black">
                        <img src={Bed} alt="bed" className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span>Hotels</span>
                    </button>
                    <button className="secondary-font flex items-center space-x-1 rounded-md px-3 sm:px-4 py-1 cursor-pointer border-2 border-transparent hover:bg-[#D9D9D9] hover:border-black">
                        <img src={Car} alt="car" className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span>Cabs</span>
                    </button>

                    <button className="secondary-font flex items-center text-black font-medium cursor-pointer px-3 sm:px-4 py-2 border-2 border-transparent hover:text-gray-500 ml-auto mt-2 sm:mt-0">
                        <img src={Mic} alt="mic" className="w-5 h-5 mr-2" />
                        <span>Customer Support</span>
                    </button>
                </div>

                <div className='mb-3 grid grid-cols-12 gap-8 '> <div className="col-span-8 flex items-center relative right-[15px] sm:right-[40px]" >
                    <div className={`h-4 relative ribbon mr-2 ${startAnimation ? 'animate-ribbon' : ''}`}></div> <img src={FlyingPlane} alt="flyingplane" /> </div>
                </div>

                {/* Trip Type Selection */}
                <div className="filter-section flex flex-wrap gap-3 sm:gap-4 mb-4 text-base sm:text-lg secondary-font font-semibold">
                    {[
                        { key: 0, value: 'ONE_WAY', label: 'One Way' },
                        { key: 1, value: 'ROUND_TRIP', label: 'Round Trip' },
                        { key: 3, value: 'MULTI_CITY', label: 'Multi-City' },
                    ].map(({ key, value, label }) => (
                        <label key={key} className="flex items-center cursor-pointer">
                            <div className={clsx('secondary-font px-4 py-2 flex items-center rounded-md', tripType === value ? 'bg-black text-white' : 'text-black')}>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value={value}
                                    checked={tripType === value}
                                    onChange={(e) => setTripType(e.target.value)}
                                    className="w-4 h-4 mr-2"
                                />
                                <span>{label}</span>
                            </div>
                        </label>
                    ))}


                    <div className="relative secondary-font font-semibold w-full sm:w-auto">
                        <Select
                            options={CoachOptions}
                            value={CoachOptions.find(c => c.value === flightSearchInfo.coach) || null}
                            onChange={(option) => handleFlightInputChange("coach", option?.value ?? null)}
                            placeholder="Coach"
                            isSearchable
                            classNamePrefix="coach-select"
                            components={{ IndicatorSeparator: () => null }}
                            getOptionLabel={(option) => option.label}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: 'pointer',
                                    boxShadow: state.isFocused ? "0 0 0 1px #000" : "none",
                                    padding: "2px 4px",
                                    minHeight: "38px",
                                    color: "black",
                                    fontSize: '1.155rem',
                                    fontWeight: '600',
                                    fontFamily: "Poppins, sans-serif",
                                    "&:hover": { borderColor: "#000" },
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 50,
                                    width: "300px",
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#f3f4f6" : "transparent",
                                    color: "black",
                                    cursor: "pointer",
                                    padding: "8px 12px",
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: "black",
                                    fontSize: '1.155rem',
                                    fontWeight: '600',
                                    fontFamily: "Poppins, sans-serif",
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    color: "black",
                                    padding: 4,
                                    svg: {
                                        fontSize: "1.155rem",
                                        fontWeight: "600",
                                    },
                                }),

                            }}
                        />

                    </div>
                </div>

                {/* Flight Search Form */}
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid grid-cols-12 gap-4 sm:gap-6 items-end secondary-font font-semibold">

                        {/* From */}
                        <div className="col-span-12 sm:col-span-6 md:col-span-2">
                            <label className="block text-lg text-gray-700">From</label>
                            <Select
                                options={AirportOptions}
                                value={flightSearchInfo.from} // store full object
                                onChange={(option) => { handleFlightInputChange("from", option) }}
                                placeholder="Origin"
                                isSearchable
                                menuPlacement="top"
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
                                        color: "#525252",
                                        "&:hover": { borderColor: "#3b82f6" },
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused
                                            ? "#e5e7eb" // light gray on hover
                                            : "transparent", // keep selected option background transparent
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

                        {/* Swap */}
                        <div className="col-span-12 sm:col-span-1 flex justify-center">
                            <button
                                onClick={handleSwap}
                                className="p-2 cursor-pointer rounded-full transition-all duration-300"
                            >
                                <div
                                    className="relative w-6 h-6 transition-transform duration-500"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                    <svg className="absolute top-0 left-0 w-4 h-4 text-black transition-all duration-500" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translate(4px, -4px) rotate(90deg)' }}>
                                        <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                                    </svg>
                                    <svg className="absolute top-0 left-0 w-4 h-4 text-black transition-all duration-500" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translate(4px, 10px) rotate(-90deg)' }}>
                                        <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* To */}
                        <div className="col-span-12 sm:col-span-6 md:col-span-2">
                            <label className="block text-lg text-gray-700">To</label>
                            <Select
                                options={AirportOptions}
                                value={flightSearchInfo.to || null} // store full object
                                onChange={(option) => { handleFlightInputChange("to", option || null) }}
                                placeholder="Destination"
                                isSearchable
                                menuPlacement="top"
                                getOptionLabel={(option) => `${option.city} - ${option.airportName}`} // display format
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
                                        color: "#525252",
                                        "&:hover": { borderColor: "#3b82f6" },
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? "#e5e7eb" : "transparent", // remove blue for selected
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

                        {/* Depart */}
                        <div className="col-span-12 sm:col-span-6 md:col-span-2 mt-4 sm:mt-0 relative" ref={departRef}>
                            <label className="block text-lg text-gray-700 mb-2 flex items-center gap-2">
                                Depart
                            </label>

                            <input
                                type="text"
                                readOnly
                                value={departSelected ? format(departSelected, "PPP") : ""}
                                placeholder="Select Depart"
                                onClick={() => setDepartOpen(!departOpen)}
                                className="w-full text-xl text-[#525252] border-b focus:outline-none placeholder-[#808080] p-2 cursor-pointer"
                            />

                            {departOpen && (
                                <div className="absolute bottom-full mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
                                    <DayPicker
                                        mode="single"
                                        selected={departSelected}
                                        onSelect={handleDepartSelect}
                                        disabled={{ before: new Date(), after: flightSearchInfo.return || undefined }}
                                        numberOfMonths={2}
                                        captionLayout="dropdown-buttons"
                                        className="text-gray-800"
                                        classNames={{ months: "flex gap-4" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Return */}
                        <div className="col-span-12 sm:col-span-6 md:col-span-2 mt-4 sm:mt-0 relative" ref={returnRef}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-lg text-gray-700 flex items-center gap-2">Return</label>
                                {flightSearchInfo.return && (
                                    <div
                                        className="bg-[#0a223d] rounded-full w-4 h-4 flex justify-center items-center cursor-pointer hover:bg-[#12345a]"
                                        onClick={() => handleFlightInputChange("return", null)}
                                    >
                                        <X className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                readOnly
                                value={flightSearchInfo.return ? format(flightSearchInfo.return, "PPP") : ""}
                                placeholder="Select Return"
                                onClick={() => setReturnOpen(!returnOpen)}
                                className="w-full text-xl text-[#525252] border-b focus:outline-none placeholder-[#808080] p-2 cursor-pointer"
                            />

                            {returnOpen && (
                                <div className="absolute bottom-full mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
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

                        {/* Traveler */}
                        <div className="col-span-12 sm:col-span-6 md:col-span-2 mt-4 sm:mt-0 flex items-center relative">
                            <img src={Person} alt="traveler" className="w-6 h-6 mr-3" />
                            <div className="flex flex-col">
                                <label className="block text-lg text-gray-700 flex items-center gap-2">Traveler</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    value={flightSearchInfo.traveller !== 1 ? flightSearchInfo.traveller.adults + flightSearchInfo.traveller.children : 1}
                                    onFocus={() => setShowTravellerBox(true)}
                                    onChange={(e) => handleFlightInputChange('traveller', Number(e.target.value))}
                                    className="w-16 text-xl border text-[#525252] border-gray-400 rounded-md text-center focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none[appearance:textfield]"
                                />
                            </div>

                            {showTravellerBox && (
                                <div
                                    ref={travellerBoxRef}
                                    className="absolute bottom-15 right-0 z-50 mt-2 w-[45rem] bg-white rounded-md shadow-lg px-6 py-5 space-y-6 text-black"
                                >
                                    {/* Adults */}
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-800 text-base">
                                            ADULTS (12y+) <br /> <span className="text-sm font-medium">on the day of travel</span>
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex border rounded-md overflow-hidden">
                                                {Array.from({ length: 9 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setTravellers((t) => ({ ...t, adults: i + 1 }))}
                                                        className={`px-3 py-2 text-sm cursor-pointer border-r last:border-r-0 ${travellers.adults === i + 1 ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                            <div
                                                onClick={() => setTravellers((t) => ({ ...t, adults: '>9' }))}
                                                className={`px-4 py-2 text-sm cursor-pointer border rounded-md ${travellers.adults === '>9' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                &gt;9
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children & Infants */}
                                    <div className="flex justify-between items-start gap-6">
                                        {/* Children */}
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-gray-800 text-base">
                                                CHILDREN (2y - 12y) <br /> <span className="text-sm font-medium">on the day of travel</span>
                                            </p>
                                            <div className="flex justify-between items-start mt-2">
                                                <div className="flex border rounded-md overflow-hidden">
                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => setTravellers((t) => ({ ...t, children: i }))}
                                                            className={`px-3 py-2 text-sm cursor-pointer border-r last:border-r-0 ${travellers.children === i ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {i}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    onClick={() => setTravellers((t) => ({ ...t, children: '>6' }))}
                                                    className={`ml-4 px-4 py-2 text-sm cursor-pointer border rounded-md ${travellers.children === '>6' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    &gt;6
                                                </div>
                                            </div>
                                        </div>

                                        {/* Infants */}
                                        <div className="flex flex-col items-start">
                                            <p className="font-semibold text-gray-800 text-base">
                                                INFANTS (below 2y) <br /> <span className="text-sm font-medium">on the day of travel</span>
                                            </p>
                                            <div className="flex justify-between items-start mt-2">
                                                <div className="mr-4 flex border rounded-md overflow-hidden">
                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => setTravellers((t) => ({ ...t, infants: i }))}
                                                            className={`px-3 py-2 text-sm cursor-pointer border-r last:border-r-0 ${travellers.infants === i ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {i}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    onClick={() => setTravellers((t) => ({ ...t, infants: '>6' }))}
                                                    className={`px-4 py-2 text-sm cursor-pointer border rounded-md ${travellers.infants === '>6' ? 'bg-[#78080B] text-white' : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    &gt;6
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Done Button */}
                                    <div
                                        onClick={validateTravellers}
                                        className="cursor-pointer col-span-12 sm:col-span-2 flex justify-center bg-[#78080B] rounded-sm p-1"
                                    >
                                        <button className="btn">
                                            <span className="cursor-pointer button-text text-white secondary-font">D O N E</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="col-span-12 sm:col-span-1 flex justify-center mt-4 sm:mt-0">
                            <button className="cursor-pointer bg-black hover:bg-gray-800 text-white p-4 rounded-xl transition flex items-center justify-center" onClick={() => { searchFlightResults() }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="fare-filter-section pt-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start w-full sm:w-auto">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="fareType" value="regular" checked={fareType === 'regular'} onChange={(e) => setFareType(e.target.value)} className="w-4 h-4 cursor-pointer" />
                            <span className="text-gray-700">Regular Fare</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="fareType" value="student" checked={fareType === 'student'} onChange={(e) => setFareType(e.target.value)} className="w-4 h-4 cursor-pointer" />
                            <span className="text-gray-700">Student Fare</span>
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end w-full sm:w-auto">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-black hover:border-black border-b border-b-2 pb-1 border-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">My Booking</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-black">
                            <CirclePlus className="w-4 h-4" />
                            <span className="text-sm">Flight Status</span>
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default BookingForm;
