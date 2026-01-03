"use client";

import Image from "next/image";

export default function CreateProfileSlide() {
  return (
    <div className="relative w-full h-full bg-white">
      {/* SVG blob shape - use the exact SVG from Figma */}
      <div
        className="absolute"
        style={{
          right: "0",
          top: "0px",
          width: "100%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 390 371"
          fill="none"
          preserveAspectRatio="none"
        >
          <g filter="url(#filter0_d_585_115)">
            <path
              d="M391.911 30.8751C391.911 21.8747 391.911 11.3931 391.911 0C381.888 0 365.897 0.0062529 357.351 1.02134e-05H0.794434V190.22C79.0675 243.128 239.61 354.866 323.826 362.197C352.029 364.64 374.413 359.111 391.973 350.104L391.911 30.8751Z"
              fill="#6085B9"
            />
            <path
              d="M391.661 0.25V30.875L391.722 349.949C374.225 358.894 351.931 364.38 323.847 361.947C302.834 360.118 277.039 351.774 248.931 339.444C220.827 327.117 190.427 310.813 160.208 293.084C99.8268 257.658 40.1856 216.546 1.04443 190.087V0.25H391.661Z"
              stroke="#6F6F6F"
              strokeWidth="0.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_585_115"
              x="-3.20557"
              y="0"
              width="399.179"
              height="370.776"
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
                result="effect1_dropShadow_585_115"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_585_115"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* SkillTrade logo text */}
      <div className="absolute top-[167px] right-[19px]">
        <span className="text-[28px] font-bold text-white text-right leading-normal">
          SkillTrade
        </span>
      </div>

      {/* Subtitle */}
      <div className="absolute top-[217px] right-[17px] w-[273px]">
        <p className="text-[16px] font-normal text-white text-right leading-normal">
          A verified profile builds trust and credibility.
        </p>
      </div>

      {/* Divider line */}
      <div className="absolute top-[210px] left-1/2 -translate-x-1/2 w-[233px] h-px bg-white" />

      {/* Icons */}
      <div
        className="absolute top-[347px] left-1/2 -translate-x-1/2 w-[124px] h-[124px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/social-skillshare.svg"
          alt="Social skill share icon"
          fill
          className="object-contain"
        />
      </div>

      <div
        className="absolute top-[456px] right-[33px] w-[84px] h-[84px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/skillshare.svg"
          alt="Skill share icon"
          fill
          className="object-contain"
        />
      </div>

      <div
        className="absolute top-[405px] left-[54px] w-[203px] h-[203px]"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
      >
        <Image
          src="/profile-search.svg"
          alt="Profile search icon"
          fill
          className="object-contain"
        />
      </div>

      {/* Create Your Profile title */}
      <div className="absolute top-[638px] left-1/2 -translate-x-1/2 w-[233px]">
        <h2 className="text-[24px] font-semibold text-black text-center leading-normal">
          Create Your Profile
        </h2>
      </div>

      {/* Description */}
      <div className="absolute top-[693px] left-1/2 -translate-x-1/2 w-[360px]">
        <p className="text-[16px] font-light text-black text-center leading-normal">
          Sign up with your email, add your photo and short bio. Upload
          certificates or diplomas that prove your skills.
        </p>
      </div>
    </div>
  );
}
