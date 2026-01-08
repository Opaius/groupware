"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function LandingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Trade Skills,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Grow Together
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Connect with people who have the skills you need and share your expertise in return.
              A community where everyone has something to teach and something to learn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/auth">
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500">
                Join thousands of learners and teachers already trading skills
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-4">
                {/* Placeholder for user avatars */}
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">
                  1,000+ active trades this month
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Illustration/Image */}
          <div className="relative">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              {/* Placeholder illustration - can be replaced with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                  <div className="relative w-full h-full">
                    {/* Simple SVG illustration */}
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="90" fill="#93c5fd" opacity="0.3" />
                      <circle cx="70" cy="70" r="25" fill="#3b82f6" />
                      <circle cx="130" cy="130" r="25" fill="#06b6d4" />
                      <path d="M70,70 L130,130" stroke="#1e40af" strokeWidth="4" />
                      <circle cx="100" cy="100" r="10" fill="#1e40af" />
                    </svg>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-8 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">Design</span>
                </div>
                <div className="absolute bottom-8 right-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-cyan-600 font-bold">Code</span>
                </div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">Teach</span>
                </div>
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">Learn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
            className="text-gray-100"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
            className="text-gray-100"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
            className="text-gray-50"
          />
        </svg>
      </div>
    </div>
  );
}
```

Now I need to provide the content in the response. I'll output it as requested.<｜end▁of▁thinking｜>
