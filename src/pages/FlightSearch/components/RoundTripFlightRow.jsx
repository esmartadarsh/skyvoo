import React, { useState, useCallback, lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import CompactFlightCard from './CompactFlightCard.jsx';

const ViewFlightDetails = lazy(() => import('./ViewFlightDetails'));

function RoundTripFlightRow({
    outboundFlight,
    returnFlight,
    onToggleCompare,
    onViewPrices,
    selectedOutbound,
    selectedReturn,
    onSelectOutbound,
    onSelectReturn,
}) {
    const isOutboundSelected =
        !!outboundFlight &&
        selectedOutbound?.AirlineCodeAndId === outboundFlight?.AirlineCodeAndId;
    const isReturnSelected =
        !!returnFlight &&
        selectedReturn?.AirlineCodeAndId === returnFlight?.AirlineCodeAndId;
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
        // Pass the outbound flight; Index.jsx handleViewPrices will use flight.totalPriceList
        onViewPrices(outboundFlight);
    }, [onViewPrices, outboundFlight]);

    return (
        <div className="rounded-2xl">

            {/* ---- Two compact cards side by side ---- */}
            <div className="flex flex-row gap-2 sm:gap-3">
                <CompactFlightCard
                    flight={outboundFlight}
                    label="DEPARTURE"
                    isDetailsOpen={openDetails === 'outbound'}
                    onToggleDetails={() => handleToggle('outbound')}
                    isSelected={isOutboundSelected}
                    onSelect={onSelectOutbound}
                />
                <CompactFlightCard
                    flight={returnFlight}
                    label="RETURN"
                    isDetailsOpen={openDetails === 'return'}
                    onToggleDetails={() => handleToggle('return')}
                    isSelected={isReturnSelected}
                    onSelect={onSelectReturn}
                />
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
