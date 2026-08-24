// src/features/flights/context/CompareContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 3;
const STORAGE_KEY = "skyvoo_compare_flights";

function loadInitialState() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed?.selectedFlights)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to load compare flights from sessionStorage", e);
    }
    return { selectedFlights: [] };
}

const initialState = {
    selectedFlights: [],
};

function reducer(state, action) {
    switch (action.type) {

        case "ADD_FLIGHT": {
            const exists = state.selectedFlights.some(
                f => f.AirlineCodeAndId === action.payload.AirlineCodeAndId
            );

            if (exists || state.selectedFlights.length >= MAX_COMPARE) {
                return state;
            }

            return {
                ...state,
                selectedFlights: [...state.selectedFlights, action.payload],
            };
        }

        case "REMOVE_FLIGHT":
            return {
                ...state,
                selectedFlights: state.selectedFlights.filter(
                    f => f.AirlineCodeAndId !== action.payload
                ),
            };

        case "RESET_COMPARE":
            return initialState;

        default:
            return state;
    }
}

export function CompareProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, null, loadInitialState);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save compare flights to sessionStorage", e);
        }
    }, [state]);

    return (
        <CompareContext.Provider value={{ state, dispatch }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompareFlights() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompareFlights must be used inside CompareProvider");
    }
    return context;
}

