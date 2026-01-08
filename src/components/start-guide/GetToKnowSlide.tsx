import Image from "next/image";

export default function GetToKnowSlide() {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between bg-white overflow-hidden">
      {/* Background ellipses */}
      <div className="absolute top-[300px] left-1/2 -translate-x-1/2 w-[974px] h-[748px]">
        {/* Main light blue ellipse with inset shadow */}
        <div
          className="w-full h-full rounded-full bg-[#C9E0FF]"
          style={{
            boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        />
      </div>

      {/* Content container with flex layout */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-10">
        {/* "Get to know" title with gradient */}
        <div className="mb-12 w-full max-w-[307px]">
          <h1 className="text-[40px] font-semibold text-center leading-tight tracking-[-0.0125em]">
            <span className="bg-gradient-to-b from-[#0C3057] to-[#31649A] bg-clip-text text-transparent">
              Get to know
            </span>
          </h1>
        </div>

        {/* Illustration image */}
        <div className="relative w-[233.21px] h-[154.54px] mb-12">
          <Image
            src="/group1.svg"
            alt="Guide illustration showing skill exchange concept"
            fill
            priority
            className="object-contain"
            style={{
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            }}
          />
        </div>

        {/* Description text */}
        <div className="w-full max-w-[341px]">
          <p className="text-[20px] font-semibold text-[#1D324E] text-center leading-[1.75] tracking-[-0.025em]">
            This short guide shows you how to start, connect, and exchange
            skills step by step.
          </p>
        </div>
      </div>
    </div>
  );
}
