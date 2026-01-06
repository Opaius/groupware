// ============================================================================
// ONBOARDING FLOW TYPES
// ============================================================================

import React from "react";

export interface OnboardingFormData {
  bio: string;
  selectedSkills: {
    tech: string[];
    creative: string[];
  };
  skills: string[];
  specialization: string;
  skillName: string;
  description: string;
  link: string;
}

export interface ProfileStepProps {
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
}

// Props for skill card component
export interface SkillCardProps {
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onToggle: () => void;
}
