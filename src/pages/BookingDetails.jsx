import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, User, Calendar, Hash, ShieldCheck, Receipt, Clock, AlertCircle, Loader2, X, ChevronDown, Check, AlertOctagon, CheckCircle2, Printer, FileText } from 'lucide-react';
import api from '@/services/api';

const parseSegDateTime = (dtStr) => {
  if (!dtStr) return null;
  // Standardize separator to space
  const normalized = dtStr.replace('T', ' ');
  const parts = normalized.split(' ');

  let datePart = parts[0];
  let timePart = parts[1] || "00:00:00";

  let year = new Date().getFullYear(), month = 0, day = 1;

  if (datePart.includes('-')) {
    const dp = datePart.split('-');
    if (dp[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(dp[0], 10);
      month = parseInt(dp[1], 10) - 1;
      day = parseInt(dp[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(dp[0], 10);
      month = parseInt(dp[1], 10) - 1;
      year = parseInt(dp[2], 10);
    }
  } else if (datePart.includes('/')) {
    const dp = datePart.split('/');
    if (dp[2].length === 4) {
      // DD/MM/YYYY or MM/DD/YYYY
      const p0 = parseInt(dp[0], 10);
      const p1 = parseInt(dp[1], 10);
      const p2 = parseInt(dp[2], 10);
      if (p0 > 12) {
        day = p0;
        month = p1 - 1;
      } else if (p1 > 12) {
        day = p1;
        month = p0 - 1;
      } else {
        // default to DD/MM/YYYY
        day = p0;
        month = p1 - 1;
      }
      year = p2;
    } else {
      // YYYY/MM/DD
      year = parseInt(dp[0], 10);
      month = parseInt(dp[1], 10) - 1;
      day = parseInt(dp[2], 10);
    }
  }

  const tp = timePart.split(':');
  const hours = parseInt(tp[0], 10) || 0;
  const minutes = parseInt(tp[1], 10) || 0;
  const seconds = parseInt(tp[2], 10) || 0;

  const date = new Date(year, month, day, hours, minutes, seconds);
  return isNaN(date.getTime()) ? null : date;
};

const formatBookingDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

const getYYYYMMDD = (dtStr) => {
  const dateObj = parseSegDateTime(dtStr);
  if (!dateObj) return "";
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = location.state;

  // State for Print Ticket
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const [printError, setPrintError] = useState("");

  // State for Cancellation Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteCancel, setIsCompleteCancel] = useState(true);
  const [selectedSegments, setSelectedSegments] = useState({});
  const [selectedTravellers, setSelectedTravellers] = useState({});
  const [openDropdownIdx, setOpenDropdownIdx] = useState(null);
  const [remarks, setRemarks] = useState("I cancel the ticket");
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

  // State for Reschedule Modal
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleSelectedSegments, setRescheduleSelectedSegments] = useState({});
  const [rescheduleSelectedTravellers, setRescheduleSelectedTravellers] = useState({});
  const [rescheduleDates, setRescheduleDates] = useState({});
  const [rescheduleOpenDropdownIdx, setRescheduleOpenDropdownIdx] = useState(null);
  const [rescheduleRemarks, setRescheduleRemarks] = useState("I want to reschedule this booking");
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleSuccess, setRescheduleSuccess] = useState("");

  const {
    data: detail,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookingDetail', payload?.BookingId, payload?.TransactionId],
    queryFn: async () => {
      if (!payload?.TransactionId) {
        throw new Error("No booking transaction details found.");
      }
      const res = await api.post('/flight/BookingDetail', {
        BookingId: payload.BookingId || null,
        TransactionId: payload.TransactionId,
        BookingStatus: payload.BookingStatus || "S",
        Vendor: payload.Vendor || "AF"
      });
      if (res.data?.IsSuccess) {
        return res.data.Data;
      }
      throw new Error(res.data?.ErrorMessage || 'Failed to fetch booking details');
    },
    enabled: !!payload?.TransactionId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Parse inner BookingResponse JSON string
  const parsedResponse = React.useMemo(() => {
    if (!detail?.BookingResponse) return null;
    try {
      return JSON.parse(detail.BookingResponse);
    } catch (e) {
      console.error("Error parsing BookingResponse:", e);
      return null;
    }
  }, [detail]);

  const order = parsedResponse?.Order;
  const airInfo = parsedResponse?.ItemInfos?.AIR;
  const tripInfos = React.useMemo(() => airInfo?.TripInfos ?? [], [airInfo]);
  const bookingTravellers = React.useMemo(() => airInfo?.TravellerInfoList ?? [], [airInfo]);
  const gstInfo = parsedResponse?.GstInfo;

  // Sync state for cancellation and reschedule selection when data is loaded
  useEffect(() => {
    if (tripInfos.length > 0 && bookingTravellers.length > 0) {
      const initialSegs = {};
      const initialTravs = {};
      const initialReschedDates = {};

      tripInfos.forEach((trip, tIdx) => {
        const segments = trip.SegmentList ?? [];
        segments.forEach((seg, sIdx) => {
          const segKey = `${tIdx}-${sIdx}`;
          initialSegs[segKey] = true;
          initialTravs[segKey] = bookingTravellers.map(t => t.PassengerId);
          initialReschedDates[segKey] = getYYYYMMDD(seg.dt) || "";
        });
      });

      setSelectedSegments(initialSegs);
      setSelectedTravellers(initialTravs);
      setRescheduleSelectedSegments(initialSegs);
      setRescheduleSelectedTravellers(initialTravs);
      setRescheduleDates(initialReschedDates);
    }
  }, [tripInfos, bookingTravellers]);

  // Helper to parse API response messages with support for Data string & Mail errors
  const parseApiResponse = (data, defaultSuccessMsg) => {
    if (!data) return { isSuccess: false, message: "No response received from server." };

    const rawData = data.Data;
    const isDataString = typeof rawData === 'string' && rawData.trim().length > 0;
    const dataStringLower = isDataString ? rawData.toLowerCase().trim() : '';

    const errorMsg =
      data.ErrorMessage ||
      (!isDataString && (rawData?.ErrorMessage || rawData?.Message)) ||
      null;

    const errorMsgLower = (errorMsg && typeof errorMsg === 'string') ? errorMsg.toLowerCase() : '';

    // Check if error is solely due to email sending failure while ticket action succeeded
    const isMailSendingError =
      errorMsgLower.includes('sending mail') ||
      errorMsgLower.includes('failure sending mail') ||
      errorMsgLower.includes('fail sending mail');

    if (isMailSendingError) {
      return {
        isSuccess: true,
        message: data.SuccessMessage || defaultSuccessMsg || "Request submitted successfully!"
      };
    }

    // Check if Data string explicitly indicates a failure
    const isFailedString = isDataString && (
      dataStringLower.includes('fail') ||
      dataStringLower.includes('error') ||
      dataStringLower.includes('reject') ||
      dataStringLower.includes('invalid') ||
      dataStringLower.includes('denied')
    );

    if (errorMsg || !data.IsSuccess || isFailedString) {
      return {
        isSuccess: false,
        message: errorMsg || (isDataString ? rawData : "Request failed. Please try again.")
      };
    }

    const successMsg =
      data.SuccessMessage ||
      (isDataString ? rawData : (rawData?.SuccessMessage || rawData?.Message)) ||
      defaultSuccessMsg;

    return {
      isSuccess: true,
      message: successMsg
    };
  };

  // Cancel Ticket Mutation
  const cancelMutation = useMutation({
    mutationFn: async (cancelPayload) => {
      const res = await api.post('/flight/CancelTicket', cancelPayload);
      return res.data;
    },
    onSuccess: (data) => {
      const result = parseApiResponse(data, "Ticket cancellation request submitted successfully!");
      if (result.isSuccess) {
        setCancelSuccess(result.message);
        setTimeout(() => {
          setIsCancelModalOpen(false);
          refetch();
        }, 2000);
      } else {
        setCancelError(result.message);
      }
    },
    onError: (err) => {
      const serverError =
        err?.response?.data?.ErrorMessage ||
        err?.response?.data?.Data?.ErrorMessage ||
        (typeof err?.response?.data?.Data === 'string' ? err?.response?.data?.Data : null) ||
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "An error occurred during ticket cancellation.";

      const serverErrorLower = typeof serverError === 'string' ? serverError.toLowerCase() : '';
      if (serverErrorLower.includes('sending mail') || serverErrorLower.includes('failure sending mail')) {
        setCancelSuccess("Ticket cancellation request submitted successfully!");
        setTimeout(() => {
          setIsCancelModalOpen(false);
          refetch();
        }, 2000);
      } else {
        setCancelError(serverError);
      }
    }
  });

  // Reschedule Ticket Mutation
  const rescheduleMutation = useMutation({
    mutationFn: async (reschedPayload) => {
      const res = await api.post('/flight/RescheduleTicket', reschedPayload);
      return res.data;
    },
    onSuccess: (data) => {
      const result = parseApiResponse(data, "Ticket reschedule request submitted successfully!");
      if (result.isSuccess) {
        setRescheduleSuccess(result.message);
        setTimeout(() => {
          setIsRescheduleModalOpen(false);
          refetch();
        }, 2000);
      } else {
        setRescheduleError(result.message);
      }
    },
    onError: (err) => {
      const serverError =
        err?.response?.data?.ErrorMessage ||
        err?.response?.data?.Data?.ErrorMessage ||
        (typeof err?.response?.data?.Data === 'string' ? err?.response?.data?.Data : null) ||
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "An error occurred during ticket rescheduling.";

      const serverErrorLower = typeof serverError === 'string' ? serverError.toLowerCase() : '';
      if (serverErrorLower.includes('sending mail') || serverErrorLower.includes('failure sending mail')) {
        setRescheduleSuccess("Ticket reschedule request submitted successfully!");
        setTimeout(() => {
          setIsRescheduleModalOpen(false);
          refetch();
        }, 2000);
      } else {
        setRescheduleError(serverError);
      }
    }
  });

  // Print Ticket Mutation
  const printMutation = useMutation({
    mutationFn: async (printType = "WithPrice") => {
      setPrintError("");
      const printPayload = {
        BookingId: order?.BookingId || payload.BookingId || "",
        TransactionId: Number(payload.TransactionId || payload.FlightTransactionId || 0),
        Status: payload.BookingStatus || detail?.BookingStatus || "S",
        FlightSearchType: payload.FlightSearchType || detail?.FlightSearchType || "OneWay",
        PrintTripWiseTicketType: printType,
        Vendor: detail?.Vendor || payload.Vendor || "FF"
      };

      const res = await api.post('/flight/PrintTicket', printPayload);
      return res.data;
    },
    onSuccess: (data) => {
      if (!data?.IsSuccess) {
        setPrintError(data?.ErrorMessage || "Failed to generate ticket.");
        return;
      }

      const ticketData = data?.Data?.TicketData || (typeof data?.Data === 'string' ? data.Data : null);
      if (!ticketData) {
        setPrintError("No ticket document received from server.");
        return;
      }

      try {
        const cleanBase64 = ticketData.replace(/\s/g, '');
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const printWindow = window.open(blobUrl, '_blank');
        if (!printWindow) {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `Ticket_${order?.BookingId || payload.BookingId || payload.TransactionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (err) {
        console.error("Error processing ticket PDF:", err);
        setPrintError("Could not open ticket PDF. Please try again.");
      }
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.ErrorMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to print ticket. Please try again.";
      setPrintError(msg);
    }
  });

  const handleCancelSubmit = () => {
    setCancelError("");
    setCancelSuccess("");

    let tripsPayload = [];

    if (isCompleteCancel) {
      // Loop through all segments and include all travellers
      tripInfos.forEach((trip, tIdx) => {
        const segments = trip.SegmentList ?? [];
        segments.forEach((seg, sIdx) => {
          const dep = seg.da;
          const arr = seg.aa;
          const segKey = `${dep?.code}-${arr?.code}`;
          const pnr = bookingTravellers[0]?.PnrDetails?.[segKey] ?? payload.AirlinePnrs ?? "—";

          tripsPayload.push({
            Source: dep?.code,
            Destination: arr?.code,
            TripSegments: `${dep?.code}-${arr?.code}`,
            DepartureDate: getYYYYMMDD(seg.dt),
            PNR: pnr,
            Travellers: bookingTravellers.map(t => ({
              FirstName: t.FirstName,
              LastName: t.LastName,
              PassengerId: t.PassengerId,
              FlightId: seg.flightId || "",
              SegmentId: seg.segmentId || "0",
              PaxId: t.PaxId
            }))
          });
        });
      });
    } else {
      // Loop through selected segments only
      let hasError = false;
      tripInfos.forEach((trip, tIdx) => {
        const segments = trip.SegmentList ?? [];
        segments.forEach((seg, sIdx) => {
          const segKey = `${tIdx}-${sIdx}`;
          if (selectedSegments[segKey]) {
            const dep = seg.da;
            const arr = seg.aa;
            const routeKey = `${dep?.code}-${arr?.code}`;
            const pnr = bookingTravellers[0]?.PnrDetails?.[routeKey] ?? payload.AirlinePnrs ?? "—";

            const checkedTravellerIds = selectedTravellers[segKey] || [];
            if (checkedTravellerIds.length === 0) {
              setCancelError(`Please select at least one passenger for sector ${dep?.code}-${arr?.code}`);
              hasError = true;
              return;
            }

            const travellersList = bookingTravellers.filter(t => checkedTravellerIds.includes(t.PassengerId));

            tripsPayload.push({
              Source: dep?.code,
              Destination: arr?.code,
              TripSegments: `${dep?.code}-${arr?.code}`,
              DepartureDate: getYYYYMMDD(seg.dt),
              PNR: pnr,
              Travellers: travellersList.map(t => ({
                FirstName: t.FirstName,
                LastName: t.LastName,
                PassengerId: t.PassengerId,
                FlightId: seg.flightId || "",
                SegmentId: seg.segmentId || "0",
                PaxId: t.PaxId
              }))
            });
          }
        });
      });

      if (hasError) return;

      if (tripsPayload.length === 0) {
        setCancelError("Please select at least one flight sector to cancel.");
        return;
      }
    }

    const cancelPayload = {
      BookingId: order?.BookingId || null,
      TransactionId: payload.TransactionId,
      Type: "F",
      Vendor: detail?.Vendor || payload.Vendor || "AF",
      IsCompleteCancel: isCompleteCancel,
      CancelType: 0,
      CancelCode: "001",
      Remarks: remarks || "I cancel the ticket",
      Trips: tripsPayload,
      SelectedTrip: true
    };

    cancelMutation.mutate(cancelPayload);
  };

  const handleRescheduleSubmit = () => {
    setRescheduleError("");
    setRescheduleSuccess("");

    let tripsPayload = [];
    let hasError = false;

    tripInfos.forEach((trip, tIdx) => {
      const segments = trip.SegmentList ?? [];
      segments.forEach((seg, sIdx) => {
        const segKey = `${tIdx}-${sIdx}`;
        if (rescheduleSelectedSegments[segKey]) {
          const dep = seg.da;
          const arr = seg.aa;
          const routeKey = `${dep?.code}-${arr?.code}`;
          const pnr = bookingTravellers[0]?.PnrDetails?.[routeKey] ?? payload.AirlinePnrs ?? "—";
          const reschedDate = rescheduleDates[segKey];

          if (!reschedDate) {
            setRescheduleError(`Please select a new reschedule date for sector ${dep?.code} → ${arr?.code}`);
            hasError = true;
            return;
          }

          const checkedTravellerIds = rescheduleSelectedTravellers[segKey] || [];
          if (checkedTravellerIds.length === 0) {
            setRescheduleError(`Please select at least one passenger for sector ${dep?.code} → ${arr?.code}`);
            hasError = true;
            return;
          }

          const travellersList = bookingTravellers.filter(t => checkedTravellerIds.includes(t.PassengerId));

          tripsPayload.push({
            Source: dep?.code,
            Destination: arr?.code,
            TripSegments: `${dep?.code}-${arr?.code}`,
            DepartureDate: getYYYYMMDD(seg.dt),
            NewDate: reschedDate,
            PNR: pnr,
            Travellers: travellersList.map(t => ({
              FirstName: t.FirstName,
              LastName: t.LastName,
              PassengerId: t.PassengerId,
              FlightId: seg.flightId || "",
              SegmentId: seg.segmentId || "0",
              PaxId: t.PaxId
            }))
          });
        }
      });
    });

    if (hasError) return;

    if (tripsPayload.length === 0) {
      setRescheduleError("Please select at least one flight sector to reschedule.");
      return;
    }

    const reschedPayload = {
      BookingId: order?.BookingId || payload.BookingId || null,
      TransactionId: payload.TransactionId,
      Trips: tripsPayload,
      SelectedTrip: true,
      Remarks: rescheduleRemarks || "I want to reschedule this booking",
      Vendor: detail?.Vendor || payload.Vendor || "AF"
    };

    rescheduleMutation.mutate(reschedPayload);
  };

  const isCancellable = order?.BookingStatus?.toLowerCase() === "confirmed" ||
    payload.BookingStatus === "S" ||
    detail?.BookingStatus === "S";

  if (!payload?.TransactionId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Invalid Access</h2>
        <p className="text-slate-500 mt-2">No booking reference details were found. Please navigate from your bookings list.</p>
        <button
          onClick={() => navigate('/my-profile')}
          className="mt-6 px-6 py-2.5 bg-[#78080B] text-white rounded-xl font-medium hover:bg-[#5a0608] transition cursor-pointer"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6 cursor-pointer font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </button>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-[#78080B] animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Fetching detailed booking information...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <p className="text-slate-800 font-bold text-lg">Failed to load booking details</p>
            <p className="text-slate-500 text-sm mt-1 max-w-md">{error?.message || "Something went wrong"}</p>
            <button
              onClick={() => navigate('/my-profile')}
              className="mt-6 px-5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer text-sm font-medium"
            >
              Go to Profile
            </button>
          </div>
        )}

        {!isLoading && !isError && detail && (
          <div className="space-y-6">
            {/* Header Status Card */}
            <div className="bg-gradient-to-r from-[#78080B] to-[#a01014] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-6 -translate-y-6">
                <Plane className="w-64 h-64 rotate-45" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Booking Confirmation</p>
                  <h2 className="text-2xl font-bold">{order?.BookingStatus || payload.BookingStatus || "CONFIRMED"}</h2>
                  {order?.BookingId && (
                    <p className="text-white/90 text-sm mt-1 font-medium">
                      Booking ID: <span className="font-bold text-white">{order.BookingId}</span>
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="text-white/70 text-xs mb-1">Transaction ID</p>
                  <p className="text-lg font-bold">#{payload.TransactionId}</p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Print Ticket Button & Dropdown */}
                <div className="relative">
                  <div className="inline-flex rounded-xl shadow-sm">
                    <button
                      onClick={() => printMutation.mutate("WithPrice")}
                      disabled={printMutation.isPending}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-l-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {printMutation.isPending ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          <span>Printing...</span>
                        </>
                      ) : (
                        <>
                          <Printer className="w-4.5 h-4.5" />
                          <span>Print Ticket</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsPrintDropdownOpen((prev) => !prev)}
                      disabled={printMutation.isPending}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-2.5 rounded-r-xl border-l border-slate-700 text-sm font-semibold transition cursor-pointer flex items-center disabled:opacity-50"
                      title="Print Options"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isPrintDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isPrintDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          setIsPrintDropdownOpen(false);
                          printMutation.mutate("WithPrice");
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-slate-500" />
                        Print (With Price)
                      </button>
                      <button
                        onClick={() => {
                          setIsPrintDropdownOpen(false);
                          printMutation.mutate("WithoutPrice");
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                      >
                        <FileText className="w-4 h-4 text-slate-500" />
                        Print (Without Price)
                      </button>
                    </div>
                  )}
                </div>

                {isCancellable && (
                  <>
                    <button
                      onClick={() => {
                        setCancelError("");
                        setCancelSuccess("");
                        setIsCancelModalOpen(true);
                      }}
                      className="bg-[#78080B] hover:bg-[#5a0608] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm hover:shadow"
                    >
                      <AlertOctagon className="w-4.5 h-4.5" />
                      Cancellation
                    </button>

                    <button
                      onClick={() => {
                        setRescheduleError("");
                        setRescheduleSuccess("");
                        setIsRescheduleModalOpen(true);
                      }}
                      className="bg-[#78080B] hover:bg-[#5a0608] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm hover:shadow"
                    >
                      <Calendar className="w-4.5 h-4.5" />
                      Reschedule
                    </button>
                  </>
                )}
              </div>

              {printError && (
                <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{printError}</span>
                  </div>
                  <button onClick={() => setPrintError("")} className="text-red-500 hover:text-red-800 p-1 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Key details grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Total Fare Amount</p>
                  <p className="text-2xl font-bold text-[#78080B]">
                    ₹ {(order?.Amount ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl text-[#78080B]">
                  <Receipt className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Booking Creation Date</p>
                  <p className="text-base font-semibold text-slate-800">
                    {formatBookingDate(order?.BookingCreatedOn || payload.BookingDate)}
                  </p>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Flight Route Cards */}
            {tripInfos.map((trip, tIdx) => {
              const segments = trip.SegmentList ?? [];
              return (
                <div key={tIdx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-[#78080B] px-5 py-3.5 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-bold">Flight Segment Route Details</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {segments.map((seg, sIdx) => {
                      const airline = seg.fD?.aI;
                      const dep = seg.da;
                      const arr = seg.aa;
                      const durationMins = seg.duration ?? 0;
                      const dHrs = Math.floor(durationMins / 60);
                      const dMins = durationMins % 60;
                      // PNR from first traveller
                      const firstTravPnr = bookingTravellers[0]?.PnrDetails;
                      const segKey = `${dep?.code}-${arr?.code}`;
                      const pnr = firstTravPnr?.[segKey] ?? payload.AirlinePnrs ?? "—";

                      // ── Connection Time Calculation ──
                      let connectionBanner = null;
                      if (sIdx > 0) {
                        const prevSeg = segments[sIdx - 1];
                        const prevArrDate = parseSegDateTime(prevSeg.at);
                        const curDepDate = parseSegDateTime(seg.dt);

                        if (prevArrDate && curDepDate) {
                          const diffMs = curDepDate - prevArrDate;
                          if (diffMs > 0) {
                            const diffMins = Math.round(diffMs / 60000);
                            const h = Math.floor(diffMins / 60);
                            const m = diffMins % 60;
                            const connectionTimeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
                            const connectionCity = prevSeg.aa?.city || prevSeg.aa?.name || "";

                            connectionBanner = (
                              <div className="px-5 py-2 bg-slate-50 border-y border-slate-100">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 border-t border-dashed border-orange-300" />
                                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    <Clock className="w-3.5 h-3.5" />
                                    Layover at {connectionCity}: {connectionTimeStr}
                                  </div>
                                  <div className="flex-1 border-t border-dashed border-orange-300" />
                                </div>
                              </div>
                            );
                          }
                        }
                      }

                      return (
                        <div key={sIdx}>
                          {connectionBanner}
                          <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-slate-800 text-sm sm:text-base">{airline?.name}</span>
                                <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded font-semibold">
                                  {airline?.code} {seg.fD?.fN}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">PNR: </span>
                                <span className="text-sm font-bold text-[#78080B]">{pnr}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="w-24 text-left">
                                <p className="text-xl sm:text-2xl font-black text-slate-800">{dep?.code}</p>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-[100px]">{dep?.city || dep?.name}</p>
                                <p className="text-xs font-semibold text-slate-700 mt-1">{seg.dt?.split(" ")[1] || seg.dt?.split("T")[1]}</p>
                                <p className="text-xs text-slate-400 font-medium">{seg.dt?.split(" ")[0] || seg.dt?.split("T")[0]}</p>
                                {dep?.terminal && <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1 font-medium">{dep.terminal}</span>}
                              </div>

                              <div className="flex-1 flex flex-col items-center gap-1">
                                <div className="text-xs text-slate-400 font-medium">{dHrs > 0 ? `${dHrs}h ` : ""}{dMins}m</div>
                                <div className="w-full flex items-center gap-1">
                                  <div className="h-px flex-1 bg-slate-200" />
                                  <Plane className="w-4 h-4 text-slate-300" />
                                  <div className="h-px flex-1 bg-slate-200" />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">{seg.stops === 0 ? "Non-stop" : `${seg.stops} stop`}</div>
                              </div>

                              <div className="w-24 text-right">
                                <p className="text-xl sm:text-2xl font-black text-slate-800">{arr?.code}</p>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-[100px]">{arr?.city || arr?.name}</p>
                                <p className="text-xs font-semibold text-slate-700 mt-1">{seg.at?.split(" ")[1] || seg.at?.split("T")[1]}</p>
                                <p className="text-xs text-slate-400 font-medium">{seg.at?.split(" ")[0] || seg.at?.split("T")[0]}</p>
                                {arr?.terminal && <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1 font-medium">{arr.terminal}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Passenger List */}
            {bookingTravellers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-[#78080B] px-5 py-3.5 flex items-center gap-2">
                  <User className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-bold">Passenger Details</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {bookingTravellers.map((trav, idx) => {
                    const pnrEntries = Object.entries(trav.PnrDetails ?? {});
                    return (
                      <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800 text-sm sm:text-base">
                            {trav.Title} {trav.FirstName} {trav.LastName}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50 font-semibold">{trav.PaxType}</span>
                            {trav.DateOfBirth && <span>DOB: {trav.DateOfBirth}</span>}
                          </div>
                        </div>
                        {pnrEntries.length > 0 && (
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-xs text-slate-400 mb-1">Route PNRs</p>
                            {pnrEntries.map(([route, pnr]) => (
                              <p key={route} className="text-xs text-slate-600 font-medium">
                                <span className="text-slate-400">{route}:</span> <span className="font-bold text-[#78080B]">{pnr}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vendor & Metadata Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-800 text-sm">Booking Verification Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-slate-400 mb-0.5">Booking Vendor</p>
                  <p className="font-semibold text-slate-700">{detail.Vendor || payload.Vendor || '—'}</p>
                </div>
                {order?.BookingUserDetails && (
                  <>
                    <div>
                      <p className="text-slate-400 mb-0.5">Outlet Name</p>
                      <p className="font-semibold text-slate-700">{order.BookingUserDetails.OutletName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">Retailer Code</p>
                      <p className="font-semibold text-slate-700">{order.BookingUserDetails.RetailerCode || '—'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Ticket Cancellation Modal ── */}
      {isCancelModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !cancelMutation.isLoading) setIsCancelModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-visible border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#78080B] to-[#a01014] text-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" />
                <h3 className="text-lg font-bold">Ticket Cancellation</h3>
              </div>
              <button
                disabled={cancelMutation.isLoading}
                onClick={() => setIsCancelModalOpen(false)}
                className="text-white/80 hover:text-white transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Error & Success Messages */}
              {cancelError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  {cancelError}
                </div>
              )}
              {cancelSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {cancelSuccess}
                </div>
              )}

              {/* Cancellation Type Radio Options */}
              <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60">
                <button
                  type="button"
                  disabled={cancelMutation.isLoading}
                  onClick={() => setIsCompleteCancel(true)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition cursor-pointer text-center ${isCompleteCancel
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Complete Cancellation
                </button>
                <button
                  type="button"
                  disabled={cancelMutation.isLoading}
                  onClick={() => setIsCompleteCancel(false)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition cursor-pointer text-center ${!isCompleteCancel
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Sector Wise Cancellation
                </button>
              </div>

              {/* Trip Segments & Travelers Selection */}
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-visible">
                <div className="bg-slate-50 grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 rounded-t-2xl">
                  <span className="col-span-1 text-center">Select</span>
                  <span className="col-span-3">Trip</span>
                  <span className="col-span-3">Departure Date</span>
                  <span className="col-span-5">Travellers</span>
                </div>

                <div className="divide-y divide-slate-100 rounded-b-2xl">
                  {(() => {
                    const allSegments = tripInfos.flatMap((trip, tIdx) =>
                      (trip.SegmentList ?? []).map((seg, sIdx) => ({ seg, tIdx, sIdx }))
                    );

                    return allSegments.map(({ seg, tIdx, sIdx }, idx) => {
                      const isLastRow = idx === allSegments.length - 1;
                      const segKey = `${tIdx}-${sIdx}`;
                      const dep = seg.da;
                      const arr = seg.aa;
                      const isChecked = !!selectedSegments[segKey];
                      const routeKey = `${dep?.code}-${arr?.code}`;
                      const pnr = bookingTravellers[0]?.PnrDetails?.[routeKey] ?? payload.AirlinePnrs ?? "—";

                      const currentSelected = selectedTravellers[segKey] || [];
                      const isAllSelected = currentSelected.length === bookingTravellers.length;

                      const handleToggleTraveller = (passengerId) => {
                        setSelectedTravellers(prev => {
                          const current = prev[segKey] || [];
                          const updated = current.includes(passengerId)
                            ? current.filter(id => id !== passengerId)
                            : [...current, passengerId];
                          return { ...prev, [segKey]: updated };
                        });
                      };

                      const handleToggleAllTravellers = () => {
                        setSelectedTravellers(prev => ({
                          ...prev,
                          [segKey]: isAllSelected ? [] : bookingTravellers.map(t => t.PassengerId)
                        }));
                      };

                      return (
                        <div key={segKey} className={`grid grid-cols-12 gap-2 px-4 py-4 items-center text-slate-700 ${isLastRow ? 'rounded-b-2xl' : ''}`}>
                          {/* Segment Checkbox */}
                          <div className="col-span-1 flex justify-center">
                            <input
                              type="checkbox"
                              checked={isCompleteCancel ? true : isChecked}
                              disabled={isCompleteCancel || cancelMutation.isLoading}
                              onChange={(e) => {
                                setSelectedSegments(prev => ({
                                  ...prev,
                                  [segKey]: e.target.checked
                                }));
                              }}
                              className="w-4.5 h-4.5 text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20"
                            />
                          </div>

                          {/* Sector Info */}
                          <div className="col-span-3 font-bold text-slate-800">
                            <div className="flex flex-col">
                              <span>{dep?.code} → {arr?.code}</span>
                              {pnr && <span className="text-[10px] text-slate-400 font-semibold uppercase">PNR: {pnr}</span>}
                            </div>
                          </div>

                          {/* Departure Date */}
                          <div className="col-span-3 text-xs font-semibold text-slate-500">
                            {getYYYYMMDD(seg.dt)}
                          </div>

                          {/* Passengers Selection Dropdown */}
                          <div className="col-span-5">
                            {(() => {
                              const activeSelected = isCompleteCancel
                                ? bookingTravellers.map(t => t.PassengerId)
                                : currentSelected;

                              const getButtonText = () => {
                                if (activeSelected.length === 0) return "Select travellers";
                                return bookingTravellers
                                  .filter(t => activeSelected.includes(t.PassengerId))
                                  .map(t => `${t.FirstName} ${t.LastName} (${t.PaxType})`)
                                  .join(', ');
                              };

                              return (
                                <div className="relative">
                                  <button
                                    type="button"
                                    disabled={isCompleteCancel || !isChecked || cancelMutation.isLoading}
                                    onClick={() => setOpenDropdownIdx(openDropdownIdx === segKey ? null : segKey)}
                                    className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50 transition cursor-pointer disabled:opacity-75 disabled:bg-slate-50 font-bold text-slate-700 truncate"
                                    title={getButtonText()}
                                  >
                                    <span className="truncate mr-1">{getButtonText()}</span>
                                    {!isCompleteCancel && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                  </button>

                                  {openDropdownIdx === segKey && !isCompleteCancel && (
                                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 max-h-48 overflow-y-auto">
                                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs font-bold border-b border-slate-100 text-slate-800">
                                        <input
                                          type="checkbox"
                                          checked={isAllSelected}
                                          onChange={handleToggleAllTravellers}
                                          className="text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20"
                                        />
                                        Select all
                                      </label>
                                      {bookingTravellers.map(t => (
                                        <label key={t.PassengerId} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                                          <input
                                            type="checkbox"
                                            checked={currentSelected.includes(t.PassengerId)}
                                            onChange={() => handleToggleTraveller(t.PassengerId)}
                                            className="text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20"
                                          />
                                          {t.FirstName} {t.LastName}
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Remarks Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cancellation Remarks</label>
                <textarea
                  rows={2}
                  disabled={cancelMutation.isLoading}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks for cancellation..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78080B]/20 focus:border-[#78080B] placeholder-slate-400 resize-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 rounded-b-3xl">
              <button
                type="button"
                disabled={cancelMutation.isLoading}
                onClick={() => setIsCancelModalOpen(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                disabled={cancelMutation.isLoading}
                onClick={handleCancelSubmit}
                className="px-5 py-2.5 bg-[#78080B] hover:bg-[#5a0608] text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md shadow-[#78080B]/10 hover:shadow"
              >
                {cancelMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reschedule Modal ── */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#78080B] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-lg">Reschedule Ticket Booking</h3>
              </div>
              <button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={() => setIsRescheduleModalOpen(false)}
                className="text-white/75 hover:text-white transition p-1 hover:bg-white/10 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Feedback Alerts */}
              {rescheduleError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm animate-fadeIn">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <p className="font-medium">{rescheduleError}</p>
                </div>
              )}

              {rescheduleSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <p className="font-medium">{rescheduleSuccess}</p>
                </div>
              )}

              <div className="bg-red-50/60 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-[#78080B] text-xs">
                <Calendar className="w-5 h-5 text-[#78080B] shrink-0" />
                <span>
                  Select the sectors you wish to reschedule, pick the new departure date, and choose which passengers will be moved to the new date.
                </span>
              </div>

              {/* Trip Segments & Travelers Selection for Rescheduling */}
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-visible">
                <div className="bg-slate-50 grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 rounded-t-2xl">
                  <span className="col-span-1 text-center">Select</span>
                  <span className="col-span-3">Trip Sector</span>
                  <span className="col-span-2">Original Date</span>
                  <span className="col-span-3">New Date</span>
                  <span className="col-span-3">Travellers</span>
                </div>

                <div className="divide-y divide-slate-100 rounded-b-2xl">
                  {(() => {
                    const allSegments = tripInfos.flatMap((trip, tIdx) =>
                      (trip.SegmentList ?? []).map((seg, sIdx) => ({ seg, tIdx, sIdx }))
                    );

                    return allSegments.map(({ seg, tIdx, sIdx }, idx) => {
                      const isLastRow = idx === allSegments.length - 1;
                      const segKey = `${tIdx}-${sIdx}`;
                      const dep = seg.da;
                      const arr = seg.aa;
                      const isChecked = !!rescheduleSelectedSegments[segKey];
                      const routeKey = `${dep?.code}-${arr?.code}`;
                      const pnr = bookingTravellers[0]?.PnrDetails?.[routeKey] ?? payload.AirlinePnrs ?? "—";

                      const currentSelected = rescheduleSelectedTravellers[segKey] || [];
                      const isAllSelected = currentSelected.length === bookingTravellers.length;
                      const currentDateVal = rescheduleDates[segKey] || "";

                      const handleToggleTraveller = (passengerId) => {
                        setRescheduleSelectedTravellers(prev => {
                          const current = prev[segKey] || [];
                          const updated = current.includes(passengerId)
                            ? current.filter(id => id !== passengerId)
                            : [...current, passengerId];
                          return { ...prev, [segKey]: updated };
                        });
                      };

                      const handleToggleAllTravellers = () => {
                        setRescheduleSelectedTravellers(prev => ({
                          ...prev,
                          [segKey]: isAllSelected ? [] : bookingTravellers.map(t => t.PassengerId)
                        }));
                      };

                      return (
                        <div key={segKey} className={`grid grid-cols-12 gap-2 px-4 py-4 items-center text-slate-700 ${isLastRow ? 'rounded-b-2xl' : ''}`}>
                          {/* Segment Checkbox */}
                          <div className="col-span-1 flex justify-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={rescheduleMutation.isPending}
                              onChange={(e) => {
                                setRescheduleSelectedSegments(prev => ({
                                  ...prev,
                                  [segKey]: e.target.checked
                                }));
                              }}
                              className="w-4.5 h-4.5 text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20 cursor-pointer"
                            />
                          </div>

                          {/* Sector Info */}
                          <div className="col-span-3 font-bold text-slate-800">
                            <div className="flex flex-col">
                              <span>{dep?.code} → {arr?.code}</span>
                              {pnr && <span className="text-[10px] text-slate-400 font-semibold uppercase">PNR: {pnr}</span>}
                            </div>
                          </div>

                          {/* Original Departure Date */}
                          <div className="col-span-2 text-xs font-semibold text-slate-500">
                            {getYYYYMMDD(seg.dt)}
                          </div>

                          {/* New Reschedule Date Picker */}
                          <div className="col-span-3">
                            <input
                              type="date"
                              disabled={!isChecked || rescheduleMutation.isPending}
                              value={currentDateVal}
                              onChange={(e) => {
                                setRescheduleDates(prev => ({
                                  ...prev,
                                  [segKey]: e.target.value
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#78080B]/20 focus:border-[#78080B] disabled:opacity-50 disabled:bg-slate-50 cursor-pointer"
                            />
                          </div>

                          {/* Passengers Selection Dropdown */}
                          <div className="col-span-3">
                            {(() => {
                              const activeSelected = currentSelected;

                              const getButtonText = () => {
                                if (activeSelected.length === 0) return "Select travellers";
                                return bookingTravellers
                                  .filter(t => activeSelected.includes(t.PassengerId))
                                  .map(t => `${t.FirstName} ${t.LastName}`)
                                  .join(', ');
                              };

                              return (
                                <div className="relative">
                                  <button
                                    type="button"
                                    disabled={!isChecked || rescheduleMutation.isPending}
                                    onClick={() => setRescheduleOpenDropdownIdx(rescheduleOpenDropdownIdx === segKey ? null : segKey)}
                                    className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:bg-slate-50 font-bold text-slate-700 truncate"
                                    title={getButtonText()}
                                  >
                                    <span className="truncate mr-1">{getButtonText()}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  </button>

                                  {rescheduleOpenDropdownIdx === segKey && isChecked && (
                                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 max-h-48 overflow-y-auto">
                                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs font-bold border-b border-slate-100 text-slate-800">
                                        <input
                                          type="checkbox"
                                          checked={isAllSelected}
                                          onChange={handleToggleAllTravellers}
                                          className="text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20"
                                        />
                                        Select all
                                      </label>
                                      {bookingTravellers.map(t => (
                                        <label key={t.PassengerId} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                                          <input
                                            type="checkbox"
                                            checked={currentSelected.includes(t.PassengerId)}
                                            onChange={() => handleToggleTraveller(t.PassengerId)}
                                            className="text-[#78080B] rounded border-slate-300 focus:ring-[#78080B]/20"
                                          />
                                          {t.FirstName} {t.LastName}
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Remarks Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reschedule Remarks</label>
                <textarea
                  rows={2}
                  disabled={rescheduleMutation.isPending}
                  value={rescheduleRemarks}
                  onChange={(e) => setRescheduleRemarks(e.target.value)}
                  placeholder="Enter remarks for rescheduling..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78080B]/20 focus:border-[#78080B] placeholder-slate-400 resize-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 rounded-b-3xl">
              <button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={handleRescheduleSubmit}
                className="px-5 py-2.5 bg-[#78080B] hover:bg-[#5a0608] text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md shadow-[#78080B]/10 hover:shadow"
              >
                {rescheduleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rescheduling...
                  </>
                ) : (
                  'Reschedule Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetails;
