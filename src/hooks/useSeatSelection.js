import { useState } from "react";

export function useSeatSelection(totalTravellers, initialSeats = []) {

    const [selectedSeats, setSelectedSeats] = useState(
        () => new Set(Array.isArray(initialSeats) ? initialSeats : [])
    );

    const handleSeatClick = (seat) => {
        setSelectedSeats((prev) => {
            const updated = new Set(prev);

            if (totalTravellers === 1) {
                updated.clear();
                updated.add(seat.number);
            } else {
                if (updated.has(seat.number)) {
                    updated.delete(seat.number);
                } else if (updated.size < totalTravellers) {
                    updated.add(seat.number);
                }
            }

            return updated;
        });
    };

    const clearSeats = () => setSelectedSeats(new Set());

    return { selectedSeats, handleSeatClick, clearSeats };
}
