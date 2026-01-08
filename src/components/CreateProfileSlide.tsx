"use client";

import Image from "next/image";

export default function CreateProfileSlide() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col bg-white">
      {/* Background blue shape */}
      <div className="absolute right-0 top-0 w-full h-[500px] overflow-hidden -scale-x-100">
        <Image
          src="/slide3-blob.svg"
          alt="Blue background shape"
          fill
          className="object-cover"
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-20">
        {/* SkillTrade logo and subtitle section */}
        <div className="flex flex-col items-end mb-8">
          <div className="mb-2">
            <h2 className="text-[28px] font-bold text-white text-right leading-normal">
              SkillTrade
            </h2>
          </div>

          <div className="w-[233px] h-px bg-white mb-4" />

          <div className="max-w-[273px]">
            <p className="text-[16px] font-normal text-white text-right leading-normal">
              A verified profile builds trust and credibility.
            </p>
          </div>
        </div>

        {/* Icons section with flex layout */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          {/* Main center icon - social-skillshare */}
          <div className="absolute left-50 w-[124px] h-[124px] mb-8">
            <Image
              src="/social-skillshare.svg"
              alt="Social skill share icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Bottom right icon - skillshare */}
          <div className="absolute bottom-[50px] left-70 w-[84px] h-[84px]">
            <Image
              src="/skillshare.svg"
              alt="Skill share icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          {/* Left center icon - profile-search */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[203px] h-[203px]">
            <Image
              src="/profile-search.svg"
              alt="Profile search icon"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>
        </div>

        {/* Title and description section at bottom */}
        <div className="mt-auto pb-20 flex flex-col items-center">
          <div className="mb-4 w-full max-w-[233px]">
            <h3 className="text-[24px] font-semibold text-black text-left leading-normal">
              Create Your Profile
            </h3>
          </div>

          <div className="w-full max-w-[360px]">
            <p className="text-[16px] font-light text-black text-center leading-normal">
              Sign up with your email, add your photo and short bio. Upload
              certificates or diplomas that prove your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
