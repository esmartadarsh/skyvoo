import { useState } from 'react';
import { Menu, X, Headphones } from 'lucide-react';
import Home from '@/assets/vectors/SidebarHome.svg';
import Flights from '@/assets/vectors/SidebarFlight.svg';
import Cabs from '@/assets/vectors/SidebarCab.svg';
import Hotels from '@/assets/vectors/SidebarHotels.svg';
import Bus from '@/assets/vectors/SidebarBus.svg';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import Logo from '@/assets/imgs/logo.webp';
import comingSoon from '@/assets/imgs/comingSoon.png';

const Header = ({ onOpen }) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navItems = [
        { label: 'Home', url: '/', icon: Home },
        { label: 'Flights', url: '/flight-results', icon: Flights },
        { label: 'Hotels', url: '/hotels', icon: Hotels },
        { label: 'Bus', url: '/bus', icon: Bus },
        { label: 'Cab', url: '/cab', icon: Cabs },
    ];


    // Temporary: assume user is logged in
    const isLoggedIn = false;
    5
    return (
        <header className="relative z-9998">
            <div className="max-w-7xl mx-auto flex items-center justify-between sm:px-6 py-10">
                {/* Logo */}
                <div className="flex items-center">
                    <img
                        onClick={() => navigate('/')}
                        src={Logo}
                        className="cursor-pointer h-10 sm:h-12 md:h-16 w-auto"
                        alt="SkyVoo Logo"
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4 lg:space-x-4 text-black text-base font-medium">
                    {navItems.map((item) => {
                        const isComingSoon = ['Hotels', 'Bus', 'Cab'].includes(item.label);
                        return (
                            <button
                                key={item.label}
                                disabled={isComingSoon}
                                onClick={() => !isComingSoon && navigate(item.url)}
                                className={`relative px-4 py-2 sm:px-6 rounded-full transition bg-[#D9D9D9] ${isComingSoon
                                    ? '!cursor-not-allowed'
                                    : 'cursor-pointer hover:bg-black hover:text-white'
                                    }`}
                            >
                                {item.label}
                                {isComingSoon && (
                                    <img
                                        src={comingSoon}
                                        alt="coming soon"
                                        className="absolute bottom-0 -right-0 w-10 h-4"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Profile instead of Login */}
                {isLoggedIn ? (
                    <div className="relative hidden md:block">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 transition"
                        >
                            <User size={20} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 space-y-2 z-999">
                                <button
                                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate('/my-profile')}

                                >
                                    Profile
                                </button>
                                <button
                                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate('/my-profile')}
                                >
                                    Settings
                                </button>
                                <button
                                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate('/mark-up')}
                                >
                                    Mark Ups
                                </button>
                                <button
                                    className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-100"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={onOpen} className="cursor-pointer hidden md:inline-block  px-4 sm:px-6 py-2 font-medium bg-black text-white rounded-full hover:bg-gray-800 transition" > Log In </button>
                )}

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden inline-flex items-center justify-center p-2 text-black"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? 'bg-white/50 backdrop-blur-sm pointer-events-auto' : 'bg-transparent pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            >
                {/* Sidebar */}
                <div
                    className={`flex flex-col fixed left-0 top-1/2 h-[80%] w-64 bg-[#4d0100] text-white rounded-r-2xl shadow-2xl transform transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0 -translate-y-1/2' : '-translate-x-full -translate-y-1/2'}`}
                    style={{ willChange: 'transform', boxShadow: '-6px 9px 40px -8px black' }}
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Close Button */}
                    <div className="flex justify-end p-3">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="text-white hover:bg-red-800 rounded-full p-1 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(item.url);
                                    setMobileOpen(false);
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-2.5 hover:bg-red-800/50 rounded-lg transition group"
                            >
                                <div className="w-11 h-11 rounded-full flex items-center justify-center border-[4px] border-[#727272]">
                                    <div className="w-9 h-9 rounded-full bg-[#D9D9D9] flex items-center justify-center">
                                        <img
                                            src={item.icon}
                                            alt={item.label}
                                            className="w-5 h-5 object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="w-full text-white font-medium text-sm pt-2">
                                    <p> {item.label} </p>
                                    <div className='border-b-2 border-[#78080B] pt-2' style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}></div>
                                </div>

                            </button>
                        ))}

                        {/* Login Button */}
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                onOpen?.();
                            }}
                            className="filterglasseffect w-full mt-4 px-6 py-2 border-2 border-white/30 rounded-full text-white font-medium text-sm hover:bg-red-800/50 transition"
                        >
                            Login
                        </button>
                    </nav>

                    {/* Customer Support */}
                    <div className="p-4 border-t border-red-800/50">
                        <button className="w-full flex items-center justify-center space-x-2 hover:text-red-200 transition">
                            <Headphones size={18} />
                            <span className="font-medium text-sm">Customer Support</span>
                        </button>
                    </div>
                </div>
            </div>

        </header >

    );
};

export default Header;
