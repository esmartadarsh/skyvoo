import React, { useState } from 'react';
import { Copy, Check, Search, Tag, Sparkles, TrendingUp, Clock, Plane, Gift, AlertCircle, X, Share2, Heart, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';

const categories = [
    { id: 'all', label: 'All Offers', icon: Tag },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Sparkles },
    { id: 'expiring', label: 'Expiring Soon', icon: Clock }
];

const coupons = [
    {
        id: 1,
        code: 'FIRSTFLIGHT50',
        discount: '50% OFF',
        title: 'First Flight Special',
        description: 'Get 50% off on your first domestic flight booking',
        minAmount: 5000,
        maxDiscount: 2500,
        validTill: '2025-12-31',
        category: 'new',
        color: 'from-purple-500 to-pink-500',
        savedCount: 1234,
        terms: ['Valid for new users only', 'Cannot be combined with other offers', 'Applicable on select routes']
    },
    {
        id: 2,
        code: 'INTERNATIONAL25',
        discount: '25% OFF',
        title: 'International Travel',
        description: 'Save 25% on all international flight bookings',
        minAmount: 15000,
        maxDiscount: 5000,
        validTill: '2025-11-30',
        category: 'popular',
        color: 'from-blue-500 to-cyan-500',
        savedCount: 3456,
        terms: ['Valid on international routes', 'Booking must be made 7 days in advance', 'Limited seats available']
    },
    {
        id: 3,
        code: 'WEEKEND300',
        discount: '₹300 OFF',
        title: 'Weekend Getaway',
        description: 'Flat ₹300 off on weekend flight bookings',
        minAmount: 3000,
        maxDiscount: 300,
        validTill: '2025-11-15',
        category: 'expiring',
        color: 'from-orange-500 to-red-500',
        savedCount: 892,
        terms: ['Valid for Friday-Sunday travel', 'Not applicable on holidays', 'One coupon per booking']
    },
    {
        id: 4,
        code: 'BUSINESS40',
        discount: '40% OFF',
        title: 'Business Class Luxury',
        description: 'Premium discount on business class tickets',
        minAmount: 25000,
        maxDiscount: 10000,
        validTill: '2025-12-25',
        category: 'popular',
        color: 'from-emerald-500 to-teal-500',
        savedCount: 2103,
        terms: ['Business class only', 'Valid on all routes', 'Complimentary lounge access included']
    },
    {
        id: 5,
        code: 'EARLYBIRD15',
        discount: '15% OFF',
        title: 'Early Bird Booking',
        description: 'Book 30 days in advance and save 15%',
        minAmount: 8000,
        maxDiscount: 3000,
        validTill: '2025-12-20',
        category: 'new',
        color: 'from-amber-500 to-yellow-500',
        savedCount: 567,
        terms: ['Book 30+ days in advance', 'All cabin classes', 'Flexible date changes allowed']
    },
    {
        id: 6,
        code: 'FAMILY500',
        discount: '₹500 OFF',
        title: 'Family Pack',
        description: 'Book for 4+ passengers and get instant discount',
        minAmount: 20000,
        maxDiscount: 500,
        validTill: '2025-11-10',
        category: 'expiring',
        color: 'from-rose-500 to-pink-500',
        savedCount: 1678,
        terms: ['Minimum 4 passengers', 'Children tickets included', 'Extra 5% off on round trips']
    }
];

function CouponsAndOffers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [copiedCode, setCopiedCode] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showHowToUse, setShowHowToUse] = useState(false);
    const [expandedCoupon, setExpandedCoupon] = useState(null);
    const [savedCoupons, setSavedCoupons] = useState(new Set());
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    let filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || coupon.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort coupons
    if (sortBy === 'popular') {
        filteredCoupons = [...filteredCoupons].sort((a, b) => b.savedCount - a.savedCount);
    } else if (sortBy === 'discount') {
        filteredCoupons = [...filteredCoupons].sort((a, b) => {
            const aDiscount = parseInt(a.discount) || 0;
            const bDiscount = parseInt(b.discount) || 0;
            return bDiscount - aDiscount;
        });
    } else if (sortBy === 'expiring') {
        filteredCoupons = [...filteredCoupons].sort((a, b) =>
            new Date(a.validTill) - new Date(b.validTill)
        );
    }

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleApply = (coupon) => {
        setAppliedCoupon(coupon);
        setTimeout(() => setAppliedCoupon(null), 3000);
    };

    const toggleSaveCoupon = (couponId) => {
        setSavedCoupons(prev => {
            const newSet = new Set(prev);
            if (newSet.has(couponId)) {
                newSet.delete(couponId);
            } else {
                newSet.add(couponId);
            }
            return newSet;
        });
    };

    const handleShare = async (coupon) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: coupon.title,
                    text: `Check out this amazing deal: ${coupon.discount} off with code ${coupon.code}!`,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            handleCopy(coupon.code);
        }
    };

    const getDaysLeft = (validTill) => {
        const days = Math.ceil((new Date(validTill) - new Date()) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="min-h-screen bg-[#f1f0f29e]">
            {/* Header Section */}
            <Header />
            {/* Search Section */}
            <div className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search coupons by code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Category Filters and Sort */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 
                                        ${isSelected ? 'bg-[#78080B] text-white shadow-lg shadow-red-500/30'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="discount">Highest Discount</option>
                            <option value="expiring">Expiring Soon</option>
                        </select>
                        <button
                            onClick={() => setShowHowToUse(true)}
                            className="px-4 py-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            How to use?
                        </button>
                    </div>
                </div>

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoupons.map((coupon) => {
                        const daysLeft = getDaysLeft(coupon.validTill);
                        const isExpiringSoon = daysLeft <= 7;
                        const isSaved = savedCoupons.has(coupon.id);
                        const isExpanded = expandedCoupon === coupon.id;

                        return (
                            <div
                                key={coupon.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                            >
                                {/* Expiring Badge */}
                                {isExpiringSoon && (
                                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                        {daysLeft} days left!
                                    </div>
                                )}

                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-r ${coupon.color} p-6 text-white relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-3xl font-bold">{coupon.discount}</span>
                                            <div className="flex gap-2">
                                                <Plane className="w-6 h-6 opacity-75" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-1">{coupon.title}</h3>
                                        <p className="text-white/90 text-sm">{coupon.description}</p>
                                        <div className="flex items-center gap-2 mt-3 text-xs opacity-90">
                                            <span>{coupon.savedCount.toLocaleString()} people saved this</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Details */}
                                <div className="p-6">
                                    <div className="space-y-3 mb-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Min. Booking:</span>
                                            <span className="font-semibold text-gray-900">₹{coupon.minAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Max. Discount:</span>
                                            <span className="font-semibold text-gray-900">₹{coupon.maxDiscount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Valid Till:</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(coupon.validTill).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Terms & Conditions Toggle */}
                                    <button
                                        onClick={() => setExpandedCoupon(isExpanded ? null : coupon.id)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {isExpanded ? 'Hide' : 'View'} Terms & Conditions
                                    </button>

                                    {/* Expanded Terms */}
                                    {isExpanded && (
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-2">
                                            {coupon.terms.map((term, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="text-blue-600 mt-1">•</span>
                                                    <span>{term}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Coupon Code */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border-2 border-dashed border-gray-300">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-600 mb-1">Coupon Code</p>
                                                <p className="font-mono font-bold text-lg text-gray-900">{coupon.code}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleCopy(coupon.code)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                    title="Copy code"
                                                >
                                                    {copiedCode === coupon.code ? (
                                                        <Check className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleShare(coupon)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                    title="Share coupon"
                                                >
                                                    <Share2 className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredCoupons.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* How to Use Modal */}
            {showHowToUse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-slide-up">
                        <button
                            onClick={() => setShowHowToUse(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Use Coupons</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Browse & Select</p>
                                    <p className="text-sm text-gray-600">Choose a coupon that matches your travel needs</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Copy Code</p>
                                    <p className="text-sm text-gray-600">Click the copy icon to copy the coupon code</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Apply at Checkout</p>
                                    <p className="text-sm text-gray-600">Paste the code during flight booking to get your discount</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">4</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Enjoy Savings!</p>
                                    <p className="text-sm text-gray-600">Your discount will be applied automatically</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHowToUse(false)}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {appliedCoupon && (
                <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
                    <Check className="w-6 h-6" />
                    <div>
                        <p className="font-semibold">Coupon Applied Successfully!</p>
                        <p className="text-sm text-green-100">{appliedCoupon.code}</p>
                    </div>
                </div>
            )}

            {/* Copy Toast */}
            {copiedCode && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-slide-up z-50">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Code copied!</span>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default CouponsAndOffers;