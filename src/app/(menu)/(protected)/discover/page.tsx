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
import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";

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
  const [age] = useState(21); // User's age

  const user = authClient.useSession().data?.user;

  const skills: SkillTag[] = [
    { id: 1, name: "Dance", color: "bg-cyan-800/60" },
    { id: 2, name: "Dance Flows", color: "bg-cyan-800/60" },
  ];

  const interests: InterestTag[] = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Branding" },
  ];

  const handleLike = () => {};

  const handleDislike = () => {};

  const handleMessage = () => {};
  if (!user) return null;
  return (
    <div className="relative  flex flex-col">
      {/* Profile Card */}
      <div className="px-4 mt-2">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden ">
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
          <div className="flex flex-col  px-6 pt-10 pb-3 gap-3">
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
            <div className="flex justify-center items-center space-x-8 ">
              <Button
                onClick={handleDislike}
                className="rounded-full size-16 hover:text-red-800 hover:bg-red-200"
                aria-label="Dislike"
                variant="outline"
              >
                <X className="size-8" />
              </Button>

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
          </div>
        </div>
      </div>
    </div>
  );
}
