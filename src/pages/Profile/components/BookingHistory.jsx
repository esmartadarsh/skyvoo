import React from 'react';
import { Plane, Calendar, Hash, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const getStatusInfo = (status) => {
  switch (status) {
    case 'S': return { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'P': return { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'C': return { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    case 'F': return { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200' };
    default: return { label: status || '—', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

const BookingHistory = React.memo(() => {
  const navigate = useNavigate();

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const payload = {
        TransactionId: null,
        PNRNumber: null,
        FromDate: null,
        ToDate: null,
        FilterType: null,
      };
      const res = await api.post('/flight/MyBookings', payload);
      if (res.data?.IsSuccess) {
        return res.data.Data ?? [];
      }
      throw new Error(res.data?.ErrorMessage || 'Failed to fetch bookings');
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const displayedBookings = bookings.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-1">My Bookings</h3>
          <p className="text-gray-400 text-sm">Your recent and upcoming journeys</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#78080B] animate-spin mb-3" />
            <p className="text-gray-400 text-sm">Loading your bookings...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-8 h-8 text-rose-500 mb-3" />
            <p className="text-rose-500 text-sm font-medium">Failed to load bookings</p>
            <p className="text-gray-400 text-xs mt-1">{error?.message}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Plane className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">No bookings found</p>
            <p className="text-gray-300 text-sm mt-1">Your booking history will appear here</p>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && !isError && bookings.length > 0 && (
          <>
            <div className="space-y-3">
              {displayedBookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.BookingStatus);
                return (
                  <div
                    key={booking.FlightTransactionId}
                    onClick={() => navigate('/booking-details', { state: booking })}
                    className="group bg-white/5 hover:bg-white/10 border border-black/10 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Left */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#78080B] to-[#a01014] flex items-center justify-center flex-shrink-0">
                          <Plane className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {booking.BookingId ? (
                              <span className="text-sm font-bold text-slate-800 truncate">{booking.BookingId}</span>
                            ) : (
                              <span className="text-sm font-medium text-slate-400 italic">No Booking ID</span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            {booking.AirlinePnrs && (
                              <span className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                PNR: <span className="font-semibold text-[#78080B]">{booking.AirlinePnrs}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Travel: {formatDate(booking.TravelDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <p className="text-xs text-slate-400">
                          {formatDateTime(booking.BookingDate)}
                        </p>
                      </div>
                    </div>

                    {/* Extra info row */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                      <span>Vendor: <span className="font-medium text-slate-600">{booking.Vendor || '—'}</span></span>
                      <span>Transaction: <span className="font-medium text-slate-600">#{booking.TransactionId}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex items-center gap-2 bg-[#78080B] hover:bg-[#5a0608] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm hover:shadow"
              >
                View All ({bookings.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default BookingHistory;
