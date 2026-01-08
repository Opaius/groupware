"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedLandingProps {
  onAnimationComplete?: () => void;
  showContinueButton?: boolean;
  continueLink?: string;
  continueText?: string;
  logoSize?: number;
}

export default function AnimatedLanding({
  onAnimationComplete,
  showContinueButton = true,
  continueLink = "/auth",
  continueText = "Continue",
  logoSize = 160,
}: AnimatedLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !circleRef.current || !textRef.current) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      },
    });

    const textChildren = textRef.current?.children;

    tl.fromTo(
      logoRef.current,
      { y: "100%", opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.inOut" },
    )
      .to(circleRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power3.inOut",
      })
      .to(circleRef.current, {
        width: "100vh",
        height: "100vh",
        borderRadius: "0px",
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(circleRef.current, {
        borderRadius: "100%",
        width: "150vh",
        height: "40vw",
        y: "-40%",
        duration: 2,
        ease: "power3.inOut",
      })
      .to(
        logoRef.current,
        {
          y: "-40%",
          duration: 2,
          ease: "power3.inOut",
        },
        "<",
      )
      .fromTo(
        textChildren!,
        {
          opacity: 0,
          y: "-100%",
        },
        {
          opacity: 1,
          duration: 2,
          ease: "power3.inOut",
          y: 0,
          stagger: 0.2,
          delay: 1,
        },
        "<",
      );

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-svh overflow-hidden relative"
    >
      <div
        className="size-20 rounded-[1000px] absolute left-1/2 top-1/2 -translate-y-1/2 drop-shadow-sm opacity-0 -translate-x-1/2 bg-accent-light"
        ref={circleRef}
        style={{
          width: `${logoSize / 4}px`,
          height: `${logoSize / 4}px`,
        }}
      ></div>

      <div
        className="relative z-10"
        ref={logoRef}
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
        }}
      >
        <Image src="/LOGO.svg" alt="Skill Trade Logo" fill className="object-contain" />
      </div>

      {showContinueButton && (
        <div
          ref={textRef}
          className="absolute bottom-0 h-[40vh] w-full p-6 flex flex-col items-center justify-around z-20"
        >
          <span className="text-2xl font-medium text-gray-800">Grow by giving</span>
          <Link
            href={continueLink}
            className={cn(buttonVariants(), "w-full text-lg h-12 animate-pulse")}
          >
            {continueText}
          </Link>
        </div>
      )}
    </div>
  );
}
