import { http } from "./http";

export const flightsApi = {
    search: (params) =>
        http.get("/flights", { params }),

    getFareRules: (flightId) =>
        http.get(`/flights/${flightId}/fare-rules`),

    getSeatMap: (flightId) =>
        http.get(`/flights/${flightId}/seats`),
};
