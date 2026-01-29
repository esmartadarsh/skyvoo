import React from 'react';
import {
    User,
    Plane,
    Settings,
    BookCheck,
    Codesandbox,
    UserCheck,
    ClipboardList,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({
    activeTab,
    setActiveTab,
    userData,
    profilePic,
    onUploadClick,
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="relative h-32 bg-[#78080B]" />

            {/* Profile */}
            <div className="relative px-6 pb-6">
                <div className="flex justify-center -mt-16 mb-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl bg-gray-400 flex items-center justify-center">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-white opacity-80" />
                            )}
                        </div>

                        <button
                            onClick={onUploadClick}
                            aria-label="Upload profile picture"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition"
                        >
                            <span className="text-sm font-medium text-white">Upload</span>
                        </button>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-[#a54040] text-sm font-semibold">{userData.tier}</p>
                    <p className="text-gray-400 text-sm">Member since {userData.memberSince}</p>
                </div>

                {/* Navigation */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                    <SidebarButton
                        icon={User}
                        label="Profile Info"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />

                    <SidebarButton
                        icon={Plane}
                        label="My Bookings"
                        active={activeTab === 'bookings'}
                        onClick={() => setActiveTab('bookings')}
                    />

                    <SidebarButton
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />

                    <SidebarLink icon={BookCheck} label="Mark Ups" onClick={() => navigate('/mark-up')} />
                    <SidebarLink icon={Codesandbox} label="Coupons & Offers" onClick={() => navigate('/coupons-and-offers')} />
                    <SidebarLink icon={UserCheck} label="Complaint Register" onClick={() => navigate('/complaint-register')} />
                    <SidebarLink icon={ClipboardList} label="Statement" onClick={() => navigate('/statement')} />

                    <SidebarLink icon={LogOut} label="Log Out" danger />
                </div>
            </div>
        </div>
    );
};

const SidebarButton = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            'group w-full flex items-center justify-between px-4 py-3 rounded-xl transition',
            active
                ? 'bg-red-100 border border-amber-500/30 text-[#78080B]'
                : 'text-gray-400 hover:bg-white/5 hover:text-black'
        )}
    >
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
);

const SidebarLink = ({ icon: Icon, label, onClick, danger }) => (
    <button
        onClick={onClick}
        className={clsx(
            'group w-full flex items-center justify-between px-4 py-3 rounded-xl transition',
            danger
                ? 'text-red-500 hover:bg-red-500/10'
                : 'text-gray-400 hover:bg-white/5 hover:text-black'
        )}
    >
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </div>
    </button>
);

export default React.memo(ProfileSidebar);
