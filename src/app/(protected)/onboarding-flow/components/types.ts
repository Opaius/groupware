// ============================================================================
// ONBOARDING FLOW TYPES
// ============================================================================

import React from "react";

export interface OnboardingFormData {
  // Profile data
  bio: string;

  // Primary specialization (first selected category)
  specializationLabel: string;

  // Skill type (applies to all skills)
  skillType: "current" | "wanted";

  // Selected categories (up to 3)
  selectedCategories: Array<{
    name: string;
    icon?: string;
  }>;

  // Skills selected from chosen categories
  selectedSkills: Array<{
    title: string;
    type: "current" | "wanted";
    categoryName: string;
  }>;

  // Custom skills from attribution step
  customSkills: Array<{
    name: string;
    description: string;
    category: string; // category name or "Other"
  }>;

  // Profile images
  mainPhotoUrl?: string;
  featuredImageUrl?: string;
}

export interface ProfileStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: OnboardingFormData) => void;
}

export interface CategorySelectionStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: OnboardingFormData) => void;
}

export interface SkillSelectionStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: OnboardingFormData) => void;
}

export interface SpecializationStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: OnboardingFormData) => void;
}

export interface SkillAttributionStepProps {
  formData: OnboardingFormData;
  updateFormData: (data: OnboardingFormData) => void;
}

// Skill types for skill selection step
export interface Skill {
  title: string;
  icon: React.ReactNode;
}

export interface Category {
  icon: string;
  label: string;
  name: string;
}

// Props for skill card component
export interface SkillCardProps {
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onToggle: () => void;
}

// Props for category card component
export interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  isSpecialization: boolean;
  onToggle: () => void;
  onSetSpecialization: () => void;
}
