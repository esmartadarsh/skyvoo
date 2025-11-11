import React, { useEffect, useState } from 'react';

import Header from '@/components/layout/Header';
import PromotionalCard from '@/components/PromotionalCard';
import BookingForm from '@/components/BookingForm';
import SignInModal from '@/components/common/Modals/SignInModal';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'
import BookingFlightSectionBg from '@/assets/imgs/bookingbg.webp';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const planeEl = document.getElementById('plane-animation');

    if (planeEl) {
      const handleAnimationEnd = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      };

      planeEl.addEventListener('animationend', handleAnimationEnd);

      return () => {
        planeEl.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, []);

  return (
    <>
      {isModalOpen && <SignInModal onClose={() => setIsModalOpen(false)} />}

      <div>
        {/* Hero Section */}
        <div className="relative bg-white bg-cover bg-center">
          <img
            className="absolute right-0 z-10 max-w-full h-auto object-cover"
            src={GrayFadedBg}
            alt="gray faded bg"
          />

          <Header onOpen={() => setIsModalOpen(true)} />

          <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-3">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h1
                  className="primary-font text-2xl sm:text-4xl lg:text-5xl font-medium text-black mb-3 sm:mb-4 leading-tight"
                  style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                >

                  TRAVEL SMARTER WITH DEALS YOU'LL ADORE
                </h1>
                <p
                  className="secondary-font text-sm sm:text-base md:text-lg font-semibold bg-clip-text text-transparent leading-snug"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #520000 0%, #FF0000 100%)',
                  }}
                >
                  Revolutionizing your financial journey with seamless, secure,
                  and personalized experiences
                </p>
              </div>

              <PromotionalCard />
            </div>
          </main>
        </div>

        {/* Booking Section */}
        <div
          className="pb-5 sm:pb-2 bg-cover bg-center"
          style={{ backgroundImage: `url(${BookingFlightSectionBg})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="my-8 text-start">
              <h4 className="secondary-font text-2xl sm:text-3xl lg:text-4xl font-bold">
                Start Booking Your Flight Now
              </h4>
            </div>
            <BookingForm />
          </div>
        </div>
      </div>
    </>
  );
}
