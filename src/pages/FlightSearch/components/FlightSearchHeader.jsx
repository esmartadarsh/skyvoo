import React, { useEffect, useRef, useState } from "react";
import Select, { components } from "react-select";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, parse, isValid } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { fetchAirportsByCode } from "@/services/airportsSearch.js";
import { useNavigate, useSearchParams } from "react-router-dom";

const CoachOptions = [
  { value: 0, label: "Economy" },
  { value: 1, label: "First Class" },
  { value: 2, label: "Business" },
  // { value: 3, label: "Premium Economy" },
];

function FlightSearchHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("returnDate"), "---search params---")

  const [flightSearchInfo, setFlightSearchInfo] = useState({
    from: null,
    to: null,
    depart: new Date(),
    return: null,
    coach: 0,
    traveller: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [tripType, setTripType] = useState("");
  const [fareType, setFareType] = useState('regular');
  console.log(tripType, "--fetch trip type--")

  const [showTravellerBox, setShowTravellerBox] = useState(false);

  const [departSelected, setDepartSelected] = useState(flightSearchInfo.depart);

  const [departOpen, setDepartOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const [debouncedFrom, setDebouncedFrom] = useState("");
  const [debouncedTo, setDebouncedTo] = useState("");

  const [fareTypeHeight, setFareTypeHeight] = useState(0);

  const fareTypeRef = useRef(null);
  const contentRef = useRef(null);
  const departRef = useRef();
  const returnRef = useRef();

  const travellerBoxRef = useRef(null);

  const handleModifySearch = () => setIsEditable(true);

  const [travellers, setTravellers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // ── Hydrate from URL params on mount ──────────────────────────────────────
  useEffect(() => {
    const originCode = searchParams.get("origin");
    const destinationCode = searchParams.get("destination");
    const departDateStr = searchParams.get("departDate"); // MM/DD/YYYY
    const returnDateStr = searchParams.get("returnDate"); // MM/DD/YYYY or ""
    const adults = Number(searchParams.get("adults") || 1);
    const children = Number(searchParams.get("children") || 0);
    const infants = Number(searchParams.get("infants") || 0);
    const cabinClass = Number(searchParams.get("cabinClass") || 0);
    const bookingType = Number(searchParams.get("bookingType") || 0);

    // Trip type: bookingType 1 = round trip, 0 = one-way
    setTripType(bookingType === 1 ? "ROUND_TRIP" : "ONE_WAY");

    // if (returnDateStr) {
    //   setTripType(1)
    // }


    // Travellers
    setTravellers({ adults, children, infants });

    // Depart date
    let departDate = new Date();
    if (departDateStr) {
      try {
        const parsed = parse(departDateStr, "MM/dd/yyyy", new Date());
        if (isValid(parsed)) departDate = parsed;
      } catch (_) {
        /* keep today */
      }
    }
    setDepartSelected(departDate);

    // Return date
    let returnDate = null;
    if (returnDateStr) {
      try {
        const parsed = parse(returnDateStr, "MM/dd/yyyy", new Date());
        if (isValid(parsed)) returnDate = parsed;
      } catch (_) {
        /* no return */
      }
    }

    setFlightSearchInfo((prev) => ({
      ...prev,
      coach: cabinClass,
      depart: departDate,
      return: returnDate,
    }));

    // Fetch airport objects for origin & destination
    const resolveAirport = async (code) => {
      if (!code) return null;
      try {
        const results = await fetchAirportsByCode(code);
        return results?.[0] ?? null;
      } catch (_) {
        return null;
      }
    };

    Promise.all([
      resolveAirport(originCode),
      resolveAirport(destinationCode),
    ]).then(([fromAirport, toAirport]) => {
      setFlightSearchInfo((prev) => ({
        ...prev,
        from: fromAirport,
        to: toAirport,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const {
    data: fromAirportOptions = [],
    isLoading: fromLoading,
    isError: fromError,
  } = useQuery({
    queryKey: ["airportlistcodes-from", debouncedFrom],
    queryFn: ({ signal }) => fetchAirportsByCode(debouncedFrom, signal),
    enabled: debouncedFrom?.trim().length >= 1,
  });

  const {
    data: toAirportOptions = [],
    isLoading: toLoading,
    isError: toError,
  } = useQuery({
    queryKey: ["airportlistcodes-to", debouncedTo],
    queryFn: ({ signal }) => fetchAirportsByCode(debouncedTo, signal),
    enabled: debouncedTo?.trim().length >= 1,
  });

  const validateTravellers = () => {
    // Interpret '>9' as 10, '>6' as 7 for validation and totals
    setShowTravellerBox(!showTravellerBox);
    const adultsVal = travellers.adults === ">9" ? 10 : travellers.adults;
    const childrenVal = travellers.children === ">6" ? 7 : travellers.children;
    const infantsVal = travellers.infants === ">6" ? 7 : travellers.infants;

    // 1️⃣ At least one adult
    if (adultsVal < 1) {
      alert("Please select at least one adult.");
      return false;
    }

    // 2️⃣ Infants cannot exceed adults
    if (infantsVal > adultsVal) {
      alert("Infants cannot exceed the number of adults.");
      return false;
    }

    // 3️⃣ Optional overall cap (adjust if needed)
    const total = adultsVal + childrenVal + infantsVal;
    if (total > 20) {
      alert("Total passengers cannot exceed 20.");
      return false;
    }

    return true;
  };

  const handleFlightInputChange = (field, value) => {
    setFlightSearchInfo((prev) => ({ ...prev, [field]: value }));
    if (field == "return") {
      if (value) {
        setTripType("ROUND_TRIP")
      } else {
        setTripType("ONE_WAY")

      }

    }
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

  const CustomOption = (props) => (
    <components.Option {...props}>
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="text-gray-900">
            {props.data.city}, {props.data.country}
          </span>
          <span className="text-gray-400 text-sm">
            {props.data.airportName}
          </span>
        </div>
        <span className="font-medium text-gray-700">
          {props.data.airportCode}
        </span>
      </div>
    </components.Option>
  );

  const handleSwap = () => {
    setRotation((prevRotation) => prevRotation + 180);
    setIsSwapping((prev) => !prev);

    setFlightSearchInfo((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const buildFlightDataFormat = () => {
    if (!flightSearchInfo.from || !flightSearchInfo.to) return;

    const isInternational = flightSearchInfo.from?.countryCode !== flightSearchInfo.to?.countryCode;

    const formatDate = (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const tripInfo = [
      {
        Origin: flightSearchInfo.from.airportCode,
        Destination: flightSearchInfo.to.airportCode,
        TravelDate: formatDate(flightSearchInfo.depart),
        Trip_Id: 0,
      },
    ];

    if (tripType === "ROUND_TRIP" && flightSearchInfo.return) {
      tripInfo.push({
        Origin: flightSearchInfo.to.airportCode,
        Destination: flightSearchInfo.from.airportCode,
        TravelDate: formatDate(flightSearchInfo.return),
        Trip_Id: 1,
      });
    }

    return {
      TripInfo: tripInfo,
      TravelType: isInternational ? 1 : 0,
      BookingType: tripType === "ROUND_TRIP" ? 1 : 0,
      CabinClass: flightSearchInfo.coach,
      AdultCount: travellers.adults,
      ChildCount: travellers.children,
      InfantCount: travellers.infants,
      SrCitizenSearch: false,
      StudentFareSearch: fareType === "student",
      Filtered_Airline: [{ Airline_Code: "" }],
    };
  };

  const validateFlightInfoInputs = () => {
    const { from, to, depart, traveller, coach } = flightSearchInfo;

    if (!from) return alert('Please select origin');
    if (!to) return alert('Please select destination');

    if (from?.airportCode === to?.airportCode) {
      return alert('Origin and destination cannot be same');
    }

    if (!depart) return alert('Please select a departure date');

    if (tripType === 'ROUND_TRIP' && !flightSearchInfo.return) {
      return alert('Please select a return date for the round trip.');
    }

    if (!traveller) return alert('Please select travelers');
    if (coach === null || coach === undefined) return alert('Please select a travel class');

    return true;
  };

  const searchFlightSearch = () => {
    if (!validateFlightInfoInputs()) return;

    const payload = buildFlightDataFormat();

    if (!payload) return;

    const params = new URLSearchParams({
      origin: payload.TripInfo[0].Origin,
      destination: payload.TripInfo[0].Destination,
      departDate: payload.TripInfo[0].TravelDate,
      returnDate: payload.TripInfo[1]?.TravelDate || "",

      adults: String(payload.AdultCount),
      children: String(payload.ChildCount),
      infants: String(payload.InfantCount),

      cabinClass: String(payload.CabinClass),
      travelType: String(payload.TravelType),
      bookingType: String(payload.BookingType),

      srCitizenSearch: String(payload.SrCitizenSearch),
      studentFareSearch: String(payload.StudentFareSearch),
    });

    navigate(`/flight-results?${params.toString()}`);
  };

  const handleSearchButtonClick = () => {
    if (!isEditable) {
      handleModifySearch();
    } else {
      searchFlightSearch();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFrom(fromSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [fromSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTo(toSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [toSearch]);

  useEffect(() => {
    function handleDocClick(e) {
      if (
        travellerBoxRef.current &&
        !travellerBoxRef.current.contains(e.target)
      ) {
        setShowTravellerBox(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setShowTravellerBox(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (isEditable && contentRef.current) {
      setFareTypeHeight(contentRef.current.scrollHeight);
    } else {
      setFareTypeHeight(0);
    }
  }, [isEditable]);

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
    const toNumber = (v) => {
      if (typeof v === "string" && v.startsWith(">")) {
        return parseInt(v.slice(1), 10) + 1;
      }
      return Number(v);
    };

    const total =
      toNumber(travellers.adults) +
      toNumber(travellers.children) +
      toNumber(travellers.infants);

    setFlightSearchInfo((prev) => ({
      ...prev,
      traveller: total,
    }));
  }, [travellers]);

  return (
    <div
      className="relative bg-[#78080B] text-white px-2 sm:px-4 py-3 sm:py-5 z-999 mb-4"
      style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Main Search Grid */}
        <div className="w-full grid grid-cols-15 gap-3 items-end  font-semibold">
          {/* Trip Type */}
          <div className="col-span-1 col-span-2">
            <label className="block text-xs sm:text-sm text-white">
              Trip Type
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full p-2 bg-transparent font-medium text-sm sm:text-base border-b border-white text-white placeholder-white focus:outline-none"
              disabled={!isEditable}
            >
              <option value="ONE_WAY" className="text-black font-medium">
                One Way
              </option>
              <option value="ROUND_TRIP" className="text-black font-medium">
                Round Trip
              </option>
              {/* <option value="multiCity" className='text-black font-medium'>Multi City</option> */}
            </select>
          </div>

          {tripType === "multiCity" ? (
            <div className="col-span-11 flex flex-col items-start">
              <label className="block text-xs sm:text-sm text-white ">
                From (Multi City)
              </label>
              <input
                type="text"
                placeholder="Enter multiple destinations"
                value={flightSearchInfo.from}
                onChange={(e) =>
                  handleFlightInputChange("from", e.target.value)
                }
                className="w-full bg-transparent font-medium text-sm sm:text-base border-b border-white text-white placeholder-white focus:outline-none"
              />
            </div>
          ) : (
            <>
              {/* From */}
              <div className="col-span-2">
                <label className="block text-xs sm:text-sm text-white">
                  From
                </label>
                <Select
                  options={fromAirportOptions}
                  isLoading={fromLoading}
                  loadingMessage={() => (
                    <div className="flex justify-center py-3">
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  noOptionsMessage={() =>
                    debouncedFrom.length === 0 ? null : "No airports found"
                  }
                  onInputChange={(value, { action }) => {
                    if (action === "input-change") {
                      setFromSearch(value);
                    }
                  }}
                  value={flightSearchInfo.from}
                  onChange={(option) => {
                    handleFlightInputChange("from", option);
                  }}
                  placeholder="Origin"
                  isDisabled={!isEditable}
                  isSearchable
                  filterOption={null}
                  menuPlacement="bottom"
                  getOptionLabel={(option) =>
                    `${option.city} - ${option.airportName}`
                  }
                  getOptionValue={(option) => option.airportCode}
                  components={{
                    Option: CustomOption,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    LoadingIndicator: () => null,
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
                      fontSize: "1.10rem",
                      color: "white",
                      "&:hover": { borderColor: "#ffffff" },
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "#e5e7eb"
                        : "transparent",
                      color: "#2066ff",
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
                  disabled={!isEditable}
                  aria-label="Swap origin and destination"
                  className={`${isEditable ? "!cursor-pointer" : "!cursor-default"} p-2 rounded-full transition-transform duration-300`}
                >
                  <div
                    className="relative w-6 h-6 transition-transform duration-500"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <svg
                      className="absolute top-0 left-0 w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ transform: "translate(4px,-4px) rotate(90deg)" }}
                    >
                      <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                    </svg>
                    <svg
                      className="absolute top-0 left-0 w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{
                        transform: "translate(4px,10px) rotate(-90deg)",
                      }}
                    >
                      <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.526V18l-2 3h6l-2-3v-4.316L22 16.21z" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* To */}
              <div className="col-span-2">
                <label className="block text-xs sm:text-sm text-white">
                  To
                </label>
                <Select
                  options={toAirportOptions}
                  onInputChange={(value, { action }) => {
                    if (action === "input-change") {
                      setToSearch(value);
                    }
                  }}
                  isLoading={toLoading}
                  loadingMessage={() => (
                    <div className="flex justify-center py-3">
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  value={flightSearchInfo.to}
                  onChange={(option) => {
                    handleFlightInputChange("to", option);
                  }}
                  isDisabled={!isEditable}
                  placeholder="Destination"
                  isSearchable
                  filterOption={null}
                  menuPlacement="bottom"
                  getOptionLabel={(option) =>
                    `${option.city} - ${option.airportName}`
                  }
                  getOptionValue={(option) => option.airportCode}
                  components={{
                    Option: CustomOption,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    LoadingIndicator: () => null,
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
                      fontSize: "1.10rem",
                      color: "white",
                      "&:hover": { borderColor: "#ffffff" },
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "#e5e7eb"
                        : "transparent",
                      color: "#2066ff",
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
              <div className="col-span-2 relative" ref={departRef}>
                <label className="block text-xs sm:text-sm text-white flex items-center gap-2">
                  Depart
                </label>

                <input
                  type="text"
                  readOnly
                  value={departSelected ? format(departSelected, "PPP") : ""}
                  placeholder="Select Depart"
                  onClick={() => {
                    if (!isEditable) return;
                    setDepartOpen((prev) => !prev);
                  }}
                  className={`w-full text-lg text-white border-b border-white focus:outline-none placeholder-white p-2 ${isEditable ? "cursor-pointer" : "cursor-default"}`}
                  disabled={!isEditable}
                />

                {departOpen && (
                  <div className="absolute top-full mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
                    <DayPicker
                      mode="single"
                      selected={departSelected}
                      onSelect={handleDepartSelect}
                      disabled={{
                        before: new Date(),
                        after: flightSearchInfo.return || undefined,
                      }}
                      numberOfMonths={2}
                      captionLayout="dropdown-buttons"
                      className="text-gray-800"
                      classNames={{ months: "flex gap-4" }}
                      menu
                    />
                  </div>
                )}
              </div>

              {/* Return — always visible; × clears value only */}
              <div className="col-span-2 relative" ref={returnRef}>
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm text-white flex items-center gap-2">
                    Return
                  </label>
                  {flightSearchInfo.return && (
                    <div
                      className="bg-[#0a223d] rounded-full w-4 h-4 flex justify-center items-center cursor-pointer hover:bg-[#12345a]"
                      onClick={() => {
                        if (!isEditable) return;
                        handleFlightInputChange("return", null);
                      }}
                    >
                      <X className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  readOnly
                  value={
                    flightSearchInfo.return
                      ? format(flightSearchInfo.return, "PPP")
                      : ""
                  }
                  placeholder="Select Return"
                  onClick={() => {
                    if (!isEditable) return;
                    setReturnOpen((prev) => !prev);
                  }}
                  className={`w-full text-lg text-white border-b border-white focus:outline-none placeholder-white p-2 ${isEditable ? "cursor-pointer" : "cursor-default"}`}
                  disabled={!isEditable}
                />

                {returnOpen && (
                  <div className="absolute top-full -left-15 mb-2 bg-white p-4 rounded-2xl shadow-lg z-50">
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
              <div className="col-span-2 relative">
                <label className="block text-xs sm:text-sm">
                  Travelers & Class
                </label>
                <div
                  onClick={() => {
                    if (!isEditable) return;
                    setShowTravellerBox((prev) => !prev);
                  }}
                  className={`border-b border-white text-white font-medium text-base sm:text-lg flex justify-between items-center  ${isEditable ? "cursor-pointer" : ""}`}
                >
                  <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis p-2">
                    {(() => {
                      const toNumber = (v) => {
                        if (typeof v === "string" && v.startsWith(">")) {
                          const parsed = parseInt(v.slice(1), 10);
                          return Number.isNaN(parsed) ? 0 : parsed;
                        }
                        const n = Number(v);
                        return Number.isNaN(n) ? 0 : n;
                      };
                      const totalTravellers = [
                        travellers.adults,
                        travellers.children,
                        travellers.infants,
                      ].reduce((acc, v) => acc + toNumber(v), 0);
                      const coachLabel =
                        CoachOptions.find(
                          (o) => o.value === flightSearchInfo.coach,
                        )?.label ?? "Economy";
                      return `${totalTravellers} Traveller${totalTravellers > 1 ? "s" : ""} • ${coachLabel}`;
                    })()}
                  </span>
                </div>

                {isEditable && showTravellerBox && (
                  <div
                    className="absolute left-0 right-0 lg:right-0 lg:left-auto z-999 mt-2 w-full lg:w-[45rem] bg-white rounded-md shadow-lg px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6 text-black overflow-hidden transition-all duration-500"
                    // style={{ height: isEditable && showTravellerBox ? `${travellerBoxRef.current?.scrollHeight}px` : '0px' }}
                    style={{ height: showTravellerBox ? "auto" : "0px" }}
                    ref={travellerBoxRef}
                  >
                    {/* Adults Section */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        ADULTS (12y+) <br />{" "}
                        <span className="text-xs sm:text-sm font-medium">
                          {" "}
                          on the day of travel{" "}
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                        <div className="flex border rounded-md overflow-hidden flex-wrap">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() =>
                                setTravellers((t) => ({ ...t, adults: i + 1 }))
                              }
                              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                        ${travellers.adults === i + 1 ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <div
                          onClick={() =>
                            setTravellers((t) => ({ ...t, adults: ">9" }))
                          }
                          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md
                                                ${travellers.adults === ">9" ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
                        >
                          &gt;9
                        </div>
                      </div>
                    </div>

                    {/* Children & Infants */}
                    <div className="flex flex-col">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                        {/* Children */}
                        <div className="flex flex-col w-full lg:w-auto">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">
                            CHILDREN (2y - 12y) <br />{" "}
                            <span className="text-xs sm:text-sm font-medium">
                              on the day of travel
                            </span>
                          </p>
                          <div className="flex justify-between items-start mt-2 gap-2">
                            <div className="flex border rounded-md overflow-hidden flex-wrap">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  onClick={() =>
                                    setTravellers((t) => ({
                                      ...t,
                                      children: i,
                                    }))
                                  }
                                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                                ${travellers.children === i ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
                                >
                                  {i}
                                </div>
                              ))}
                            </div>
                            <div
                              onClick={() =>
                                setTravellers((t) => ({ ...t, children: ">6" }))
                              }
                              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md 
                                                        ${travellers.children === ">6" ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
                            >
                              &gt;6
                            </div>
                          </div>
                        </div>

                        {/* Infants */}
                        <div className="flex flex-col items-start w-full lg:w-auto">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">
                            INFANTS (below 2y) <br />{" "}
                            <span className="text-xs sm:text-sm font-medium">
                              {" "}
                              on the day of travel{" "}
                            </span>
                          </p>
                          <div className="flex justify-between items-start mt-2 gap-2">
                            <div className="flex border rounded-md overflow-hidden flex-wrap">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  onClick={() =>
                                    setTravellers((t) => ({ ...t, infants: i }))
                                  }
                                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm cursor-pointer border-r last:border-r-0
                                                                ${travellers.infants === i ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
                                >
                                  {i}
                                </div>
                              ))}
                            </div>
                            <div
                              onClick={() =>
                                setTravellers((t) => ({ ...t, infants: ">6" }))
                              }
                              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer border rounded-md
                                                        ${travellers.infants === ">6" ? "bg-[#78080B] text-white" : "hover:bg-gray-100"}`}
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
                        {CoachOptions.map((cls) => (
                          <button
                            key={cls}
                            onClick={() =>
                              handleFlightInputChange("coach", cls.value)
                            }
                            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition-colors ${flightSearchInfo.coach === cls.value ? "bg-[#78080B] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                          >
                            {cls.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Done Button */}
                    <div
                      onClick={validateTravellers}
                      className="cursor-pointer flex justify-center bg-[#78080B] rounded-sm p-1"
                    >
                      <button className="btn">
                        <span className="cursor-pointer button-text text-white  text-sm sm:text-base">
                          D O N E
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Search Button */}
          <div className="col-span-2 flex justify-center relative">
            <a
              href="#"
              id="ModifySearchButton"
              onClick={handleSearchButtonClick}
              className="text-xs sm:text-sm"
            >
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
        className="filter-section max-w-6xl mx-auto mt-4 font-medium overflow-hidden transition-all duration-500"
        style={{ height: isEditable ? `${fareTypeHeight}px` : "0px" }}
        ref={fareTypeRef}
      >
        <div ref={contentRef}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start space-y-3 sm:space-y-0 sm:space-x-6">
            <span className="text-xs sm:text-sm">Fare Type</span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 rounded-xl filterglasseffect px-3 sm:px-4 w-full sm:w-auto">
              {[
                { value: "regular", label: "Regular", checked: true },
                { value: "student", label: "Student" },
                { value: "senior", label: "Senior Citizen" },
                { value: "armed", label: "Armed Forces" },
                { value: "doctor", label: "Doctor and Nurses" },
              ].map(({ value, label, checked }, i) => (
                <div
                  key={value}
                  className={`${i !== 0 ? "sm:border-l border-white" : ""}`}
                >
                  <label className="flex py-2 sm:ml-2 items-center space-x-1 cursor-pointer text-xs sm:text-sm">
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
  );
}

export default FlightSearchHeader;
