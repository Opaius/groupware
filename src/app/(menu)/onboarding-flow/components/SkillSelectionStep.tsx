"use client";

import React from "react";
import {
  Code,
  Bug,
  Cloud,
  Smartphone,
  Database,
  Palette,
  Camera,
  Paintbrush,
  Layers,
  Shirt,
  ChefHat,
  Music,
  Circle,
} from "lucide-react";
import { SkillSelectionStepProps, Skill, SkillCardProps } from "./types";

const techSkills: Skill[] = [
  {
    title: "Web Development",
    icon: <Code size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Software Testing",
    icon: <Bug size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Cloud Computing",
    icon: <Cloud size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Mobile App Dev",
    icon: <Smartphone size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Database",
    icon: <Database size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "UI/UX Design",
    icon: <Palette size={40} color="#1D324E" strokeWidth={2} />,
  },
];

const creativeSkills: Skill[] = [
  {
    title: "Photography",
    icon: <Camera size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Painting",
    icon: <Paintbrush size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Graphic Design",
    icon: <Layers size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Fashion Design",
    icon: <Shirt size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Cooking & Baking",
    icon: <ChefHat size={40} color="#1D324E" strokeWidth={2} />,
  },
  {
    title: "Music Production",
    icon: <Music size={40} color="#1D324E" strokeWidth={2} />,
  },
];

const SkillCard = ({ title, icon, isSelected, onToggle }: SkillCardProps) => {
  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <div
        className="w-24 h-24 rounded-sm relative overflow-hidden flex items-center justify-center shrink-0"
        style={{
          backgroundColor: isSelected
            ? "rgba(64, 201, 231, 0.2)"
            : "rgba(148, 198, 231, 0.5)",
          border: isSelected ? "2px solid #40C9E7" : "none",
        }}
      >
        {/* Background decorative circle */}
        <div className="absolute top-[20px] opacity-100">
          <Circle size={48} fill="#E04F5F" color="#E04F5F" strokeWidth={0} />
        </div>

        {/* Icon */}
        <div className="relative z-10 mt-0">{icon}</div>
      </div>
      <div className="text-center text-blue-950 text-xs font-normal font-sans w-24 leading-tight">
        {title}
      </div>
    </div>
  );
};

const SkillSelectionStep = ({
  formData,
  updateFormData,
}: SkillSelectionStepProps) => {
  const toggleSkill = (category: "tech" | "creative", skillTitle: string) => {
    const currentSkills = formData.selectedSkills || { tech: [], creative: [] };
    const categorySkills = currentSkills[category];

    if (categorySkills.includes(skillTitle)) {
      updateFormData({
        ...formData,
        selectedSkills: {
          ...currentSkills,
          [category]: categorySkills.filter((s: string) => s !== skillTitle),
        },
      });
    } else {
      updateFormData({
        ...formData,
        selectedSkills: {
          ...currentSkills,
          [category]: [...categorySkills, skillTitle],
        },
      });
    }
  };

  const isSkillSelected = (
    category: "tech" | "creative",
    skillTitle: string,
  ) => {
    const currentSkills = formData.selectedSkills || { tech: [], creative: [] };
    return currentSkills[category]?.includes(skillTitle) || false;
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10">
      {/* TECH SECTION */}
      <h3 className="text-blue-950 text-sm font-normal font-sans mb-4">
        Tech & Digital Skills
      </h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 mb-8">
        {techSkills.map((skill, index) => (
          <SkillCard
            key={index}
            title={skill.title}
            icon={skill.icon}
            isSelected={isSkillSelected("tech", skill.title)}
            onToggle={() => toggleSkill("tech", skill.title)}
          />
        ))}
      </div>

      {/* CREATIVE SECTION */}
      <h3 className="text-blue-950 text-sm font-normal font-sans mb-4">
        Creative & Practical Skills
      </h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-6">
        {creativeSkills.map((skill, index) => (
          <SkillCard
            key={index}
            title={skill.title}
            icon={skill.icon}
            isSelected={isSkillSelected("creative", skill.title)}
            onToggle={() => toggleSkill("creative", skill.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillSelectionStep;
