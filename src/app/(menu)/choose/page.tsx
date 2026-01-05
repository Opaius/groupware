"use client"
import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Importă fontul



// --- CONFIGURARE DATE ---
// Aici poți schimba textul și calea către imaginile PNG
const techSkills = [
  { title: "Web Development", img: "iconita.png" },
  { title: "Software Testing", img: "iconita.png" },
  { title: "Cloud Computing", img: "iconita.png" },
  { title: "Mobile App Dev", img: "iconita.png" },
  { title: "Database", img: "iconita.png" },
  { title: "UI/UX Design", img: "iconita.png" },
];

const creativeSkills = [
  { title: "Photography", img: "photography.png" },
  { title: "Painting", img: "painting.png" },
  { title: "Graphic Design", img: "iconita.png" },
  { title: "Fashion Design", img: "fashion.png" },
  { title: "Cooking & Baking", img: "cooking.png" },
  { title: "Music Production", img: "music.png" },
];

// --- INTERFEȚE ---
interface SkillCardProps {
  title: string;
  imageSrc: string; // Acum acceptăm calea către imagine (string)
}

// --- COMPONENTA CARD ---
const SkillCard = ({ title, imageSrc }: SkillCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 bg-blue-200/50 rounded-sm relative overflow-hidden flex items-center justify-center shrink-0">
        
        {/* Background Shape (Forma roșie din spate - rămâne SVG pentru consistență) */}
        <div className="absolute top-[20px] opacity-100">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 47.998C37.255 47.998 48 37.253 48 23.998C48 10.746 37.255 0 24 0C10.745 0 0 10.745 0 23.999C0 37.253 10.745 47.998 24 47.998Z" fill="#E04F5F"/>
          </svg>
        </div>
        
        {/* IMAGINEA PNG - Aici se încarcă iconița ta */}
        <div className="relative z-10 mt-0">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-10 h-10 object-contain" // Poți ajusta dimensiunea iconiței de aici (w-8 h-8 = 32px)
            onError={(e) => {
              // Fallback în caz că nu găsește imaginea (apare un pătrat gri)
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-8 bg-gray-400 rounded"></div>'; 
            }}
          />
        </div>

      </div>
      <div className="text-center text-blue-950 text-xs font-normal font-sans w-24 leading-tight">
        {title}
      </div>
    </div>
  );
};

// --- PAGINA PRINCIPALĂ ---
export default function ChoosePage() {
  return (
    <div className="w-full max-w-md mx-auto h-[844px] bg-white relative overflow-hidden shadow-2xl flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-10 pb-4">
        <button className="p-2">
          <svg width="23" height="20" viewBox="0 0 23 20" fill="none" stroke="#1D324E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 10L10 1M1 10L10 19M1 10H22" />
          </svg>
        </button>

        {/* LOGO */}
        <img src="/logo.png" alt="App Logo" className="h-10 object-contain" />

        <button className="p-2 flex flex-col gap-1.5 items-end">
          <div className="w-[19px] h-[2px] bg-[#333] rounded-full"></div>
          <div className="w-[28px] h-[2px] bg-[#333] rounded-full"></div>
          <div className="w-[23px] h-[2px] bg-[#333] rounded-full"></div>
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="px-6 mt-4">
        <div className="w-full bg-blue-200/20 rounded-sm p-6 relative">
          
          {/* Progress Bar */}
          <div className="relative w-full mb-6 px-1">
             <div className="absolute top-1/2 left-0 w-full h-px bg-blue-800/20 -translate-y-1/2 z-0"></div>
             <div className="flex justify-between items-center w-full relative z-10">
                <div className="w-5 h-5 bg-white rounded-full border border-[#2965B5] flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-[#40C9E7] rounded-full"></div>
                </div>
                <div className="w-2.5 h-2.5 bg-[#2965B5] rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-[#2965B5] rounded-full"></div>
             </div>
          </div>

          <h2 className="text-blue-950 text-xl font-bold font-sans mb-2">Shape Your Growth Path</h2>
          <p className="text-slate-800 text-sm font-normal font-sans mb-2">
            Choose the skills you’d like to explore and start learning what matters most to you.
          </p>
          <p className="text-blue-950 text-sm font-medium font-sans mb-4">
            We’ll tailor your experience just for you!
          </p>
          
          <button className="w-full py-3 bg-blue-200/50 hover:bg-blue-300/50 rounded-sm text-blue-950 text-xl font-semibold font-sans transition-colors">
            Continue
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10 custom-scrollbar">
        
        {/* TECH SECTION */}
        <h3 className="text-blue-950 text-sm font-normal font-sans mb-4">Tech & Digital Skills</h3>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 mb-8">
          {techSkills.map((skill, index) => (
            <SkillCard key={index} title={skill.title} imageSrc={skill.img} />
          ))}
        </div>

        {/* CREATIVE SECTION */}
        <h3 className="text-blue-950 text-sm font-normal font-sans mb-4">Creative & Practical Skills</h3>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
           {creativeSkills.map((skill, index) => (
            <SkillCard key={index} title={skill.title} imageSrc={skill.img} />
          ))}
        </div>
      </div>
    </div>
  );
}