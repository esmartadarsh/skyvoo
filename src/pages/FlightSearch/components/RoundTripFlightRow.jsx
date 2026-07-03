import React, { useState, useCallback, lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import CompactFlightCard from './CompactFlightCard.jsx';

const ViewFlightDetails = lazy(() => import('./ViewFlightDetails'));

function RoundTripFlightRow({
    outboundFlight,
    returnFlight,
    isCompared,
    onToggleCompare,
    onViewPrices,
}) {
    // null | 'outbound' | 'return'
    const [openDetails, setOpenDetails] = useState(null);

    const handleToggle = useCallback((leg) => {
        setOpenDetails(prev => prev === leg ? null : leg);
    }, []);

    const totalPrice =
        (outboundFlight?.AirlineMinNetPrice || 0) +
        (returnFlight?.AirlineMinNetPrice || 0);

    // For compare: use the combined key from Index.jsx
    const handleCompare = useCallback(() => {
        onToggleCompare(outboundFlight); // outboundFlight has the combined AirlineCodeAndId
    }, [onToggleCompare, outboundFlight]);

    const handleViewPrices = useCallback(() => {
        // Combine both price lists so the modal shows all options
        const combined = [
            ...(outboundFlight?.totalPriceList || []),
            ...(returnFlight?.totalPriceList || []),
        ];
        onViewPrices(combined);
    }, [onViewPrices, outboundFlight, returnFlight]);

    return (
        <div className="rounded-2xl">

            {/* ---- Two compact cards side by side ---- */}
            <div className="flex flex-row gap-2 sm:gap-3">
                <CompactFlightCard
                    flight={outboundFlight}
                    label="DEPARTURE"
                    isDetailsOpen={openDetails === 'outbound'}
                    onToggleDetails={() => handleToggle('outbound')}
                />
                <CompactFlightCard
                    flight={returnFlight}
                    label="RETURN"
                    isDetailsOpen={openDetails === 'return'}
                    onToggleDetails={() => handleToggle('return')}
                />
            </div>

            {/* ---- Action bar ---- */}
            <div
                className="mt-1 px-3 sm:px-4 py-2 bg-white rounded-b-xl flex items-center justify-between gap-2"
                style={{ boxShadow: "-2px 4px 16px 0px rgba(0,0,0,0.15)" }}
            >
                {/* Compare toggle */}
                {isCompared ? (
                    <div
                        className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded hover:bg-red-100 transition-colors duration-200"
                        onClick={handleCompare}
                    >
                        <span className="text-[9px] sm:text-xs font-medium text-gray-700">Added</span>
                        <X size={11} strokeWidth={3} className="text-[#910E0E]" />
                    </div>
                ) : (
                    <div
                        className="cursor-pointer flex items-center px-2 py-1 rounded hover:bg-red-100 transition-colors duration-200"
                        onClick={handleCompare}
                    >
                        <span className="text-[#811919] text-[9px] sm:text-xs font-semibold">
                            + Compare
                        </span>
                    </div>
                )}

                {/* Total price */}
                <div className="text-center">
                    <div className="text-[7px] sm:text-[9px] text-gray-500 leading-none">Total</div>
                    <div className="text-[11px] sm:text-sm font-bold text-[#811919] leading-tight">
                        ₹ {totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[6px] sm:text-[8px] text-gray-500 leading-none">Per Adult</div>
                </div>

                {/* View prices */}
                <button
                    className="cursor-pointer bg-[#811919] hover:bg-[#741111] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium text-[9px] sm:text-xs transition-colors whitespace-nowrap"
                    onClick={handleViewPrices}
                >
                    VIEW PRICES
                </button>
            </div>

            {/* ---- Expandable flight details ---- */}
            <div
                className={`shadow-2xl mt-2 overflow-hidden transition-[max-height] duration-700 ease-in-out ${openDetails ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                {openDetails === 'outbound' && (
                    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading details...</div>}>
                        <ViewFlightDetails flight={outboundFlight} />
                    </Suspense>
                )}
                {openDetails === 'return' && (
                    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading details...</div>}>
                        <ViewFlightDetails flight={returnFlight} />
                    </Suspense>
                )}
            </div>

        </div>
    );
}

export default React.memo(RoundTripFlightRow);
