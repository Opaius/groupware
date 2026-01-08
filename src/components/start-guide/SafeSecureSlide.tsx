"use client";

import Image from "next/image";

interface SafeSecureSlideProps {
  onComplete?: () => void;
}

export default function SafeSecureSlide({ onComplete }: SafeSecureSlideProps) {
  return (
    <div className="relative w-full  flex flex-col bg-white overflow-hidden">
      {/* Background blue shape - top left */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {/* Main shape */}
          <div className="absolute inset-0">
            <Image
              src="/slide3-blob.svg"
              alt="Blue background shape"
              fill
              className="object-cover -scale-x-100"
            />
          </div>
          {/* Subshape with opacity */}
        </div>
      </div>

      {/* Main content container */}
      <div className="relative  z-10 flex-1 flex flex-col px-6 top-20">
        {/* SkillTrade logo and subtitle section - left aligned */}
        <div className="relative flex flex-col items-start ">
          <div className="mb-2">
            <h2 className="text-[28px] font-bold text-white leading-normal">
              SkillTrade
            </h2>
          </div>

          <div className="w-[233px] h-px bg-white mb-4" />

          <div className="max-w-[255px]">
            <p className="text-[16px] font-normal text-white leading-normal">
              Safety first — your experience matters.
            </p>
          </div>
        </div>

        {/* Icons section with relative positioning */}
        <div className="relative flex-1 flex items-center justify-center mt-auto ">
          {/* Large people-safe icon */}
          <div className="relative w-[243px] h-[243px]">
            <Image
              src="/people-safe.svg"
              alt="People safe icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Smaller safe icon positioned relative to people-safe */}
          <div className="absolute left-[70px] top-[calc(50%+40px)] w-[89px] h-[89px]">
            <Image
              src="/safe-icon.svg"
              alt="Safe icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>
        </div>

        {/* Title and description section */}
        <div className="mt-auto ">
          <div className="mb-3 flex justify-center">
            <h3 className="text-[24px] font-semibold text-black text-center leading-normal">
              Safe & Secure
            </h3>
          </div>

          <div className="w-full max-w-[382px] mx-auto mb-8">
            <p className="text-[16px] font-light text-black text-center leading-normal">
              Users can rate and review each other after every session.
              <br />
              Chats and personal data stay private and protected.
            </p>
          </div>

          {/* Get Started button */}
          <div className="flex justify-center pb-20">
            <div className="w-[181px] h-[41px] relative">
              <button
                className="relative w-full h-full bg-[#E1E2F0] rounded-[12px] border border-black/10 hover:opacity-90 transition-opacity active:scale-95"
                onClick={onComplete}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-bold text-[16px] leading-[1.25] tracking-[-0.03125em]">
                    Get Started
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
