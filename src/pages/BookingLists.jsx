import React, { useEffect, useState } from 'react';
import { Plane, Calendar, Clock, MapPin, User, Search, Filter, ChevronDown, ArrowRight, Check, X, Luggage, Wifi, Coffee, ChevronUp  } from 'lucide-react';
import Header from '@/components/layout/Header';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'

const bookings = [
    {
        id: 1,
        flightNumber: 'AA 2847',
        airline: 'Vistara',
        passenger: 'Testing Joshi',
        from: 'New York (JFK)',
        to: 'Los Angeles (LAX)',
        departure: 'Nov 15, 2025',
        departureTime: '08:30 AM',
        arrival: 'Nov 15, 2025',
        arrivalTime: '11:45 AM',
        duration: '6h 15m',
        status: 'confirmed',
        class: 'Business',
        price: '₹85,000',
        gate: 'B12',
        seat: '12A',
        amenities: ['wifi', 'meals', 'entertainment']
    },
    {
        id: 2,
        flightNumber: 'DL 1523',
        airline: 'Vistara',
        passenger: 'Adarsh Testing',
        from: 'San Francisco (SFO)',
        to: 'Tokyo (NRT)',
        departure: 'Nov 20, 2025',
        departureTime: '01:15 PM',
        arrival: 'Nov 21, 2025',
        arrivalTime: '05:30 PM',
        duration: '11h 15m',
        status: 'pending',
        class: 'Economy',
        price: '₹66,500',
        gate: 'A7',
        seat: '28C',
        amenities: ['wifi', 'entertainment']
    },
    {
        id: 3,
        flightNumber: 'UA 892',
        airline: 'Vistara',
        passenger: 'Manoj Tiwari',
        from: 'Delhi (DEL)',
        to: 'Sri Lanka (SRL)',
        departure: 'Nov 18, 2025',
        departureTime: '06:45 PM',
        arrival: 'Nov 19, 2025',
        arrivalTime: '08:20 AM',
        duration: '7h 35m',
        status: 'confirmed',
        class: 'First Class',
        price: '₹22,450',
        gate: 'C3',
        seat: '2D',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge']
    },
    {
        id: 4,
        flightNumber: 'BA 447',
        airline: 'Vistara',
        passenger: 'Ritik Sharma',
        from: 'Delhi (DEL)',
        to: 'Paris (CDG)',
        departure: 'Nov 22, 2025',
        departureTime: '09:20 PM',
        arrival: 'Nov 23, 2025',
        arrivalTime: '10:45 AM',
        duration: '7h 25m',
        status: 'cancelled',
        class: 'Business',
        price: '₹71,680',
        gate: 'E5',
        seat: '8B',
        amenities: ['wifi', 'meals', 'entertainment']
    },
    {
        id: 5,
        flightNumber: 'EK 215',
        airline: 'Emirates',
        passenger: 'Shubham Kaur',
        from: 'Dubai (DXB)',
        to: 'New York (JFK)',
        departure: 'Nov 25, 2025',
        departureTime: '03:10 AM',
        arrival: 'Nov 25, 2025',
        arrivalTime: '08:55 AM',
        duration: '14h 45m',
        status: 'confirmed',
        class: 'First Class',
        price: '₹55,200',
        gate: 'D2',
        seat: '1A',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge', 'shower']
    },
    {
        id: 6,
        flightNumber: 'LH 458',
        airline: 'Air India',
        passenger: 'Daniel Kumar',
        from: 'Frankfurt (FRA)',
        to: 'Singapore (SIN)',
        departure: 'Nov 28, 2025',
        departureTime: '11:30 PM',
        arrival: 'Nov 29, 2025',
        arrivalTime: '05:15 PM',
        duration: '12h 45m',
        status: 'pending',
        class: 'Business',
        price: '₹33,150',
        gate: 'A18',
        seat: '15F',
        amenities: ['wifi', 'meals', 'entertainment', 'lounge']
    }
];

function BookingLists() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 600); // show after 300px scroll
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.airline.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <Check className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'cancelled': return <X className="w-4 h-4" />;
            default: return null;
        }
    };

    const getClassColor = (className) => {
        switch (className) {
            case 'First Class': return 'bg-purple-100 text-purple-700';
            case 'Business': return 'bg-blue-100 text-blue-700';
            case 'Economy': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        // <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="min-h-screen bg-[#f1f0f29e]">
            {/* Header */}
            <Header />
            <div className="bg-[#78080B] backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-3 text-white">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        My Flight Bookings
                                    </h1>
                                    <p className="mt-1">Manage your upcoming flights</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search flights..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border placeholder-white border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                                >
                                    <option value="all">All Flights</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Flights</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                            </div>
                            <div className="bg-emerald-100 p-3 rounded-xl">
                                <Check className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-amber-600 mt-1">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Left: Flight Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div>
                                                    <img src={AirlineLogo} alt="airline logo" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {booking.airline}
                                                    </h3>
                                                    <span className="text-gray-500 font-medium">{booking.flightNumber}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 text-sm">{booking.passenger}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getClassColor(booking.class)}`}>
                                                {booking.class}
                                            </span>
                                            <span className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Route */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="text-2xl font-bold text-gray-900">{booking.departureTime}</div>
                                            <div className="text-gray-600 text-sm mt-1">{booking.from}</div>
                                            <div className="text-gray-500 text-xs mt-1">{booking.departure}</div>
                                        </div>

                                        <div className="flex flex-col items-center px-4">
                                            <div className="text-gray-500 text-xs mb-2">{booking.duration}</div>
                                            <div className="relative flex items-center">
                                                <div className="h-0.5 w-24 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                                            </div>
                                            <div className="text-gray-400 text-xs mt-2">Non-stop</div>
                                        </div>

                                        <div className="flex-1 text-right">
                                            <div className="text-2xl font-bold text-gray-900">{booking.arrivalTime}</div>
                                            <div className="text-gray-600 text-sm mt-1">{booking.to}</div>
                                            <div className="text-gray-500 text-xs mt-1">{booking.arrival}</div>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex items-center gap-3 mt-4">
                                        {booking.amenities.includes('wifi') && (
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <Wifi className="w-4 h-4" />
                                                <span>WiFi</span>
                                            </div>
                                        )}
                                        {booking.amenities.includes('meals') && (
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <Coffee className="w-4 h-4" />
                                                <span>Meals</span>
                                            </div>
                                        )}
                                        {booking.amenities.includes('entertainment') && (
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <span>🎬</span>
                                                <span>Entertainment</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Price & Actions */}
                                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">{booking.price}</div>
                                        <div className="text-gray-500 text-sm mt-1">Total Price</div>
                                    </div>
                                    <button className="px-6 py-3 bg-[#78080B] text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap">
                                        View Details
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredBookings.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm border border-gray-100">
                            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedBooking && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#78080B] p-8 text-white relative">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <div className="flex items-center justify-between mb-6">
                                <div className='flex'>
                                    <div className='mr-2'>
                                        <img src={AirlineLogo} alt="airline logo" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">{selectedBooking.airline}</h2>
                                        <p className="text-blue-100 text-lg">{selectedBooking.flightNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold">{selectedBooking.price}</div>
                                    <div className="text-blue-100 text-sm mt-1">Total Price</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold mb-1">{selectedBooking.departureTime}</div>
                                    <div className="text-blue-100">{selectedBooking.from}</div>
                                </div>
                                <div className="flex flex-col items-center px-6">
                                    <Plane className="w-8 h-8 mb-2 rotate-15" />
                                    <div className="text-sm">{selectedBooking.duration}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold mb-1">{selectedBooking.arrivalTime}</div>
                                    <div className="text-blue-100">{selectedBooking.to}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Passenger & Booking Info */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Passenger Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-sm text-gray-500">Name</div>
                                                <div className="font-semibold text-gray-900">{selectedBooking.passenger}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Luggage className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-sm text-gray-500">Class</div>
                                                <div className="font-semibold text-gray-900">{selectedBooking.class}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Flight Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-sm text-gray-500">Gate</div>
                                                <div className="font-semibold text-gray-900">{selectedBooking.gate}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-sm text-gray-500">Seat</div>
                                                <div className="font-semibold text-gray-900">{selectedBooking.seat}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Booking Status</h3>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                                    {getStatusIcon(selectedBooking.status)}
                                    <span className="font-semibold capitalize">{selectedBooking.status}</span>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Included Amenities</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedBooking.amenities.map((amenity, index) => (
                                        <div key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium capitalize">
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                                    Download Ticket
                                </button>
                                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                                    Cancel Flight
                                </button>
                                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium">
                                    Modify Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="cursor-pointer fixed bottom-6 right-6 bg-[#78080B] text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                    <p className='flex font-medium'> <ChevronUp className='mr-1' /> TOP</p>
                </button>
            )}
        </div>
    );
}

export default BookingLists;