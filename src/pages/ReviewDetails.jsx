import api from "@/services/api.js";
import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import TripBenefitsModal from "@/components/modals/TripBenefitsModal";
import TicketDetailsReviewModal from "@/components/modals/TicketDetailsReviewModal";
import ViewAllCouponsModal from "@/components/modals/ViewAllCouponsModal";
import BaggageModal from "@/components/modals/BaggageModal";
import MealModal from "@/components/modals/MealModal";
import AirlineLogo from "@/assets/imgs/airlinelogo.webp";
import { Trash2, User, Luggage, Utensils, CirclePlus, ShieldAlert, ChevronRight, Plus } from "lucide-react";
import Select from "react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { countryOptions, stateOptions } from "@/data/ExtraData.js";
import { bookingStore } from "@/store/bookingStore";
const Modal = lazy(() => import("@/components/modals/Modal"));
const FlightSeatMap = lazy(() => import("./FlightSeatMap"));
import { getAirlineLogo } from "@/utils/airlineCode";

export default function ReviewDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isFlightSeatMap, setIsFlightSeatMap] = useState(false);
  const [selectedSeatCost, setSelectedSeatCost] = useState(0);
  const [selectedSeatData, setSelectedSeatData] = useState(null); // { seats: Set, services: [] }

  const [isTripBenefitsModal, setIsTripBenefitsModal] = useState(false);
  const [isTicketDetailsReviewModal, setIsTicketDetailsReviewModal] =
    useState(false);
  const [isViewAllCouponsModal, setIsViewAllCouponsModal] = useState(false);
  const [isBaggageModal, setIsBaggageModal] = useState(false);
  const [baggageTarget, setBaggageTarget] = useState(null);
  const [isMealModal, setIsMealModal] = useState(false);
  const [mealTarget, setMealTarget] = useState(null);

  const {
    data: fareReviewData,
    isLoading: loadingFareReview,
    error: fareReviewError,
  } = useQuery({
    queryKey: ["fareReview"],

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


      // TravelType is always 0 (domestic)
      const travelType = 0;

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
  const baseFare = totalPriceList?.BF ?? 0;
  const taxes = totalPriceList?.TAF ?? 0;

  const services = fareReviewData?.TransactionFee ?? 0;

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const subtotal = baseFare + taxes + services;

  const otherTaxes = totalPriceList?.OT ?? 0;
  const fuelSurcharge = fareReviewData?.TotalPriceList?.afC?.TAF?.YQ ?? 0;

  const Taxes = otherTaxes + fuelSurcharge;

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
    countryCode: "",
    mobile: "",
    email: "",
    wheelchair: false,
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

  const subTotal = baseFare + Taxes + totalBaggageCost + totalMealCost + selectedSeatCost;

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

  const handleSeatsContinue = ({ selectedSeats, selectedServices, totalAmount }) => {
    // Save the seat cost and data back into ReviewDetails fare calculation
    setSelectedSeatCost(totalAmount);
    setSelectedSeatData({ seats: selectedSeats, services: selectedServices });
    // Persist into bookingStore so payment page can access seat selections
    bookingStore.set({
      seatTotal: totalAmount,
      selectedSeats: Array.from(selectedSeats),
      selectedServices,
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

  const handleContinue = () => {
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

  return (
    <>
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
                                            Layover
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
                                    <button
                                      type="button"
                                      onClick={handleSelectSeatModal}
                                      className="text-blue-600 font-semibold text-sm whitespace-nowrap hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                      Select Seat
                                    </button>
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
                                className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              />
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
                                className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Gender */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {["MALE", "FEMALE"].map((g) => (
                                  <button
                                    key={g}
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

                            {/* Conditional Fields */}
                            {key === "Adults" && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <Select
                                  options={countryOptions}
                                  value={countryOptions.find(
                                    (opt) => opt.value === t.countryCode,
                                  )}
                                  onChange={(opt) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "countryCode",
                                      opt?.value || "",
                                    )
                                  }
                                  placeholder="Country Code"
                                  classNamePrefix="country-select"
                                />
                                <input
                                  type="tel"
                                  placeholder="Mobile No (Optional)"
                                  value={t.mobile}
                                  onChange={(e) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "mobile",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="email"
                                  placeholder="Email (Optional)"
                                  value={t.email}
                                  onChange={(e) =>
                                    updateTraveller(
                                      key,
                                      i,
                                      "email",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            )}

                            {(key === "Childs" || key === "Infants") && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                {key === "Infants" && (
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
                                    className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  />
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
                          </div>
                        ))}

                        {/* Add Button */}
                        {travellers[key].length < limit && (
                          <button
                            onClick={() => addTraveller(key, limit)}
                            className="cursor-pointer uppercase text-blue-600 text-sm font-medium hover:text-blue-700"
                          >
                            + Add {label}
                          </button>
                        )}
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
                    className="hidden lg:flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base px-6 py-3 rounded-full shadow-sm transition-all duration-200"
                    onClick={handleContinue}
                  >
                    CONTINUE
                    <ChevronRight />
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
                      <FareRow
                        label="Other Taxes"
                        amount={otherTaxes}
                        showIcon={false}
                      />

                      <FareRow
                        label="Fuel Surcharge"
                        amount={fuelSurcharge}
                        showIcon={false}
                      />
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

                  {/* Sub Total */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-blue-700">
                        Sub Total
                      </span>

                      <span className="font-semibold text-slate-800">
                        ₹ {subTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

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
              className="bg-[#D9D9D9] text-[#78080B] font-semibold text-base px-6 py-3 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleContinue}
            >
              CONTINUE
              <ChevronRight className="w-5 h-5" />
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