import React, { useEffect, useMemo, useState } from 'react';
import FareRulesModal from '@/components/common/Modals/FareRulesModal';
import TripBenefitsModal from '@/components/common/Modals/TripBenefitsModal';
import TicketDetailsReviewModal from '@/components/common/Modals/TicketDetailsReviewModal';
import ViewAllCouponsModal from '@/components/common/Modals/ViewAllCouponsModal';
import BaggageModal from '@/components/common/Modals/BaggageModal';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import CouponBg from '@/assets/imgs/couponbg.webp';
import OfferPromo from '@/assets/vectors/OfferPromo.svg';
import { Trash2, Plane, User, Luggage, AlertCircle, ShieldCheck, CirclePlus, ShieldAlert, ChevronRight } from 'lucide-react';
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

export default function ReviewDetails() {

  const navigate = useNavigate();

  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isTripBenefitsModal, setIsTripBenefitsModal] = useState(false);
  const [isTicketDetailsReviewModal, setIsTicketDetailsReviewModal] = useState(false);
  const [isViewAllCouponsModal, setIsViewAllCouponsModal] = useState(false);
  const [isBaggageModal, setIsBaggageModal] = useState(false);
  const [selectedFare, setSelectedFare] = useState('your-selection');
  const [isTripSecure, setIsTripSecure] = useState(false);

  const countryOptions = [
    { value: "+91", label: "India (+91)" },
    { value: "+1", label: "United States (+1)" },
    { value: "+7", label: "Russia (+7)" },
    { value: "+20", label: "Egypt (+20)" },
    { value: "+27", label: "South Africa (+27)" },
    { value: "+30", label: "Greece (+30)" },
    { value: "+31", label: "Netherlands (+31)" },
    { value: "+32", label: "Belgium (+32)" },
    { value: "+33", label: "France (+33)" },
    { value: "+34", label: "Spain (+34)" },
    { value: "+36", label: "Hungary (+36)" },
    { value: "+39", label: "Italy (+39)" },
    { value: "+40", label: "Romania (+40)" },
    { value: "+41", label: "Switzerland (+41)" },
    { value: "+44", label: "United Kingdom (+44)" },
    { value: "+45", label: "Denmark (+45)" },
    { value: "+46", label: "Sweden (+46)" },
    { value: "+47", label: "Norway (+47)" },
    { value: "+48", label: "Poland (+48)" },
    { value: "+49", label: "Germany (+49)" },
    { value: "+52", label: "Mexico (+52)" },
    { value: "+55", label: "Brazil (+55)" },
    { value: "+60", label: "Malaysia (+60)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+62", label: "Indonesia (+62)" },
    { value: "+63", label: "Philippines (+63)" },
    { value: "+64", label: "New Zealand (+64)" },
    { value: "+65", label: "Singapore (+65)" },
    { value: "+81", label: "Japan (+81)" },
    { value: "+82", label: "South Korea (+82)" },
    { value: "+84", label: "Vietnam (+84)" },
    { value: "+86", label: "China (+86)" },
    { value: "+90", label: "Turkey (+90)" },
    { value: "+92", label: "Pakistan (+92)" },
    { value: "+93", label: "Afghanistan (+93)" },
    { value: "+94", label: "Sri Lanka (+94)" },
    { value: "+95", label: "Myanmar (+95)" },
    { value: "+98", label: "Iran (+98)" },
    { value: "+212", label: "Morocco (+212)" },
    { value: "+234", label: "Nigeria (+234)" },
    { value: "+254", label: "Kenya (+254)" },
    { value: "+255", label: "Tanzania (+255)" },
    { value: "+256", label: "Uganda (+256)" },
    { value: "+260", label: "Zambia (+260)" },
    { value: "+351", label: "Portugal (+351)" },
    { value: "+352", label: "Luxembourg (+352)" },
    { value: "+353", label: "Ireland (+353)" },
    { value: "+354", label: "Iceland (+354)" },
    { value: "+358", label: "Finland (+358)" },
    { value: "+380", label: "Ukraine (+380)" },
    { value: "+852", label: "Hong Kong (+852)" },
    { value: "+853", label: "Macau (+853)" },
    { value: "+855", label: "Cambodia (+855)" },
    { value: "+856", label: "Laos (+856)" },
    { value: "+880", label: "Bangladesh (+880)" },
    { value: "+971", label: "United Arab Emirates (+971)" },
    { value: "+972", label: "Israel (+972)" },
    { value: "+974", label: "Qatar (+974)" },
    { value: "+975", label: "Bhutan (+975)" },
    { value: "+976", label: "Mongolia (+976)" },
    { value: "+977", label: "Nepal (+977)" },
  ];

  const stateOptions = [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal-pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "delhi", label: "Delhi" },
    { value: "jammu-kashmir", label: "Jammu & Kashmir" },
    { value: "ladakh", label: "Ladakh" },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const TotalTravellers = { Adults: 4, Childs: 2, Infants: 2 }

  const { Adults, Childs, Infants } = TotalTravellers;

  const [travellers, setTravellers] = useState({
    Adults: [
      { id: 1, firstName: '', lastName: '', gender: 'MALE', countryCode: '', mobile: '', email: '', wheelchair: false }
    ],
    Childs: [],
    Infants: [],
  });

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
            ? { id: Date.now(), firstName: '', lastName: '', gender: 'MALE', countryCode: '', mobile: '', email: '', wheelchair: false }
            : category === "Childs"
              ? { id: Date.now(), firstName: '', lastName: '', gender: 'MALE', dob: '' }
              : { id: Date.now(), firstName: '', lastName: '', gender: 'MALE', dob: '', accompanyingAdult: '' }
        ]
      });
    }
  };

  const removeTraveller = (category, index) => {
    const traveller = travellers[category][index];
    const hasData = Object.values(traveller).some(v => v);
    if (hasData && !window.confirm(`Remove this ${category.slice(0, -1)}? All entered data will be lost.`)) return;

    setTravellers({
      ...travellers,
      [category]: travellers[category].filter((_, i) => i !== index)
    });
  };


  const baseFare = 5936;
  const taxes = 913;
  const services = 2100;

  const [showCoupons, setShowCoupons] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [couponCode, setCouponCode] = useState('');

  const coupons = [
    { code: "SAVE200", label: "₹200 off on your booking", discountType: "flat", value: 200 },
    { code: "FLY10", label: "10% off (up to ₹500)", discountType: "percent", value: 10 },
    { code: "FREEMEAL", label: "₹150 off on meals", discountType: "flat", value: 150 },
    { code: "SUPER25", label: "25% off on base fare (max ₹800)", discountType: "percent", value: 25 },
    { code: "WELCOME100", label: "₹100 instant discount", discountType: "flat", value: 100 },
    { code: "WELCOME200", label: "₹200 instant discount", discountType: "flat", value: 200 },
    { code: "WELCOME300", label: "₹300 instant discount", discountType: "flat", value: 300 },
    { code: "WELCOME400", label: "₹400 instant discount", discountType: "flat", value: 400 },
    { code: "WELCOME500", label: "₹500 instant discount", discountType: "flat", value: 500 },
  ];

  const subtotal = useMemo(() => baseFare + taxes + services, []);

  const calculateTotal = useMemo(() => {
    if (!selectedCoupon) return subtotal;
    const { discountType, value } = selectedCoupon;
    let discount = 0;
    if (discountType === "flat") discount = value;
    else if (discountType === "percent") discount = Math.min((subtotal * value) / 100, 800);
    return Math.max(subtotal - discount, 0);
  }, [selectedCoupon, subtotal]);

  const handleApply = () => {
    if (couponCode.trim()) {
      console.log('Applying coupon:', couponCode);
    }
  };

  const handleApplyCoupon = (coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const handleManualApply = () => {
    const found = coupons.find((c) => c.code.toUpperCase() === manualCode.toUpperCase());
    if (found) {
      handleApplyCoupon(found);
      setManualCode("");
    } else {
      alert("Invalid coupon code");
    }
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
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <>
      {isFareModalOpen && <FareRulesModal onClose={() => setIsFareModalOpen(false)} />}
      {isTripBenefitsModal && <TripBenefitsModal onClose={() => setIsTripBenefitsModal(false)} />}
      {isTicketDetailsReviewModal && <TicketDetailsReviewModal onClose={() => setIsTicketDetailsReviewModal(false)} />}
      {isBaggageModal && <BaggageModal onClose={() => setIsBaggageModal(false)} />}

      {/* Coupons Filters Drawer */}
      {isViewAllCouponsModal && (
        <ViewAllCouponsModal
          onClose={() => setIsViewAllCouponsModal(false)}
        />
      )}

      <div className="min-h-screen relative">
        {/* Header */}
        <div className="z-999 bg-[#78080B] text-white py-6 px-4 sticky top-0" style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>

          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">Complete your booking</h1>
            <div className="hidden lg:flex gap-4 text-sm">
              <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("flight-summary")}
              >
                Flights Summary
              </span>
              {/* <span
                className="cursor-pointer text-slate-300 hover:text-white transition"
                onClick={() => handleScroll("travel-insurance")}
              >
                Travel Insurance
              </span> */}
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
              // ["travel-insurance", "Travel Insurance"],
              ["traveller-details", "Traveller Details"],
              ["seats-meals", "Seats & Meals"],
              ["add-ons", "Add-ons"],
            ].map(([id, label]) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`
          px-4 py-1 rounded-full transition-all duration-200 flex-shrink-0
          ${isActive
                      ? "bg-white text-[#78080B] font-semibold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/10"}
        `}
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
                {/* Airport Alert */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg py-1 px-2 flex items-start gap-3">
                  <Plane className="w-5 h-5 text-yellow-600 mt-0.5" />

                  <p className="text-sm text-yellow-800">
                    Your flight departs from <strong>Hindon Airport</strong>, which is <strong>32 km away from Indira Gandhi International Airport</strong>.
                  </p>
                </div>

                {/* Flight Details Card */}
                <div id="flight-summary" className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-2 sm:p-4" >
                    <div className='p-2' style={{ boxShadow: '0 1px 4px 0 rgba(0, 0, 0, .21)' }}>
                      {/* Route Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-16 sm:h-20 bg-blue-500 rounded"></div>

                          <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                              Ghaziabad → Bengaluru
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex flex-wrap gap-2">
                              <span className="bg-yellow-50 border border-yellow-200 rounded-lg py-1 px-2">
                                Thursday, Oct 9
                              </span>
                              <span>Non Stop · 2h 50m</span>
                            </p>
                          </div>
                        </div>

                        <span className="self-start lg:self-center bg-[#78080B] text-white text-xs font-semibold px-3 py-1 rounded">
                          CANCELLATION FEES APPLY
                        </span>
                      </div>

                      <button className="cursor-pointer text-blue-600 text-sm font-medium mb-4" onClick={() => setIsFareModalOpen(true)}>View Fare Rules</button>

                      {/* Airline Info */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3 flex-wrap">
                          <img src={AirlineLogo} alt="airline logo" className="w-8 h-8" />

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold text-sm">Air India Express</span>
                            <span className="text-slate-600 text-xs sm:text-sm">IX 1971</span>
                            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                              Boeing 737
                            </span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-slate-600">Economy &gt; </span>
                          <span className="text-blue-600 font-semibold">Xpress Value</span>
                        </div>
                      </div>


                      {/* Flight Times */}
                      <div className="space-y-4 p-3 sm:p-4 bg-[#f4f4f4]">
                        <div className="flex gap-4">
                          <div className="text-xl sm:text-2xl font-bold">08:50</div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">Ghaziabad</div>
                            <div className="text-xs sm:text-sm text-slate-600">
                              Hindon Airport
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 border-l-2 border-dashed border-slate-300 pl-4 py-2">
                          <div className="text-xs sm:text-sm text-slate-600">2h 50m</div>
                        </div>

                        <div className="flex gap-4">
                          <div className="text-xl sm:text-2xl font-bold">11:40</div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">Bengaluru</div>
                            <div className="text-xs sm:text-sm text-slate-600">
                              Bengaluru International Airport, T2
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className='bg-[#f4f4f4] flex justify-center'>
                        <div className='border-t border-slate-300 w-[95%]'></div>
                      </div>

                      {/* Baggage Info */}
                      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-[#f4f4f4] text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Luggage className="w-5 h-5 text-slate-600" />
                          <span className="text-sm"><strong>Cabin Baggage:</strong> 7 Kgs / Adult</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Luggage className="w-5 h-5 text-slate-600" />
                          <span className="text-sm"><strong>Check-In Baggage:</strong> 15 Kgs / Adult</span>
                        </div>
                      </div>

                      {/* Extra Baggage Notice */}
                      <div className="mt-3 bg-[#f4f4f4] border border-blue-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <Luggage className="w-5 h-5 text-[#78080B] shrink-0" />
                          <p className="text-xs sm:text-sm text-slate-700">
                            <strong>3 KGs of extra baggage added on your trip for ₹ 2,100!</strong>
                            <br className="sm:hidden" />
                            Total check-in baggage is now 18 KGs.
                          </p>
                        </div>

                        <button className="text-blue-600 font-semibold text-sm whitespace-nowrap self-start sm:self-auto" onClick={() => setIsBaggageModal(true)}>
                          ADD BAGGAGE
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="border-t border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Cancellation & Date Change Policy</h3>
                      <button className="cursor-pointer text-blue-600 text-sm font-medium" onClick={() => setIsFareModalOpen(true)}>View Policy</button>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <img src={AirlineLogo} alt="Airline logo" className="w-10 h-10 object-contain" />

                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div>
                          <div className="font-semibold mb-1">HDO-BLR</div>
                          <div className="text-sm text-slate-600 mb-3">Cancellation Penalty:</div>
                          <div className="text-sm text-slate-600 mt-2">Cancel Between (IST):</div>
                        </div>

                        <div className="flex-1">
                          {/* Timeline */}
                          <div className="relative">
                            <div className="flex items-center justify-around mb-2">
                              <span className="text-base sm:text-lg font-bold">₹ 4,650</span>
                              <span className="text-base sm:text-lg font-bold">₹ 6,849</span>
                            </div>

                            <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="text-left">
                                <div className="font-semibold">Now</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">9 Oct</div>
                                <div className="text-slate-600">06:50</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">9 Oct</div>
                                <div className="text-slate-600">08:50</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Upgrade Fare Options */}
                {/* <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-4" >
                    <div className='p-2' style={{ boxShadow: '0 1px 4px 0 rgba(0, 0, 0, .21)' }}>
                      <h3 className="text-lg font-bold mb-6">Get more benefits by upgrading your fare</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Your Selection */}
                {/* <div
                          className={`border-2 rounded-lg p-4 cursor-pointer ${selectedFare === 'your-selection' ? 'border-[#78080B] bg-blue-50' : 'border-slate-200'}`}
                          onClick={() => setSelectedFare('your-selection')}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFare === 'your-selection' ? 'border-blue-500' : 'border-slate-300'
                              }`}>
                              {selectedFare === 'your-selection' && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">Your Selection</div>
                              <div className="text-xl font-bold">₹ 6,849</div>
                            </div>
                          </div>

                          <div className='bg-[#f4f4f4] flex justify-center mb-2'>
                            <div className='border-t border-slate-300 w-[95%]'></div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600">

                            <div className="flex items-start gap-2">
                              <img src={Dash} alt="dash" className="fill-current " />
                              <span><strong>Flight Delay Protection</strong> benefit not included</span>
                            </div>

                            <div className="flex items-start gap-2">
                              <img src={Dash} alt="dash" className="fill-current" />
                              <span>Date Change fee starts at <strong>₹ 3,000</strong> up to <strong>2 hrs</strong> before departure</span>
                            </div>

                            <div className="flex items-start gap-2">
                              <img src={Dash} alt="dash" className="fill-current " />
                              <span>Seats Chargeable</span>
                            </div>

                            <div className="flex items-start gap-2">
                              <img src={Dash} alt="dash" className="fill-current" />
                              <span>Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                            </div>

                          </div>

                        </div> */}

                {/* Skyvoo Regular */}
                {/* <div
                          className={`border-2 rounded-lg p-4 cursor-pointer ${selectedFare === 'skyvoo-regular' ? 'border-[#78080B] bg-blue-50' : 'border-slate-200'}`}
                          onClick={() => setSelectedFare('skyvoo-regular')}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFare === 'skyvoo-regular' ? 'border-blue-500' : 'border-slate-300'
                              }`}>
                              {selectedFare === 'skyvoo-regular' && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">Skyvoo Regular</div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 line-through">₹ 7,423</span>
                                <span className="text-xl font-bold">₹ 7,298</span>
                              </div>
                            </div>
                          </div>

                          <div className='bg-[#f4f4f4] flex justify-center mb-2'>
                            <div className='border-t border-slate-300 w-[95%]'></div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600">

                            <div className="flex items-center gap-2">
                              <img src={Dash} alt="dash" className="fill-current " />

                              <span>
                                <strong>Flight Delay Protection</strong> included
                              </span>

                              <div className="relative group">
                                <AlertCircle className="h-3 w-3 cursor-pointer" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mt-1 hidden w-max rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                                  Get compensaation of <strong>₹ 2,000</strong> if you flight is delayed by one hour or more
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 ">
                              <img src={Dash} alt="dash" className="fill-current " />
                              <span>Date Change fee starts at <strong>₹ 3,000</strong> up to <strong>2 hrs</strong> before departure</span>
                            </div>

                            <div className="flex items-center gap-2 ">
                              <img src={Dash} alt="dash" className="fill-current " />

                              <span>
                                Seats worth <strong>₹ 375</strong> included
                              </span>

                              <div className="relative group">
                                <AlertCircle className="h-3 w-3 cursor-pointer" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mt-1 hidden w-max font-medium rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                                  HDO-BLR: 22A. You can change seats in addons page.
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 ">
                              <img src={Dash} alt="dash" className="fill-current " />
                              <span>Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                            </div>

                          </div>

                        </div> */}

                {/* Skyvoo Premium */}
                {/* <div
                          className={`border-2 rounded-lg p-4 cursor-pointer ${selectedFare === 'skyvoo-premium' ? 'border-[#78080B] bg-blue-50' : 'border-slate-200'
                            }`}
                          onClick={() => setSelectedFare('skyvoo-premium')}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFare === 'skyvoo-premium' ? 'border-blue-500' : 'border-slate-300'
                              }`}>
                              {selectedFare === 'skyvoo-premium' && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">Skyvoo Premium</div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 line-through">₹ 7,522</span>
                                <span className="text-xl font-bold">₹ 7,397</span>
                              </div>
                            </div>
                          </div>

                          <div className='bg-[#f4f4f4] flex justify-center mb-2'>
                            <div className='border-t border-slate-300 w-[95%]'></div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600">

                            <div className="flex items-center gap-2 ">
                              <img src={Dash} alt="dash" className="fill-current" />

                              <span>
                                <strong>Flight Delay Protection</strong> included
                              </span>

                              <div className="relative group">
                                <AlertCircle className="h-3 w-3 cursor-pointer" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mt-1 hidden w-max rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                                  Get compensaation of <strong>₹ 2,000</strong> if you flight is delayed by one hour or more
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <img src={Dash} alt="dash" className="fill-current" />
                              <span>
                                Free date change upto <strong>2 hours</strong> before departure
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <img src={Dash} alt="dash" className="fill-current" />

                              <span>
                                Seats worth <strong>₹ 375</strong> included
                              </span>

                              <div className="relative group">
                                <AlertCircle className="h-3 w-3 cursor-pointer" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mt-1 hidden w-max font-medium rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                                  HDO-BLR: 22A. You can change seats in addons page.
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 ">
                              <img src={Dash} alt="dash" className="fill-current" />
                              <span>Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                            </div>

                          </div>

                        </div>
                      </div>
                      <button className="text-blue-600 my-3 text-sm font-medium mb-4">View Fare Rules</button> */}
                {/* Extra Baggage Notice */}
                {/* <div className="bg-[#f4f4f4] border border-blue-200 p-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-[#78080B]" />
                          <p className="text-sm text-slate-700">
                            Just a click for a better trip <strong>Upgrade now!</strong>
                          </p>
                        </div>
                        <button className="text-blue-600 font-semibold text-sm whitespace-nowrap">CHANGE</button>
                      </div>

                    </div>
                  </div>
                </div> */}

                {/* Important Information */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-bold">Important Information</h3>
                    </div>

                    <div className="space-y-4 text-sm text-slate-700">
                      <div>
                        <div className='flex font-bold mb-2'>
                          <ShieldAlert className="mr-2 text-red-500" />
                          <p className=''>Nearby Airport</p>
                        </div>
                        <p>
                          Your flight goes from Ghaziabad, near Indira Gandhi International Airport. Please note, this is not the airport you originally searched for. Kindly check all the routes to your desired destination to avoid any hassles in your journey.
                        </p>
                      </div>

                      <div className='my-8'>
                        <div className='flex font-bold mb-2'>
                          <ShieldAlert className="mr-2 text-red-500 " />
                          <p className=''>Check travel guidelines and baggage information below:</p>
                        </div>
                        <p>
                          Carry no more than 1 check-in baggage and 1 hand baggage per passenger. If violated, airline may levy extra charges.
                        </p>
                      </div>

                      <div>
                        <div className='flex font-bold mb-2'>
                          <ShieldAlert className="mr-2 text-red-500" />
                          <p className=''>Unaccompanied Minors Travelling:</p>
                        </div>
                        <p>
                          Children below 18 years travelling alone may be classified as Unaccompanied Minors (UMNR) and can be subject to airline-specific UMNR rules, forms, and extra charges. Non-compliance may lead to denied boarding. Please check the respective airline website for exact requirements. Kindly note that MakeMyTrip will not have control over airline-specific decisions or charges.

                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Trip Secure */}
                {/* <div id="travel-insurance" className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-5"> */}
                {/* Header */}
                {/* <div className="flex items-center mb-4">
                      <ShieldCheck className="mr-4 w-5 h-5 text-[#78080B]" />
                      <h3 className="text-lg font-bold">Trip Secure</h3>
                    </div> */}

                {/* Pricing + Benefits Section */}
                {/* <div className="bg-[#f4f4f4] py-3 px-3 rounded-md"> */}
                {/* Pricing */}
                {/* <p className="text-lg font-semibold mb-3">
                        ₹199 <span className="text-xs text-slate-500">/Traveller (18% GST included)</span>
                      </p> */}

                {/* Benefits Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex col-span-2 items-center bg-white rounded-md px-2 py-2 border border-slate-200">
                          <Luggage className="mr-2 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-800">24x7 Support</p>
                            <p className="text-slate-500 text-sm">Delayed/lost baggage Assistance</p>
                          </div>
                        </div>

                        <div className="flex col-span-2 items-center bg-white rounded-md px-2 py-2 border border-slate-200">
                          <Luggage className="mr-2 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-800">Up to ₹2,500</p>
                            <p className="text-slate-500 text-sm">Missed Flight</p>
                          </div>
                        </div>

                        <div className="flex col-span-2 items-center bg-white rounded-md px-2 py-2 border border-slate-200">
                          <Luggage className="mr-2 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-800">Up to ₹2,500</p>
                            <p className="text-slate-500 text-sm">Trip Cancellation</p>
                          </div>
                        </div>

                        <div
                          className="flex text-sm col-span-1 items-center bg-white rounded-md px-3 py-2 border border-slate-200 text-blue-600 font-medium cursor-pointer hover:bg-blue-50 transition"
                          onClick={() => setIsTripBenefitsModal(true)}
                        >
                          View All Benefits →
                        </div>
                      </div>
                    </div> */}

                {/* Selection Section */}
                {/* <div className="mt-4 space-y-3">
                      <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 inline-block rounded">
                        Chosen by 2 lakh+ people in last 1 month
                      </p>

                      <label className="flex items-center space-x-2">
                        <input type="radio" name="tripSecure" onClick={() => { setIsTripSecure(true) }} />
                        <span className="text-slate-800">Yes, Secure my trip.</span>
                      </label> */}
                {/* {isTripSecure && (
                        <div className="bg-green-100 border border-green-300 rounded-md p-2 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 text-sm">Great! Your trip is secured.</span>
                        </div>
                      )}

                      <label className="flex items-center space-x-2">
                        <input type="radio" name="tripSecure" onClick={() => { setIsTripSecure(false) }} defaultChecked />
                        <span className="text-slate-800">No, I will book without trip secure.</span>
                      </label>

                      {!isTripSecure && (
                        <div className="bg-green-100 border border-green-300 rounded-md p-2 flex items-center space-x-2">
                          <span className="text-green-700 text-sm"><strong>3 Lakh+ travellers</strong> secured their trip in the last month. Get your trip also secured.</span>
                        </div>
                      )}

                      {isTripSecure && (
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-slate-800 text-sm">Save my selection for future bookings</span>
                        </label>
                      )}

                    </div> */}

                {/* Testimonials */}
                {/* <div className='mt-5'>
                      <p className="text-xs px-2 py-1 mb-3">
                        Preferred by millions of travellers
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border rounded-md p-3 text-sm text-slate-700 bg-slate-50">
                          "Your willingness to go above and beyond what was expected made a significant difference in my ability..."
                          <br />
                          <span className="text-xs font-semibold">~ Amit Paul</span>
                        </div>
                        <div className="border rounded-md p-3 text-sm text-slate-700 bg-slate-50">
                          "Wow, the claim settlement was incredibly fast. Thank you so much! Such a smooth experience..."
                          <br />
                          <span className="text-xs font-semibold">~ Prateek Keshari</span>
                        </div>
                        <div className="border rounded-md p-3 text-sm text-slate-700 bg-slate-50">
                          "This is the best travel protection I’ve used. The claim process was easy and transparent..."
                          <br />
                          <span className="text-xs font-semibold">~ Karthik Ritesh</span>
                        </div>
                      </div>
                    </div> */}


                {/* Footer */}
                {/* <p className="text-xs text-slate-500 mt-4">
                      Trip Secure is non-refundable. By selecting it, I confirm that the age of all travellers is between 6 months and 90 years,
                      and I agree to the <a href="#" className="text-blue-600 underline">T&Cs</a>.
                    </p>
                  </div>
                </div> */}

                {/* Travellers Details */}
                <div id="traveller-details" className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="p-5">

                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold">Traveller Details</h3>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 text-sm text-orange-800">
                      <span className="font-semibold">Important:</span> Enter name as per passport or Government-approved ID.
                    </div>

                    {/* Render for each category */}
                    {[
                      { label: 'Adult', key: 'Adults', limit: Adults },
                      { label: 'Child', key: 'Childs', limit: Childs },
                      { label: 'Infant', key: 'Infants', limit: Infants },
                    ].map(({ label, key, limit }) => (
                      <div key={key} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">{label} Details</h4>
                          <span className="text-sm text-slate-500">
                            {travellers[key].length}/{limit} added
                          </span>
                        </div>

                        {travellers[key].map((t, i) => (
                          <div key={t.id} className="mb-4 border border-slate-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <label className="font-semibold">{label.toUpperCase()} {i + 1}</label>
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
                                onChange={(e) => updateTraveller(key, i, 'firstName', e.target.value)}
                                className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="Last Name"
                                value={t.lastName}
                                onChange={(e) => updateTraveller(key, i, 'lastName', e.target.value)}
                                className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Gender */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {['MALE', 'FEMALE'].map((g) => (
                                  <button
                                    key={g}
                                    onClick={() => updateTraveller(key, i, 'gender', g)}
                                    className={`flex-1 py-2 px-4 rounded border text-sm font-medium transition-colors ${t.gender === g
                                      ? 'bg-[#78080B] text-white border-[#78080B]'
                                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#78080B]'
                                      }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Conditional Fields */}
                            {key === 'Adults' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <Select
                                  options={countryOptions}
                                  value={countryOptions.find(opt => opt.value === t.countryCode)}
                                  onChange={(opt) => updateTraveller(key, i, 'countryCode', opt?.value || '')}
                                  placeholder="Country Code"
                                  classNamePrefix="country-select"
                                />
                                <input
                                  type="tel"
                                  placeholder="Mobile No (Optional)"
                                  value={t.mobile}
                                  onChange={(e) => updateTraveller(key, i, 'mobile', e.target.value)}
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="email"
                                  placeholder="Email (Optional)"
                                  value={t.email}
                                  onChange={(e) => updateTraveller(key, i, 'email', e.target.value)}
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            )}

                            {(key === 'Childs' || key === 'Infants') && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input
                                  type="date"
                                  value={t.dob}
                                  onChange={(e) => updateTraveller(key, i, 'dob', e.target.value)}
                                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                {key === 'Infants' && (
                                  <input
                                    type="text"
                                    placeholder="Accompanying Adult Name"
                                    value={t.accompanyingAdult}
                                    onChange={(e) => updateTraveller(key, i, 'accompanyingAdult', e.target.value)}
                                    className="border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                )}
                              </div>
                            )}

                            {/* Wheelchair (Adults only) */}
                            {key === 'Adults' && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={t.wheelchair}
                                  onChange={(e) => updateTraveller(key, i, 'wheelchair', e.target.checked)}
                                  className="cursor-pointer w-4 h-4"
                                />
                                <label className="text-sm text-slate-600">I require wheelchair (Optional)</label>
                              </div>
                            )}
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
                    <span className='font-semibold text-lg'>Your State</span>
                    (Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Select State */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Select the State</label>
                      <Select
                        options={stateOptions}
                        placeholder="Select state..."
                        isSearchable
                        classNamePrefix="state-select"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
                            boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
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

                {/* Mobile Coupons Section */}
                <div className="block lg:hidden bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Offers & promo codes
                    </h2>
                    <div>
                      <img src={OfferPromo} alt="Offer & Promo" />
                    </div>
                  </div>

                  {/* Coupon Input */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-700 transition-colors">
                      <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                      <button
                        onClick={handleApply}
                        className="text-red-800 font-semibold text-sm hover:text-red-900 transition-colors"
                      >
                        APPLY
                      </button>
                    </div>
                  </div>

                  {/* View All Coupons Link */}
                  <button className="text-red-800 font-medium text-sm hover:text-red-900 transition-colors" onClick={() => setIsViewAllCouponsModal(true)}>
                    View All Coupons
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="hidden lg:flex  items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base px-6 py-3 rounded-full shadow-sm transition-all duration-200"
                    onClick={() => setIsTicketDetailsReviewModal(true)}
                  >
                    CONTINUE
                    <ChevronRight />
                  </button>
                </div>

              </div>

              {/* Sidebar - Fare Summary */}
              <div className="hidden lg:block order-2 lg:order-2 lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 static lg:sticky lg:top-24">
                  <h2 className="text-xl font-bold mb-4">Fare Summary</h2>

                  {/* --- Fare Breakdown --- */}
                  <div className="space-y-3 mb-4">
                    <FareRow label="Base Fare" amount={baseFare} />
                    <FareRow label="Taxes and Surcharges" amount={taxes} />
                    <FareRow label="Other Services" amount={services} />
                  </div>

                  {/* --- Coupon Applied --- */}
                  {selectedCoupon && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm flex justify-between items-center">
                      <span>
                        Applied <b>{selectedCoupon.code}</b> – {selectedCoupon.label}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="cursor-pointer text-xs text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* --- Total --- */}
                  <div className="border-t border-t-2 border-slate-200 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-2xl font-bold text-slate-800">
                        ₹ {calculateTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* --- Coupons Section --- */}
                  <div
                    className="rounded-lg p-4 mb-4 bg-cover"
                    style={{ backgroundImage: `url(${CouponBg})` }}
                  >
                    <span className="font-bold">Coupons and Offers</span>
                  </div>

                  {/* --- Manual Code Input --- */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-slate-300 w-[90%] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={handleManualApply}
                      className="bg-[#78080B] text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 flex-shrink-0"
                      style={{ height: "100%" }}
                    >
                      Apply
                    </button>
                  </div>

                  {/* --- View All Coupons Toggle --- */}
                  <button
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="cursor-pointer w-full text-blue-600 font-semibold text-sm py-2"
                  >
                    {showCoupons ? "HIDE COUPONS ˄" : "VIEW ALL COUPONS ˅"}
                  </button>

                  {/* --- Coupons List --- */}
                  {showCoupons && (
                    <div className="max-h-90 overflow-y-auto mt-3 border border-slate-200 rounded-lg divide-y divide-slate-100">
                      {coupons.map((coupon) => (
                        <CouponItem
                          key={coupon.code}
                          coupon={coupon}
                          onApply={() => handleApplyCoupon(coupon)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div
          className="block lg:hidden sticky bottom-0 z-[999] bg-[#78080B] text-white px-4 py-4 sm:py-5 shadow-[0_-4px_8px_rgba(0,0,0,0.25)]"
        >
          <div className="max-w-7xl mx-auto flex flex-row sm:items-center justify-between gap-4">

            {/* Price Section */}
            <div className="flex flex-col sm:items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold">₹ 5,641</span>

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
              className="
        bg-[#D9D9D9]
        text-[#78080B] font-semibold
        text-base
        px-6 py-3
        rounded-full
        shadow-sm
        transition-all duration-200
        flex items-center justify-center gap-2
      "
              onClick={() => setIsTicketDetailsReviewModal(true)}
            >
              CONTINUE
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </div>


      </div >

    </>
  );
}

const FareRow = ({ label, amount }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <CirclePlus className="w-4 h-4 text-slate-400" />
      <span className="text-sm">{label}</span>
    </div>
    <span className="font-semibold">₹ {amount.toLocaleString()}</span>
  </div>
);

const CouponItem = ({ coupon, onApply }) => (
  <div className="flex justify-between items-center p-3 hover:bg-slate-50">
    <div>
      <div className="font-semibold text-slate-800">{coupon.code}</div>
      <div className="text-xs text-slate-500">{coupon.label}</div>
    </div>
    <button
      onClick={onApply}
      className="cursor-pointer text-blue-600 font-medium text-sm hover:underline"
    >
      Apply
    </button>
  </div>
);