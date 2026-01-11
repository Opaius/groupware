"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Star,
  CheckCircle,
  Clock as ClockIcon,
  Calendar,
  User,
  ChevronLeft,
} from "lucide-react";
import { BackButton } from "@/components/back-button";

type SkillType = "learned" | "taught";
type SkillStatus = "scheduled" | "ongoing" | "completed";

interface SkillCardProps {
  title: string;
  partnerName: string;
  date: string;
  duration: number;
  rating: number;
  status: SkillStatus;
  type: "learned" | "taught";
  onStatusChange?: (status: SkillStatus) => void;
}

const SkillCard = ({
  title,
  partnerName,
  date,
  duration,
  rating,
  status,
  type,
  onStatusChange,
}: SkillCardProps) => {
  const statusColors = {
    scheduled: "bg-yellow-100 text-yellow-800",
    ongoing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const typeColors = {
    learned: "bg-purple-100 text-purple-800",
    taught: "bg-cyan-100 text-cyan-800",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">with {partnerName}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type]}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="h-4 w-4 mr-1" />
        <span className="mr-4">{date}</span>
        <Clock className="h-4 w-4 mr-1" />
        <span>{duration}h</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const statuses: SkillStatus[] = [
              "scheduled",
              "ongoing",
              "completed",
            ];
            const currentIndex = statuses.indexOf(status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            const newStatus = statuses[nextIndex];
            onStatusChange?.(newStatus);
          }}
          className={`text-sm flex items-center px-2 py-1 rounded-md ${
            status === "completed"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : status === "ongoing"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          {status === "completed" ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <ClockIcon className="h-4 w-4 mr-1" />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      </div>
    </div>
  );
};

const SkillHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "learned" | "taught">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [skills, setSkills] = useState<SkillCardProps[]>([
    {
      title: "Web Development",
      partnerName: "Laura Apostol",
      date: "2025-11-10",
      duration: 2,
      rating: 4,
      status: "scheduled",
      type: "learned",
    },
    {
      title: "Photography",
      partnerName: "Andrei Popescu",
      date: "2025-11-12",
      duration: 1.5,
      rating: 5,
      status: "ongoing",
      type: "taught",
    },
    {
      title: "Spanish Language",
      partnerName: "Matei Lungu",
      date: "2025-11-15",
      duration: 1,
      rating: 0,
      status: "scheduled",
      type: "learned",
    },
  ]);

  // Calculate completed trades from skills array
  const completedTrades = skills.filter(
    (skill) => skill.status === "completed",
  ).length;

  // Log when skills change
  useEffect(() => {}, [skills]);

  const handleStatusChange = (index: number, newStatus: SkillStatus) => {
    setSkills((prevSkills) => {
      const updatedSkills = [...prevSkills];
      updatedSkills[index] = { ...updatedSkills[index], status: newStatus };
      return updatedSkills;
    });
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesTab = activeTab === "all" || skill.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-svh bg-[#F0F6FF]">
      {/* header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-lg font-semibold text-gray-900 ml-2">
            Skill History
          </h1>
        </div>
      </header>
      <div className="p-4">
        {/* Search bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm transition-all duration-200 hover:border-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
            placeholder="Search skills and partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Completed Trades Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Completed Trades
              </h3>
              <p className="text-sm text-gray-500">
                Total skills you've completed
              </p>
            </div>
            <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {completedTrades}
            </div>
          </div>
        </div>

        {/* skill-uri numarate */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Skills
            </div>
            <div className="text-2xl font-semibold text-cyan-900">
              {skills.length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Learned
            </div>
            <div className="text-2xl font-semibold text-cyan-900">
              {skills.filter((skill) => skill.type === "learned").length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Taught</div>
            <div className="text-2xl font-semibold text-cyan-900">
              {skills.filter((skill) => skill.type === "taught").length}
            </div>
          </div>
        </div>

        {/* segmente*/}
        <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full">
          {[
            { id: "all", label: "All" },
            { id: "learned", label: "Learned" },
            { id: "taught", label: "Taught" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "all" | "learned" | "taught")
              }
              className={`px-4 py-2 text-sm font-medium rounded-md flex-1 ${
                activeTab === tab.id
                  ? "bg-white shadow-sm text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <SkillCard
              key={index}
              {...skill}
              onStatusChange={(newStatus) =>
                handleStatusChange(index, newStatus)
              }
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No results found for "{searchQuery}"
            </div>
            <div className="text-gray-400 mt-2">
              Try different search terms or check back later.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillHistoryPage;
