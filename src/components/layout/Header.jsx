import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import Logo from '@/assets/imgs/logo.webp';
import comingSoon from '@/assets/imgs/comingSoon.png';

const Header = ({ onOpen }) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navItems = [
        { label: 'Home', url: '/' },
        { label: 'Flights', url: '/flight-results' },
        { label: 'Hotels', url: '/hotels' },
        { label: 'Bus', url: '/bus' },
        { label: 'Cab', url: '/cab' },
        { label: 'Customer Supports', url: '/support' },
    ];

    // Temporary: assume user is logged in
    const isLoggedIn = true;

    return (
        <header className="relative z-999">
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
                    <button onClick={onOpen} className="cursor-pointer hidden md:inline-block secondary-font px-4 sm:px-6 py-2 font-medium bg-black text-white rounded-full hover:bg-gray-800 transition" > Log In </button>
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

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navItems.map((item) => {
                            const isComingSoon = ['Hotels', 'Bus', 'Cab'].includes(item.label);
                            return (
                                <button
                                    key={item.label}
                                    disabled={isComingSoon}
                                    onClick={() => !isComingSoon && navigate(item.url)}
                                    className={`relative bg-[#D9D9D9] px-4 py-2 rounded-full transition ${isComingSoon
                                        ? 'text-gray-500 cursor-not-allowed'
                                        : 'hover:bg-black hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    {isComingSoon && (
                                        <span className="absolute bottom-0 right-1 text-[10px] text-red-500 font-semibold">
                                            Coming Soon
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Mobile Profile */}
                        {isLoggedIn && (
                            <div className="pt-3 border-t">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-black text-white w-full hover:bg-gray-800"
                                >
                                    <User size={20} />
                                    <span>Profile</span>
                                </button>

                                {profileOpen && (
                                    <div className="mt-2 bg-white shadow rounded-md p-2 space-y-2">
                                        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                                            Profile
                                        </button>
                                        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                                            Settings
                                        </button>
                                        <button className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-100">
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
