const STORAGE_KEY = "skyvoo_booking";

const defaultBooking = {
    flight: null,
    passengers: [],
    seats: [],
    seatTotal: 0,
};

function loadBooking() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultBooking;
    } catch {
        return defaultBooking;
    }
}

function saveBooking(data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let booking = loadBooking();

export const bookingStore = {
    get() {
        return booking;
    },

    set(partial) {
        booking = { ...booking, ...partial };
        saveBooking(booking);
    },

    reset() {
        booking = defaultBooking;
        sessionStorage.removeItem(STORAGE_KEY);
    },
};
