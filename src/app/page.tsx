"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // Import the hook
import Image from "next/image";
import { useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // useGSAP handles the layout effect and cleanup automatically
  useGSAP(
    () => {
      const tl = gsap.timeline();

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
        // Merged the expansion + border radius for smoother feel
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
    },
    { scope: containerRef },
  ); // Scope makes selectors safe (optional but recommended)

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-screen overflow-hidden"
    >
      <div
        className="size-20 rounded-[1000px] absolute left-1/2 top-1/2 -translate-y-1/2  drop-shadow-sm opacity-0 -translate-x-1/2 bg-accent-light"
        ref={circleRef}
      ></div>

      {/* Added z-10 so the logo stays on top of the expanding circle */}
      <div className="relative w-40 h-40 z-10" ref={logoRef}>
        <Image src="/LOGO.svg" alt="Logo" fill />
      </div>
      <div
        ref={textRef}
        className="absolute bottom-0 h-[40vh] w-full p-6 flex flex-col items-center justify-around"
      >
        <span className="text-2xl">Grow by giving</span>
        <Link
          href="/auth"
          className={cn(buttonVariants(), "w-full text-lg h-12")}
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
