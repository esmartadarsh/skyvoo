import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import FlightSearchTopHeader from './components/FlightSearchTopHeader.jsx';
import FlightSearchHeader from './components/FlightSearchHeader.jsx';
import FlightSearchHeaderMobile from './components/FlightSearchHeaderMobile.jsx';
import Filters from './components/Filters.jsx';
import FlightPriceDetailsModal from '@/components/modals/FlightPriceDetailsModal';
import CompareFlightsWidget from "./components/CompareFlightsWidget.jsx";
import LoadingBar from "@/components/layout/LoadingBar.jsx";
import SignInModal from "@/components/modals/SignInModal";
import GrayFadedBg from "@/assets/imgs/grayfadedbg.webp";
import { useFlightFilters } from "@/contexts/FlightFilterContext.jsx";
import { useCompareFlights } from "@/contexts/CompareContext.jsx";
import FlightCard from "./components/FlightCard.jsx";
import RoundTripBottomBar from "./components/RoundTripBottomBar.jsx";
import SortingOptions from "./components/SortingOptions.jsx";
import MobileSearchSummary from "./components/MobileSearchSummary.jsx";
import FlightCardSkeleton from '@/components/layout/FlightCardSkeleton';
import { useFlightSearch } from '@/hooks/FlightSearch/useFlightSearch.js';
import { useFilteredFlights } from "@/hooks/FlightSearch/useFilteredFlights";
import { useInfiniteFlights } from '@/hooks/FlightSearch/useInfiniteFlights.js';
import { useScrollTop } from '@/hooks/FlightSearch/useScrollTop.js';
import { bookingStore } from '@/store/bookingStore.js';
import RoundTripFlightRow from './components/RoundTripFlightRow.jsx';

export default function FlightSearch() {

    const navigate = useNavigate();
    const { state: filters } = useFlightFilters();
    const [selectedSorting, setSelectedSorting] = useState("");

    // ── Independent filter reducers for round-trip ──────────────────────────
    const filterInitialState = {
        selectedStops: [],
        selectedAirlines: [],
        selectedAircraftSizes: [],
        selectedPriceRange: [0, Infinity],
        selectedDepartureTime: null,
        selectedArrivalTime: null,
    };
    function filterReducer(state, action) {
        switch (action.type) {
            case "SET_STOPS": return { ...state, selectedStops: action.payload };
            case "SET_AIRLINES": return { ...state, selectedAirlines: action.payload };
            case "SET_PRICE_RANGE": return { ...state, selectedPriceRange: action.payload };
            case "SET_DEPARTURE_TIME": return { ...state, selectedDepartureTime: action.payload };
            case "SET_ARRIVAL_TIME": return { ...state, selectedArrivalTime: action.payload };
            case "SET_AIRCRAFT_SIZES": return { ...state, selectedAircraftSizes: action.payload };
            case "RESET_FILTERS": return filterInitialState;
            default: return state;
        }
    }
    const [outboundFilterState, outboundFilterDispatch] = useReducer(filterReducer, filterInitialState);
    const [returnFilterState, returnFilterDispatch] = useReducer(filterReducer, filterInitialState);
    // ───────────────────────────────────────────────────────────────────────

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    const [selectedFlightId, setSelectedFlightId] = useState(null);

    const [progress, setProgress] = useState(0);

    const { state: compareState, dispatch } = useCompareFlights();
    const selectedFlights = compareState.selectedFlights;

    const [isSignInModal, setIsSignInModal] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);
    // Holds { flight, fareList } so the modal can persist both to bookingStore
    const [flightDetailsModalCtx, setFlightDetailsModalCtx] = useState(null);

    // Round-trip independent selection
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);

    const [showOtherMenu, setShowOtherMenu] = useState(false);

    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const { apiFlights, apiFlightAirlines, apiReturnFlights, apiReturnAirlines, isLoading, isError, payload } = useFlightSearch();

    const isRoundTrip = payload.TripInfo.length > 1;

    // For round trip: both arrays are independent — no zipping or merging.
    // One-way pipeline uses apiFlights as-is; round-trip renders rows by index directly.
    const flightsForFilter = useMemo(() => {
        if (isRoundTrip) return []; // round-trip rows are rendered separately below
        return apiFlights;
    }, [isRoundTrip, apiFlights]);


    const FlightDetails = useFilteredFlights({
        flights: flightsForFilter,
        filters,
        sorting: selectedSorting,
    });

    const { visibleFlights, loadMoreRef } = useInfiniteFlights(FlightDetails);
    const { showScrollTop, scrollToTop } = useScrollTop();

    const filterParams = useMemo(() => {
        const prices = apiFlights.map(f => f.AirlineMinNetPrice);
        return {
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            totalStops: [...new Set(apiFlights.map(f => f.AirlineStops))],
            airlines: apiFlightAirlines.map(f => ({
                code: f.AirlineCode,
                name: f.AirlineName,
                count: f.AirlineCount,
            }))
        };
    }, [apiFlights, apiFlightAirlines]);

    const returnFilterParams = useMemo(() => {
        const prices = apiReturnFlights.map(f => f.AirlineMinNetPrice);
        return {
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            totalStops: [...new Set(apiReturnFlights.map(f => f.AirlineStops))],
            airlines: (apiReturnAirlines || []).map(f => ({
                code: f.AirlineCode,
                name: f.AirlineName,
                count: f.AirlineCount,
            }))
        };
    }, [apiReturnFlights, apiReturnAirlines]);

    // For round-trip: apply independent filters to each array
    const filteredOutboundFlights = useFilteredFlights({
        flights: isRoundTrip ? apiFlights : [],
        filters: outboundFilterState,
        sorting: selectedSorting,
    });
    const filteredReturnFlights = useFilteredFlights({
        flights: isRoundTrip ? apiReturnFlights : [],
        filters: returnFilterState,
        sorting: selectedSorting,
    });

    // Round-trip row count after filtering — driven by the longer filtered array
    const filteredRTRowCount = useMemo(() => {
        if (!isRoundTrip) return 0;
        return Math.max(filteredOutboundFlights.length, filteredReturnFlights.length);
    }, [isRoundTrip, filteredOutboundFlights, filteredReturnFlights]);

    // Infinite scroll for round-trip rows
    const [visibleRTCount, setVisibleRTCount] = useState(10);
    const rtLoadMoreRef = React.useRef(null);
    useEffect(() => {
        if (!isRoundTrip) return;
        const el = rtLoadMoreRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleRTCount(prev => Math.min(prev + 10, filteredRTRowCount));
                }
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isRoundTrip, filteredRTRowCount]);


    const toggleCompare = useCallback((flight) => {
        console.log(flight, 'save the whole flight information')
        const exists = selectedFlights.some(
            f => f.AirlineCodeAndId === flight.AirlineCodeAndId
        );

        if (!exists && selectedFlights.length >= 3) {
            alert("You can only compare up to 3 flights.");
            return;
        }

        dispatch({
            type: exists ? "REMOVE_FLIGHT" : "ADD_FLIGHT",
            payload: exists ? flight.AirlineCodeAndId : flight
        });
    }, [selectedFlights, dispatch]);

    const toggleFlightDetails = useCallback((flightId) => {
        setSelectedFlightId(prev => prev === flightId ? null : flightId);
    }, []);

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

    const handleViewPrices = useCallback((flight) => {
        setFlightDetailsModalCtx({
            flight,
            fareList: flight.TotalPriceList || [],
        });
        setIsFlightDetailsModalOpen(true);
    }, []);

    const handleBookRoundTrip = useCallback(() => {
        const adults = Number(payload.AdultCount || 1);
        const children = Number(payload.ChildCount || 0);
        const infants = Number(payload.InfantCount || 0);

        bookingStore.set({
            isRoundTrip: true,
            outboundFlight: selectedOutbound,
            returnFlight: selectedReturn,
            outboundFareReviewKey: selectedOutbound?.FareReviewKey ?? null,
            returnFareReviewKey: selectedReturn?.FareReviewKey ?? null,
            travellers: { adults, children, infants },
        });
        navigate('/review-details');
    }, [selectedOutbound, selectedReturn, navigate, payload]);


    // useEffect(() => {
    //     if (isFilterOpen) {
    //         document.documentElement.style.overflow = 'hidden';
    //     } else {
    //         document.documentElement.style.overflow = 'auto';
    //     }

    //     // Cleanup on unmount
    //     return () => {
    //         document.documentElement.style.overflow = 'auto';
    //     };
    // }, [isFilterOpen]);


    useEffect(() => {
        let timer;

        if (isLoading) {
            setProgress(10);

            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 300);
        } else {
            setProgress(100);

            setTimeout(() => {
                setProgress(0);
            }, 500);
        }

        return () => clearInterval(timer);
    }, [isLoading]);

    return (
        <>
            {/* Mobile Filters Drawer */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `}
                onClick={() => setIsFilterOpen(false)} />
            <div className={`fixed top-0 left-0 z-[9999] bg-white transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-screen w-80 overflow-y-auto overscroll-contain">
                    <Filters
                        origin={payload.TripInfo[0].Origin}
                        destination={payload.TripInfo[0].Destination}
                        filters={filterParams}
                    />
                </div>

            </div>

            <CompareFlightsWidget
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {isFlightDetailsModalOpen && flightDetailsModalCtx &&
                <FlightPriceDetailsModal
                    flight={flightDetailsModalCtx.flight}
                    data={flightDetailsModalCtx.fareList}
                    onClose={() => setIsFlightDetailsModalOpen(false)}
                />
            }

            {isSignInModal && <SignInModal onClose={() => setIsSignInModal(false)} />}

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
                <FlightSearchTopHeader onOpen={() => setIsSignInModal(true)} />

                <div className="hidden lg:block">
                    <FlightSearchHeader />
                </div>

                {/* Mobile Search Header */}
                <div className="block lg:hidden">
                    <FlightSearchHeaderMobile
                        open={showMobileSearch}
                        onClose={() => setShowMobileSearch(false)}
                    />
                </div>

                {isLoading && progress > 0 && (
                    <LoadingBar progress={progress} />
                )}


                {/* Main Content */}
                <div className={`relative max-w-7xl mx-auto px-5 sm:px-4 py-6 z-50 transition-all duration-500 ${isRoundTrip && (selectedOutbound || selectedReturn) ? 'pb-32' : ''}`}>
                    <div className="flex gap-6">

                        <div className="hidden lg:block">
                            {isRoundTrip ? (
                                // Two filters → sticky + scrollable container
                                <div
                                    className="
                p-1
                sticky top-6
                max-h-[calc(100vh-3rem)]
                overflow-y-auto
                space-y-6
                [scrollbar-width:thin]
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-400
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-500
            "
                                >
                                    <Filters
                                        origin={payload.TripInfo[0].Origin}
                                        destination={payload.TripInfo[0].Destination}
                                        filters={filterParams}
                                        filterState={outboundFilterState}
                                        filterDispatch={outboundFilterDispatch}
                                        label="Departure Filters"
                                        showShadow={false}
                                    />

                                    <Filters
                                        origin={payload.TripInfo[1].Origin}
                                        destination={payload.TripInfo[1].Destination}
                                        filters={returnFilterParams}
                                        filterState={returnFilterState}
                                        filterDispatch={returnFilterDispatch}
                                        label="Return Filters"
                                        showShadow={false}
                                    />
                                </div>
                            ) : (
                                <div className='sticky top-10'>

                                    <Filters
                                        origin={payload.TripInfo[0].Origin}
                                        destination={payload.TripInfo[0].Destination}
                                        filters={filterParams}
                                        showShadow={true}
                                    />
                                </div>

                            )}
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

                            {/* Mobile Search Summary */}
                            <MobileSearchSummary
                                onEdit={() => setShowMobileSearch(true)}
                            />

                            {/* Sorting Options */}
                            <SortingOptions
                                selectedSorting={selectedSorting}
                                showOtherMenu={showOtherMenu}
                                handleClick={handleClick}
                                handleOtherSelect={handleOtherSelect}
                            />

                            {/* Flight Results */}
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <FlightCardSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : isError ? (
                                    <div className="text-center py-10 text-red-600">
                                        Something went wrong. Please try again.
                                    </div>
                                ) : apiFlights.length === 0 ? (
                                    <div className="text-center text-gray-600 mt-10">
                                        No flights found for this route. Try different dates or airports.
                                    </div>
                                ) : isRoundTrip ? (
                                    // Round-trip: both arrays filtered independently
                                    filteredRTRowCount === 0 ? (
                                        <div className="text-center text-gray-600 mt-10">
                                            No flights found for this route. Try different dates or airports.
                                        </div>
                                    ) : (
                                        Array.from({ length: Math.min(visibleRTCount, filteredRTRowCount) }, (_, i) => (
                                            <RoundTripFlightRow
                                                key={i}
                                                outboundFlight={filteredOutboundFlights[i] ?? null}
                                                returnFlight={filteredReturnFlights[i] ?? null}
                                                onToggleCompare={toggleCompare}
                                                onViewPrices={handleViewPrices}
                                                selectedOutbound={selectedOutbound}
                                                selectedReturn={selectedReturn}
                                                onSelectOutbound={setSelectedOutbound}
                                                onSelectReturn={setSelectedReturn}
                                            />
                                        ))
                                    )
                                ) : FlightDetails.length > 0 ? (
                                    visibleFlights.map((flight) => (
                                        <FlightCard
                                            key={flight.AirlineCodeAndId}
                                            flight={flight}
                                            isSelected={selectedFlightId === flight.AirlineCodeAndId}
                                            isCompared={selectedFlights.some(
                                                f => f.AirlineCodeAndId === flight.AirlineCodeAndId
                                            )}
                                            onToggleDetails={toggleFlightDetails}
                                            onToggleCompare={toggleCompare}
                                            onViewPrices={handleViewPrices}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center text-gray-600 mt-10">
                                        No flights match your current filters.
                                    </div>
                                )}
                                {isRoundTrip
                                    ? <div ref={rtLoadMoreRef} className="h-10" />
                                    : <div ref={loadMoreRef} className="h-10" />
                                }
                            </div>

                            {/* Round-trip sticky bottom bar */}
                            {isRoundTrip && (selectedOutbound || selectedReturn) && (
                                <RoundTripBottomBar
                                    outbound={selectedOutbound}
                                    returnFlight={selectedReturn}
                                    onClearOutbound={() => setSelectedOutbound(null)}
                                    onClearReturn={() => setSelectedReturn(null)}
                                    onBook={handleBookRoundTrip}
                                />
                            )}

                        </div>
                    </div>
                </div >
            </div >


        </>
    );
}