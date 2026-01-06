"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  OnboardingFormData,
  ProfileStep,
  SkillSelectionStep,
  SpecializationStep,
  SkillAttributionStep,
  ProgressIndicator,
} from "./components";

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const BrandLogo = () => (
  <div style={{ width: 122, height: 66, position: "relative" }}>
    <img
      src="/logo.png"
      alt="Skill Trade Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function OnboardingFlowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    bio: "",
    selectedSkills: { tech: [], creative: [] },
    skills: ["Wireframing", "Figma", "User Flows", "UX Research"],
    specialization: "",
    skillName: "",
    description: "",
    link: "",
  });

  const stepTitles = [
    "Shape Your Growth Path",
    "Choose Your Specialization",
    "Bring Your Skills to Life",
    "Show Your Best Self",
  ];

  const stepDescriptions = [
    "Choose the skills you'd like to explore and start learning what matters most to you. We'll tailor your experience just for you!",
    "Select your primary area of focus. This helps us match you with relevant opportunities and resources.",
    "Upload what you know and start growing from here. Let us know what you're great at!",
    "Add a friendly, professional-looking photo to personalize your profile. Let us know you better!",
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      console.log("Form submitted:", formData);
      alert(
        "Onboarding complete! Form data: " + JSON.stringify(formData, null, 2),
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SkillSelectionStep
            formData={formData}
            updateFormData={setFormData}
          />
        );
      case 1:
        return (
          <SpecializationStep
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
            background: "rgba(148, 198, 231, 0.58)",
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          onClick={handleNext}
        >
          <span style={{ color: "#1D324E", fontSize: 20, fontWeight: 600 }}>
            {currentStep === 3 ? "Complete Onboarding" : "Continue"}
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
          disabled={currentStep === 0}
          style={{
            flex: 1,
            height: 50,
            background:
              currentStep === 0 ? "#f0f0f0" : "rgba(139, 154, 183, 0.20)",
            borderRadius: 10,
            border: "none",
            color: currentStep === 0 ? "#999" : "#1D324E",
            fontSize: 16,
            fontWeight: 600,
            cursor: currentStep === 0 ? "not-allowed" : "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 1,
            height: 50,
            background: "rgba(64, 201, 231, 0.7)",
            borderRadius: 10,
            border: "none",
            color: "#1D324E",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {currentStep === 3 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
