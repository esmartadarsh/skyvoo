import React, { useState } from 'react';
import { Plane, Utensils, Coffee, Clock, Plug, Tv, Luggage, DollarSign, RockingChair, BaggageClaim, Coins } from 'lucide-react';
import Header from '@/components/layout/Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import FlightPriceDetailsModal from '@/components/common/Modals/FlightPriceDetailsModal';
import SignInModal from '@/components/common/Modals/SignInModal';

export default function CompareFlights() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFlightDetailsModalOpen, setIsFlightDetailsModalOpen] = useState(false);

    const flights = [
        {
            airline: 'Akasa Air',
            logo: '🟠',
            departTime: '21:55',
            arriveTime: '00:50',
            duration: '2h 55m',
            stops: 'Non Stop',
            dayTag: '+1 Day',
            fleet: 'Boeing 737 | 3-3 Layout',
            seating: 'Standard Recliner(29.0" Legroom)',
            power: false,
            infotainment: false,
            meals: 'Chargeable',
            beverages: 'Chargeable',
            cabinBag: '7 Kgs',
            checkInBag: '15 Kgs',
            cancellation: 'Partially Refundable',
            price: '₹ 10,221',
            moreFares: '1 more fares available'
        },
        {
            airline: 'Akasa Air',
            logo: '🟠',
            departTime: '22:55',
            arriveTime: '02:15',
            duration: '3h 20m',
            stops: 'Non Stop',
            dayTag: '+1 Day',
            fleet: 'Boeing 737 | 3-3 Layout',
            seating: 'Standard Recliner(29.0" Legroom)',
            power: false,
            infotainment: false,
            meals: 'Chargeable',
            beverages: 'Chargeable',
            cabinBag: '7 Kgs',
            checkInBag: '15 Kgs',
            cancellation: 'Partially Refundable',
            price: '₹ 13,943',
            moreFares: '1 more fares available'
        },
        {
            airline: 'IndiGo',
            logo: '🔷',
            departTime: '21:45',
            arriveTime: '00:40',
            duration: '2h 55m',
            stops: 'Non Stop',
            dayTag: '+1 Day',
            fleet: 'Airbus A320 | 3-3 Layout',
            seating: 'Standard Recliner(28" Legroom)',
            power: false,
            infotainment: false,
            meals: 'Chargeable',
            beverages: 'Chargeable',
            cabinBag: '7 Kgs',
            checkInBag: '15 Kgs',
            cancellation: 'Partially Refundable',
            price: '₹ 12,805',
            moreFares: '2 more fares available'
        }
    ];

    return (
        <>
            {isFlightDetailsModalOpen && <FlightPriceDetailsModal onClose={() => setIsFlightDetailsModalOpen(false)} />}
            {isModalOpen && <SignInModal onClose={() => setIsModalOpen(false)} />}

            <div className="relative bg-white secondary-font">
                {/* Background Image */}
                <img
                    className="absolute right-0 z-10 max-w-full h-auto object-cover"
                    src={GrayFadedBg}
                    alt="gray faded bg"
                />
                <Header onOpen={() => setIsModalOpen(true)} />


            </div>

            {/* Main Content */}
            <div className="pb-5 sm:pb-2 bg-cover bg-center" >
                <div className="relative z-20 container mx-auto max-w-7xl px-4">
                    <h1 className="text-3xl font-bold mb-3">Compare your flights</h1>
                    {/* Route Info Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-lg mb-2 border-1 border-solid border-[#78080B]">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-semibold text-gray-800">New Delhi, <span className='font-normal'>India</span> </span>
                                <span className="mx-2 text-gray-400">→</span>
                                <span className="font-semibold text-gray-800">Kolkatta, <span className='font-normal'>India</span></span>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="ml-2 text-gray-600">Departure <span className='font-semibold'>Oct 7</span></span>
                            </div>
                            <div className="text-sm text-gray-500">
                                * Comparison is between base fares of each flights
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-xl shadow-xl p-4 mb-4 border-1 border-solid border-[#78080B]">
                        <div className="grid grid-cols-7 gap-0">
                            {/* Left Column - Labels */}
                            <div className="col-span-1">
                                <div className="px-4 h-32 flex items-center">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Plane className="w-4 h-4" />
                                        <span className="font-medium">Flight summary</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Plane className="w-4 h-4" />
                                        <span className="text-sm">Fleet</span>
                                    </div>
                                </div>

                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <RockingChair className="w-4 h-4" />
                                        <span className="text-sm">Seating</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Plug className="w-4 h-4" />
                                        <span className="text-sm">Power outlet</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Tv className="w-4 h-4" />
                                        <span className="text-sm">Infotainment</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Utensils className="w-4 h-4" />
                                        <span className="text-sm">Meals</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Coffee className="w-4 h-4" />
                                        <span className="text-sm">Beverages</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Luggage className="w-4 h-4" />
                                        <span className="text-sm">Cabin Bag</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <BaggageClaim className="w-4 h-4" />
                                        <span className="text-sm">Check In Bag</span>
                                    </div>
                                </div>
                                <div className="px-4 h-12 flex items-center  ">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Coins className="w-4 h-4" />
                                        <span className="text-sm">Cancellation</span>
                                    </div>
                                </div>

                                <div className="p-4 h-24 flex items-center">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-semibold">Price</span>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Columns */}
                            {flights.map((flight, idx) => (
                                <div key={idx} className={`col-span-2 mx-3 ${idx < 2 ? ' ' : ''}`}>
                                    {/* Flight Summary */}
                                    <div className="h-32 flex justify-center items-center border-1 border-gray-300">
                                        <div className="flex items-start gap-3">
                                            <img src={AirlineLogo} alt="airline logo" />
                                            <div className="flex-1">
                                                <div className="flex items-start gap-2 mb-1">
                                                    <span className="text-xl font-bold text-gray-800">{flight.departTime}</span>
                                                    <span className="text-gray-400">→</span>
                                                    <span className="text-xl font-bold text-gray-800">{flight.arriveTime}</span>
                                                    <span className="text-xs text-red-600 font-semibold">{flight.dayTag}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {flight.duration} | {flight.stops}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fleet */}
                                    <div className="h-12 flex items-center justify-center border-l border-r border-gray-300">
                                        <span className="text-sm text-gray-700 text-center">{flight.fleet}</span>
                                    </div>

                                    {/* Seating */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <span className="text-sm text-gray-700 text-center">{flight.seating}</span>
                                    </div>

                                    {/* Power outlet */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">✕</span>
                                            <span className="text-sm text-gray-700">No</span>
                                        </div>
                                    </div>

                                    {/* Infotainment */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">✕</span>
                                            <span className="text-sm text-gray-700">No</span>
                                        </div>
                                    </div>

                                    {/* Meals */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">≈</span>
                                            <span className="text-sm text-gray-700">{flight.meals}</span>
                                        </div>
                                    </div>

                                    {/* Beverages */}
                                    <div className="h-12 flex items-center justify-center border-l border-r border-gray-300 ">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">≈</span>
                                            <span className="text-sm text-gray-700">{flight.beverages}</span>
                                        </div>
                                    </div>

                                    {/* Cabin Bag */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <span className="text-sm text-gray-700">{flight.cabinBag}</span>
                                    </div>

                                    {/* Check In Bag */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <span className="text-sm text-gray-700">{flight.checkInBag}</span>
                                    </div>

                                    {/* Cancellation */}
                                    <div className="h-12 flex items-center justify-center  border-l border-r border-gray-300">
                                        <span className="text-sm text-gray-700">{flight.cancellation}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="p-4 flex flex-col items-center justify-center border-l border-r border-b border-gray-300">
                                        <div className="text-2xl font-bold text-[#78080B] mb-1">{flight.price}</div>
                                        <div className="text-xs text-gray-500 mb-3">per adult</div>
                                        <div className="text-xs text-gray-500 mb-3">{flight.moreFares}</div>
                                        <button className="w-full bg-[#811919] hover:bg-[#741111] text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors" onClick={() => setIsFlightDetailsModalOpen(true)}>
                                            VIEW ALL FARE OPTIONS
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-4 text-sm text-gray-400">
                            <p className='text-end'>
                                Hover on table items for more information
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}
