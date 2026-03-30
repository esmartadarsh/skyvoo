import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { ChevronUp } from 'lucide-react';
import FlightSearchTopHeader from './components/FlightSearchTopHeader.jsx';
import FlightSearchHeader from './components/FlightSearchHeader';
import FlightSearchHeaderMobile from './components/FlightSearchHeaderMobile';
import Filters from './components/Filters';
import FlightPriceDetailsModal from '@/components/modals/FlightPriceDetailsModal';
import CompareFlightsWidget from "./components/CompareFlightsWidget";
import LoadingBar from "@/components/layout/LoadingBar.jsx";
import SignInModal from '@/components/modals/SignInModal';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import { useFlightFilters } from '../../contexts/FlightFilterContext.jsx';
import { useFilteredFlights } from "@/features/flights/hooks/useFilteredFlights";
import { useCompareFlights } from '@/features/flights/contexts/CompareContext.jsx';
import FlightCard from './components/FlightCard.jsx';
import SortingOptions from './components/SortingOptions.jsx';
import MobileSearchSummary from "./components/MobileSearchSummary";
import { searchFlights } from "@/services/flightsSearch.js";

export default function FlightSearch() {
    const [searchParams] = useSearchParams();

    const payload = useMemo(() => {
        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");
        const departDate = searchParams.get("departDate");
        const returnDate = searchParams.get("returnDate");

        const adults = Number(searchParams.get("adults") || 1);
        const children = Number(searchParams.get("children") || 0);
        const infants = Number(searchParams.get("infants") || 0);
        const travelClass = Number(searchParams.get("travelClass") || 0);

        const tripInfo = [
            {
                Origin: origin,
                Destination: destination,
                TravelDate: departDate,
                Trip_Id: 0
            }
        ];

        if (returnDate) {
            tripInfo.push({
                Origin: destination,
                Destination: origin,
                TravelDate: returnDate,
                Trip_Id: 1
            });
        }

        return {
            Travel_Type: 0,
            Booking_Type: 0,
            TripInfo: tripInfo,
            Adult_Count: adults,
            Child_Count: children,
            Infant_Count: infants,
            Class_Of_Travel: travelClass,
            InventoryType: 0,
            Source_Type: 0,
            SrCitizen_Search: false,
            StudentFare_Search: false,
            DefenceFare_Search: false,
            Filtered_Airline: [{ Airline_Code: "" }]
        };

    }, [searchParams]);

    const { data: FlightSearch, isLoading, isError, error } = useQuery({
        queryKey: ["flight-search", payload],
        queryFn: () => searchFlights(payload),
        staleTime: 1000 * 60 * 5,
    });

    const [progress, setProgress] = useState(0);

    const apiFlights = FlightSearch?.Data?.oneWayResponses || [];
    const apiFlightsCounts = FlightSearch?.Data?.flightcounts || [];

    const loadMoreRef = useRef(null);

    const PAGE_SIZE = 10;

    const { state: filters } = useFlightFilters();

    const prices = apiFlights.map(f => f.AirlineMinNetPrice);

    const filterParams = {
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        totalStops: [...new Set(apiFlights.map(f => f.Airlinestops))],
        airlines: [...new Set(apiFlightsCounts.map(f => f.AirlineName))]
    };

    const [page, setPage] = useState(1);

    const [selectedSorting, setSelectedSorting] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    const [selectedFlightId, setSelectedFlightId] = useState(null);

    const { state: compareState, dispatch } = useCompareFlights();
    const selectedFlights = compareState.selectedFlights;

    const [isSignInModal, setIsSignInModal] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);
    const [IsFlightDetailsModalData, setIsFlightDetailsModalData] = useState([]);

    const [showOtherMenu, setShowOtherMenu] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const FlightDetails = useFilteredFlights({
        flights: apiFlights,
        filters,
        sorting: selectedSorting,
    });

    const visibleFlights = useMemo(() => {
        return FlightDetails.slice(0, page * PAGE_SIZE);
    }, [FlightDetails, page]);

    const toggleCompare = (flight) => {
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

            <div
                className={`fixed top-0 left-0 z-[9999] bg-white transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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

            {isFlightDetailsModalOpen &&
                <FlightPriceDetailsModal
                    data={IsFlightDetailsModalData}
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
                <div className="relative max-w-7xl mx-auto px-5 sm:px-4 py-6 z-50">
                    <div className="flex gap-6">

                        {/* Filters Sidebar */}
                        <div className="hidden lg:block">
                            <Filters
                                origin={payload.TripInfo[0].Origin}
                                destination={payload.TripInfo[0].Destination}
                                filters={filterParams}
                            />
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
                                    <div className="text-center py-10 text-lg font-medium">
                                        Searching flights...
                                    </div>
                                ) : isError ? (
                                    <div className="text-center py-10 text-red-600">
                                        Something went wrong.
                                    </div>
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
                                            onViewPrices={(data) => {
                                                setIsFlightDetailsModalData(data)
                                                setIsFlightDetailsModalOpen(true)
                                            }}
                                        />
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