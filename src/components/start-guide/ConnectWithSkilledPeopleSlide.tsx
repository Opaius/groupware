"use client";

import Image from "next/image";

export default function ConnectWithSkilledPeopleSlide() {
  return (
    <div className="relative w-full h-full bg-white">
      {/* SVG blob shape - exact from Figma */}
      <div className="absolute top-[-15px] -left-px w-full ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 300 390"
          fill="none"
          preserveAspectRatio="none"
        >
          <g filter="url(#filter0_d_546_66)">
            <path
              d="M402.75 0.25V174.716C383.518 185.019 358.706 202.492 330.977 223.04C303.174 243.642 272.445 267.331 241.424 290.019C210.407 312.703 179.12 334.372 150.227 350.919C121.778 367.211 95.6784 378.521 74.458 380.964L73.4512 381.073C44.8175 383.944 22.0886 377.406 4.25 366.664V0.25H402.75Z"
              fill="#6085B9"
              stroke="#6F6F6F"
              strokeWidth="0.5"
            />
            <path
              opacity="0.2"
              d="M402.75 0.25V174.616C386.202 183.543 365.306 197.864 342.031 214.868C297.697 207.599 256.986 182.027 227.16 142.697C197.358 103.399 180.364 52.9219 179.205 0.25H402.75Z"
              fill="white"
              stroke="#6F6F6F"
              strokeWidth="0.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_546_66"
              x="0"
              y="0"
              width="407"
              height="390"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_546_66"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_546_66"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* SkillTrade logo text */}
      <div className="absolute top-[167px] left-[20px]">
        <span className="text-[28px] font-bold text-white leading-normal">
          SkillTrade
        </span>
      </div>

      {/* Subtitle */}
      <div className="absolute top-[217px] left-[20px] w-[295px]">
        <p className="text-[16px] font-normal text-white leading-normal">
          Connect, communicate, and grow through shared knowledge.
        </p>
      </div>

      {/* Divider line */}
      <div className="absolute top-[210px] left-[20px] w-[233px] h-px bg-white" />

      {/* People sync icon */}
      <div className="absolute top-[348px] left-1/2 -translate-x-1/2 w-[266px] h-[266px]">
        <Image
          src="/people-sync.svg"
          alt="People sync icon showing collaboration"
          fill
          className="object-contain"
        />
      </div>

      {/* Connect with Skilled People title */}
      <div className="absolute top-[638px] left-1/2 -translate-x-1/2 w-[336px]">
        <h2 className="text-[24px] font-semibold text-black text-left leading-normal">
          Connect with Skilled People
        </h2>
      </div>

      {/* Description */}
      <div className="absolute top-[687px] left-1/2 -translate-x-1/2 w-[370px]">
        <p className="text-[16px] font-light text-black text-center leading-normal">
          Share your goals and plan your first learning session. Build real
          connections with people who have the skills you need.
        </p>
      </div>
    </div>
  );
}
