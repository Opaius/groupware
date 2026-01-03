import Image from "next/image";

export default function GetToKnowSlide() {
  return (
    <div className="relative w-full h-full">
      {/* Large light blue ellipse background */}
      <div
        className="absolute w-[974px] h-[748px] rounded-[100%] bg-[#C9E0FF] left-1/2 -translate-x-1/2"
        style={{
          top: "221px",
          boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
      />

      {/* "Get to know" title */}
      <div className="absolute top-[118px] left-1/2 -translate-x-1/2 w-[307px]">
        <h1 className="text-[40px] font-semibold text-[#989898] text-center leading-tight tracking-[-0.0125em]">
          Get to know
        </h1>
      </div>

      {/* Illustration image */}
      <div className="absolute top-[317.99px] left-1/2 -translate-x-1/2 w-[233.21px] h-[154.54px]">
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
      <div className="absolute top-[487px] left-1/2 -translate-x-1/2 w-[341px]">
        <p className="text-[20px] font-semibold text-[#1D324E] text-center leading-[1.75] tracking-[-0.025em]">
          This short guide shows you how to start, connect, and exchange
          skills step by step.
        </p>
      </div>
    </div>
  );
}
