import { useMemo } from "react";

const TimeRanges = {
    "Early Morning": { start: 0, end: 6 },
    "Morning": { start: 6, end: 12 },
    "Afternoon": { start: 12, end: 18 },
    "Night": { start: 18, end: 24 },
};

export function useFilteredFlights({ flights, filters, sorting }) {
    const {
        selectedStops,
        selectedAirlines,
        selectedAircraftSizes,
        selectedPriceRange,
        selectedDepartureTime,
        selectedArrivalTime,
    } = filters;

    return useMemo(() => {
        if (!flights || flights.length === 0) return [];

        /* ---------------- FILTERING ---------------- */
        let result = flights.filter((flight) => {

            const airlineCode = flight.AirlineCodeAndId?.split("-")[0] || "";

            const lowestFare = flight.AirlineMinNetPrice || 0;

            const stopsCount = flight.Airlinestops || 0;

            const depHour = Number(flight.DepartureTime?.split(":")[0]) || 0;

            const arrHour = Number(flight.ArrivalTime?.split(":")[0]) || 0;

            // 1️⃣ Airline filter
            if (selectedAirlines.length && !selectedAirlines.includes(airlineCode)) {
                return false;
            }

            // 2️⃣ Price range
            if (selectedPriceRange?.length === 2 && lowestFare > 0) {
                const [min, max] = selectedPriceRange;
                if (lowestFare < min || lowestFare > max) return false;
            }

            // 3️⃣ Stops filter
            if (selectedStops.length > 0) {
                const stopLabel =
                    stopsCount === 0
                        ? "Non Stop"
                        : stopsCount === 1
                            ? "1 Stop"
                            : `${stopsCount} Stops`;

                if (!selectedStops.includes(stopLabel)) {
                    return false;
                }
            }

            // 4️⃣ Departure time
            if (selectedDepartureTime) {
                const { start, end } = TimeRanges[selectedDepartureTime];
                if (depHour < start || depHour >= end) return false;
            }

            // 5️⃣ Arrival time
            if (selectedArrivalTime) {
                const { start, end } = TimeRanges[selectedArrivalTime];
                if (arrHour < start || arrHour >= end) return false;
            }

            return true;
        });

        /* ---------------- SORTING ---------------- */
        const sorted = [...result];

        switch (sorting) {
            case "CHEAPEST":
                sorted.sort((a, b) => a.AirlineMinPrice - b.AirlineMinPrice);
                break;

            case "NONSTOP":
                sorted.sort((a, b) => a.Airlinestops - b.Airlinestops);
                break;

            case "EARLY_DEPARTURE":
                sorted.sort((a, b) => a.DepartureTime.localeCompare(b.DepartureTime));
                break;

            case "LATE_DEPARTURE":
                sorted.sort((a, b) => b.DepartureTime.localeCompare(a.DepartureTime));
                break;

            case "EARLY_ARRIVAL":
                sorted.sort((a, b) => a.ArrivalTime.localeCompare(b.ArrivalTime));
                break;

            case "LATE_ARRIVAL":
                sorted.sort((a, b) => b.ArrivalTime.localeCompare(a.ArrivalTime));
                break;

            default:
                break;
        }

        return sorted;
    }, [flights, filters, sorting]);
}
