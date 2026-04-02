import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import FlightSearchTopHeader from './components/FlightSearchTopHeader.jsx';
import FlightSearchHeader from './components/FlightSearchHeader.jsx';
import FlightSearchHeaderMobile from './components/FlightSearchHeaderMobile.jsx';
import Filters from './components/Filters.jsx';
import FlightPriceDetailsModal from '@/components/modals/FlightPriceDetailsModal';
import CompareFlightsWidget from "./components/CompareFlightsWidget.jsx";
import LoadingBar from "@/components/layout/LoadingBar.jsx";
import SignInModal from '@/components/modals/SignInModal';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import { useFlightFilters } from '../../contexts/FlightFilterContext.jsx';
import { useFilteredFlights } from "@/hooks/useFilteredFlights";
import { useCompareFlights } from '@/contexts/CompareContext.jsx';
import FlightCard from './components/FlightCard.jsx';
import SortingOptions from './components/SortingOptions.jsx';
import MobileSearchSummary from "./components/MobileSearchSummary.jsx";
import { useFlightSearch } from '@/hooks/useFlightSearch.js';
import { useInfiniteFlights } from '@/hooks/useInfiniteFlights.js';
import { useScrollTop } from '@/hooks/useScrollTop.js';
import FlightCardSkeleton from '@/components/layout/FlightCardSkeleton';

export default function FlightSearch() {

    const { state: filters } = useFlightFilters();

    const [selectedSorting, setSelectedSorting] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    const [selectedFlightId, setSelectedFlightId] = useState(null);

    const [progress, setProgress] = useState(0);

    const { state: compareState, dispatch } = useCompareFlights();
    const selectedFlights = compareState.selectedFlights;

    const [isSignInModal, setIsSignInModal] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);
    const [IsFlightDetailsModalData, setIsFlightDetailsModalData] = useState([]);

    const [showOtherMenu, setShowOtherMenu] = useState(false);

    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const { apiFlights, apiFlightAirlines, isLoading, isError, payload } = useFlightSearch();

    const FlightDetails = useFilteredFlights({
        flights: apiFlights,
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
            totalStops: [...new Set(apiFlights.map(f => f.Airlinestops))],
            airlines: [...new Set(apiFlightAirlines.map(f => f.AirlineName))]
        }

    }, [apiFlights, apiFlightAirlines]);

    const toggleCompare = useCallback((flight) => {
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

    const handleViewPrices = useCallback((data) => {
        setIsFlightDetailsModalData(data);
        setIsFlightDetailsModalOpen(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? 'hidden' : 'auto';
        return () => (document.body.style.overflow = 'auto');
    }, [isFilterOpen]);

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
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <FlightCardSkeleton key={i} />
                                        ))}
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
                                            onViewPrices={handleViewPrices}
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