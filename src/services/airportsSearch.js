import api from '@/services/api.js';

export const fetchAirportsByCode = async (airportCode) => {
    const res = await api.post(
        `/Flight/ListAirportsByCode?airportCode=${airportCode}`
    );

    if (!res.data?.IsSuccess) {
        throw new Error(res.data?.ErrorMessage || "Failed to fetch airports");
    }

    return res.data.Data.map((item) => ({
        airportCode: item.AirportCode,
        airportName: item.AirportName,
        city: item.CityName,
        cityCode: item.CityCode,
        countryCode: item.CountryCode,
    }));
};