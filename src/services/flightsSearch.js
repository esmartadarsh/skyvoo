import api from '@/services/api.js';

export const searchFlights = async (payload) => {
    const response = await api.post("/Flight/SearchFlight", payload);

    if (!response.data?.IsSuccess) {
        throw new Error(response.data?.ErrorMessage || "Flight search failed");
    }

    return response.data;
}; 