"use client";

import React, { useState } from "react";
import { LucideStar, LucideChevronLeft, LucideChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Datele extrase din design-ul tău
const REVIEWS = [
  {
    id: 1,
    name: "Olivia Carter",
    date: "2025-06-21",
    rating: 5,
    skill: "Graphic design",
    comment:
      "Sophia was amazing to work with! She explained everything clearly and made learning so enjoyable. In return, she gave me great design advice that improved my portfolio. Highly recommend trading skills with her!",
    avatar: "",
  },
  {
    id: 2,
    name: "Isabella Chen",
    date: "2025-06-10",
    rating: 5,
    skill: "Art",
    comment:
      "One of the best partners I’ve met on the platform! She’s enthusiastic, creative, and communicates perfectly. The exchange felt balanced, and I learned a lot from her artistic perspective.",
    avatar: "",
  },
  {
    id: 3,
    name: "Ethan Walker",
    date: "2025-08-16",
    rating: 4,
    skill: "Web development for UX",
    comment:
      "Working with Sophia was a great experience! She helped me redesign my project’s user interface, making it more intuitive and visually consistent.",
    avatar: "",
  },
];

export default function ReviewPage() {
  const [sortBy, setSortBy] = useState("Most Recent");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header cu buton de back (folosind culorile tale din global) */}
      <header className="flex items-center px-4 py-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-secondary hover:bg-muted"
        >
          <LucideChevronLeft className="w-6 h-6" strokeWidth={3} />
        </Button>
        <h1 className="flex-1 text-center font-poppins font-semibold text-[17px] text-secondary mr-10">
          Reviews
        </h1>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Sumar Rating - Sectiunea de sus */}
        <div className="px-6 py-4">
          <div className="flex gap-8 items-center border border-muted p-5 rounded-[15px]">
            <div className="flex flex-col items-center">
              <span className="text-[36px] font-black text-[#121417] leading-none">
                4.5
              </span>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <LucideStar
                    key={i}
                    className="w-4 h-4 fill-[#FDD264] text-[#FDD264]"
                  />
                ))}
                <LucideStar className="w-4 h-4 fill-[#989898] text-[#989898]" />
              </div>
              <span className="text-sm text-[#121417] mt-2">5 reviews</span>
            </div>

            <div className="flex-1 space-y-2.5">
              {[
                { star: "5", val: 90 },
                { star: "4", val: 10 },
                { star: "3", val: 0 },
                { star: "2", val: 0 },
                { star: "1", val: 0 },
              ].map((item) => (
                <div key={item.star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-secondary w-2">
                    {item.star}
                  </span>
                  <Progress
                    value={item.val}
                    className="h-2 bg-[#DEE0E3] [&>div]:bg-secondary"
                  />
                  <span className="text-sm text-[#6B7582] w-8 text-right">
                    {item.val}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdown Filtrare */}
        <div className="flex justify-end px-6 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#F4F4FC] border-[#6F6F6F] rounded-[10px] text-sm h-8"
              >
                Sort by <LucideChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => setSortBy("Most Recent")}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Highest Rating")}>
                Highest Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Lista de Review-uri (Fundalul albastru deschis din design) */}
        <div className="flex-1 bg-[#F4F4FC] rounded-t-[20px] p-6 space-y-8 pb-10">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {/* Info Utilizator */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback className="bg-accent text-white font-bold">
                    {review.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h4 className="text-base font-semibold text-[#121417] leading-tight">
                    {review.name}
                  </h4>
                  <p className="text-sm text-black/60">{review.date}</p>
                </div>
              </div>

              {/* Stelele individuale */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <LucideStar
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "fill-[#FDD264] text-[#FDD264]" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>

              {/* Continut Review */}
              <div className="text-[16px] leading-relaxed">
                <span className="font-bold text-[#121417]">
                  Skill Exchanged:{" "}
                </span>
                <span className="text-[#121417]">{review.skill}</span>
                <p className="mt-3 text-[#121417] font-normal">
                  {review.comment}
                </p>
              </div>

              {/* Separator subtil ca in design-ul tau (optional intre ele) */}
              <div className="w-full h-[1px] bg-[#989898]/20 mt-2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
