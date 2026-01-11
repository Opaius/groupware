"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SkillSelectionStepProps, SkillCardProps } from "./types";
import {
  Code,
  Palette,
  Camera,
  Paintbrush,
  Layers,
  Shirt,
  ChefHat,
  Music,
  Database,
  Cloud,
  Smartphone,
  Bug,
  Target,
  Search,
} from "lucide-react";

// Extended skill icon map for fallback
const skillIconMap: Record<string, React.ReactNode> = {
  // Tech & Digital Skills
  "Web Development": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Mobile App Development": (
    <Smartphone size={40} color="#1D324E" strokeWidth={2} />
  ),
  "Cloud Computing": <Cloud size={40} color="#1D324E" strokeWidth={2} />,
  "Data Science": <Database size={40} color="#1D324E" strokeWidth={2} />,
  "Machine Learning": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Cybersecurity: <Bug size={40} color="#1D324E" strokeWidth={2} />,
  "UI/UX Design": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  DevOps: <Cloud size={40} color="#1D324E" strokeWidth={2} />,
  Blockchain: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Game Development": <Smartphone size={40} color="#1D324E" strokeWidth={2} />,
  "Artificial Intelligence": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Frontend Development": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Backend Development": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Database Administration": (
    <Database size={40} color="#1D324E" strokeWidth={2} />
  ),
  "API Development": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Software Architecture": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Network Administration": <Cloud size={40} color="#1D324E" strokeWidth={2} />,
  "System Administration": <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Creative & Design Skills
  "Graphic Design": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  Photography: <Camera size={40} color="#1D324E" strokeWidth={2} />,
  "Video Editing": <Camera size={40} color="#1D324E" strokeWidth={2} />,
  "3D Modeling": <Layers size={40} color="#1D324E" strokeWidth={2} />,
  Animation: <Paintbrush size={40} color="#1D324E" strokeWidth={2} />,
  Illustration: <Paintbrush size={40} color="#1D324E" strokeWidth={2} />,
  "Fashion Design": <Shirt size={40} color="#1D324E" strokeWidth={2} />,
  "Interior Design": <Layers size={40} color="#1D324E" strokeWidth={2} />,
  Typography: <Paintbrush size={40} color="#1D324E" strokeWidth={2} />,
  "Brand Identity": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Motion Graphics": <Paintbrush size={40} color="#1D324E" strokeWidth={2} />,
  "Digital Art": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Product Design": <Layers size={40} color="#1D324E" strokeWidth={2} />,
  "User Interface Design": (
    <Palette size={40} color="#1D324E" strokeWidth={2} />
  ),
  "User Experience Design": (
    <Palette size={40} color="#1D324E" strokeWidth={2} />
  ),
  "Web Design": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Adobe Creative Suite": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  Figma: <Palette size={40} color="#1D324E" strokeWidth={2} />,

  // Communication & Soft Skills
  "Public Speaking": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Leadership: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Team Management": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Negotiation: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Conflict Resolution": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Active Listening": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Emotional Intelligence": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Presentation Skills": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Networking: <Cloud size={40} color="#1D324E" strokeWidth={2} />,
  "Time Management": <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Business & Marketing Skills
  "Digital Marketing": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "SEO Optimization": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Social Media Marketing": (
    <Smartphone size={40} color="#1D324E" strokeWidth={2} />
  ),
  "Content Strategy": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Market Research": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Sales Strategy": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Business Development": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Financial Planning": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Project Management": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Entrepreneurship: <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Personal Growth & Lifestyle
  Meditation: <Palette size={40} color="#1D324E" strokeWidth={2} />,
  Mindfulness: <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Goal Setting": <Target size={40} color="#1D324E" strokeWidth={2} />,
  "Habit Building": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Stress Management": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Personal Finance": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Nutrition Planning": <ChefHat size={40} color="#1D324E" strokeWidth={2} />,
  "Sleep Optimization": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  Journaling: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Self-Reflection": <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Practical & Everyday Skills
  Cooking: <ChefHat size={40} color="#1D324E" strokeWidth={2} />,
  Baking: <ChefHat size={40} color="#1D324E" strokeWidth={2} />,
  "Home Repair": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Gardening: <Palette size={40} color="#1D324E" strokeWidth={2} />,
  Sewing: <Shirt size={40} color="#1D324E" strokeWidth={2} />,
  "Car Maintenance": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "First Aid": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Budgeting: <Code size={40} color="#1D324E" strokeWidth={2} />,
  Cleaning: <Code size={40} color="#1D324E" strokeWidth={2} />,
  Organization: <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Science & Education
  "Scientific Research": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Data Analysis": <Database size={40} color="#1D324E" strokeWidth={2} />,
  "Laboratory Techniques": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Teaching: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Curriculum Design": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Academic Writing": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Mentoring: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Critical Thinking": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Research Methodology": <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Social Impact & Global Studies
  "Nonprofit Management": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Community Organizing": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Fundraising: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Grant Writing": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Advocacy: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Policy Analysis": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Social Research": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Cultural Competency": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Volunteer Coordination": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Sustainability Planning": (
    <Palette size={40} color="#1D324E" strokeWidth={2} />
  ),

  // Sports, Fitness & Performance
  "Personal Training": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Yoga Instruction": <Palette size={40} color="#1D324E" strokeWidth={2} />,
  "Nutrition Coaching": <ChefHat size={40} color="#1D324E" strokeWidth={2} />,
  "Sports Coaching": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Dance Instruction": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Martial Arts": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Swimming Instruction": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Strength Training": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Cardio Fitness": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Rehabilitation: <Code size={40} color="#1D324E" strokeWidth={2} />,

  // Entertainment & Media
  Acting: <Code size={40} color="#1D324E" strokeWidth={2} />,
  Singing: <Music size={40} color="#1D324E" strokeWidth={2} />,
  "Music Production": <Music size={40} color="#1D324E" strokeWidth={2} />,
  Screenwriting: <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Film Directing": <Camera size={40} color="#1D324E" strokeWidth={2} />,
  "Podcast Production": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Stand-up Comedy": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Voice Acting": <Code size={40} color="#1D324E" strokeWidth={2} />,
  "Event Hosting": <Code size={40} color="#1D324E" strokeWidth={2} />,
  Broadcasting: <Cloud size={40} color="#1D324E" strokeWidth={2} />,
};

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
        {/* Red circle background - perfectly centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#E04F5F]" />
        </div>

        {/* Icon - perfectly centered on top of circle */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex items-center justify-center w-16 h-16">
            {icon}
          </div>
        </div>
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
  // Get selected categories from form data
  const selectedCategories = formData.selectedCategories || [];
  const selectedSkills = useMemo(
    () => formData.selectedSkills || [],
    [formData.selectedSkills],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Ensure all selected skills are marked as "wanted" in this step
  useEffect(() => {
    const hasCurrentSkills = selectedSkills.some(
      (skill) => skill.type === "current",
    );
    if (hasCurrentSkills) {
      const updatedSkills = selectedSkills.map((skill) => ({
        ...skill,
        type: "wanted" as const,
      }));

      // Update form data if any skills were changed
      updateFormData({
        ...formData,
        selectedSkills: updatedSkills,
      });
    }
  }, [selectedSkills, formData, updateFormData]);

  console.log("DEBUG: selectedCategories", selectedCategories);
  console.log("DEBUG: selectedSkills", selectedSkills);

  // Fetch all categories to get their icons
  const allCategories = useQuery(api.skills.index.getAllSkillCategories);

  // Fetch skills for selected categories using single query
  const categoryNames = selectedCategories.map((cat) => cat.name);
  console.log("DEBUG: categoryNames", categoryNames);

  const categorySkillsData = useQuery(
    api.skills.index.getSkillsByCategoryNames,
    { categoryNames },
  );
  console.log("DEBUG: categorySkillsData", categorySkillsData);

  // Check if any query is still loading
  const isLoading =
    allCategories === undefined || categorySkillsData === undefined;

  console.log("DEBUG: isLoading", isLoading);
  console.log("DEBUG: allCategories", allCategories);
  console.log("DEBUG: api.skills.index", api.skills?.index);

  // Group skills by category and apply search filter
  const skillsByCategory = useMemo(() => {
    console.log(
      "DEBUG: useMemo called, isLoading:",
      isLoading,
      "categorySkillsData:",
      categorySkillsData,
    );
    if (isLoading) return [];

    const result = (categorySkillsData || []).map((group) => {
      // Filter skills by search query if provided
      const filteredSkills = (group.skills || [])
        .filter((skill: { name: string }) => {
          if (!searchQuery.trim()) return true;
          return skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map((skill: { name: string }) => ({
          title: skill.name,
          icon: skillIconMap[skill.name] || (
            <Code size={40} color="#1D324E" strokeWidth={2} />
          ),
        }));

      return {
        category: group.category,
        skills: filteredSkills,
      };
    });

    // Filter out categories with no skills (especially important during search)
    return result.filter((group) => group.skills.length > 0);
  }, [categorySkillsData, isLoading, searchQuery]);

  const toggleSkill = (skillTitle: string, categoryName: string) => {
    const existingSkillIndex = selectedSkills.findIndex(
      (skill) =>
        skill.title === skillTitle && skill.categoryName === categoryName,
    );

    const newSelectedSkills = [...selectedSkills];

    if (existingSkillIndex >= 0) {
      // Remove skill if already selected
      newSelectedSkills.splice(existingSkillIndex, 1);
    } else {
      // Add new skill as "wanted" skill (user wants to learn it)
      newSelectedSkills.push({
        title: skillTitle,
        type: "wanted" as const,
        categoryName,
      });
    }

    updateFormData({
      ...formData,
      selectedSkills: newSelectedSkills,
    });
  };

  const isSkillSelected = (skillTitle: string, categoryName: string) => {
    return selectedSkills.some(
      (skill) =>
        skill.title === skillTitle && skill.categoryName === categoryName,
    );
  };

  // Handle loading state
  if (isLoading) {
    console.log("DEBUG: Showing loading state");
    return (
      <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10 flex items-center justify-center">
        <div>Loading skills...</div>
      </div>
    );
  }

  // Handle no categories selected state
  if (selectedCategories.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10 flex flex-col items-center justify-center">
        <div className="text-lg font-medium text-gray-700 mb-2">
          No categories selected
        </div>
        <div className="text-sm text-gray-500 text-center">
          Please go back and select at least one category to choose skills from.
        </div>
        <button
          onClick={() => updateFormData({ ...formData, selectedSkills: [] })}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
        >
          Go Back to Categories
        </button>
      </div>
    );
  }

  // Handle empty skills state
  const totalSkills = skillsByCategory.reduce(
    (total, group) => total + group.skills.length,
    0,
  );
  if (totalSkills === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10 flex flex-col items-center justify-center">
        <div className="text-lg font-medium text-gray-700 mb-2">
          No skills available in selected categories
        </div>
        <div className="text-sm text-gray-500 text-center">
          Try selecting different categories or contact support.
        </div>
      </div>
    );
  }

  // Get category icon from skillsByCategory first, then fallback to allCategories
  const getCategoryIcon = (categoryName: string) => {
    // First try to find category in skillsByCategory (already loaded)
    const categoryFromSkills = skillsByCategory.find(
      (group) => group.category.name === categoryName,
    );
    if (categoryFromSkills?.category.icon) {
      return categoryFromSkills.category.icon;
    }

    // Fallback to allCategories query
    const category = allCategories?.find((cat) => cat.name === categoryName);
    return category?.icon || "📋";
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for skills you want to learn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Skill Type Info - This step is only for selecting wanted skills */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <Target size={20} className="text-blue-600" />
          <div>
            <h4 className="text-blue-900 font-medium">Select Wanted Skills</h4>
            <p className="text-blue-700 text-sm mt-1">
              Choose skills you want to learn from your selected categories.
              You&apos;ll add skills you already master in the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Selection summary */}
      {selectedSkills.length > 0 ? (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-blue-900 font-medium">
              Selected skills: {selectedSkills.length}
            </h4>
            <button
              onClick={() =>
                updateFormData({ ...formData, selectedSkills: [] })
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSkills.slice(0, 5).map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill.title}
                <span className="ml-1 text-xs">(→)</span>
              </div>
            ))}
            {selectedSkills.length > 5 && (
              <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm">
                +{selectedSkills.length - 5} more
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-red-600" />
            <h4 className="text-red-900 font-medium">No skills selected</h4>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Please select at least one skill you want to learn from the
            categories below. You must select skills to continue.
          </p>
        </div>
      )}

      {/* Skills by category */}
      <div className="space-y-8">
        {skillsByCategory.map(({ category, skills }) => {
          const categoryIcon = getCategoryIcon(category.name);
          const categorySkillsCount = selectedSkills.filter(
            (skill) => skill.categoryName === category.name,
          ).length;

          return (
            <div key={category.name} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryIcon}</span>
                  <h3 className="text-blue-950 text-sm font-normal font-sans">
                    {category.name}
                  </h3>
                </div>
                <span className="text-sm text-gray-500">
                  {categorySkillsCount} selected
                </span>
              </div>

              {skills.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                    {skills
                      .slice(
                        0,
                        expandedCategories.has(category.name)
                          ? skills.length
                          : 6,
                      )
                      .map((skill, index) => {
                        const isSelected = isSkillSelected(
                          skill.title,
                          category.name,
                        );

                        return (
                          <div key={index} className="relative">
                            <SkillCard
                              title={skill.title}
                              icon={skill.icon}
                              isSelected={isSelected}
                              onToggle={() =>
                                toggleSkill(skill.title, category.name)
                              }
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-blue-500 text-white">
                                →
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {skills.length > 6 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedCategories);
                          if (newExpanded.has(category.name)) {
                            newExpanded.delete(category.name);
                          } else {
                            newExpanded.add(category.name);
                          }
                          setExpandedCategories(newExpanded);
                        }}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedCategories.has(category.name)
                          ? "Show less"
                          : `Show ${skills.length - 6} more skills`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery.trim()
                    ? "No skills match your search"
                    : "No skills available in this category"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-gray-700 font-medium mb-2">
          How to select wanted skills:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on any skill card to select it as a wanted skill</li>
          <li>
            • Use the search bar to find specific skills you want to learn
          </li>
          <li>
            • Each category shows 6 skills initially - click &quot;Show
            more&quot; to see all
          </li>
          <li>
            • Selected skills show → to indicate they&apos;re wanted skills
          </li>
          <li>• Click a selected skill again to remove it</li>
          <li>• You&apos;ll add skills you already master in the next step</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillSelectionStep;
