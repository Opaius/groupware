"use client";

import Image from "next/image";

export default function SwipeToMatchSlide() {
  return (
    <div className="relative w-full h-full bg-white">
      {/* Shape group with main shape and subshape */}
      <div
        className="absolute"
        style={{
          top: "0px",
          width: "100%",
          height: "209px",
          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        }}
      >
        {/* Main shape */}
        <div className="absolute w-full h-full">
          <Image
            src="/slide4-shape.svg"
            alt="Blue shape background"
            fill
            className="object-fill"
          />
        </div>

        {/* Subshape with opacity */}
        <div
          className="absolute"
          style={{
            left: "0.11px",
            top: "0px",
            width: "80.19px",
            height: "168.78px",
            opacity: 0.2,
          }}
        >
          <Image
            src="/slide4-subshape.svg"
            alt="White subshape"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* SkillTrade logo text */}
      <div className="absolute top-[167px] left-[20px]">
        <span className="text-[28px] font-bold text-[#037EE6] leading-normal">
          SkillTrade
        </span>
      </div>

      {/* Divider line */}
      <div className="absolute top-[210px] left-[20px] w-[233px] h-px bg-[#404040]" />

      {/* Subtitle */}
      <div className="absolute top-[217px] left-[20px] w-[370px]">
        <p className="text-[16px] font-normal text-[#404040] leading-normal">
          Swipe, match, and start learning together.
        </p>
      </div>

      {/* Sparkles icon 2 (top left) */}
      <div
        className="absolute top-[299px] left-[37px] w-[116px] h-[116px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/sparkles2.svg"
          alt="Sparkles decoration"
          fill
          className="object-contain"
        />
      </div>

      {/* Swipe-down icon (main center icon) */}
      <div
        className="absolute top-[391px] left-[79px] w-[180px] h-[180px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/swipe-down.svg"
          alt="Swipe down icon"
          fill
          className="object-contain"
        />
      </div>

      {/* Vector icon (top right) */}
      <div
        className="absolute top-[356px] left-[221px] w-[104.37px] h-[84.15px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/slide4-vector.svg"
          alt="Decorative vector"
          fill
          className="object-contain"
        />
      </div>

      {/* Sparkles icon 1 (bottom right) */}
      <div
        className="absolute top-[513px] left-[222px] w-[115px] h-[115px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/sparkles1.svg"
          alt="Sparkles decoration"
          fill
          className="object-contain"
        />
      </div>

      {/* Swipe to Match title and description group */}
      <div className="absolute top-[639px] left-[7px] w-[376px]">
        {/* Title */}
        <div className="w-full flex justify-center mb-[16px]">
          <h2 className="text-[24px] font-semibold text-black text-center leading-normal">
            Swipe to Match
          </h2>
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="text-[16px] font-light text-black text-center leading-normal">
            Discover people suggested by the app's AI matching system.
            <br />
            Swipe to browse profiles and learn more about each user.
          </p>
        </div>
      </div>
    </div>
  );
}
