"use client";

import Image from "next/image";

export default function ConnectWithSkilledPeopleSlide() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Background blue shape - left side */}
      <div className="absolute  w-full h-[500px] overflow-hidden">
        <Image
          src="/slide3-blob.svg"
          alt="Blue background shape"
          fill
          className="object-cover"
        />
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

          <div className="max-w-[295px]">
            <p className="text-[16px] font-normal text-white leading-normal">
              Connect, communicate, and grow through shared knowledge.
            </p>
          </div>
        </div>

        {/* Center icon section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[266px] h-[266px]">
            <Image
              src="/people-sync.svg"
              alt="People sync icon showing collaboration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Title and description section at bottom */}
        <div className="mt-auto pb-20">
          <div className="mb-4">
            <h3 className="text-[24px] font-semibold text-black text-center leading-normal">
              Connect with Skilled People
            </h3>
          </div>

          <div className="w-full max-w-[370px] mx-auto">
            <p className="text-[16px] font-light text-black text-center leading-normal">
              Share your goals and plan your first learning session. Build real
              connections with people who have the skills you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
