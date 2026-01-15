import React, { useState, useCallback } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, CreditCard, Plane, Award, Globe, ClipboardList, Bell, Shield, Settings, Codesandbox,
    UserCheck, BookCheck, LogOut, Edit2, Save, X, ChevronRight, ReceiptIndianRupee, Clock, Check
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/getCroppedImg.jsx';
import AirlineLogo from '@/assets/imgs/airlinelogo.webp'
import SignInModal from '@/components/common/Modals/SignInModal';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import { useNavigate } from 'react-router-dom';
import clsx from "clsx";

const stats = [
    { icon: Plane, label: 'Total Flights', value: '47', color: 'from-amber-400 to-orange-500' },
    { icon: Globe, label: 'Countries Visited', value: '23', color: 'from-emerald-400 to-teal-500' },
    { icon: Award, label: 'Money Saved', value: '₹12,800', color: 'from-violet-400 to-purple-500' },
    { icon: ReceiptIndianRupee, label: 'Coupons Redeemed', value: '2', color: 'from-blue-400 to-indigo-500' }
];

const bookingHistory = [
    {
        id: 1,
        from: 'JFK',
        to: 'CDG',
        destination: 'Paris, France',
        date: '2024-12-15',
        time: '14:30',
        flightNo: 'AF 1234',
        status: 'Upcoming',
        price: '₹9890',
        class: 'Business',
        gate: 'B12',
        seat: '12A'
    },
    {
        id: 2,
        from: 'LHR',
        to: 'NRT',
        destination: 'Tokyo, Japan',
        date: '2024-11-20',
        time: '09:15',
        flightNo: 'JL 5678',
        status: 'Completed',
        price: '₹21,250',
        class: 'First Class',
        gate: 'A7',
        seat: '3F'
    },
    {
        id: 3,
        from: 'LAX',
        to: 'LHR',
        destination: 'London, UK',
        date: '2024-10-10',
        time: '18:45',
        flightNo: 'BA 9012',
        status: 'Cancelled',
        price: '₹7200',
        class: 'Economy Plus',
        gate: 'C3',
        seat: '24C'
    }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

function Profile() {
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        name: 'Adarsh Joshi',
        email: 'adarshjoshi200513@gmail.com',
        phone: '+91 9667479529',
        location: 'Delhi, India',
        dateOfBirth: '2005-01-13',
        passportNumber: 'XXXX765432',
        memberSince: '2018',
        tier: 'Frequent Flyer'
    });

    const [profilePic, setProfilePic] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropping, setCropping] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [isSignInModal, setIsSignInModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [editData, setEditData] = useState({ ...userData });
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);


    const handleCropConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setProfilePic(croppedImage);
            setCropping(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...userData });
    };

    const handleSave = () => {
        setUserData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    return (
        <>
            {cropping && (
                <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-999 p-4">
                    <div className="relative bg-slate-900 rounded-2xl p-4 shadow-xl w-full max-w-md">
                        <div className="relative w-full h-72 rounded-xl overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        {/* Zoom Slider */}
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full mt-4"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => setCropping(false)}
                                className="px-4 py-2 text-gray-300 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCropConfirm}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-white font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-998">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group shadow-xl relative bg-white backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 border-3 hover:border-black transition-[background,transform,box-shadow] duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                            <div className={`w-12 h-12 bg-[#78080B] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>

                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative h-32 bg-[#78080B]">
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            <div className="relative px-6 pb-6">
                                <div className="flex justify-center -mt-16 mb-4">
                                    {/* Profile Image Container */}
                                    <div className="relative group">
                                        {/* Profile picture (or fallback) */}
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl bg-gray-400 flex items-center justify-center">
                                            {profilePic ? (
                                                <img
                                                    src={profilePic}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-16 h-16 text-white opacity-80" />
                                            )}
                                        </div>

                                        {/* Hidden file input */}
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {/* Overlay (entire circle is clickable) */}
                                        <label
                                            htmlFor="profile-upload"
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-full transition-opacity duration-300 cursor-pointer"
                                        >
                                            <Edit2 className="w-5 h-5 text-black" />
                                            <span className="text-sm text-black font-medium">Upload</span>
                                        </label>

                                        {/* Verified Badge */}
                                        {/* <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div> */}
                                    </div>

                                </div>

                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                                    <p className="text-[#a54040] text-sm font-semibold mb-2">{userData.tier}</p>
                                    <p className="text-gray-400 text-sm">Member since {userData.memberSince}</p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">

                                    <button
                                        onClick={() => setActiveTab("profile")}
                                        className={clsx(
                                            "group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                                            activeTab === "profile"
                                                ? "bg-red-100 border border-amber-500/30 text-[#78080B]"
                                                : "text-gray-400 hover:bg-white/5 hover:text-black"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5" />
                                            <span className="font-medium">Profile Info</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className={clsx("group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                                            activeTab === 'bookings' ?
                                                "bg-red-100 border border-amber-500/30 text-[#78080B]"
                                                : "text-gray-400 hover:bg-white/5 hover:text-black"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Plane className="w-5 h-5" />
                                            <span className="font-medium">My Bookings</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    {/*
                                        <button
                                            onClick={() => setActiveTab('achievements')}
                                            className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'achievements'
                                                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[#78080B]'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Award className="w-5 h-5" />
                                                <span className="font-medium">Achievements</span>
                                            </div>

                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        */}

                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={clsx("group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300", activeTab === 'settings'
                                            ? 'bg-red-100 border border-amber-500/30 text-[#78080B]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-black'
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Settings className="w-5 h-5" />
                                            <span className="font-medium">Settings</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>


                                    <button
                                        onClick={() => navigate('/mark-up')}
                                        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-black`}>
                                        <div className="flex items-center space-x-3">
                                            <BookCheck className="w-5 h-5" />
                                            <span className="font-medium">Mark Ups</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>


                                    <button
                                        onClick={() => navigate('/coupons-and-offers')}
                                        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-black`}>
                                        <div className="flex items-center space-x-3">
                                            <Codesandbox className="w-5 h-5" />
                                            <span className="font-medium">Coupons & Offers</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>


                                    <button
                                        onClick={() => navigate('/complaint-register')}
                                        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-black`}>
                                        <div className="flex items-center space-x-3">
                                            <UserCheck className="w-5 h-5" />
                                            <span className="font-medium">Complaint Register</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => navigate('/statement')}
                                        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-black`}>
                                        <div className="flex items-center space-x-3">
                                            <ClipboardList className="w-5 h-5" />
                                            <span className="font-medium">Statement</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>


                                    <button
                                        className={`group w-full flex items-center justify-between px-4 py-3 pt-4 transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-black border-t border-gray-400`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-medium">Log Out</span>
                                        </div>

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">

                        {activeTab === 'profile' && (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-3xl font-bold mb-2">Personal Information</h3>
                                        <p className="text-gray-400">Manage your account details</p>
                                    </div>
                                    {!isEditing ? (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center space-x-2 px-6 py-3 bg-[#78080B] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#78080B]"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span className="font-medium">Edit Profile</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span className="font-medium">Save</span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-[#78080B] border-2 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="font-medium text-[#78080B]">Cancel</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { icon: User, label: 'Full Name', name: 'name', value: userData.name, editValue: editData.name },
                                        { icon: Mail, label: 'Email Address', name: 'email', value: userData.email, editValue: editData.email, type: 'email' },
                                        { icon: Phone, label: 'Phone Number', name: 'phone', value: userData.phone, editValue: editData.phone, type: 'tel' },
                                        { icon: MapPin, label: 'Location', name: 'location', value: userData.location, editValue: editData.location },
                                        { icon: Calendar, label: 'Date of Birth', name: 'dateOfBirth', value: userData.dateOfBirth, editValue: editData.dateOfBirth, type: 'date' },
                                        { icon: CreditCard, label: 'Passport Number', name: 'passportNumber', value: userData.passportNumber, editValue: editData.passportNumber }
                                    ].map((field, index) => (
                                        <div key={index} className="group">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-400 mb-3">
                                                <field.icon className="w-4 h-4 text-amber-400" />
                                                <span>{field.label}</span>
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type={field.type || 'text'}
                                                    name={field.name}
                                                    value={field.editValue}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 focus:bg-white/10 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-all duration-300">
                                                    {field.value}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="space-y-6">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold mb-2">Flight History</h3>
                                        <p className="text-gray-400">Your recent and upcoming journeys</p>
                                    </div>

                                    <div className="space-y-4">
                                        {bookingHistory.map((booking) => (
                                            <div
                                                key={booking.id}
                                                onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                                                className={`group cursor-pointer bg-white/5 hover:bg-white/10 border border-black/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${selectedBooking === booking.id ? 'shadow-xl' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                            <img src={AirlineLogo} alt="Airline Logo" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <span className="text-2xl font-bold">{booking.from}</span>
                                                                <ChevronRight className="w-5 h-5 text-amber-400" />
                                                                <span className="text-2xl font-bold">{booking.to}</span>
                                                            </div>
                                                            <p className="text-gray-400 text-sm mb-1">{booking.destination}</p>
                                                            <p className="text-gray-500 text-xs">Flight {booking.flightNo} • {booking.class}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">

                                                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold mb-2 ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                        {/* <span
                                                                className={`inline-block text-white px-4 py-2 rounded-xl text-sm font-semibold mb-2 ${statusStyles[booking.status]}`}>
                                                                {booking.status}
                                                            </span> */}

                                                        <p className="text-2xl font-bold text-[#78080B]">{booking.price}</p>
                                                    </div>
                                                </div>

                                                {selectedBooking === booking.id && (
                                                    <div className="mt-6 pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                                                        <div className="bg-white/5 rounded-xl p-3">
                                                            <p className="text-gray-400 text-xs mb-1">Date</p>
                                                            <p className=" font-semibold">{booking.date}</p>
                                                        </div>
                                                        <div className="bg-white/5 rounded-xl p-3">
                                                            <p className="text-gray-400 text-xs mb-1">Time</p>
                                                            <p className=" font-semibold">{booking.time}</p>
                                                        </div>
                                                        <div className="bg-white/5 rounded-xl p-3">
                                                            <p className="text-gray-400 text-xs mb-1">Gate</p>
                                                            <p className=" font-semibold">{booking.gate}</p>
                                                        </div>
                                                        <div className="bg-white/5 rounded-xl p-3">
                                                            <p className="text-gray-400 text-xs mb-1">Seat</p>
                                                            <p className=" font-semibold">{booking.seat}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className='flex justify-end mt-4'>
                                        <button
                                            type="button"
                                            className="cursor-pointer bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                                            onClick={() => navigate('/booking-lists')}
                                        >
                                            VIEWL ALL
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* {activeTab === 'achievements' && (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-white mb-2">Achievements</h3>
                                        <p className="text-gray-400">Your travel milestones and rewards</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {achievements.map((achievement, index) => (
                                            <div
                                                key={index}
                                                className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                        <Award className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white mb-2">{achievement.title}</h4>
                                                    <p className="text-gray-400 text-sm mb-3">{achievement.desc}</p>
                                                    {achievement.unlocked && (
                                                        <div className="flex items-center space-x-2 text-emerald-400">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="text-sm font-semibold">Unlocked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                        {activeTab === 'settings' && (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold mb-2">Account Settings</h3>
                                    <p className="text-gray-400">Manage your preferences and security</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Bell className="w-7 h-7 text-[#78080B]" />
                                            <h4 className="font-bold text-lg">Notifications</h4>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Email notifications', desc: 'Receive flight updates via email' },
                                                { label: 'SMS notifications', desc: 'Get text alerts for bookings' },
                                                { label: 'Push notifications', desc: 'Mobile app notifications' },
                                            ].map((item, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center justify-between cursor-pointer group"
                                                >
                                                    <div>
                                                        <p className="font-medium group-hover:text-[#a54040] transition-colors">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                                    </div>

                                                    {/* Custom Switch */}
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={index === 0}
                                                            className="sr-only peer"

                                                        />
                                                        <div className="w-12 h-6 bg-white/10 border border-white/20 rounded-full peer-checked:bg-[#a54040] transition-all duration-300"></div>
                                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-6"></div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Shield className="w-7 h-7 text-[#78080B]" />
                                            <h4 className="font-bold text-lg">Security & Privacy</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium group-hover:text-[#a54040] transition-colors">Change Password</span>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium group-hover:text-[#a54040] transition-colors">Two-Factor Authentication</span>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                            <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium group-hover:text-[#a54040] transition-colors">Privacy Settings</span>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                                        <button className="px-6 py-3 bg-red-800 hover:bg-red-500 border border-red-500/50 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;