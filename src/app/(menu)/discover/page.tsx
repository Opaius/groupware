"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  User,
  Bell,
  SlidersHorizontal,
  Home,
  UserPen,
  Handshake,
  FileUser,
  Sparkles,
} from "lucide-react";
import Dock from "@/components/Dock";
import { Button } from "@/components/ui/button";

type SkillTag = {
  id: number;
  name: string;
  color: string;
};

type InterestTag = {
  id: number;
  name: string;
};

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [age] = useState(21); // User's age

  const skills: SkillTag[] = [
    { id: 1, name: "Dance", color: "bg-cyan-800/60" },
    { id: 2, name: "Dance Flows", color: "bg-cyan-800/60" },
  ];

  const interests: InterestTag[] = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Branding" },
  ];

  const handleLike = () => {
    const shouldMatch = Math.random() > 0.7;
    if (shouldMatch) {
      setShowMatchModal(true);
    }
  };

  const handleDislike = () => {
    console.log("Disliked profile");
  };

  const handleMessage = () => {
    console.log("Open chat");
  };

  return (
    <div className="relative mx-auto my-12 flex flex-col">
      {/* Header */}
      <div className="px-4  pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">Hello, user!</h1>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-amber-400 text-base font-semibold">
                Level 1
              </span>
              <Sparkles className="ml-1 w-4 h-4 text-amber-400" />
            </div>
            <div className="text-blue-950 text-sm mt-1 font-semibold">
              0 matches
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 mt-2">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden pb-28">
          {/* Profile Header with Blurred Background */}
          <div className="h-32 bg-linear-to-b from-blue-900 via-blue-900/60 to-white relative"></div>

          {/* Profile Picture */}
          <div className="relative">
            <div className="absolute left-1/2 -top-20 transform -translate-x-1/2 z-10">
              <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                <User className="w-20 h-20 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="absolute right-8 top-64 bg-white rounded-full px-2 py-1 flex items-center shadow">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm font-medium">4.9</span>
          </div>

          {/* User Info */}
          <div className="px-6 pb-6 mt-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 text-center mb-4">
                User, {age}
              </h2>
              <p className="text-cyan-800 font-['Comic-Sans-M] text-semibold text-left mb-2">
                Iași, România
              </p>
            </div>

            <p className="text-slate-950 text-sm font-['Comic-Sans-M]  mb-6">
              I am passionate about dance and have developed strong rhythm,
              coordination, and body control through consistent practice.
              Dancing allows me to express creativity and confidence.
            </p>

            {/* Skills */}
            <div className="mb-4">
              <h3 className="text-slate-950 text-xl font-semibold mb-2">
                Skills:
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`${skill.color} text-white text-base font-medium px-3 py-1 rounded-lg`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Looking to Learn */}
            <div>
              <h3 className="text-slate-950 text-xl font-semibold mb-2">
                Looking to learn:
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest.id}
                    className="bg-blue-950 text-white text-base font-medium px-3 py-1 rounded-lg"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-8 -mt-24 pb-6">
        <Button
          onClick={handleDislike}
          className="rounded-full size-16 hover:text-red-800 hover:bg-red-200"
          aria-label="Dislike"
          variant="outline"
        >
          <X className="size-8" />
        </Button>

<<<<<<<< HEAD:src/app/(menu)/discover/page.tsx
        <Button
          onClick={handleMessage}
          className="rounded-full size-16 hover:text-blue-800 hover:bg-blue-200"
          aria-label="Message"
          variant="outline"
        >
          <FileUser className="size-8" />
        </Button>

        <Button
          onClick={handleLike}
          className="rounded-full size-16 hover:text-green-800 hover:bg-green-200"
          aria-label="Like"
          variant="outline"
        >
          <Handshake className="size-8" />
        </Button>
      </div>
========
      
>>>>>>>> 574d4433c75129b134c20bc1ab9050efc9c43b4b:apps/web/src/app/(menu)/discover/page.tsx

      {showMatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              It&apos;s a match!
            </h3>
            <p className="text-gray-600 mb-6">
              You and User have liked each other.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowMatchModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Keep Browsing
              </button>
              <button
                onClick={() => {
                  setShowMatchModal(false);
                  console.log("Open chat with match");
                }}
                className="px-6 py-2 bg-cyan-800 text-white rounded-lg font-medium hover:bg-cyan-900"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
