import { useState } from "react";

export function useSeatSelection(totalTravellers) {
    const [selectedSeats, setSelectedSeats] = useState(new Set());

    const handleSeatClick = (seat) => {
        setSelectedSeats((prev) => {
            const updated = new Set(prev);

            if (totalTravellers === 1) {
                // Only one traveller → replace selection
                updated.clear();
                updated.add(seat.number);
            } else {
                // Multiple travellers → toggle and limit
                if (updated.has(seat.number)) {
                    updated.delete(seat.number);
                } else if (updated.size < totalTravellers) {
                    updated.add(seat.number);
                }
            }

            return updated;
        });
    };

    // Optional: clear all selections
    const clearSeats = () => setSelectedSeats(new Set());

    return { selectedSeats, handleSeatClick, clearSeats };
}
