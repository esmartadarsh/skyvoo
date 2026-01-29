import React, { useState, useCallback, useMemo } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Plane, Award, Globe, ReceiptIndianRupee } from 'lucide-react';
import getCroppedImg from '@/utils/getCroppedImg.jsx';
import { useNavigate } from 'react-router-dom';
import ProfileStats from './components/ProfileStats';
import ImageCropModal from './components/ImageCropModal';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileInfo from './components/ProfileInfo';
import BookingHistory from './components/BookingHistory';
import SettingsPanel from './components/SettingsPanel';


const profileFields = [
    {
        icon: User,
        label: 'Full Name',
        name: 'name',
        type: 'text',
    },
    {
        icon: Mail,
        label: 'Email Address',
        name: 'email',
        type: 'email',
    },
    {
        icon: Phone,
        label: 'Phone Number',
        name: 'phone',
        type: 'tel',
    },
    {
        icon: MapPin,
        label: 'Location',
        name: 'location',
        type: 'text',
    },
    {
        icon: Calendar,
        label: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'date',
    },
    {
        icon: CreditCard,
        label: 'Passport Number',
        name: 'passportNumber',
        type: 'text',
    },
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

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [editData, setEditData] = useState({ ...userData });
    const [selectedBooking, setSelectedBooking] = useState(null);

    const stats = useMemo(() => ([
        { icon: Plane, label: 'Total Flights', value: '47', color: 'from-amber-400 to-orange-500' },
        { icon: Globe, label: 'Countries Visited', value: '23', color: 'from-emerald-400 to-teal-500' },
        { icon: Award, label: 'Money Saved', value: '₹12,800', color: 'from-violet-400 to-purple-500' },
        { icon: ReceiptIndianRupee, label: 'Coupons Redeemed', value: '2', color: 'from-blue-400 to-indigo-500' }
    ]), []);

    const bookingHistory = useMemo(() => ([
        {
            id: 1,
            from: 'JFK',
            to: 'CDG',
            destination: 'Paris, France',
            date: '2024-12-15',
            time: '14:30',
            flightNo: 'AF 1234',
            status: 'Upcoming',
            price: 9890,
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
            price: 21250,
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
            price: 7200,
            class: 'Economy Plus',
            gate: 'C3',
            seat: '24C'
        }
    ]), []);


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

    const handleCropCancel = () => {
        setCropping(false);
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
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

    const toggleBooking = (id) => {
        setSelectedBooking(prev => (prev === id ? null : id));
    };

    const formatDate = (date) =>
        new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));

    const formatTime = (time) => time;

    const formatPrice = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);


    return (
        <>
            {cropping && imageSrc && (
                <ImageCropModal
                    imageSrc={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    setCrop={setCrop}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    setZoom={setZoom}
                    onCropComplete={onCropComplete}
                    onCancel={handleCropCancel}
                    onConfirm={handleCropConfirm}
                />
            )}

            <div className="relative max-w-7xl mx-auto px-4 py-8 z-998">
                <ProfileStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <ProfileSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        userData={userData}
                        profilePic={profilePic}
                        onUploadClick={() => document.getElementById('profile-upload').click()}
                    />
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />


                    {/* Main content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'profile' && (
                            <ProfileInfo
                                profileFields={profileFields}
                                userData={userData}
                                editData={editData}
                                isEditing={isEditing}
                                handleChange={handleChange}
                                handleEdit={handleEdit}
                                handleSave={handleSave}
                                handleCancel={handleCancel}
                            />

                        )}

                        {activeTab === 'bookings' && (
                            <BookingHistory
                                bookings={bookingHistory}
                                selectedBooking={selectedBooking}
                                toggleBooking={toggleBooking}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                formatPrice={formatPrice}
                                getStatusColor={getStatusColor}
                            />
                        )}

                        {activeTab === 'settings' && <SettingsPanel />}
                    </div>
                </div>
            </div>

        </>
    );
}

export default Profile;