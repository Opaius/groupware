"use client";

import React from "react";
import { Circle } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps = 4,
}: ProgressIndicatorProps) => {
  const stepTitles = ["Skills", "Specialization", "Skill Details", "Profile"];

  return (
    <div style={{ marginBottom: 20, padding: "0 25px" }}>
      {/* Step Titles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          fontSize: 12,
          color: "#1D324E",
          fontWeight: 500,
        }}
      >
        {stepTitles.map((title, index) => (
          <span
            key={index}
            style={{
              color: index === currentStep ? "#40C9E7" : "#496995",
              fontWeight: index === currentStep ? 600 : 400,
            }}
          >
            {title}
          </span>
        ))}
      </div>

      {/* Visual Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 24,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 300, position: "relative" }}>
          {/* Background Line */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: 3,
              right: 3,
              height: 1,
              background: "#2965B5",
            }}
          />

          {/* Steps */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} style={{ marginTop: 0 }}>
                {index === currentStep ? (
                  <div style={{ position: "relative", width: 24, height: 24 }}>
                    <Circle
                      size={24}
                      fill="#40C9E7"
                      color="#40C9E7"
                      strokeWidth={0}
                    />
                    <Circle
                      size={12}
                      fill="#94C6E7"
                      color="#94C6E7"
                      strokeWidth={0}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                ) : index < currentStep ? (
                  <Circle size={12} fill="#40C9E7" color="#40C9E7" strokeWidth={0} />
                ) : (
                  <Circle size={10} fill="#2965B5" color="#2965B5" strokeWidth={0} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
