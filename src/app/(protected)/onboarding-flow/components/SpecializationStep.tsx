"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { CategorySelectionStepProps, Category } from "./types";
import { Star, CheckCircle } from "lucide-react";
import { useQueryWithStatus } from "@/lib/client-utils";

const CategorySelectionStep = ({
  formData,
  updateFormData,
}: CategorySelectionStepProps) => {
  // Fetch skill categories from database
  const skillCategories = useQueryWithStatus(
    api.skills.index.getAllSkillCategories,
  );
  console.log(skillCategories);

  // Handle loading state
  if (skillCategories.isPending) {
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 17px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading categories...</div>
      </div>
    );
  }

  // Handle empty state
  if (!skillCategories || skillCategories.data?.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 17px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>No categories available. Please contact support.</div>
      </div>
    );
  }

  // Convert skill categories to Category format
  const categories: Category[] | undefined = skillCategories?.data?.map(
    (cat) => ({
      icon: cat.icon || "📋",
      label: cat.name,
      name: cat.name,
    }),
  );

  const selectedCategories = formData.selectedCategories || [];
  const primarySpecialization = formData.specializationLabel;
  const selectedSkills = formData.selectedSkills || [];

  const isCategorySelected = (categoryName: string) => {
    return selectedCategories.some((cat) => cat.name === categoryName);
  };

  const handleCategoryToggle = (category: Category) => {
    const isSelected = isCategorySelected(category.name);
    let newSelectedCategories = [...selectedCategories];
    let newSpecialization = primarySpecialization;
    let newSelectedSkills = [...selectedSkills];

    if (isSelected) {
      // Remove category
      newSelectedCategories = newSelectedCategories.filter(
        (cat) => cat.name !== category.name,
      );

      // Also remove skills from this category
      newSelectedSkills = newSelectedSkills.filter(
        (skill) => skill.categoryName !== category.name,
      );

      // If removed category was primary specialization, clear it
      if (primarySpecialization === category.name) {
        newSpecialization = "";
      }
    } else {
      // Add category (max 3)
      if (newSelectedCategories.length < 3) {
        newSelectedCategories.push({
          name: category.name,
          icon: category.icon,
        });
      }
    }

    updateFormData({
      ...formData,
      selectedCategories: newSelectedCategories,
      selectedSkills: newSelectedSkills,
      specializationLabel: newSpecialization,
    });
  };

  const handleSetSpecialization = (categoryName: string) => {
    updateFormData({
      ...formData,
      specializationLabel: categoryName,
    });
  };

  // Selection counter
  const selectionCount = selectedCategories.length;
  const canSelectMore = selectionCount < 3;

  return (
    <div className="flex-1 overflow-y-auto px-6 mt-6 pb-10">
      {/* Instructions */}
      <div className="mb-6">
        <h3 className="text-blue-950 text-lg font-semibold mb-2">
          Select up to 3 categories
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          Choose the areas you&apos;re most interested in. You&apos;ll select
          specific skills from these categories next.
        </p>

        {/* Selection counter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(selectionCount / 3) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {selectionCount}/3 selected
          </span>
        </div>
      </div>

      {/* Selected categories summary */}
      {selectionCount > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-blue-900 font-medium mb-2">Your selections:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={category.name}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  primarySpecialization === category.name
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-white border border-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
                {primarySpecialization === category.name && (
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                )}
              </div>
            ))}
          </div>

          {primarySpecialization && (
            <div className="mt-3 text-sm text-blue-700">
              <Star size={14} className="inline mr-1" />
              <span className="font-medium">{primarySpecialization}</span> is
              your primary specialization
            </div>
          )}
        </div>
      )}

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories?.map((category) => {
          const isSelected = isCategorySelected(category.name);
          const isSpecialization = primarySpecialization === category.name;
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <div
              key={category.name}
              className={`relative rounded-xl p-4 border-2 cursor-pointer transition-all ${
                isSelected
                  ? isSpecialization
                    ? "border-blue-500 bg-blue-50"
                    : "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => !isDisabled && handleCategoryToggle(category)}
            >
              {/* Category icon and name */}
              <div className="flex flex-col items-center text-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-800">
                  {category.label}
                </span>
              </div>

              {/* Selection indicators */}
              <div className="absolute top-2 right-2">
                {isSelected && (
                  <div
                    className={`rounded-full p-1 ${
                      isSpecialization ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    {isSpecialization ? (
                      <Star size={12} className="text-blue-600 fill-blue-600" />
                    ) : (
                      <CheckCircle size={12} className="text-green-600" />
                    )}
                  </div>
                )}
              </div>

              {/* Specialization button */}
              {isSelected && !isSpecialization && (
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetSpecialization(category.name);
                    }}
                    className="w-full py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    Set as Primary
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-gray-700 font-medium mb-2">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select up to 3 categories that interest you most</li>
          <li>• Choose one as your primary specialization (marked with ⭐)</li>
          <li>
            • Next, you&apos;ll select specific skills from your chosen
            categories
          </li>
          <li>
            • Your primary specialization helps us match you with relevant
            opportunities
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategorySelectionStep;
