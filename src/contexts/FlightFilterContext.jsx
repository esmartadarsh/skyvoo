import { createContext, useContext, useState } from "react";

const FlightFilterContext = createContext();

export const FlightFilterProvider = ({ children }) => {
    const DEFAULT_SELECTED_PRICE = 18000;
    const minValue = 1900;
    const maxValue = 21000;
    const [selectedStops, setSelectedStops] = useState([]);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedAircraftSizes, setSelectedAircraftSizes] = useState([]);
    const [selectedDepartureTime, setselectedDepartureTime] = useState(null);
    const [selectedArrivalTime, setSelectedArrivalTime] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState([DEFAULT_SELECTED_PRICE, maxValue]);

    return (
        <FlightFilterContext.Provider value={{
            selectedStops,
            setSelectedStops,
            selectedAirlines,
            setSelectedAirlines,
            selectedAircraftSizes,
            setSelectedAircraftSizes,
            selectedPriceRange,
            setSelectedPriceRange,
            selectedDepartureTime,
            setselectedDepartureTime,
            selectedArrivalTime,
            setSelectedArrivalTime
        }}>
            {children}
        </FlightFilterContext.Provider>
    );
};

export const useFlightFilters = () => useContext(FlightFilterContext);
