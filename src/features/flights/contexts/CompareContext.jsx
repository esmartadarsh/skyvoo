// src/features/flights/context/CompareContext.jsx
import { createContext, useContext, useReducer } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 3;

const initialState = {
    selectedFlights: [],
};

function reducer(state, action) {
    switch (action.type) {
        case "ADD_FLIGHT": {
            const exists = state.selectedFlights.some(
                f => f.Flight_Id === action.payload.Flight_Id
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
                    f => f.Flight_Id !== action.payload
                ),
            };

        case "RESET_COMPARE":
            return initialState;

        default:
            return state;
    }
}

export function CompareProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

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
