import React from 'react';
import { ChevronRight } from 'lucide-react';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp';

const BookingHistory = React.memo(({
    bookings,
    selectedBooking,
    toggleBooking,
    formatDate,
    formatTime,
    formatPrice,
    getStatusColor,
    onViewAll,
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-2">Flight History</h3>
                    <p className="text-gray-400">Your recent and upcoming journeys</p>
                </div>

                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            role="button"
                            tabIndex={0}
                            aria-expanded={selectedBooking === booking.id}
                            onClick={() => toggleBooking(booking.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleBooking(booking.id);
                                }
                            }}
                            className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-black/10 rounded-2xl p-4 sm:p-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                {/* LEFT SECTION */}
                                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                                        <img src={AirlineLogo} alt="Airline Logo" className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg sm:text-2xl font-bold">{booking.from}</span>
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                                            <span className="text-lg sm:text-2xl font-bold">{booking.to}</span>
                                        </div>

                                        <p className="text-gray-400 text-xs sm:text-sm">{booking.destination}</p>
                                        <p className="text-gray-500 text-[11px] sm:text-xs">
                                            Flight {booking.flightNo} • {booking.class}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SECTION */}
                                <div className="flex sm:flex-col sm:items-end justify-between sm:justify-center gap-2">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${getStatusColor(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>

                                    <p className="text-lg sm:text-2xl font-bold text-[#78080B]">
                                        {formatPrice(booking.price)}
                                    </p>
                                </div>
                            </div>

                            {/* EXPANDED DETAILS */}
                            {selectedBooking === booking.id && (
                                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    <Info label="Date" value={formatDate(booking.date)} />
                                    <Info label="Time" value={formatTime(booking.time)} />
                                    <Info label="Gate" value={booking.gate} />
                                    <Info label="Seat" value={booking.seat} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onViewAll}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full"
                    >
                        VIEW ALL
                    </button>
                </div>
            </div>
        </div>
    );
});

const Info = ({ label, value }) => (
    <div className="bg-white/5 rounded-xl p-2 sm:p-3">
        <p className="text-gray-400 text-[11px] sm:text-xs mb-1">{label}</p>
        <p className="font-semibold text-sm sm:text-base">{value}</p>
    </div>
);


export default BookingHistory;
