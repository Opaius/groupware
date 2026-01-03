"use client";

interface SkipButtonProps {
  onClick: () => void;
  isWhite?: boolean;
}

export default function SkipButton({
  onClick,
  isWhite = false,
}: SkipButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-[60px] right-[42px] z-50 font-bold text-[20px] leading-none tracking-[-0.025em] hover:opacity-80 transition-opacity ${
        isWhite ? "text-white" : "text-[#6F6F6F]"
      }`}
      style={{
        textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      Skip
    </button>
  );
}
