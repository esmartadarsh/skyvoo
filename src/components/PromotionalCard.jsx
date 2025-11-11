import React from 'react';
import StickerStack from './StickerStack';
import Plane from '@/assets/imgs/plane.webp';

function PromotionalCard() {
  return (
    <div className="relative overflow-visible grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 pt-10 md:pt-20 items-center">

      {/* Plane Image */}
      <div className="order-1 md:order-2 md:col-span-9 flex justify-center">
        <img
          id="plane-animation"
          src={Plane}
          alt="Plane"
          className=" plane w-[80%] sm:w-[90%] md:w-full h-auto absolute"
        />

      </div>

      {/* StickerStack — hidden on mobile, visible on md+ */}
      <div className="hidden xl:flex order-2 md:order-1 md:col-span-3 cursor-pointer mb-8 md:mb-[100px] relative md:-left-[50px] justify-start">
        <div className="relative">
          <StickerStack />
        </div>
      </div>

    </div>
  );
}

export default PromotionalCard;
