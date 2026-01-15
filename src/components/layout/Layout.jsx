// src/layouts/PublicLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import SignInModal from '@/components/common/Modals/SignInModal';

function Layout() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {isModalOpen && <SignInModal onClose={() => setIsModalOpen(false)} />}

            {/* Hero Section */}
            <div className="relative bg-white bg-cover bg-center">
                <img
                    className="absolute right-0 z-10 max-w-full h-auto object-cover"
                    src={GrayFadedBg}
                    alt="gray faded bg"
                />

                <Header onOpen={() => setIsModalOpen(true)} />
            </div>

            {/* Routed Page */}
            <Outlet />
        </div>
    );
}

export default Layout;
