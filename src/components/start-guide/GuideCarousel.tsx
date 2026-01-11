"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import GetToKnowSlide from "./GetToKnowSlide";
import CreateProfileSlide from "../CreateProfileSlide";
import ConnectWithSkilledPeopleSlide from "./ConnectWithSkilledPeopleSlide";
import SwipeToMatchSlide from "./SwipeToMatchSlide";
import ChatPlanScheduleSlide from "./ChatPlanScheduleSlide";
import SafeSecureSlide from "./SafeSecureSlide";
import SkipButton from "./SkipButton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface GuideCarouselProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function GuideCarousel({
  onComplete,
  onSkip,
}: GuideCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSkip = () => {
    onSkip?.();
  };

  const handleNext = () => {
    if (swiperInstance) {
      if (activeIndex === 5) {
        // Last slide - complete the guide
        onComplete?.();
      } else {
        swiperInstance.slideNext();
      }
    }
  };

  // Combined navigation component with pagination and next button
  const NavigationControls = () => {
    // Don't show navigation on last slide (SafeSecureSlide has its own button)
    if (activeIndex === 5) {
      return null;
    }

    return (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-6">
        {/* Pagination indicators - only show for slides 1-4 */}
        {activeIndex > 0 && (
          <div className="flex items-center gap-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const isActive = index === activeIndex - 1;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (swiperInstance) {
                      swiperInstance.slideTo(index + 1);
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "bg-[#037EE6] w-10"
                      : "bg-[#037EE6] opacity-20 w-3"
                  } h-3`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        )}

        {/* Next button */}
        <div className="w-[139px] h-[50px] flex-shrink-0">
          <button
            onClick={handleNext}
            className="relative w-full h-full bg-transparent border-none p-0 hover:opacity-90 transition-opacity active:scale-95"
          >
            {/* Button background rectangle */}
            <div className="absolute top-[5px] left-0 w-full h-[40px] bg-white rounded-[12px] border-[#6F6F6F] border-[0.5px] shadow-lg" />

            {/* Button text - properly centered */}
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-[#1D324E] font-semibold text-[16px] leading-[3.125] tracking-[-0.03125em]">
                Next
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-svh bg-white relative overflow-hidden">
      <SkipButton onClick={handleSkip} isWhite={activeIndex > 0} />

      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        speed={300}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full"
        allowTouchMove={true}
        keyboard={{ enabled: true }}
      >
        <SwiperSlide>
          <GetToKnowSlide />
        </SwiperSlide>
        <SwiperSlide>
          <CreateProfileSlide />
        </SwiperSlide>
        <SwiperSlide>
          <ConnectWithSkilledPeopleSlide />
        </SwiperSlide>
        <SwiperSlide>
          <SwipeToMatchSlide />
        </SwiperSlide>
        <SwiperSlide>
          <ChatPlanScheduleSlide />
        </SwiperSlide>
        <SwiperSlide>
          <SafeSecureSlide onComplete={onComplete} />
        </SwiperSlide>
      </Swiper>

      <NavigationControls />
    </div>
  );
}
