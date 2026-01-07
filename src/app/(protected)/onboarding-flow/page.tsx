"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import {
  OnboardingFormData,
  ProfileStep,
  CategorySelectionStep,
  SkillSelectionStep,
  SkillAttributionStep,
  ProgressIndicator,
} from "./components";
import { useRouter } from "next/navigation";
import { api } from "~/convex/_generated/api";

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const BrandLogo = () => (
  <div style={{ width: 122, height: 66, position: "relative" }}>
    <Image
      src="/logo.png"
      alt="Skill Trade Logo"
      fill
      style={{ objectFit: "contain" }}
    />
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function OnboardingFlowPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<OnboardingFormData>({
    bio: "",
    specializationLabel: "",
    skillType: "current",
    selectedCategories: [],
    selectedSkills: [],
    customSkills: [],
  });

  const completeOnboardingMutation = useMutation(
    api.onboarding.completeOnboarding,
  );

  // Load existing profile data if any
  const onboardingStatus = useQuery(api.onboarding.getOnboardingStatus, {});

  // Load existing profile data when onboarding status is available
  React.useEffect(() => {
    // Skip if still loading
    if (onboardingStatus === undefined) {
      return;
    }

    // Query has completed (could be null or have data)
    if (onboardingStatus?.profile) {
      const profile = onboardingStatus.profile;

      // Helper to parse storage ID from either plain string or JSON string
      // Handles cases where storageId might be a JSON string like {"storageId":"..."}
      // Also handles double-encoded JSON strings (quoted JSON strings)
      // Recursively parses until a non-JSON string or string without storageId field
      const parseStorageId = (
        storageId: string | null | undefined,
      ): string | undefined => {
        if (!storageId) return undefined;

        let actualStorageId = storageId.trim();
        let changed = true;
        let iterations = 0;

        // Keep parsing as long as we're making progress, but limit iterations to prevent infinite loops
        while (changed && iterations < 10) {
          changed = false;
          iterations++;

          // Try to strip outer quotes if present
          if (
            actualStorageId.length >= 2 &&
            actualStorageId[0] === '"' &&
            actualStorageId[actualStorageId.length - 1] === '"'
          ) {
            actualStorageId = actualStorageId.slice(1, -1);
            changed = true;
          }

          try {
            const parsed = JSON.parse(actualStorageId);
            if (parsed && typeof parsed.storageId === "string") {
              actualStorageId = parsed.storageId;
              changed = true;
            }
          } catch {
            // Not JSON, use as-is
          }
        }

        return actualStorageId;
      };

      setFormData((prev) => ({
        ...prev,
        bio: profile.bio || "",
        mainPhotoUrl: parseStorageId(profile.mainPhoto),
        featuredImageUrl: parseStorageId(profile.featuredImage),
      }));
    }
    setIsLoading(false);
  }, [onboardingStatus]);

  const stepTitles = [
    "Choose Your Categories",
    "Select Your Skills",
    "Add Mastered Skills",
    "Complete Your Profile",
  ];

  const stepDescriptions = [
    "Select up to 3 skill categories that interest you most. You'll choose skills from these areas next.",
    "Choose specific skills from your selected categories. Mark skills you already have or want to learn.",
    "Search for skills you master or add new ones. Describe your proficiency level for each skill.",
    "Add a bio and profile photos to personalize your account and connect with others.",
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      // Submit the form
      await submitOnboarding();
    }
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Transform form data to match mutation schema
      const catalogSkills = (formData.selectedSkills || []).map((skill) => ({
        title: skill.title,
        type: skill.type,
        categoryName: skill.categoryName,
      }));

      const customSkills = (formData.customSkills || []).map((skill) => ({
        name: skill.name,
        type: "current" as "current" | "wanted",
        category: skill.category,
        description: skill.description || "",
        link: "",
      }));

      const result = await completeOnboardingMutation({
        bio: formData.bio || "",
        specializationLabel: formData.specializationLabel,
        catalogSkills,
        customSkills,
        mainPhoto: formData.mainPhotoUrl,
        featuredImage: formData.featuredImageUrl,
      });

      if (result.success) {
        // Redirect to dashboard or home page
        router.push("/");
      } else {
        setError("Failed to complete onboarding. Please try again.");
      }
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CategorySelectionStep
            formData={formData}
            updateFormData={setFormData}
          />
        );
      case 1:
        return (
          <SkillSelectionStep
            formData={formData}
            updateFormData={setFormData}
          />
        );
      case 2:
        return (
          <SkillAttributionStep
            formData={formData}
            updateFormData={setFormData}
          />
        );
      case 3:
        return <ProfileStep formData={formData} updateFormData={setFormData} />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (currentStep) {
      case 0:
        // Must have at least one category selected
        return (formData.selectedCategories?.length || 0) > 0;
      case 1:
        // Must have at least one skill selected from chosen categories
        return (formData.selectedSkills?.length || 0) > 0;
      case 2:
        // Custom skills are optional
        return true;
      case 3:
        // Bio is optional, images are optional
        return true;
      default:
        return false;
    }
  };

  const nextButtonText = () => {
    if (currentStep === 3) {
      return isSubmitting ? "Completing..." : "Complete Onboarding";
    }
    return "Continue";
  };

  // Show loading state while checking for existing data
  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: 844,
          background: "white",
          fontFamily: "'Inter', sans-serif",
          overflowX: "hidden",
          margin: "0 auto",
          position: "relative",
          paddingBottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#1D324E",
            fontSize: 16,
          }}
        >
          Loading your data...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        minHeight: 844,
        background: "white",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        margin: "0 auto",
        position: "relative",
        paddingBottom: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px 25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          position: "relative",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={handleBack}>
          <ArrowLeft size={24} color="#1D324E" strokeWidth={2} />
        </div>

        <div style={{ transform: "scale(0.9)" }}>
          <BrandLogo />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 5,
          }}
        >
          <div style={{ width: 20, height: 2, background: "#333" }}></div>
          <div style={{ width: 30, height: 2, background: "#333" }}></div>
          <div style={{ width: 25, height: 2, background: "#333" }}></div>
        </div>
      </div>

      {/* PROGRESS INDICATOR */}
      <ProgressIndicator currentStep={currentStep} totalSteps={4} />

      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            margin: "10px 25px 0",
            padding: "10px 15px",
            background: "rgba(255, 0, 0, 0.1)",
            border: "1px solid rgba(255, 0, 0, 0.3)",
            borderRadius: 8,
            color: "#d32f2f",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* TOP CARD: Step Intro */}
      <div
        style={{
          margin: "10px 25px 30px 25px",
          background: "rgba(139, 154, 183, 0.20)",
          borderRadius: 10,
          padding: "20px 17px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2
            style={{
              color: "#1D324E",
              fontSize: 20,
              fontWeight: 700,
              margin: "0 0 8px 0",
            }}
          >
            {stepTitles[currentStep]}
          </h2>
          <p
            style={{
              color: "#2F2E41",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "1.4",
              margin: "0 0 12px 0",
            }}
          >
            {stepDescriptions[currentStep]}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: 56,
            background: isFormValid()
              ? "rgba(148, 198, 231, 0.58)"
              : "rgba(148, 198, 231, 0.3)",
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
            opacity: isFormValid() && !isSubmitting ? 1 : 0.7,
          }}
          onClick={() => isFormValid() && !isSubmitting && handleNext()}
        >
          <span style={{ color: "#1D324E", fontSize: 20, fontWeight: 600 }}>
            {nextButtonText()}
          </span>
        </div>
      </div>

      {/* STEP CONTENT */}
      <div style={{ flex: 1, overflowY: "auto" }}>{renderStep()}</div>

      {/* NAVIGATION BUTTONS (for smaller screens) */}
      <div
        style={{
          padding: "20px 25px",
          display: "flex",
          gap: "10px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
          style={{
            flex: 1,
            height: 50,
            background:
              currentStep === 0 || isSubmitting
                ? "#f0f0f0"
                : "rgba(139, 154, 183, 0.20)",
            borderRadius: 10,
            border: "none",
            color: currentStep === 0 || isSubmitting ? "#999" : "#1D324E",
            fontSize: 16,
            fontWeight: 600,
            cursor:
              currentStep === 0 || isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid() || isSubmitting}
          style={{
            flex: 1,
            height: 50,
            background:
              isFormValid() && !isSubmitting
                ? "rgba(64, 201, 231, 0.7)"
                : "rgba(64, 201, 231, 0.3)",
            borderRadius: 10,
            border: "none",
            color: "#1D324E",
            fontSize: 16,
            fontWeight: 600,
            cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
            opacity: isFormValid() && !isSubmitting ? 1 : 0.7,
          }}
        >
          {currentStep === 3
            ? isSubmitting
              ? "Processing..."
              : "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
