import React from "react";
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import Tick from '@/assets/vectors/Tick.svg'
import Dash from '@/assets/vectors/Dash.svg'
import Insurance from '@/assets/vectors/Insurance.svg'
import { useNavigate } from 'react-router-dom';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/react-splide/css";

export default function FlightPriceDetailsModal({ onClose }) {
    const navigate = useNavigate();

    const fareCards = [
        {
            title: "SKYVOO",
            price: "₹ 5,330",
            oldPrice: "₹ 5,530",
            type: "Per adult",
            benefitsWorth: "₹ 5,330",
            insurance: "Travel Insurance for 1 days",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Cancellation fee start at ₹ 5,330 (up to 24 hours before departure)",
                "Date Change fee start at ₹ 5,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Chargeable Seats", "Chargeable Meals"],
            buttons: ["BOOK NOW"],
        },
        {
            title: "FLEXI PLUS",
            price: "₹ 5,340",
            oldPrice: "₹ 5,530",
            type: "Per adult",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Lower Cancellation fee start at ₹ 5,330 (up to 24 hours before departure)",
                "Free Date Change fee start at ₹ 5,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Free Seats", "Chargeable Meals"],
            buttons: ["LOCK PRICE", "BOOK NOW"],
        },
        {
            title: "SUPER 6E",
            price: "₹ 5,350",
            oldPrice: "₹ 5,530",
            type: "Per adult",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Lower Cancellation fee start at ₹ 5,330 (up to 24 hours before departure)",
                "Free Date Change fee start at ₹ 5,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Free Seats", "Chargeable Meals"],
            buttons: ["LOCK PRICE", "BOOK NOW"],
        },
        {
            title: "TELLY 6E",
            price: "₹ 5,250",
            oldPrice: "₹ 5,520",
            type: "Per adult",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Lower Cancellation fee start at ₹ 2,330 (up to 24 hours before departure)",
                "Free Date Change fee start at ₹ 1,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Free Seats", "Chargeable Meals"],
            buttons: ["LOCK PRICE", "BOOK NOW"],
        },
        {
            title: "EXTRA 6E",
            price: "₹ 5,360",
            oldPrice: "₹ 5,560",
            type: "Per adult",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Lower Cancellation fee start at ₹ 2,330 (up to 24 hours before departure)",
                "Free Date Change fee start at ₹ 1,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Free Seats", "Chargeable Meals"],
            buttons: ["LOCK PRICE", "BOOK NOW"],
        },
        {
            title: "EXTRA 7E",
            price: "₹ 5,370",
            oldPrice: "₹ 5,570",
            type: "Per adult",
            baggage: ["7 kgs Cabin Baggage", "15 kgs Check-in Baggage"],
            flexibility: [
                "Lower Cancellation fee start at ₹ 2,330 (up to 24 hours before departure)",
                "Free Date Change fee start at ₹ 1,330 up to 3hrs before departure",
            ],
            seatsMeals: ["Free Seats", "Chargeable Meals"],
            buttons: ["LOCK PRICE", "BOOK NOW"],
        },
    ];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-9999 "
            onClick={onClose}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="rounded-4xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative mx-4 p-4 sm:p-6 bg-white/30"
                style={{
                    animation: "scaleIn 0.3s ease-out forwards",
                    backdropFilter: "blur(11px)",
                    border: "2px solid rgb(120, 8, 11)",
                    boxShadow: "0px 0px 33.8px 10px #00000082",
                }}
            >
                {/* Close button */}
                <button
                    className="cursor-pointer absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl font-black text-[#4A4141] hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="font-semibold text-lg sm:text-2xl">
                        Flights Details and Fare Options Available for you !
                    </h2>

                    <div className=" flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-sm sm:text-base mt-2 ">
                        <span>New Delhi - Mumbai</span>
                        <span>|</span>
                        <img src={AirlineLogo} alt="airline logo" className="h-6 sm:h-8" />
                        <span>Vistara</span>
                        <span>|</span>
                        <span>Wed, 24 Sep 2025</span>
                        <span className="hidden sm:inline">|</span>
                        <span className="text-xs sm:text-base">
                            Departure at 17:00 – Arrival at 19:25
                        </span>
                    </div>
                </div>


                <div className="my-8">
                    <Splide
                        className="py-2 sm:py-4"
                        options={{
                            type: "slide",
                            rewind: false,
                            perPage: 3,
                            perMove: 1,
                            gap: "1rem",
                            pagination: false,
                            arrows: true,
                            drag: true,
                            breakpoints: {
                                1280: { perPage: 2 },
                                768: { perPage: 1 },
                            },
                        }}
                    >
                        {fareCards.map((card, index) => (
                            <SplideSlide key={index}>
                                <div
                                    className=" rounded-xl p-4 sm:p-6 flex flex-col justify-between bg-white h-full"
                                    style={{ boxShadow: '1px 5px 4px 2px rgba(0, 0, 0, 0.25)' }}
                                >
                                    <div>
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <span className="text-sm sm:text-lg line-through">{card.oldPrice}</span>
                                            <span className="text-xl sm:text-2xl font-bold text-[#78080B]">
                                                {card.price}
                                            </span>
                                            <span className="text-sm sm:text-xl font-medium">{card.type}</span>
                                        </div>

                                        <p className="text-sm font-medium mb-5">
                                            FARE BY{" "}
                                            <span className="font-bold text-[#78080B]">{card.title}</span>
                                        </p>

                                        <div className="space-y-2 text-sm">
                                            {/* Baggage */}
                                            <div>
                                                <p className="font-bold text-base">Baggage</p>
                                                {card.baggage.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 mt-1">
                                                        <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#78080B] text-white text-xs">
                                                            <img src={Tick} alt="tick" />
                                                        </div>
                                                        <p>{item}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Flexibility */}
                                            <div className="mt-4">
                                                <p className="text-base font-bold">Flexibility</p>
                                                {card.flexibility.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <img src={Dash} alt="dash" className="pt-2" />
                                                        <p className="text-sm leading-loose">{item}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Seats, Meals & More */}
                                            <div className="mt-4">
                                                <p className="text-base font-bold">Seats, Meals & More</p>
                                                {card.seatsMeals.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <img src={Dash} alt="dash" className="pt-2" />
                                                        <p className="text-sm leading-loose">{item}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Optional: Benefits / Insurance */}
                                            {card.benefitsWorth && (
                                                <div>
                                                    <p className="text-base mt-3 font-semibold">
                                                        BENEFITS WORTH{" "}
                                                        <span className="text-[#FF8000]">
                                                            {card.benefitsWorth}
                                                        </span>{" "}
                                                        INCLUDED
                                                    </p>
                                                </div>
                                            )}

                                            {card.insurance && (
                                                <div
                                                    className="flex items-center bg-[#D9D9D9] rounded-md text-black p-2"
                                                    style={{
                                                        boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.10)",
                                                    }}
                                                >
                                                    <img src={Insurance} alt="insurance" />
                                                    <p className="text-sm">{card.insurance}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col justify-between sm:flex-row mt-6 gap-3 sm:gap-4">
                                        {card.buttons.map((btn, i) => (
                                            <button
                                                key={i}
                                                className={`cursor-pointer py-2 px-4 text-sm sm:text-base rounded-full border-2 transition duration-200 shadow-sm ${btn === "BOOK NOW"
                                                    ? "bg-[#78080B] text-white border-transparent hover:bg-white hover:text-[#78080B] hover:border-[#78080B]"
                                                    : "border-[#78080B] text-[#78080B] hover:bg-[#78080B] hover:text-white"
                                                    }`}
                                                onClick={() => { navigate('/review-details') }}
                                            >
                                                {btn}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </SplideSlide>
                        ))}
                    </Splide>
                </div>

            </div>

            {/* Animations */}
            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); }
            to { transform: scale(1); }
          }
        `}
            </style>
        </div >
    );
}
