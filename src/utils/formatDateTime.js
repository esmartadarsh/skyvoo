// utils/dateFormatters.js

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return String(date.getDate()).padStart(2, '0'); // e.g., "09"
};

const formatMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return String(date.getMonth() + 1).padStart(2, '0'); // e.g., "10"
};

const formatDay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Fri"
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // e.g., "14:30"
};

export { formatDate, formatMonth, formatDay, formatTime };
