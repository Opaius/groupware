"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SkillAttributionStepProps } from "./types";
import { Search, Plus, X, ChevronDown } from "lucide-react";

interface SearchResultSkill {
  _id: string;
  name: string;
  icon?: string;
  categoryId: string;
}

interface CategoryOption {
  name: string;
  icon: string;
}

const SkillAttributionStep = ({
  formData,
  updateFormData,
}: SkillAttributionStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<SearchResultSkill | null>(
    null,
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Search for skills
  const searchResults = useQuery(
    api.skills.index.searchSkills,
    searchQuery.trim() ? { query: searchQuery } : "skip",
  );

  // Fetch all categories to map IDs to names
  const allCategories = useQuery(api.skills.index.getAllSkillCategories);

  // Get category options: selected categories + "Other"
  const categoryOptions = useMemo(() => {
    const options: CategoryOption[] = [];

    // Add all categories from database
    if (allCategories) {
      allCategories.forEach((cat) => {
        options.push({
          name: cat.name,
          icon: cat.icon || "📋",
        });
      });
    }

    // Add "Other" option
    options.push({ name: "Other", icon: "➕" });
    return options;
  }, [allCategories]);

  // Effect to reset when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsAddingNew(false);
      setSelectedSkill(null);
    }
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Select an existing skill from search results
  const handleSelectSkill = (skill: SearchResultSkill) => {
    setSelectedSkill(skill);
    const categoryName = getCategoryNameForSkill(skill);
    setNewSkillData((prev) => ({
      ...prev,
      name: skill.name,
      category: categoryName,
      description: "", // Clear description for existing skills - user can add their proficiency
    }));
  };

  // Get category name for a skill
  const getCategoryNameForSkill = (skill: SearchResultSkill): string => {
    if (!allCategories) return "Loading...";
    const category = allCategories.find((cat) => cat._id === skill.categoryId);
    return category?.name || "Other";
  };

  // Start adding a new skill
  const handleAddNewSkill = () => {
    setIsAddingNew(true);
    setNewSkillData((prev) => ({
      ...prev,
      name: searchQuery,
      category: categoryOptions[0]?.name || "Other",
    }));
  };

  // Handle new skill data changes
  const handleNewSkillChange = (
    field: keyof typeof newSkillData,
    value: string,
  ) => {
    setNewSkillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle category selection
  const handleSelectCategory = (categoryName: string) => {
    setNewSkillData((prev) => ({
      ...prev,
      category: categoryName,
    }));
    setShowCategoryDropdown(false);
  };

  // Add the custom skill
  const handleAddSkill = () => {
    if (!newSkillData.name.trim()) return;

    const skillToAdd = {
      name: newSkillData.name.trim(),
      description: newSkillData.description.trim(),
      category: newSkillData.category || "Other",
    };

    const updatedCustomSkills = [...formData.customSkills, skillToAdd];

    updateFormData({
      ...formData,
      customSkills: updatedCustomSkills,
    });

    // Reset form
    setSearchQuery("");
    setSelectedSkill(null);
    setIsAddingNew(false);
    setNewSkillData({
      name: "",
      description: "",
      category: categoryOptions[0]?.name || "Other",
    });
  };

  // Remove a custom skill
  const handleRemoveSkill = (index: number) => {
    const updatedCustomSkills = [...formData.customSkills];
    updatedCustomSkills.splice(index, 1);
    updateFormData({
      ...formData,
      customSkills: updatedCustomSkills,
    });
  };

  // Check if we should show "Add new" option
  const showAddNewOption =
    searchQuery.trim() &&
    searchResults &&
    !searchResults.some(
      (skill) => skill.name.toLowerCase() === searchQuery.toLowerCase().trim(),
    );

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* SEARCH SECTION */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-blue-950 text-lg font-semibold mb-2">
            Add Mastered Skills
          </h3>
          <p className="text-gray-600 text-sm">
            Search for skills you master or add new ones. Describe your
            proficiency level for each skill.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for skills you master..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Search results dropdown */}
          {searchQuery.trim() && !selectedSkill && !isAddingNew && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {/* Loading state */}
              {searchResults === undefined && (
                <div className="px-4 py-3 text-center text-gray-500">
                  Searching...
                </div>
              )}

              {/* Results found */}
              {searchResults && searchResults.length > 0 && (
                <>
                  {searchResults.map((skill) => (
                    <button
                      key={skill._id}
                      onClick={() => handleSelectSkill(skill)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    >
                      <span className="text-lg">{skill.icon || "💡"}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {skill.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getCategoryNameForSkill(skill)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Select</span>
                    </button>
                  ))}
                  {showAddNewOption && (
                    <button
                      onClick={handleAddNewSkill}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-t border-gray-100 flex items-center gap-3 text-blue-600"
                    >
                      <Plus size={20} />
                      <div className="flex-1">
                        <div className="font-medium">
                          Add &quot;{searchQuery}&quot;
                        </div>
                        <div className="text-sm text-gray-500">
                          Create new custom skill
                        </div>
                      </div>
                    </button>
                  )}
                </>
              )}

              {/* No results */}
              {searchResults && searchResults.length === 0 && (
                <button
                  onClick={handleAddNewSkill}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-blue-600"
                >
                  <Plus size={20} />
                  <div className="flex-1">
                    <div className="font-medium">
                      Add &quot;{searchQuery}&quot; as new skill
                    </div>
                    <div className="text-sm text-gray-500">
                      This skill doesn&apos;t exist in our catalog
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SKILL DETAILS FORM (shown when skill is selected or adding new) */}
      {(selectedSkill || isAddingNew) && (
        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-800 font-semibold">
              {selectedSkill ? "Selected Skill" : "New Skill Details"}
            </h4>
            <button
              onClick={() => {
                setSelectedSkill(null);
                setIsAddingNew(false);
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Skill name (readonly if selected from search) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkillData.name}
              readOnly={!!selectedSkill}
              onChange={(e) => handleNewSkillChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800"
            />
          </div>

          {/* Category selection - read-only for existing skills, dropdown for new */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            {selectedSkill ? (
              // Read-only category for existing skills
              <input
                type="text"
                value={newSkillData.category}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800"
              />
            ) : (
              // Editable category for new skills
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 flex items-center justify-between hover:border-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <span>{newSkillData.category || "Select a category"}</span>
                  </div>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {categoryOptions.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleSelectCategory(category.name)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description/Proficiency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your proficiency level (optional)
            </label>
            <textarea
              placeholder="e.g., Beginner, Intermediate, Expert, or describe your experience..."
              value={newSkillData.description}
              onChange={(e) =>
                handleNewSkillChange("description", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 h-32 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Add button */}
          <button
            onClick={handleAddSkill}
            disabled={!newSkillData.name.trim()}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              newSkillData.name.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Add Skill
          </button>
        </div>
      )}

      {/* EXISTING CUSTOM SKILLS */}
      {formData.customSkills.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h4 className="text-blue-900 font-semibold">
                Your Mastered Skills ({formData.customSkills.length})
              </h4>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Mastered
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {formData.customSkills.map((skill, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-blue-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-800">
                        {skill.name}
                      </h5>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {skill.category}
                      </span>
                    </div>
                    {skill.description && (
                      <p className="text-gray-600 text-sm">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HELP TEXT */}
      <div className="text-center px-4">
        <p className="text-gray-600 text-sm">
          Add skills you master that aren&apos;t in our catalog. These will be
          saved as your mastered skills.
        </p>
      </div>
    </div>
  );
};

export default SkillAttributionStep;
