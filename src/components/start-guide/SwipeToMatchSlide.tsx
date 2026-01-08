"use client";

import Image from "next/image";

export default function SwipeToMatchSlide() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Top blue shape background */}
      <div className="absolute top-0 w-full h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {/* Main shape */}
          <div className="absolute w-full h-full">
            <Image
              src="/slide3-blob.svg"
              alt="Blue shape background"
              fill
              className="object-cover -scale-x-100"
            />
          </div>
          {/* Subshape with opacity */}
          <div className="absolute left-[0.11px] top-0 w-[80.19px] h-[168.78px] opacity-20">
            <Image
              src="/slide4-subshape.svg"
              alt="White subshape"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-20">
        {/* SkillTrade logo and subtitle section - left aligned */}
        <div className="flex flex-col items-start mb-8">
          <div className="mb-2">
            <h2 className="text-[28px] font-bold text-white leading-normal">
              SkillTrade
            </h2>
          </div>

          <div className="w-[233px] h-px bg-white mb-4" />

          <div className="max-w-[370px]">
            <p className="text-[16px] font-normal text-white leading-normal">
              Swipe, match, and start learning together.
            </p>
          </div>
        </div>

        {/* Icons section with relative positioning */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Sparkles icon 2 (top left) */}
          <div className="absolute top-[60px] left-[17px] w-[116px] h-[116px]">
            <Image
              src="/sparkles2.svg"
              alt="Sparkles decoration"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Swipe-down icon (main center icon) */}
          <div className="relative w-[180px] h-[180px] z-10">
            <Image
              src="/swipe-down.svg"
              alt="Swipe down icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Vector icon (top right) */}
          <div className="absolute top-[40px] right-[17px] w-[104.37px] h-[84.15px]">
            <Image
              src="/slide4-vector.svg"
              alt="Decorative vector"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Sparkles icon 1 (bottom right) */}
          <div className="absolute bottom-[60px] right-[17px] w-[115px] h-[115px]">
            <Image
              src="/sparkles1.svg"
              alt="Sparkles decoration"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>
        </div>

        {/* Title and description section at bottom */}
        <div className="mt-auto pb-20">
          <div className="mb-4 flex justify-center">
            <h3 className="text-[24px] font-semibold text-black text-center leading-normal">
              Swipe to Match
            </h3>
          </div>

          <div className="w-full max-w-[376px] mx-auto">
            <p className="text-[16px] font-light text-black text-center leading-normal">
              Discover people suggested by the app&apos;s AI matching system.
              <br />
              Swipe to browse profiles and learn more about each user.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
