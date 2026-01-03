"use client";

interface NextButtonProps {
  onClick: () => void;
  isLastSlide?: boolean;
}

export default function NextButton({
  onClick,
  isLastSlide = false,
}: NextButtonProps) {
  return (
    <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-[139px] h-[50px] z-40">
      <button
        onClick={onClick}
        className="relative w-full h-full bg-transparent border-none p-0 hover:opacity-90 transition-opacity active:scale-95"
      >
        {/* Button background rectangle */}
        <div className="absolute top-[5px] left-0 w-full h-[40px] bg-white rounded-[12px] border-[#6F6F6F] border-[0.5px] shadow-lg" />

        {/* Button text - properly centered */}
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-[#1D324E] font-semibold text-[16px] leading-[3.125] tracking-[-0.03125em]">
            {isLastSlide ? "Get Started" : "Next"}
          </span>
        </div>
      </button>
    </div>
  );
}
