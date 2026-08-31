import api from "@/services/api.js";
import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import TripBenefitsModal from "@/components/modals/TripBenefitsModal";
import TicketDetailsReviewModal from "@/components/modals/TicketDetailsReviewModal";
import ViewAllCouponsModal from "@/components/modals/ViewAllCouponsModal";
import BaggageModal from "@/components/modals/BaggageModal";
import MealModal from "@/components/modals/MealModal";
import ErrorModal from "@/components/modals/ErrorModal";
import AirlineLogo from "@/assets/imgs/airlinelogo.webp";
import { Trash2, User, Luggage, Utensils, CirclePlus, ShieldAlert, ChevronRight, Plus, CheckCircle2, XCircle, Plane, Loader2 } from "lucide-react";
import Select from "react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { countryOptions, stateOptions } from "@/data/ExtraData.js";
import { bookingStore } from "@/store/bookingStore";
import ReviewDetailsSkeleton from "@/components/layout/ReviewDetailsSkeleton";
const Modal = lazy(() => import("@/components/modals/Modal"));
const FlightSeatMap = lazy(() => import("./FlightSeatMap/Index"));
import { getAirlineLogo } from "@/utils/airlineCode";

const getTravelType = async (bookingData) => {
  try {
    const flight = bookingData.isRoundTrip ? bookingData.outboundFlight : bookingData.flight;
    const originCode = flight?.AirlineDeparture?.code || flight?.DepartureAirportCode || flight?.Origin;
    const destCode = flight?.AirlineArrival?.code || flight?.ArrivalAirportCode || flight?.Destination;

    if (originCode && destCode) {
      const [originRes, destRes] = await Promise.all([
        api.post(`/Flight/ListAirportsByCode?airportCode=${originCode.toUpperCase()}`, {}),
        api.post(`/Flight/ListAirportsByCode?airportCode=${destCode.toUpperCase()}`, {})
      ]);

      const originCountry = originRes?.data?.Data?.[0]?.CountryCode || flight?.AirlineDeparture?.countryCode || flight?.AirlineDeparture?.CountryCode;
      const destCountry = destRes?.data?.Data?.[0]?.CountryCode || flight?.AirlineArrival?.countryCode || flight?.AirlineArrival?.CountryCode;
      const countryCodeArr = ["IND", "IN"];

      const isOriginIndia = countryCodeArr.includes(originCountry?.toUpperCase());
      const isDestIndia = countryCodeArr.includes(destCountry?.toUpperCase());

      // If either origin or destination is not IN or IND, it is an international flight (1), otherwise domestic (0)
      if (!isOriginIndia || !isDestIndia) {
        return 1;
      } else {
        return 0;
      }
    }
  } catch (err) {
    console.error("Failed to determine travel type dynamically:", err);
  }
  return 0;
};

const parseSegDateTime = (dtStr) => {
  if (!dtStr) return null;
  const [datePart, timePart] = dtStr.split(" ");
  if (!datePart || !timePart) return null;

  const timeSplit = timePart.split(":");
  const hours = parseInt(timeSplit[0], 10);
  const minutes = parseInt(timeSplit[1], 10);

  const dateSplit = datePart.includes("-") ? datePart.split("-") : datePart.split("/");
  if (dateSplit.length < 3) return null;

  let day, month, year;
  if (dateSplit[0].length === 4) {
    year = parseInt(dateSplit[0], 10);
    month = parseInt(dateSplit[1], 10) - 1;
    day = parseInt(dateSplit[2], 10);
  } else {
    day = parseInt(dateSplit[0], 10);
    month = parseInt(dateSplit[1], 10) - 1;
    year = parseInt(dateSplit[2], 10);
  }

  return new Date(year, month, day, hours, minutes);
};

export default function ReviewDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isFlightSeatMap, setIsFlightSeatMap] = useState(false);
  const [selectedSeatCost, setSelectedSeatCost] = useState(0);
  const [selectedSeatData, setSelectedSeatData] = useState(null); // { seats: Set, services: [] }
  const [selectedSeatDetails, setSelectedSeatDetails] = useState([]); // ordered array of seat objects

  const [isTripBenefitsModal, setIsTripBenefitsModal] = useState(false);
  const [isTicketDetailsReviewModal, setIsTicketDetailsReviewModal] =
    useState(false);
  const [isViewAllCouponsModal, setIsViewAllCouponsModal] = useState(false);
  const [isBaggageModal, setIsBaggageModal] = useState(false);
  const [baggageTarget, setBaggageTarget] = useState(null);
  const [isMealModal, setIsMealModal] = useState(false);
  const [mealTarget, setMealTarget] = useState(null);
  const [isInternational, setIsInternational] = useState(() => {
    return bookingStore.get()?.travelType === 1;
  });
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const currentBooking = bookingStore.get();
  const currentFlightKey = currentBooking.isRoundTrip
    ? `${currentBooking.outboundFareReviewKey || currentBooking.outboundFlight?.FareReviewKey || ""}_${currentBooking.returnFareReviewKey || currentBooking.returnFlight?.FareReviewKey || ""}`
    : (currentBooking.fareReviewKey || currentBooking.selectedFare?.FareReviewKey || currentBooking.flight?.FareReviewKey || currentBooking.flightId || "");

  const {
    data: fareReviewData,
    isLoading: loadingFareReview,
    isFetching: fetchingFareReview,
    error: fareReviewError,
  } = useQuery({
    queryKey: ["fareReview", currentFlightKey],
    staleTime: 0,
    gcTime: 0,
    queryFn: async () => {
      const bookingData = bookingStore.get();
      let reviewKeyList = [];
      let oldPrice = 0;


      if (bookingData.isRoundTrip) {
        const outKey =
          bookingData.outboundFareReviewKey ||
          bookingData.outboundFlight?.FareReviewKey;

        const retKey =
          bookingData.returnFareReviewKey ||
          bookingData.returnFlight?.FareReviewKey;

        if (outKey) reviewKeyList.push(outKey);
        if (retKey) reviewKeyList.push(retKey);

        // OldPrice = sum of both flights' TotalFare
        oldPrice =
          (bookingData.outboundFlight?.AirlineMinNetPrice ||
            bookingData.outboundFlight?.AirlineMinPrice ||
            0) +
          (bookingData.returnFlight?.AirlineMinNetPrice ||
            bookingData.returnFlight?.AirlineMinPrice ||
            0);
      } else {
        const key =
          bookingData.fareReviewKey ||
          bookingData.selectedFare?.FareReviewKey ||
          bookingData.flight?.FareReviewKey;

        if (key) reviewKeyList.push(key);

        oldPrice =
          bookingData.selectedFare?.PriceList?.TotalFare ||
          bookingData.flight?.AirlineMinNetPrice ||
          bookingData.flight?.AirlineMinPrice ||
          0;
      }

      const adults = Number(bookingData.travellers?.adults ?? searchParams.get("adults") ?? 1);
      const children = Number(bookingData.travellers?.children ?? searchParams.get("children") ?? 0);
      const infants = Number(bookingData.travellers?.infants ?? searchParams.get("infants") ?? 0);

      // TravelType determination
      const travelType = await getTravelType(bookingData);
      bookingStore.set({ travelType });
      setIsInternational(travelType === 1);

      const payload = {
        TravelType: travelType,
        ReviewKeyList: reviewKeyList,
        OldPrice: oldPrice,
        PaxInfo: {
          ADULT: adults,
          CHILD: children,
          INFANT: infants,
        },
      };

      let res;
      try {
        res = await api.post("/flight/FareReview", payload);
      } catch (axiosErr) {
        // Extract the API's own ErrorMessage from the error response body
        const apiMsg =
          axiosErr?.response?.data?.ErrorMessage ||
          axiosErr?.response?.data?.message ||
          axiosErr?.message ||
          "Failed to load fare details.";
        throw new Error(apiMsg);
      }

      if (!res.data?.IsSuccess) {
        throw new Error(
          res.data?.ErrorMessage || "Failed to load fare details.",
        );
      }

      return res.data.Data;
    },
  });

  const isMultipleFlights = fareReviewData?.TripInfo?.[0]?.FlightDetailResponses?.length > 1;

  const fareRuleData = fareReviewData?.TripInfo?.[0]?.FareRules?.fareRule ?? [];
  const TripBaggageData = fareReviewData?.TripInfo?.[0]?.TripBaggageList ?? [];
  const TripMealData = fareReviewData?.TripInfo?.[0]?.TripMealList ?? [];

  const FlightKeyList = fareReviewData?.FlightKeyList ?? [];
  const FlightId = fareReviewData?.TripInfo?.[0]?.FlightId;

  const FlightsDepartureAndArrivalDetails = fareReviewData?.TripInfo[0].FlightDetailResponses;
  const flight = FlightsDepartureAndArrivalDetails?.[0];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [activeTab, setActiveTab] = useState("flight-summary");

  const handleTabClick = (id) => {
    setActiveTab(id);
    handleScroll(id);
  };

  const updateTraveller = (category, index, field, value) => {
    const updated = { ...travellers };
    updated[category][index][field] = value;
    setTravellers(updated);
  };

  const addTraveller = (category, limit) => {
    if (travellers[category].length < limit) {
      setTravellers({
        ...travellers,
        [category]: [
          ...travellers[category],
          category === "Adults"
            ? makeAdult(Date.now())
            : category === "Childs"
              ? makeChild(Date.now())
              : makeInfant(Date.now()),
        ],
      });
    }
  };

  const removeTraveller = (category, index) => {
    const traveller = travellers[category][index];
    const hasData = Object.values(traveller).some((v) => v);
    if (
      hasData &&
      !window.confirm(
        `Remove this ${category.slice(0, -1)}? All entered data will be lost.`,
      )
    )
      return;

    setTravellers({
      ...travellers,
      [category]: travellers[category].filter((_, i) => i !== index),
    });
  };
  // Derive fare numbers from API response (fall back to 0 while loading)
  const totalPriceList = fareReviewData?.TotalPriceList?.fC;
  const afC = fareReviewData?.TotalPriceList?.afC;

  // Base Fare (BF)
  const baseFare = totalPriceList?.BF ?? 0;

  // Total taxes & fees (TAF = YQ + AGST + OT + MF + MFT)
  const taxes = totalPriceList?.TAF ?? 0;

  // Tax breakdown from afC.TAF
  const fuelSurcharge = afC?.TAF?.YQ ?? 0;
  const gst           = afC?.TAF?.AGST ?? 0;
  const otherTaxes    = afC?.TAF?.OT ?? 0;
  // MF (Management Fee) if present
  const managementFee = afC?.TAF?.MF ?? 0;

  const services = fareReviewData?.TransactionFee ?? 0;

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const isIntl =
    isInternational ||
    fareReviewData?.TravelType === 1 ||
    fareReviewData?.TripInfo?.[0]?.TravelType === 1 ||
    bookingStore.get()?.travelType === 1;

  // Derive traveller limits from API
  const TotalTravellers = {
    Adults: fareReviewData?.PaxInfo?.ADULT?.Count ?? 1,
    Childs: fareReviewData?.PaxInfo?.CHILD?.Count ?? 0,
    Infants: fareReviewData?.PaxInfo?.INFANT?.Count ?? 0,
  };

  const { Adults, Childs, Infants } = TotalTravellers;

  const makeAdult = (id) => ({
    id,
    firstName: "",
    lastName: "",
    gender: "MALE",
    dob: "",
    countryCode: "",
    mobile: "",
    email: "",
    wheelchair: false,
    passportNumber: "",
    passportNationality: "",
    passportExpiry: "",
    passportIssued: "",
    selectedBaggage: [],
    selectedMeals: [],
  });
  const makeChild = (id) => ({
    id,
    firstName: "",
    lastName: "",
    gender: "MALE",
    dob: "",
    selectedBaggage: [],
    selectedMeals: [],
  });
  const makeInfant = (id) => ({
    id,
    firstName: "",
    lastName: "",
    gender: "MALE",
    dob: "",
    accompanyingAdult: "",
    selectedBaggage: [],
    selectedMeals: [],
  });

  const [travellers, setTravellers] = useState({
    Adults: [],
    Childs: [],
    Infants: [],
  });

  // Compute total baggage price & count across all travellers
  const totalBaggageCost = useMemo(() => {
    const all = [
      ...(travellers.Adults || []),
      ...(travellers.Childs || []),
      ...(travellers.Infants || []),
    ];
    return all.reduce((sum, t) => {
      const bList = t.selectedBaggage || [];
      return sum + bList.reduce((bSum, item) => bSum + (Number(item.Amount) || 0), 0);
    }, 0);
  }, [travellers]);

  const totalBaggageItemsCount = useMemo(() => {
    const all = [
      ...(travellers.Adults || []),
      ...(travellers.Childs || []),
      ...(travellers.Infants || []),
    ];
    return all.reduce((sum, t) => sum + (t.selectedBaggage?.length || 0), 0);
  }, [travellers]);

  // Compute total meal price & count across all travellers
  const totalMealCost = useMemo(() => {
    const all = [
      ...(travellers.Adults || []),
      ...(travellers.Childs || []),
      ...(travellers.Infants || []),
    ];
    return all.reduce((sum, t) => {
      const mList = t.selectedMeals || [];
      return sum + mList.reduce((mSum, item) => mSum + (Number(item.Amount) || 0), 0);
    }, 0);
  }, [travellers]);

  const totalMealItemsCount = useMemo(() => {
    const all = [
      ...(travellers.Adults || []),
      ...(travellers.Childs || []),
      ...(travellers.Infants || []),
    ];
    return all.reduce((sum, t) => sum + (t.selectedMeals?.length || 0), 0);
  }, [travellers]);

  // subTotal = BF + TAF + extras (baggage, meals, seat)
  const subTotal = baseFare + taxes + totalBaggageCost + totalMealCost + selectedSeatCost;

  // subtotal alias (used by calculateTotal)
  const subtotal = baseFare + taxes;

  const convenienceFee = fareReviewData?.ConvenienceFee ?? 0;

  const amountToPay = subTotal + convenienceFee;

  const commission = fareReviewData?.Commission ?? 0;

  const netPrice = amountToPay - commission;

  const calculateTotal = useMemo(() => {
    const currentSubtotal = subtotal + totalBaggageCost + totalMealCost + selectedSeatCost;
    if (!selectedCoupon) return currentSubtotal;
    const { discountType, value } = selectedCoupon;
    let discount = 0;
    if (discountType === "flat") discount = value;
    else if (discountType === "percent")
      discount = Math.min((currentSubtotal * value) / 100, 800);
    return Math.max(currentSubtotal - discount, 0);
  }, [selectedCoupon, subtotal, totalBaggageCost, totalMealCost, selectedSeatCost]);

  const handleOpenBaggageModal = (category, index, label) => {
    const traveller = travellers[category]?.[index];
    setBaggageTarget({
      category,
      index,
      label: `${label} ${index + 1}`,
      firstName: traveller?.firstName || "",
      lastName: traveller?.lastName || "",
    });
    setIsBaggageModal(true);
  };

  const handleSaveBaggage = (selectedItems) => {
    if (baggageTarget) {
      const { category, index } = baggageTarget;
      setTravellers((prev) => {
        const updatedCat = [...prev[category]];
        if (updatedCat[index]) {
          updatedCat[index] = {
            ...updatedCat[index],
            selectedBaggage: selectedItems,
          };
        }
        return { ...prev, [category]: updatedCat };
      });
    }
  };

  const handleSelectSeatModal = () => {
    // Adults + Childs need seats; Infants do NOT get seats
    const totalSeatCount = Adults + Childs;
    bookingStore.set({
      passengers: travellers,
      totalSeatCount,
      extraBaggageTotal: totalBaggageCost,
      extraMealTotal: totalMealCost,
      flightKeyList: FlightKeyList,
      flightId: FlightId,
      flightSummary: flightSummary
    });
    setIsFlightSeatMap(true);
  };

  const handleSeatsContinue = ({ selectedSeats, selectedServices, totalAmount, selectedSeatDetails: details = [] }) => {
    // Save the seat cost and data back into ReviewDetails fare calculation
    setSelectedSeatCost(totalAmount);
    setSelectedSeatData({ seats: selectedSeats, services: selectedServices });
    setSelectedSeatDetails(details);
    // Persist into bookingStore so payment page can access seat selections
    bookingStore.set({
      seatTotal: totalAmount,
      selectedSeats: Array.from(selectedSeats),
      selectedServices,
      // Full seat detail objects (in selection order, index = passenger order)
      selectedSeatDetails: details,
    });
    setIsFlightSeatMap(false);
  };

  const handleRemoveSingleBaggage = (category, index, itemId) => {
    setTravellers((prev) => {
      const updatedCat = [...prev[category]];
      if (updatedCat[index]) {
        const getItemId = (item) => item.SSRKey || item.Code || item.Description;
        const currentList = updatedCat[index].selectedBaggage || [];
        updatedCat[index] = {
          ...updatedCat[index],
          selectedBaggage: currentList.filter((b) => getItemId(b) !== itemId),
        };
      }
      return { ...prev, [category]: updatedCat };
    });
  };

  const handleOpenMealModal = (category, index, label) => {
    const traveller = travellers[category]?.[index];
    setMealTarget({
      category,
      index,
      label: `${label} ${index + 1}`,
      firstName: traveller?.firstName || "",
      lastName: traveller?.lastName || "",
    });
    setIsMealModal(true);
  };

  const handleSaveMeals = (selectedItems) => {
    if (mealTarget) {
      const { category, index } = mealTarget;
      setTravellers((prev) => {
        const updatedCat = [...prev[category]];
        if (updatedCat[index]) {
          updatedCat[index] = {
            ...updatedCat[index],
            selectedMeals: selectedItems,
          };
        }
        return { ...prev, [category]: updatedCat };
      });
    }
  };

  const handleRemoveSingleMeal = (category, index, itemId) => {
    setTravellers((prev) => {
      const updatedCat = [...prev[category]];
      if (updatedCat[index]) {
        const getItemId = (item) => item.SSRKey || item.Code || item.Description;
        const currentList = updatedCat[index].selectedMeals || [];
        updatedCat[index] = {
          ...updatedCat[index],
          selectedMeals: currentList.filter((m) => getItemId(m) !== itemId),
        };
      }
      return { ...prev, [category]: updatedCat };
    });
  };

  const flightSummary = useMemo(() => {
    const trip = fareReviewData?.TripInfo?.[0];
    const legs = trip?.FlightDetailResponses ?? [];
    const first = legs[0];
    const last = legs[legs.length - 1] || first;
    if (!first) return null;

    return {
      airlineName: first.AirlineName || "Airline",
      airlineCode: first.AirlineCode || "",
      flightNo: first.FlightNo || "",
      craft: first.Craft || first.Equipment || "Airbus A320",
      depCode: first.AirlineDeparture?.code || first.AirlineDeparture?.city || "DEL",
      depTime: first.DepartureTime || first.AirlineDeparture?.time || "14:30",
      arrCode: last.AirlineArrival?.code || last.AirlineArrival?.city || "BOM",
      arrTime: last.ArrivalTime || last.AirlineArrival?.time || "16:45",
      duration: first.AirlineDuration || "2h 15m",
    };
  }, [fareReviewData]);

  // ─── Booking Confirmation Modal State ────────────────────────────────────────
  const [bookingResult, setBookingResult] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Flight Booking Mutation ──────────────────────────────────────────────────
  const bookingMutation = useMutation({
    mutationFn: async () => {
      const bookingData = bookingStore.get();

      // Build TravellerInfoList from travellers state
      const buildTravellerList = () => {
        const list = [];
        const mapPaxType = (key) =>
          key === "Adults" ? "ADULT" : key === "Childs" ? "CHILD" : "INFANT";
        const mapTitle = (gender) => (gender === "FEMALE" ? "MS" : "MR");

        // Get seat details from bookingStore (set in handleSeatsContinue)
        // selectedSeatDetails is an ORDERED array: index 0 = pax 0, index 1 = pax 1 ...
        const storedSeatDetails = bookingStore.get().selectedSeatDetails ?? [];

        // Helper to map SSR items to API format
        const mapSSRItem = (item) => ({
          Key: item.Key ?? item.SSRKey ?? "",
          Code: item.Code ?? "",
          TripType: item.TripType ?? 0,
          Amount: Number(item.Amount) ?? 0,
          Description: item.Description ?? "",
          ...(item.IsEmdRequired && { IsEmdRequired: true }),
          ...(item.IsParameterRequired && { IsParameterRequired: true }),
        });

        // Build a flat ordered list of pax (Adults first, then Childs — no Infants for seats)
        const paxList = [
          ...travellers.Adults.map((t) => ({ t, key: "Adults" })),
          ...travellers.Childs.map((t) => ({ t, key: "Childs" })),
        ];

        Object.entries(travellers).forEach(([key, group]) => {
          group.forEach((t) => {
            const paxType = mapPaxType(key);

            // Find the global index of this traveller in the paxList (Adults+Childs order)
            const globalPaxIndex = paxList.findIndex((p) => p.t === t);

            // The seat selected for this pax (by order of selection)
            const seatObj = globalPaxIndex >= 0 ? storedSeatDetails[globalPaxIndex] : null;

            let seatSSRs = [];
            if (seatObj) {
              const raw = seatObj.raw || seatObj;
              seatSSRs = [{
                Key: raw.Key ?? raw.SSRKey ?? "",
                Code: raw.SeatNo ?? raw.SeatCode ?? seatObj.number ?? "",
                TripType: raw.TripType ?? 0,
                Amount: Number(raw.Amount ?? raw.Total_Amount ?? seatObj.price ?? 0),
                Description: raw.SeatClass ?? seatObj.classType ?? raw.SeatNo ?? "",
                ...(raw.IsEmdRequired && { IsEmdRequired: true }),
                ...(raw.IsParameterRequired && { IsParameterRequired: true }),
              }];
            }

            const baggageSSRs = (t.selectedBaggage ?? []).map(mapSSRItem);
            const mealSSRs = (t.selectedMeals ?? []).map(mapSSRItem);

            const ssrBaggageFlag = baggageSSRs.length > 0;
            const ssrMealFlag = mealSSRs.length > 0;
            const ssrSeatFlag = seatSSRs.length > 0;

            const entry = {
              Title: mapTitle(t.gender),
              FirstName: (t.firstName || "").trim().toUpperCase(),
              LastName: (t.lastName || "").trim().toUpperCase(),
              PaxType: paxType,
              ...(ssrBaggageFlag && { SSRBaggageInfosFlag: true, SSRBaggageInfos: baggageSSRs }),
              ...(ssrMealFlag && { SSRMealInfosFlag: true, SSRMealInfos: mealSSRs }),
              ...(ssrSeatFlag && { SSRSeatInfosFlag: true, SSRSeatInfos: seatSSRs }),
            };

            if (t.dob) entry.DateOfBirth = t.dob;
            if (t.passportNumber) entry.PassportNumber = t.passportNumber;
            if (t.passportNationality) entry.PassportNationality = t.passportNationality.toUpperCase();
            if (t.passportExpiry) entry.PassportExpiryDate = t.passportExpiry;
            if (t.passportIssued) entry.PasssportIssuedDate = t.passportIssued;

            list.push(entry);
          });
        });
        return list;
      };

      // BookingKey & FlightKeys from fareReviewData
      const bookingKey = fareReviewData?.BookingKey ?? "";
      const flightKeys = fareReviewData?.FlightKeyList ?? [];
      const travelType = bookingStore.get().travelType ?? 0;
      const vendor = fareReviewData?.TripInfo?.[0]?.Vendor ?? fareReviewData?.Vendor ?? "";

      // BookingAmount = amountToPay
      const payload = {
        Vendor: vendor,
        TravelType: travelType,
        FlightKeys: flightKeys,
        BookingKey: bookingKey,
        PaymentInfoList: [
          {
            BookingAmount: amountToPay,
          },
        ],
        TravellerInfoList: buildTravellerList(),
        DeliveryInfo: {
          Emails: travellers.Adults.map((t) => t.email).filter(Boolean),
          Contacts: travellers.Adults.map((t) => t.mobile).filter(Boolean),
        },
        PGTransactionId: 0,
        PaymentFlag: true,
      };

      let res;
      try {
        res = await api.post("/flight/InstantBooking", payload);
      } catch (axiosErr) {
        const apiMsg =
          axiosErr?.response?.data?.ErrorMessage ||
          axiosErr?.response?.data?.message ||
          axiosErr?.message ||
          "Booking failed. Please try again.";
        throw new Error(apiMsg);
      }

      if (!res.data?.IsSuccess) {
        throw new Error(res.data?.ErrorMessage || "Booking failed. Please try again.");
      }

      return res.data;
    },
    onSuccess: (data) => {
      // Parse the nested BookingResponse JSON string
      let parsed = null;
      try {
        const raw = data?.Data?.BookingResponse;
        parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        parsed = null;
      }
      setBookingResult({ raw: data, parsed });
      setIsBookingModalOpen(true);
    },
    onError: (err) => {
      setErrorMessage(err?.message || "Booking failed. Please try again.");
    },
  });

  const validateForm = () => {
    if (travellers.Adults.length < Adults) return false;
    if (travellers.Childs.length < Childs) return false;
    if (travellers.Infants.length < Infants) return false;

    for (let i = 0; i < travellers.Adults.length; i++) {
      const a = travellers.Adults[i];
      if (!a.firstName?.trim() || !a.lastName?.trim() || !a.dob || !a.mobile?.trim() || !a.email?.trim()) {
        return false;
      }
      if (isIntl) {
        if (!a.passportNumber?.trim() || !a.passportNationality?.trim() || !a.passportIssued || !a.passportExpiry) {
          return false;
        }
      }
    }

    for (let i = 0; i < travellers.Childs.length; i++) {
      const c = travellers.Childs[i];
      if (!c.firstName?.trim() || !c.lastName?.trim() || !c.dob) {
        return false;
      }
    }

    for (let i = 0; i < travellers.Infants.length; i++) {
      const inf = travellers.Infants[i];
      if (!inf.firstName?.trim() || !inf.lastName?.trim() || !inf.dob || !inf.accompanyingAdult?.trim()) {
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    setShowValidationErrors(true);
    if (!validateForm()) {
      handleScroll("traveller-details");
      return;
    }
    bookingMutation.mutate();
  };

  useEffect(() => {
    const sections = [
      "flight-summary",
      "travel-insurance",
      "traveller-details",
      "seats-meals",
      "add-ons",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const formatFareRule = (text = "") => {
    if (!text) return "";

    // If API returned HTML
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return { isHtml: true, content: text };
    }

    // Plain text formatting
    const content = text
      .replace(/^\s*-+\s*$/gm, "")
      .replace(/\.\s+/g, ".\n")
      .replace(/;\s+/g, ";\n")
      .replace(/:\s+/g, ":\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return { isHtml: false, content };
  };

  // ─── Parse booking result for display ───────────────────────────────────────
  const parsedBooking = bookingResult?.parsed;
  const order = parsedBooking?.Order;
  const airInfo = parsedBooking?.ItemInfos?.AIR;
  const tripInfos = airInfo?.TripInfos ?? [];
  const bookingTravellers = airInfo?.TravellerInfoList ?? [];

  if (loadingFareReview || (!fareReviewData && !fareReviewError)) {
    return <ReviewDetailsSkeleton />;
  }

  if (fareReviewError && !fareReviewData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#78080B] flex items-center justify-center mb-4 border border-red-100">
          <ShieldAlert className="w-8 h-8 text-[#78080B]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Flight Details</h2>
        <p className="text-slate-600 text-sm max-w-md mb-6">
          {fareReviewError?.message || "We couldn't retrieve the latest fare details. The fare may have expired or is temporarily unavailable."}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#78080B] text-white text-sm font-semibold rounded-lg hover:bg-[#8F0306] transition shadow-sm cursor-pointer"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/flight-results")}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ErrorModal
        open={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title="Booking Failed"
        message={errorMessage}
      />
      {/* ── Booking Confirmation Modal ── */}
      {isBookingModalOpen && bookingResult && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsBookingModalOpen(false); }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ animation: "modalSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <style>{`
              @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(40px) scale(0.95); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes checkPop {
                0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
                70%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#78080B] to-[#a01014] rounded-t-2xl px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white" style={{ width: `${60 + i * 20}px`, height: `${60 + i * 20}px`, top: `${-20 + i * 10}px`, right: `${-10 + i * 15}px`, opacity: 0.5 }} />
                ))}
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div style={{ animation: "checkPop 0.5s 0.2s both" }}>
                  <CheckCircle2 className="w-14 h-14 text-green-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium uppercase tracking-wider mb-0.5">Booking Confirmed</p>
                  <h2 className="text-2xl font-bold">{order?.BookingStatus ?? "CONFIRMED"}</h2>
                  {order?.BookingId && (
                    <p className="text-white/80 text-sm mt-1">
                      Booking ID: <span className="font-bold text-white">{order.BookingId}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Amount Paid</p>
                  <p className="text-2xl font-bold text-[#78080B]">
                    ₹ {(order?.Amount ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Booking Date</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {order?.BookingCreatedOn
                      ? (() => {
                        const d = new Date(order.BookingCreatedOn);
                        if (isNaN(d)) return order.BookingCreatedOn;
                        const dd = String(d.getDate()).padStart(2, "0");
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const yyyy = d.getFullYear();
                        return `${dd}-${mm}-${yyyy} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                      })()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Flight Segments */}
              {tripInfos.map((trip, tIdx) => {
                const segments = trip.SegmentList ?? [];
                return (
                  <div key={tIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">Flight Route</span>
                    </div>
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
                      const pnr = firstTravPnr?.[segKey] ?? "—";

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
                              <div className="px-4 py-2">
                                <div className="flex items-center gap-2 my-2">
                                  <div className="flex-1 border-t border-dashed border-orange-300" />
                                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <circle cx="12" cy="12" r="9" />
                                      <path d="M12 7v5l3 3" />
                                    </svg>
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
                          <div className={`px-4 py-4 ${sIdx > 0 && !connectionBanner ? "border-t border-slate-100" : ""}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-sm">{airline?.name}</span>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{airline?.code} {seg.fD?.fN}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-500">PNR: </span>
                                <span className="text-sm font-bold text-[#78080B]">{pnr}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <p className="text-xl font-bold text-slate-800">{dep?.code}</p>
                                <p className="text-xs text-slate-500">{dep?.name}</p>
                                <p className="text-xs font-medium text-slate-700">{seg.dt?.split(" ")[1]}</p>
                                <p className="text-xs text-slate-400">{seg.dt?.split(" ")[0]}</p>
                                {dep?.terminal && <p className="text-xs text-slate-400 mt-0.5">{dep.terminal}</p>}
                              </div>
                              <div className="flex-1 flex flex-col items-center gap-1">
                                <div className="text-xs text-slate-400">{dHrs > 0 ? `${dHrs}h ` : ""}{dMins}m</div>
                                <div className="w-full flex items-center gap-1">
                                  <div className="h-px flex-1 bg-slate-300" />
                                  <Plane className="w-3 h-3 text-slate-400" />
                                  <div className="h-px flex-1 bg-slate-300" />
                                </div>
                                <div className="text-xs text-slate-400">{seg.stops === 0 ? "Non-stop" : `${seg.stops} stop`}</div>
                              </div>
                              <div className="text-center">
                                <p className="text-xl font-bold text-slate-800">{arr?.code}</p>
                                <p className="text-xs text-slate-500">{arr?.name}</p>
                                <p className="text-xs font-medium text-slate-700">{seg.at?.split(" ")[1]}</p>
                                <p className="text-xs text-slate-400">{seg.at?.split(" ")[0]}</p>
                                {arr?.terminal && <p className="text-xs text-slate-400 mt-0.5">{arr.terminal}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Travellers */}
              {bookingTravellers.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Travellers</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {bookingTravellers.map((t, tIdx) => {
                      const pnrEntries = Object.entries(t.PnrDetails ?? {});
                      const statusEntries = Object.entries(t.StatusMap ?? {});
                      return (
                        <div key={tIdx} className="px-4 py-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {t.Title} {t.FirstName} {t.LastName}
                            </p>
                            <p className="text-xs text-slate-500">{t.PaxType} · DOB: {t.DateOfBirth}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {pnrEntries.map(([route, pnr]) => (
                              <p key={route} className="text-xs text-slate-600">
                                <span className="text-slate-400">{route}:</span> <span className="font-bold text-[#78080B]">{pnr}</span>
                              </p>
                            ))}
                            {statusEntries.map(([route, status]) => (
                              <p key={route} className="text-xs">
                                {/* <span className={`font-semibold ${status === "CONFIRMED" ? "text-green-600" : "text-orange-500"}`}>{status}</span> */}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {order?.DeliveryInfo && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
                  <p className="text-blue-700 font-semibold mb-1">Confirmation sent to:</p>
                  {order.DeliveryInfo.Emails?.map((e) => (
                    <p key={e} className="text-blue-600">{e}</p>
                  ))}
                  {order.DeliveryInfo.Contacts?.map((c) => (
                    <p key={c} className="text-blue-600">{c}</p>
                  ))}
                </div>
              )}

              {/* Transaction ID */}
              {bookingResult?.raw?.Data?.TransactionId && (
                <p className="text-xs text-slate-400 text-center">
                  Transaction ID: {bookingResult.raw.Data.TransactionId}
                </p>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-full bg-[#78080B] hover:bg-[#a01014] text-white font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {isFareModalOpen && (
        <Suspense fallback={null}>
          <Modal
            open={isFareModalOpen}
            onClose={() => setIsFareModalOpen(false)}
            title="Fare Rules"
          >
            {Array.isArray(fareRuleData) && fareRuleData.length > 0 ? (
              <div className="space-y-4 text-sm">
                {fareRuleData.map((rule, idx) => {
                  const { isHtml, content } = formatFareRule(
                    rule.FareRuleDescription,
                  );

                  return (
                    <div
                      key={idx}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-[#920000] mb-2">
                        {rule.FareRuleName}
                      </p>

                      {isHtml ? (
                        <div
                          className="prose prose-sm max-w-none text-xs leading-6"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <div className="text-xs text-gray-700 leading-6 space-y-2">
                          {content.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No Fare Rules Found</p>
            )}
          </Modal>
        </Suspense>
      )}

      {isFlightSeatMap && (
        <Suspense fallback={null}>
          <FlightSeatMap
            onClose={() => setIsFlightSeatMap(false)}
            flightLegs={FlightsDepartureAndArrivalDetails}
            onSeatsContinue={handleSeatsContinue}
            initialSelectedSeats={selectedSeatData?.seats ? Array.from(selectedSeatData.seats) : []}
          />
        </Suspense>
      )}

      {isTripBenefitsModal && (
        <TripBenefitsModal onClose={() => setIsTripBenefitsModal(false)} />
      )}

      {isTicketDetailsReviewModal && (
        <TicketDetailsReviewModal
          onClose={() => setIsTicketDetailsReviewModal(false)}
        />
      )}

      {isBaggageModal && (
        <BaggageModal
          onClose={() => {
            setIsBaggageModal(false);
            setBaggageTarget(null);
          }}
          travellerInfo={baggageTarget}
          initialSelectedBaggage={
            baggageTarget
              ? travellers[baggageTarget.category]?.[baggageTarget.index]?.selectedBaggage || []
              : []
          }
          onSave={handleSaveBaggage}
          baggageList={TripBaggageData}
          routeLabel={(() => {
            const trip = fareReviewData?.TripInfo?.[0];
            const first = trip?.FlightDetailResponses?.[0];
            const last =
              trip?.FlightDetailResponses?.[
              trip.FlightDetailResponses.length - 1
              ];
            if (!first) return "";
            const dep =
              first.AirlineDeparture?.city ||
              first.AirlineDeparture?.code ||
              "";
            const arr =
              last?.AirlineArrival?.city || last?.AirlineArrival?.code || "";
            return dep && arr ? `${dep} → ${arr}` : "";
          })()}
        />
      )}

      {isMealModal && (
        <MealModal
          onClose={() => {
            setIsMealModal(false);
            setMealTarget(null);
          }}
          travellerInfo={mealTarget}
          initialSelectedMeals={
            mealTarget
              ? travellers[mealTarget.category]?.[mealTarget.index]?.selectedMeals || []
              : []
          }
          onSave={handleSaveMeals}
          mealList={TripMealData}
          routeLabel={(() => {
            const trip = fareReviewData?.TripInfo?.[0];
            const first = trip?.FlightDetailResponses?.[0];
            const last =
              trip?.FlightDetailResponses?.[
              trip.FlightDetailResponses.length - 1
              ];
            if (!first) return "";
            const dep =
              first.AirlineDeparture?.city ||
              first.AirlineDeparture?.code ||
              "";
            const arr =
              last?.AirlineArrival?.city || last?.AirlineArrival?.code || "";
            return dep && arr ? `${dep} → ${arr}` : "";
          })()}
        />
      )}

      {/* Coupons Filters Drawer */}
      {isViewAllCouponsModal && (
        <ViewAllCouponsModal onClose={() => setIsViewAllCouponsModal(false)} />
      )}

      <div className="min-h-screen relative">
        {/* Header */}
        <div
          className="z-999 bg-[#78080B] text-white py-6 px-4 sticky top-0"
          style={{ boxShadow: " 0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">
              Complete your booking
            </h1>
            <div className="hidden lg:flex gap-4 text-sm">
              <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("flight-summary")}
              >
                Flights Summary
              </span>
              <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("traveller-details")}
              >
                Traveller Details
              </span>
              <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("seats-meals")}
              >
                Seats & Meals
              </span>
              <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("add-ons")}
              >
                Add-ons
              </span>
            </div>
          </div>

          <div className="flex mt-1 lg:hidden gap-2 overflow-x-auto scrollbar-hide text-sm whitespace-nowrap px-1">
            {[
              ["flight-summary", "Flights Summary"],
              ["traveller-details", "Traveller Details"],
              ["seats-meals", "Seats & Meals"],
              ["add-ons", "Add-ons"],
            ].map(([id, label]) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`px-4 py-1 rounded-full transition-all duration-200 flex-shrink-0 ${isActive ? "bg-white text-[#78080B] font-semibold shadow-sm" : "text-slate-300 hover:text-white hover:bg-white/10"} `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 pb-5 sm:pb-2 bg-cover bg-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Main Content */}
              <div className="order-1 lg:order-1 lg:col-span-3 space-y-4 sm:space-y-6">
                {/* Flight Details Card */}
                <div
                  id="flight-summary"
                  className="bg-white rounded-lg shadow-sm border border-slate-200"
                >
                  <div className="p-2 sm:p-4">
                    {loadingFareReview ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        Loading flight details…
                      </div>
                    ) : fareReviewError ? (
                      <div className="p-6 text-center text-red-600 text-sm">
                        {fareReviewError.message}
                      </div>
                    ) : (
                      (() => {
                        // Flatten all trips — render one card per TripInfo entry
                        const trips = fareReviewData?.TripInfo ?? [];
                        if (trips.length === 0)
                          return (
                            <div className="p-6 text-center text-slate-500 text-sm">
                              No flight data available.
                            </div>
                          );
                        return trips.map((trip, tripIdx) => {
                          const legs = trip.FlightDetailResponses ?? [];
                          const first = legs[0];
                          const last = legs[legs.length - 1];
                          if (!first) return null;

                          const depCity =
                            first.AirlineDeparture?.city ||
                            first.AirlineDeparture?.code ||
                            "—";
                          const arrCity =
                            last?.AirlineArrival?.city ||
                            last?.AirlineArrival?.code ||
                            "—";
                          const depAirport = first.AirlineDeparture?.name || "";
                          const arrAirport = last?.AirlineArrival?.name || "";
                          const depTerminal = first.AirlineDeparture?.terminal
                            ? ` T${first.AirlineDeparture.terminal}`
                            : "";
                          const arrTerminal = last?.AirlineArrival?.terminal
                            ? ` T${last.AirlineArrival.terminal}`
                            : "";
                          const stops =
                            first.Stops === 0
                              ? "Non Stop"
                              : `${first.Stops} Stop`;
                          const duration = first.AirlineDuration || "";
                          const refundable =
                            trip.Refundable || "NON-Refundable";
                          const fareIdentifier = trip.FareIdentifier || "";
                          const paxAdult = fareReviewData?.PaxInfo?.ADULT;
                          const cabinBag = paxAdult?.HandBag || "7 Kgs";
                          const checkInBag = paxAdult?.CheckingBag
                            ? `${paxAdult.CheckingBag} Kgs`
                            : "15 Kgs";

                          return (
                            <div className="my-2" key={tripIdx}>
                              <div
                                className="p-2"
                                style={{
                                  boxShadow: "0 1px 4px 0 rgba(0, 0, 0, .21)",
                                }}
                              >
                                {/* Route Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-1 h-16 sm:h-20 bg-blue-500 rounded"></div>
                                    <div>
                                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                                        {depCity} → {arrCity}
                                      </h2>
                                      <p className="text-xs sm:text-sm text-slate-600 mt-1 flex flex-wrap gap-2">
                                        <span className="bg-yellow-50 border border-yellow-200 rounded-lg py-1 px-2">
                                          {first.DepartureDate || "—"}
                                        </span>
                                        <span>
                                          {stops} · {duration}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <span className="self-start lg:self-center bg-[#78080B] text-white text-xs font-semibold px-3 py-1 rounded uppercase">
                                    {refundable}
                                  </span>
                                </div>

                                <button
                                  className="cursor-pointer text-blue-600 text-sm font-medium mb-4"
                                  onClick={() => setIsFareModalOpen(true)}
                                >
                                  View Fare Rules
                                </button>

                                {/* Airline Info */}
                                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">

                                  {!isMultipleFlights && (
                                    <div className="flex items-center gap-3 flex-wrap">

                                      <img
                                        src={getAirlineLogo(flight.AirlineCode)}
                                        alt={flight.AirlineName?.split(",")[0] || "Airline"}
                                        className="rounded-full w-8 h-8"
                                      />

                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <span className="font-semibold text-sm">
                                          {first.AirlineName}
                                        </span>
                                        <span className="text-slate-600 text-xs sm:text-sm">
                                          {first.AirlineCode} {first.FlightNo}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {fareIdentifier && (
                                    <div className="text-sm">
                                      <span className="text-slate-600">
                                        Economy &gt;{" "}
                                      </span>
                                      <span className="text-blue-600 font-semibold">
                                        {fareIdentifier}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Flight Times — supports direct & connecting */}
                                <div className="bg-[#f4f4f4] p-3 sm:p-4">
                                  {legs.map((leg, legIdx) => {
                                    const legDepCity =
                                      leg.AirlineDeparture?.city ||
                                      leg.AirlineDeparture?.code ||
                                      "—";
                                    const legArrCity =
                                      leg.AirlineArrival?.city ||
                                      leg.AirlineArrival?.code ||
                                      "—";
                                    const legDepAirport =
                                      leg.AirlineDeparture?.name || "";
                                    const legArrAirport =
                                      leg.AirlineArrival?.name || "";
                                    const legDepTerminal =
                                      leg.AirlineDeparture?.terminal
                                        ? ` · ${leg.AirlineDeparture.terminal}`
                                        : "";
                                    const legArrTerminal =
                                      leg.AirlineArrival?.terminal
                                        ? ` · ${leg.AirlineArrival.terminal}`
                                        : "";

                                    // ── Layover calculation ──────────────────
                                    let layoverBanner = null;
                                    if (legIdx > 0) {
                                      const prevLeg = legs[legIdx - 1];
                                      let layoverLabel = "";

                                      // Prefer ConnectingTime (in minutes) from current leg
                                      const ctMin = parseInt(
                                        leg.ConnectingTime,
                                        10
                                      );
                                      if (!isNaN(ctMin) && ctMin > 0) {
                                        const h = Math.floor(ctMin / 60);
                                        const m = ctMin % 60;
                                        layoverLabel =
                                          h > 0
                                            ? `${h}h ${m}m`
                                            : `${m}m`;
                                      } else {
                                        // Fallback: compute from prev arrival → current departure
                                        try {
                                          const prevArrDT = new Date(
                                            `${prevLeg.ArrivalDate}T${prevLeg.ArrivalTime}`
                                          );
                                          const curDepDT = new Date(
                                            `${leg.DepartureDate}T${leg.DepartureTime}`
                                          );
                                          const diffMs =
                                            curDepDT - prevArrDT;
                                          if (diffMs > 0) {
                                            const totalMin = Math.round(
                                              diffMs / 60000
                                            );
                                            const h = Math.floor(
                                              totalMin / 60
                                            );
                                            const m = totalMin % 60;
                                            layoverLabel =
                                              h > 0
                                                ? `${h}h ${m}m`
                                                : `${m}m`;
                                          }
                                        } catch (_) { }
                                      }

                                      const layoverCity =
                                        prevLeg.AirlineArrival?.city ||
                                        prevLeg.AirlineArrival?.code ||
                                        "";

                                      layoverBanner = (
                                        <div className="flex items-center gap-2 my-3">
                                          <div className="flex-1 border-t border-dashed border-orange-300" />
                                          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="w-3.5 h-3.5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                            >
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                              />
                                              <path d="M12 7v5l3 3" />
                                            </svg>
                                            {leg.IsConnecting && "Layover"}
                                            {layoverCity
                                              ? ` in ${layoverCity}`
                                              : ""}
                                            {layoverLabel
                                              ? `: ${layoverLabel}`
                                              : ""}
                                          </div>
                                          <div className="flex-1 border-t border-dashed border-orange-300" />
                                        </div>
                                      );
                                    }

                                    return (
                                      <div key={legIdx}>
                                        {layoverBanner}

                                        {/* Leg segment card */}
                                        <div className="space-y-3">
                                          {/* Airline row for this leg */}
                                          {legs.length > 1 && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                              <img
                                                src={AirlineLogo}
                                                alt="airline"
                                                className="w-5 h-5"
                                              />
                                              <span className="font-medium text-slate-700">
                                                {leg.AirlineName}
                                              </span>
                                              <span>
                                                {leg.AirlineCode}{" "}
                                                {leg.FlightNo}
                                              </span>
                                            </div>
                                          )}

                                          {/* Departure */}
                                          <div className="flex gap-4">
                                            <div className="text-xl sm:text-2xl font-bold">
                                              {leg.DepartureTime}
                                            </div>
                                            <div>
                                              <div className="font-semibold text-sm sm:text-base">
                                                {legDepCity}
                                              </div>
                                              <div className="text-xs sm:text-sm text-slate-600">
                                                {legDepAirport}
                                                {legDepTerminal}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Duration indicator */}
                                          <div className="ml-6 border-l-2 border-dashed border-slate-300 pl-4 py-1">
                                            <div className="text-xs sm:text-sm text-slate-600">
                                              {leg.AirlineDuration}
                                            </div>
                                          </div>

                                          {/* Arrival */}
                                          <div className="flex gap-4">
                                            <div className="text-xl sm:text-2xl font-bold">
                                              {leg.ArrivalTime}
                                              {leg.NextDayFlag && (
                                                <sup className="text-xs text-orange-500 font-semibold ml-0.5">
                                                  +1
                                                </sup>
                                              )}
                                            </div>
                                            <div>
                                              <div className="font-semibold text-sm sm:text-base">
                                                {legArrCity}
                                              </div>
                                              <div className="text-xs sm:text-sm text-slate-600">
                                                {legArrAirport}
                                                {legArrTerminal}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="bg-[#f4f4f4] flex justify-center">
                                  <div className="border-t border-slate-300 w-[95%]"></div>
                                </div>

                                {/* Baggage Info */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[#f4f4f4] text-xs sm:text-sm">
                                  {/* Cabin Baggage */}
                                  <div className="flex items-center gap-2">
                                    <Luggage className="w-5 h-5 text-slate-600 shrink-0" />

                                    <span>
                                      <strong>Cabin Baggage:</strong> {cabinBag} / Adult
                                    </span>
                                  </div>

                                  {/* Check-In Baggage */}
                                  <div className="flex items-center gap-2">
                                    <Luggage className="w-5 h-5 text-slate-600 shrink-0" />

                                    <span>
                                      <strong>Check-In Baggage:</strong> {checkInBag} / Adult
                                    </span>
                                  </div>

                                  {/* Select Seat */}
                                  <div className="sm:ml-auto">
                                    {selectedSeatData?.seats?.size > 0 ? (
                                      <button
                                        type="button"
                                        onClick={handleSelectSeatModal}
                                        className="flex items-center gap-1.5 text-[#78080B] font-semibold text-sm whitespace-nowrap hover:text-[#5a0608] transition-colors cursor-pointer"
                                      >
                                        <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-[#78080B] rounded-full px-2.5 py-0.5 text-xs font-bold">
                                          ✓ {Array.from(selectedSeatData.seats).join(", ")} · ₹{selectedSeatCost.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">· Change</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={handleSelectSeatModal}
                                        className="text-blue-600 font-semibold text-sm whitespace-nowrap hover:text-blue-700 transition-colors cursor-pointer"
                                      >
                                        Select Seat
                                      </button>
                                    )}
                                  </div>
                                </div>


                              </div>
                            </div>
                          );
                        });
                      })()
                    )}
                  </div>

                  {/* Cancellation Policy */}
                </div>

                {/* Important Information */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-bold">
                        Important Information
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm text-slate-700">
                      <div>
                        <div className="flex font-bold mb-2">
                          <ShieldAlert className="mr-2 text-red-500" />
                          <p className="">Check-in & Boarding Pass</p>
                        </div>

                        <p>
                          Please complete your web check-in before your flight and keep your boarding pass easily accessible. We recommend arriving at the airport well in advance to allow enough time for security checks and boarding.
                        </p>
                      </div>

                      <div className="my-8">
                        <div className="flex font-bold mb-2">
                          <ShieldAlert className="mr-2 text-red-500 " />
                          <p className="">
                            Baggage Information
                          </p>
                        </div>
                        <p>
                          Baggage allowance may vary depending on the airline, fare type, and route. Please check your booking details for the applicable baggage allowance. Additional baggage or excess weight may incur extra charges.
                        </p>
                      </div>

                      <div>
                        <div className="flex font-bold mb-2">
                          <ShieldAlert className="mr-2 text-red-500" />
                          <p className="">Travel Documents</p>
                        </div>
                        <p>
                          Make sure you carry all required travel documents, including a valid ID and any necessary visa or permit. For international flights, check the entry requirements of your destination before travelling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travellers Details */}
                <div
                  id="traveller-details"
                  className="bg-white rounded-lg shadow-sm border border-slate-200"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold">Traveller Details</h3>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 text-sm text-orange-800">
                      <span className="font-semibold">Important:</span> Enter
                      name as per passport or Government-approved ID.
                    </div>

                    {/* Render for each category */}
                    {[
                      { label: "Adult", key: "Adults", limit: Adults },
                      { label: "Child", key: "Childs", limit: Childs },
                      { label: "Infant", key: "Infants", limit: Infants },
                    ].map(({ label, key, limit }) => (
                      <div key={key} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">
                            {label} Details
                          </h4>
                          <span className="text-sm text-slate-500">
                            {travellers[key].length}/{limit} added
                          </span>
                        </div>

                        {travellers[key].map((t, i) => (
                          <div
                            key={t.id}
                            className="mb-4 border border-slate-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <label className="font-semibold">
                                {label.toUpperCase()} {i + 1}
                              </label>
                              {travellers[key].length > 0 && (
                                <button
                                  onClick={() => removeTraveller(key, i)}
                                  className="cursor-pointer text-[#78080B] hover:text-red-800 font-semibold flex items-center gap-1 text-sm"
                                >
                                  <Trash2 className="w-4 h-4" /> Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <input
                                  type="text"
                                  placeholder="First & Middle Name"
                                  value={t.firstName}
                                  onChange={(e) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "firstName",
                                      e.target.value,
                                    )
                                  }
                                  className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.firstName?.trim()
                                      ? "border-red-500 bg-red-50/20"
                                      : "border-slate-300"
                                    }`}
                                />
                                {showValidationErrors && !t.firstName?.trim() && (
                                  <span className="text-[11px] text-red-600 font-medium">First & Middle Name is required</span>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  value={t.lastName}
                                  onChange={(e) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "lastName",
                                      e.target.value,
                                    )
                                  }
                                  className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.lastName?.trim()
                                      ? "border-red-500 bg-red-50/20"
                                      : "border-slate-300"
                                    }`}
                                />
                                {showValidationErrors && !t.lastName?.trim() && (
                                  <span className="text-[11px] text-red-600 font-medium">Last Name is required</span>
                                )}
                              </div>

                              {/* Gender */}
                              <div className="flex flex-col sm:flex-row gap-2 h-[38px]">
                                {["MALE", "FEMALE"].map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() =>
                                      updateTraveller(key, i, "gender", g)
                                    }
                                    className={`flex-1 py-2 px-4 rounded border text-sm font-medium transition-colors ${t.gender === g
                                      ? "bg-[#78080B] text-white border-[#78080B]"
                                      : "bg-white text-slate-700 border-slate-300 hover:border-[#78080B]"
                                      }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Conditional Fields – Adults */}
                            {key === "Adults" && (
                              <>
                                {/* Row 1: DOB + Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">Date of Birth</label>
                                    <input
                                      type="date"
                                      value={t.dob}
                                      onChange={(e) =>
                                        updateTraveller(key, i, "dob", e.target.value)
                                      }
                                      className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.dob
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-slate-300"
                                        }`}
                                    />
                                    {showValidationErrors && !t.dob && (
                                      <span className="text-[11px] text-red-600 font-medium">Date of Birth is required</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">Mobile Number</label>
                                    <input
                                      type="tel"
                                      placeholder="Mobile Number"
                                      value={t.mobile}
                                      onChange={(e) =>
                                        updateTraveller(key, i, "mobile", e.target.value)
                                      }
                                      className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.mobile?.trim()
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-slate-300"
                                        }`}
                                    />
                                    {showValidationErrors && !t.mobile?.trim() && (
                                      <span className="text-[11px] text-red-600 font-medium">Mobile Number is required</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">Email Address</label>
                                    <input
                                      type="email"
                                      placeholder="Email Address"
                                      value={t.email}
                                      onChange={(e) =>
                                        updateTraveller(key, i, "email", e.target.value)
                                      }
                                      className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.email?.trim()
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-slate-300"
                                        }`}
                                    />
                                    {showValidationErrors && !t.email?.trim() && (
                                      <span className="text-[11px] text-red-600 font-medium">Email Address is required</span>
                                    )}
                                  </div>
                                </div>

                                {/* Row 2: Passport Details (International Only) */}
                                {isIntl && (
                                  <div className="mb-3">
                                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Passport Details</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Passport Number</label>
                                        <input
                                          type="text"
                                          placeholder="Passport Number"
                                          value={t.passportNumber}
                                          onChange={(e) =>
                                            updateTraveller(key, i, "passportNumber", e.target.value.toUpperCase())
                                          }
                                          className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 uppercase ${showValidationErrors && !t.passportNumber?.trim()
                                              ? "border-red-500 bg-red-50/20"
                                              : "border-slate-300"
                                            }`}
                                        />
                                        {showValidationErrors && !t.passportNumber?.trim() && (
                                          <span className="text-[11px] text-red-600 font-medium">Passport Number is required</span>
                                        )}
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Nationality (e.g. IN)</label>
                                        <input
                                          type="text"
                                          placeholder="Nationality (e.g. IN)"
                                          maxLength={2}
                                          value={t.passportNationality}
                                          onChange={(e) =>
                                            updateTraveller(key, i, "passportNationality", e.target.value.toUpperCase())
                                          }
                                          className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 uppercase ${showValidationErrors && !t.passportNationality?.trim()
                                              ? "border-red-500 bg-red-50/20"
                                              : "border-slate-300"
                                            }`}
                                        />
                                        {showValidationErrors && !t.passportNationality?.trim() && (
                                          <span className="text-[11px] text-red-600 font-medium">Nationality is required</span>
                                        )}
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Passport Issue Date</label>
                                        <input
                                          type="date"
                                          value={t.passportIssued}
                                          onChange={(e) =>
                                            updateTraveller(key, i, "passportIssued", e.target.value)
                                          }
                                          className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.passportIssued
                                              ? "border-red-500 bg-red-50/20"
                                              : "border-slate-300"
                                            }`}
                                        />
                                        {showValidationErrors && !t.passportIssued && (
                                          <span className="text-[11px] text-red-600 font-medium">Passport Issue Date is required</span>
                                        )}
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Passport Expiry Date</label>
                                        <input
                                          type="date"
                                          value={t.passportExpiry}
                                          onChange={(e) =>
                                            updateTraveller(key, i, "passportExpiry", e.target.value)
                                          }
                                          className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.passportExpiry
                                              ? "border-red-500 bg-red-50/20"
                                              : "border-slate-300"
                                            }`}
                                        />
                                        {showValidationErrors && !t.passportExpiry && (
                                          <span className="text-[11px] text-red-600 font-medium">Passport Expiry Date is required</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {(key === "Childs" || key === "Infants") && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs text-slate-500">Date of Birth</label>
                                  <input
                                    type="date"
                                    value={t.dob}
                                    onChange={(e) =>
                                      updateTraveller(
                                        key,
                                        i,
                                        "dob",
                                        e.target.value,
                                      )
                                    }
                                    className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.dob
                                        ? "border-red-500 bg-red-50/20"
                                        : "border-slate-300"
                                      }`}
                                  />
                                  {showValidationErrors && !t.dob && (
                                    <span className="text-[11px] text-red-600 font-medium">Date of Birth is required</span>
                                  )}
                                </div>
                                {key === "Infants" && (
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">Accompanying Adult Name</label>
                                    <input
                                      type="text"
                                      placeholder="Accompanying Adult Name"
                                      value={t.accompanyingAdult}
                                      onChange={(e) =>
                                        updateTraveller(
                                          key,
                                          i,
                                          "accompanyingAdult",
                                          e.target.value,
                                        )
                                      }
                                      className={`border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 ${showValidationErrors && !t.accompanyingAdult?.trim()
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-slate-300"
                                        }`}
                                    />
                                    {showValidationErrors && !t.accompanyingAdult?.trim() && (
                                      <span className="text-[11px] text-red-600 font-medium">Accompanying Adult Name is required</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Wheelchair (Adults only) */}
                            {key === "Adults" && (
                              <div className="flex items-center gap-2 mb-3">
                                <input
                                  type="checkbox"
                                  checked={t.wheelchair}
                                  onChange={(e) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "wheelchair",
                                      e.target.checked,
                                    )
                                  }
                                  className="cursor-pointer w-4 h-4"
                                />
                                <label className="text-sm text-slate-600">
                                  I require wheelchair (Optional)
                                </label>
                              </div>
                            )}

                            {/* Extra Baggage Section per Traveller */}
                            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                  <Luggage className="w-4 h-4 text-[#78080B] shrink-0" />
                                  <span>Extra Baggage</span>
                                </div>
                                {(!t.selectedBaggage || t.selectedBaggage.length === 0) ? (
                                  <span className="text-xs text-slate-500 italic pl-6">No extra baggage selected</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5 pl-6 mt-1">
                                    {t.selectedBaggage.map((bItem) => {
                                      const itemId = bItem.SSRKey || bItem.Code || bItem.Description;
                                      return (
                                        <span
                                          key={itemId}
                                          className="inline-flex items-center gap-1.5 bg-white text-[#78080B] text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200 shadow-2xs"
                                        >
                                          {bItem.Description || bItem.Code} (+₹{Number(bItem.Amount).toLocaleString('en-IN')})
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSingleBaggage(key, i, itemId)}
                                            className="text-slate-400 hover:text-red-700 ml-0.5 font-bold"
                                            title="Remove item"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenBaggageModal(key, i, label)}
                                className="cursor-pointer text-xs font-semibold text-[#78080B] hover:bg-red-100 flex items-center justify-center gap-1.5 bg-white px-3.5 py-2 rounded-lg border border-red-200 shadow-2xs transition shrink-0 self-start sm:self-auto"
                              >
                                <Luggage className="w-4 h-4 text-[#78080B]" />
                                {t.selectedBaggage && t.selectedBaggage.length > 0 ? "Edit Baggage" : "+ Add Baggage"}
                              </button>
                            </div>

                            {/* Extra Meal Section per Traveller */}
                            <div className="mt-2 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                  <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                                  <span>Extra Meal</span>
                                </div>
                                {(!t.selectedMeals || t.selectedMeals.length === 0) ? (
                                  <span className="text-xs text-slate-500 italic pl-6">No extra meal selected</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5 pl-6 mt-1">
                                    {t.selectedMeals.map((mItem) => {
                                      const itemId = mItem.SSRKey || mItem.Code || mItem.Description;
                                      return (
                                        <span
                                          key={itemId}
                                          className="inline-flex items-center gap-1.5 bg-white text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-orange-200 shadow-2xs"
                                        >
                                          {mItem.Description || mItem.Code} (+₹{Number(mItem.Amount).toLocaleString('en-IN')})
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSingleMeal(key, i, itemId)}
                                            className="text-slate-400 hover:text-orange-700 ml-0.5 font-bold"
                                            title="Remove item"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenMealModal(key, i, label)}
                                className="cursor-pointer text-xs font-semibold text-[#78080B] hover:bg-red-100 flex items-center justify-center gap-1.5 bg-white px-3.5 py-2 rounded-lg border border-red-200 shadow-2xs transition shrink-0 self-start sm:self-auto"
                              >
                                <Utensils className="w-4 h-4 text-[#78080B]" />
                                {t.selectedMeals && t.selectedMeals.length > 0 ? "Edit Meals" : "+ Add Meal"}
                              </button>
                            </div>

                            {/* Seat Section per Traveller (Adults + Childs only) */}
                            {key !== "Infants" && (() => {
                              // Build ordered pax list same as booking logic
                              const allPax = [
                                ...travellers.Adults.map((p) => p),
                                ...travellers.Childs.map((p) => p),
                              ];
                              const globalPaxIdx = allPax.indexOf(t);
                              const seatsArr = selectedSeatData?.seats ? Array.from(selectedSeatData.seats) : [];
                              const assignedSeat = seatsArr[globalPaxIdx] ?? null;
                              const assignedSeatPrice = selectedSeatDetails[globalPaxIdx]?.price ?? 0;

                              return (
                                <div className="mt-2 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
                                  <div className="flex flex-col gap-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                      <Plane className="w-4 h-4 text-blue-600 shrink-0" />
                                      <span>Seat</span>
                                    </div>
                                    {assignedSeat ? (
                                      <span className="inline-flex items-center gap-1 bg-white text-[#78080B] text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200 shadow-2xs ml-6 mt-1 w-fit">
                                        ✓ Seat {assignedSeat}{assignedSeatPrice > 0 ? ` (+₹${assignedSeatPrice.toLocaleString('en-IN')})` : ''}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-slate-500 italic pl-6">No seat selected</span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleSelectSeatModal}
                                    className="cursor-pointer text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-1.5 bg-white px-3.5 py-2 rounded-lg border border-blue-200 shadow-2xs transition shrink-0 self-start sm:self-auto"
                                  >
                                    <Plane className="w-4 h-4 text-blue-500" />
                                    {assignedSeat ? "Change Seat" : "Select Seat"}
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        ))}

                        {/* Add Button */}
                        <div className="flex flex-col gap-1">
                          {travellers[key].length < limit && (
                            <button
                              onClick={() => addTraveller(key, limit)}
                              className="cursor-pointer uppercase text-blue-600 text-sm font-medium hover:text-blue-700 text-left"
                            >
                              + Add {label}
                            </button>
                          )}
                          {showValidationErrors && travellers[key].length < limit && (
                            <span className="text-xs text-red-600 font-medium">
                              Please add all {limit} {label}(s)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State Info */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                  {/* Booking Details Section */}
                  <p className="text-slate-800 mb-3 text-xs">
                    <span className="font-semibold text-lg">Your State</span>
                    (Required for GST purpose on your tax invoice. You can edit
                    this anytime later in your profile section.)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Select State */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Select the State
                      </label>
                      <Select
                        options={stateOptions}
                        placeholder="Select state..."
                        isSearchable
                        classNamePrefix="state-select"
                        menuPlacement="top"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused
                              ? "#3b82f6"
                              : "#cbd5e1",
                            boxShadow: state.isFocused
                              ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
                              : "none",
                            minHeight: "36px",
                            fontSize: "0.875rem",
                            "&:hover": { borderColor: "#3b82f6" },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#94a3b8",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 50,
                          }),
                        }}
                      />
                    </div>
                  </div>

                  {/* GST Details */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="billing-details-checkbox"
                      className="cursor-pointer w-4 h-4"
                    />
                    <label className="text-sm font-medium text-slate-800">
                      Confirm and save billing details to your profile
                    </label>
                  </div>
                </div>


                <div>
                  <button
                    type="button"
                    disabled={bookingMutation.isPending}
                    className="hidden lg:flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base px-6 py-3 rounded-full shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleContinue}
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking…
                      </>
                    ) : (
                      <>
                        CONTINUE
                        <ChevronRight />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar - Fare Summary */}
              <div className="hidden lg:block order-2 lg:order-2 lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 static lg:sticky lg:top-24">

                  <h2 className="text-xl font-bold mb-5">
                    Fare Summary
                  </h2>

                  {/* Base Fare */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-blue-700">
                        Base fare
                      </span>

                      <span className="font-semibold text-slate-800">
                        ₹ {baseFare.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Taxes and Fees */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-semibold text-blue-700">
                        Taxes and fees
                      </span>

                      <span className="font-semibold text-slate-800">
                        ₹ {taxes.toLocaleString()}
                      </span>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="space-y-3 pl-1">
                      {fuelSurcharge > 0 && (
                        <FareRow
                          label="Fuel Surcharge (YQ)"
                          amount={fuelSurcharge}
                          showIcon={false}
                        />
                      )}

                      {gst > 0 && (
                        <FareRow
                          label="GST"
                          amount={gst}
                          showIcon={false}
                        />
                      )}

                      {otherTaxes > 0 && (
                        <FareRow
                          label="Other Taxes"
                          amount={otherTaxes}
                          showIcon={false}
                        />
                      )}

                      {managementFee > 0 && (
                        <FareRow
                          label="Management Fee"
                          amount={managementFee}
                          showIcon={false}
                        />
                      )}
                    </div>
                  </div>

                  {/* Extra Baggage Summary */}
                  {totalBaggageCost > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <FareRow
                        label={`Extra Baggage (${totalBaggageItemsCount} ${totalBaggageItemsCount === 1 ? 'item' : 'items'})`}
                        amount={totalBaggageCost}
                        showIcon={false}
                      />
                    </div>
                  )}

                  {/* Extra Meals Summary */}
                  {totalMealCost > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <FareRow
                        label={`Extra Meals (${totalMealItemsCount} ${totalMealItemsCount === 1 ? 'item' : 'items'})`}
                        amount={totalMealCost}
                        showIcon={false}
                      />
                    </div>
                  )}

                  {/* Seat Charges Summary */}
                  {selectedSeatCost > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <FareRow
                        label={`Seat Charges (${selectedSeatData?.seats?.size ?? 0} seat${(selectedSeatData?.seats?.size ?? 0) !== 1 ? 's' : ''})`}
                        amount={selectedSeatCost}
                        showIcon={false}
                      />
                    </div>
                  )}


                  {/* Amount to Pay */}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-blue-700">
                        Amount to Pay
                      </span>

                      <span className="text-xl font-bold text-slate-800">
                        ₹ {amountToPay.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Additional Pricing Details */}
                  <div className="space-y-3">

                    {/* Convenience Fee */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        Convenience Fee
                      </span>

                      <span className="text-sm font-medium text-slate-800">
                        ₹ {convenienceFee.toLocaleString()}
                      </span>
                    </div>

                    {/* Net Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        Net Price
                      </span>

                      <span className="text-sm font-medium text-slate-800">
                        ₹ {netPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Commission */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        Commission
                      </span>

                      <span className="text-sm font-medium text-slate-800">
                        ₹ {commission.toLocaleString()}
                      </span>
                    </div>

                  </div>

                  {/* --- Coupon Applied --- */}
                  {selectedCoupon && (
                    <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm flex justify-between items-center">
                      <span>
                        Applied <b>{selectedCoupon.code}</b> –{" "}
                        {selectedCoupon.label}
                      </span>

                      <button
                        onClick={handleRemoveCoupon}
                        className="cursor-pointer text-xs text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                </div>
              </div>


            </div>
          </div>
        </div>

        <div className="block lg:hidden sticky bottom-0 z-[999] bg-[#78080B] text-white px-4 py-4 sm:py-5 shadow-[0_-4px_8px_rgba(0,0,0,0.25)]">
          <div className="max-w-7xl mx-auto flex flex-row sm:items-center justify-between gap-4">
            {/* Price Section */}
            <div className="flex flex-col sm:items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold">
                  ₹ {calculateTotal.toLocaleString("en-IN")}
                </span>

                <button
                  type="button"
                  aria-label="Price information"
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80 hover:opacity-100 transition cursor-pointer"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              </div>

              <span className="text-xs sm:text-sm font-medium opacity-90">
                FOR 1 ADULT
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              disabled={bookingMutation.isPending}
              className="bg-[#D9D9D9] text-[#78080B] font-semibold text-base px-6 py-3 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleContinue}
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  CONTINUE
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const FareRow = ({ label, amount, showIcon = true }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {showIcon && (
        <CirclePlus className="w-4 h-4 text-slate-400" />
      )}

      <span className="text-sm text-slate-700">
        {label}
      </span>
    </div>

    <span className="text-sm font-medium text-slate-800">
      ₹ {amount.toLocaleString()}
    </span>
  </div>
);