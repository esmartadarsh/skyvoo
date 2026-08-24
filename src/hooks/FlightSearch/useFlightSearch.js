import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchFlights } from "@/services/flightsSearch";

export const useFlightSearch = () => {

    const [searchParams] = useSearchParams();

    const payload = useMemo(() => {
        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");
        const departDate = searchParams.get("departDate");
        const returnDate = searchParams.get("returnDate");

        const adults = Number(searchParams.get("adults") || 1);
        const children = Number(searchParams.get("children") || 0);
        const infants = Number(searchParams.get("infants") || 0);

        const cabinClass = Number(searchParams.get("cabinClass") || 0);
        const travelType = Number(searchParams.get("travelType") || 0);
        const bookingType = Number(searchParams.get("bookingType") || 0);

        const srCitizenSearch =
            searchParams.get("srCitizenSearch") === "true";

        const studentFareSearch =
            searchParams.get("studentFareSearch") === "true";

        const tripInfo = [
            {
                Origin: origin,
                Destination: destination,
                TravelDate: departDate,
                Trip_Id: 0,
            },
        ];

        if (returnDate) {
            tripInfo.push({
                Origin: destination,
                Destination: origin,
                TravelDate: returnDate,
                Trip_Id: 1,
            });
        }

        return {
            TripInfo: tripInfo,
            TravelType: travelType,
            BookingType: bookingType,
            CabinClass: cabinClass,
            AdultCount: adults,
            ChildCount: children,
            InfantCount: infants,
            SrCitizenSearch: srCitizenSearch,
            StudentFareSearch: studentFareSearch,
            Filtered_Airline: [{ Airline_Code: "" }],
        };
    }, [searchParams]);

    const origin = payload.TripInfo?.[0]?.Origin;
    const destination = payload.TripInfo?.[0]?.Destination;
    const departDate = payload.TripInfo?.[0]?.TravelDate;

    const isValidSearch = origin && destination && departDate;

    const query = useQuery({
        queryKey: ["flight-search", payload],
        queryFn: () => searchFlights(payload),
        staleTime: 1000 * 60 * 5,
        enabled: !!isValidSearch
    });

    const apiFlights = query.data?.Data?.OneWayResponses || [];
    const apiFlightAirlines = query.data?.Data?.FlightCounts || [];
    const apiReturnFlights = query.data?.Data?.ReturnResponses || [];
    const apiReturnAirlines = query.data?.Data?.ReturnFlightCounts || [];

    return {
        ...query,
        apiFlights,
        apiFlightAirlines,
        apiReturnFlights,
        apiReturnAirlines,
        payload,
    };
};