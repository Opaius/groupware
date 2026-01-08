"use client";

import Image from "next/image";

export default function ChatPlanScheduleSlide() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Background blue shape - right side */}
      <div className="absolute top-0 w-full h-[500px] overflow-hidden">
        <Image
          src="/slide3-blob.svg"
          alt="Blue background shape"
          fill
          className="object-cover"
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-20">
        {/* SkillTrade logo and subtitle section - right aligned */}
        <div className="flex flex-col items-end mb-8">
          <div className="mb-2">
            <h2 className="text-[28px] font-bold text-white text-right leading-normal">
              SkillTrade
            </h2>
          </div>

          <div className="w-[233px] h-px bg-white mb-4" />

          <div className="max-w-[273px]">
            <p className="text-[16px] font-normal text-white text-right leading-normal">
              Communicate, plan, and stay organized — all in one place.
            </p>
          </div>
        </div>

        {/* Icons section with relative positioning */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Chat icon - left center */}
          <div className="absolute  top-1/2 -translate-y-1/2 w-[194px] h-[194px]">
            <Image
              src="/chat-icon.svg"
              alt="Chat icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Calendar icon - bottom right of chat area */}
          <div className="absolute left-60  top-[calc(50%+87px)] w-[75.83px] h-[64.46px]">
            <Image
              src="/calendar-icon.svg"
              alt="Calendar icon"
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
          <div className="mb-4">
            <h3 className="text-[24px] font-semibold text-black text-center leading-normal">
              Chat & Plan Schedule
            </h3>
          </div>

          <div className="w-full max-w-[358px] mx-auto">
            <p className="text-[16px] font-light text-black text-center leading-normal">
              Chat directly with your learning partner.
              <br />
              Use the built-in calendar to set the meeting date and time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
