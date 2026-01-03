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
import SkipButton from "./SkipButton";
import NextButton from "./NextButton";

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
      if (activeIndex === 4) {
        // Last slide - complete the guide
        onComplete?.();
      } else {
        swiperInstance.slideNext();
      }
    }
  };

  // Custom pagination component
  const CustomPagination = () => {
    if (activeIndex === 0) {
      return null; // No pagination on first slide
    }

    // Show 4 indicators for slides 2-5 (slide 1 has no pagination)
    const totalIndicators = 4;

    return (
      <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-4">
        {Array.from({ length: totalIndicators }).map((_, index) => {
          // Map slide index to indicator index (slide 0 has no pagination, slide 1 -> indicator 0, etc.)
          const isActive = index === activeIndex - 1;

          return (
            <button
              key={index}
              onClick={() => {
                if (swiperInstance) {
                  // Map indicator index to slide index
                  // Index 0 -> slide 0, index 1 -> slide 1, index 2 -> slide 2, index 3 -> slide 3, index 4 -> slide 4
                  swiperInstance.slideTo(index);
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                isActive ? "bg-[#037EE6] w-10" : "bg-[#037EE6] opacity-20 w-3"
              } h-3`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full bg-white relative overflow-hidden">
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
      </Swiper>

      <CustomPagination />
      {activeIndex === 0 && (
        <NextButton onClick={handleNext} isLastSlide={false} />
      )}
    </div>
  );
}
