import React, { useState, useEffect } from 'react'
import { X, Tag, Lock } from 'lucide-react';

const offers = [
    {
        id: 1,
        code: 'MMTSECURE',
        discount: '₹346 off',
        description: 'Get an instant discount ₹346 on your flight booking and trip secure combo',
        category: 'all'
    },
    {
        id: 2,
        code: 'MMTSECURE',
        discount: '₹346 off',
        description: 'Get an instant discount ₹346 on your flight booking and trip secure combo',
        category: 'bank'
    },
    {
        id: 3,
        code: 'MMTSECURE',
        discount: '₹346 off',
        description: 'Get an instant discount ₹346 on your flight booking and trip secure combo',
        category: 'add-ons'
    }
];

export default function ViewAllCouponsModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('all');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const filteredOffers = activeTab === 'all' ? offers : offers.filter(offer => offer.category === activeTab);

    const handleApplyCoupon = () => {
        if (couponCode) {
            setAppliedCoupon(couponCode);
        }
    };

    const handleApplyOffer = (code) => {
        setAppliedCoupon(code);
        setCouponCode(code);
    };

    const handleClose = () => {
        setIsClosing(true);

        setTimeout(() => {
            onClose();
        }, 300);
    };


    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
        };
    }, []);


    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm" onClick={handleClose} >
            <div
                className={`fixed bottom-0 left-0 right-0 bg-gradient-to-br from-stone-50 via-neutral-100 to-stone-100 rounded-t-3xl shadow-2xl w-full max-h-[90vh] overflow-hidden ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}
                onClick={(e) => e.stopPropagation()}
            >


                {/* Header with decorative coins */}
                <div className="relative bg-gradient-to-r from-stone-200 to-neutral-200 px-6 py-5 border-b-2 border-amber-200/50">
                    <div className="absolute -left-4 -top-4 w-24 h-24 opacity-80">
                        <div className="relative w-full h-full animate-float">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full transform rotate-12 shadow-xl"></div>
                            <div className="absolute inset-1 bg-gradient-to-br from-amber-300 via-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                <Tag className="w-8 h-8 text-white transform -rotate-12" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -left-2 top-8 w-16 h-16 opacity-70" style={{ animationDelay: '0.2s' }}>
                        <div className="relative w-full h-full animate-float">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-full transform -rotate-6 shadow-lg"></div>
                        </div>
                    </div>
                    <div className="absolute left-14 -top-2 w-12 h-12 opacity-60" style={{ animationDelay: '0.4s' }}>
                        <div className="relative w-full h-full animate-float">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-full transform rotate-45 shadow-lg"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <div className="text-xs font-medium text-stone-600 tracking-wider uppercase mb-1">
                                Economy › SAVER
                            </div>
                            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                                Offers & promo codes
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-9 h-9 rounded-full bg-stone-300/70 hover:bg-stone-400/80 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
                        >
                            <X className="w-5 h-5 text-stone-700" />
                        </button>
                    </div>
                </div>

                {/* Coupon Input */}
                <div className="px-6 py-4 bg-white/50 border-b border-stone-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter Coupon Code"
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800 placeholder-stone-400 font-medium text-sm transition-all duration-200"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl uppercase text-sm tracking-wide"
                        >
                            Apply
                        </button>
                    </div>
                    {appliedCoupon && (
                        <div className="mt-3 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 font-medium animate-fadeIn">
                            ✓ Coupon "{appliedCoupon}" applied successfully
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="px-6 py-3 bg-gradient-to-r from-stone-100 to-neutral-100 border-b border-stone-200">
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'bank', label: 'Bank' },
                            { id: 'add-ons', label: 'Add-ons' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${activeTab === tab.id
                                    ? 'bg-white border-orange-500 text-orange-600 shadow-md scale-105'
                                    : 'bg-stone-200/50 border-stone-300 text-stone-600 hover:bg-stone-300/70 hover:border-stone-400'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Offers List */}
                <div className="max-h-96 overflow-y-auto px-6 py-4 bg-gradient-to-b from-white/30 to-stone-50/30">
                    <div className="space-y-3">
                        {filteredOffers.map((offer, index) => (
                            <div
                                key={offer.id}
                                className="bg-white rounded-2xl border-2 border-stone-200 hover:border-orange-300 p-4 transition-all duration-300 hover:shadow-lg group animate-slideIn"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                                            <Lock className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <h3 className="font-bold text-stone-900 text-base tracking-tight">
                                                    {offer.code}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-stone-600 leading-relaxed">
                                                {offer.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <div className="text-right">
                                            <div className="text-orange-600 font-bold text-lg whitespace-nowrap">
                                                {offer.discount}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleApplyOffer(offer.code)}
                                            className="text-orange-600 hover:text-orange-700 font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <style>{`
                    @keyframes slideUp {
                        from {
                        transform: translateY(100%);
                        }
                        to {
                        transform: translateY(0);
                        }
                    }

                    @keyframes slideDown {
                        from {
                        transform: translateY(0);
                        }
                        to {
                        transform: translateY(100%);
                        }
                    }
                    .animate-slideUp {
                        animation: slideUp 0.5s ease-out forwards;
                    }

                    .animate-slideDown {
                        animation: slideDown 0.3s ease-in forwards;
                    }`}
                </style>

            </div>
        </div>
    );
}