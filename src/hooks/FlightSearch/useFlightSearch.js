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
        const travelClass = Number(searchParams.get("travelClass") || 0);

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

    const apiFlights = query.data?.Data?.oneWayResponses || [];
    const apiFlightAirlines = query.data?.Data?.flightcounts || [];
    const apiReturnFlights = query.data?.Data?.ReturnResponses || [];
    const apiReturnAirlines = query.data?.Data?.Returnflightcounts || [];
    const FlightSearchKey = query.data?.Data?.SessionId?.FF || "";

    useEffect(() => {
        if (FlightSearchKey) {
            localStorage.setItem("flightSearchKey", FlightSearchKey);
        }
    }, [FlightSearchKey]);

    return {
        ...query,
        apiFlights,
        apiFlightAirlines,
        apiReturnFlights,
        apiReturnAirlines,
        payload,
    };
};