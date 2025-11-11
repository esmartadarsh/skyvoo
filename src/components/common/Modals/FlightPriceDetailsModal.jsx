import React from "react";
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import Tick from '@/assets/vectors/Tick.svg'
import Dash from '@/assets/vectors/Dash.svg'
import Insuarance from '@/assets/vectors/Insuarance.svg'
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
    ];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-9999 bg-black/30 backdrop-blur-sm secondary-font"
            onClick={onClose}
            style={{
                animation: "fadeIn 0.3s ease-out forwards"
            }}
        >
            <div
                className=" rounded-2xl bg-white shadow-xl w-[90%] max-w-6xl relative p-6"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "scaleIn 0.3s ease-out forwards" }}>
                {/* Close button */}
                <button
                    className="cursor-pointer absolute top-4 right-4 text-2xl font-black text-[#4A4141] hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="font-semibold text-2xl">
                        Flights Details and Fare Options Available for you !
                    </h2>
                    <div className="flex items-center gap-2 font-medium text-base mt-1">
                        <span>New Delhi - Mumbai</span>
                        <span>|</span>
                        <img src={AirlineLogo} alt="airline logo" className="h-8" />
                        <span>Vistara</span>
                        <span>|</span>
                        <span>Wed, 24 Sep 2025</span>
                        <span>|</span>
                        <span>Departure at 17:00 – Arrival at 19:25</span>
                    </div>

                </div>

                <div className="my-8">
                    <Splide
                        options={{
                            type: "loop",
                            perPage: 3,
                            perMove: 1,
                            gap: "1rem",
                            pagination: false,
                            arrows: true,
                            breakpoints: {
                                1024: { perPage: 2 },
                                640: { perPage: 1 },
                            },
                        }}
                    >
                        {fareCards.map((card, index) => (
                            <SplideSlide key={index}>
                                <div
                                    className="border rounded-xl shadow-sm p-6 relative flex flex-col justify-between"
                                    style={{ height: "-webkit-fill-available" }}
                                >
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg line-through">{card.oldPrice}</span>
                                            <span className="text-2xl font-bold text-[#78080B]">
                                                {card.price}
                                            </span>
                                            <span className="text-xl font-medium">{card.type}</span>
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
                                                    <img src={Insuarance} alt="insurance" />
                                                    <p className="text-sm">{card.insurance}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex mt-6 justify-between text-sm font-medium gap-4">
                                        {card.buttons.map((btn, i) => (
                                            <button
                                                key={i}
                                                className={`cursor-pointer py-1 px-3 rounded-full border-2 transition duration-200 shadow-sm ${btn === "BOOK NOW"
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
        </div>
    );
}
