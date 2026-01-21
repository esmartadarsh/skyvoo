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
            const airlineCode = flight.Airline_Code || "";

            const lowestFare = Math.min(
                ...flight.Fares.map(f => f.FareDetails[0].Total_Amount)
            );

            const stopsCount = Array.isArray(flight?.Segments?.[0]?.Stop_Over)
                ? flight.Segments[0].Stop_Over.length
                : 0;

            const depHour = new Date(
                flight.Segments[0].Departure_DateTime
            ).getHours();

            const arrHour = new Date(
                flight.Segments[0].Arrival_DateTime
            ).getHours();

            // 1️⃣ Airline filter
            if (selectedAirlines.length && !selectedAirlines.includes(airlineCode)) {
                return false;
            }

            // 2️⃣ Price range
            if (selectedPriceRange?.length === 2) {
                const [min, max] = selectedPriceRange;
                if (lowestFare < min || lowestFare > max) return false;
            }

            // 3️⃣ Stops filter
            if (selectedStops.includes("Non Stop") && stopsCount !== 0) return false;
            if (selectedStops.includes("1 Stop") && stopsCount !== 1) return false;
            if (selectedStops.includes("2+ Stops") && stopsCount < 2) return false;

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
                sorted.sort((a, b) => {
                    const fareA = Math.min(
                        ...a.Fares.map(f => f.FareDetails[0].Total_Amount)
                    );
                    const fareB = Math.min(
                        ...b.Fares.map(f => f.FareDetails[0].Total_Amount)
                    );
                    return fareA - fareB;
                });
                break;

            case "NONSTOP":
                sorted.sort((a, b) => {
                    const stopsA = Array.isArray(a.Segments[0]?.Stop_Over)
                        ? a.Segments[0].Stop_Over.length
                        : 0;
                    const stopsB = Array.isArray(b.Segments[0]?.Stop_Over)
                        ? b.Segments[0].Stop_Over.length
                        : 0;
                    return stopsA - stopsB;
                });
                break;

            case "EARLY_DEPARTURE":
                sorted.sort(
                    (a, b) =>
                        new Date(a.Segments[0].Departure_DateTime) -
                        new Date(b.Segments[0].Departure_DateTime)
                );
                break;

            case "LATE_DEPARTURE":
                sorted.sort(
                    (a, b) =>
                        new Date(b.Segments[0].Departure_DateTime) -
                        new Date(a.Segments[0].Departure_DateTime)
                );
                break;

            case "EARLY_ARRIVAL":
                sorted.sort(
                    (a, b) =>
                        new Date(a.Segments[0].Arrival_DateTime) -
                        new Date(b.Segments[0].Arrival_DateTime)
                );
                break;

            case "LATE_ARRIVAL":
                sorted.sort(
                    (a, b) =>
                        new Date(b.Segments[0].Arrival_DateTime) -
                        new Date(a.Segments[0].Arrival_DateTime)
                );
                break;

            default:
                break;
        }

        return sorted;
    }, [flights, filters, sorting]);
}
