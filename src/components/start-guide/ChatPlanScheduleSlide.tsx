"use client";

import Image from "next/image";

export default function ChatPlanScheduleSlide() {
  return (
    <div className="relative w-full h-full bg-white">
      {/* Main shape - exact from Figma */}
      <div
        className="absolute"
        style={{
          left: "-0.21px",
          top: "0px",
          width: "391.18px",
          height: "362.78px",
          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        }}
      >
        <Image
          src="/slide5-shape.svg"
          alt="Blue shape background"
          fill
          className="object-contain"
        />
      </div>

      {/* SkillTrade logo text - right aligned, white */}
      <div className="absolute top-[167px] right-[20px]">
        <span className="text-[28px] font-bold text-white text-right leading-normal">
          SkillTrade
        </span>
      </div>

      {/* Divider line - white, positioned right */}
      <div
        className="absolute top-[210px] right-[20px] w-[233px] h-px bg-white"
        style={{ transform: "translateX(0)" }}
      />

      {/* Subtitle - right aligned, white */}
      <div className="absolute top-[217px] right-[20px] w-[273px]">
        <p className="text-[16px] font-normal text-white text-right leading-normal">
          Communicate, plan, and stay organized — all in one place.
        </p>
      </div>

      {/* Chat icon - center-left */}
      <div
        className="absolute top-[352px] left-[79px] w-[194px] h-[194px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/chat-icon.svg"
          alt="Chat icon"
          fill
          className="object-contain"
        />
      </div>

      {/* Calendar icon - bottom right of chat area */}
      <div
        className="absolute top-[526px] left-[199px] w-[75.83px] h-[64.46px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/calendar-icon.svg"
          alt="Calendar icon"
          fill
          className="object-contain"
        />
      </div>

      {/* Chat & Plan Schedule title - left aligned */}
      <div className="absolute top-[641px] left-[64px] w-[263px]">
        <h2 className="text-[24px] font-semibold text-black text-left leading-normal">
          Chat & Plan Schedule
        </h2>
      </div>

      {/* Description - centered but positioned left */}
      <div className="absolute top-[694px] left-[19px] w-[358px]">
        <p className="text-[16px] font-light text-black text-center leading-normal">
          Chat directly with your learning partner.
          <br />
          Use the built-in calendar to set the meeting date and time.
        </p>
      </div>
    </div>
  );
}
