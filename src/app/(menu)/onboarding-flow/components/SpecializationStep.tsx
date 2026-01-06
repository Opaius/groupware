"use client";

import React from "react";
import { SpecializationStepProps, Category } from "./types";

const categories: Category[] = [
  { icon: "💻", label: "Tech & Digital Skills" },
  { icon: "🎨", label: "Creative & Design Skills" },
  { icon: "💬", label: "Communication & Soft Skills" },
  { icon: "📈", label: "Business & Marketing Skills" },
  { icon: "🌱", label: "Personal Growth & Lifestyle" },
  { icon: "🧰", label: "Practical & Everyday Skills" },
  { icon: "🧠", label: "Science & Education" },
  { icon: "🌍", label: "Social Impact & Global Studies" },
  { icon: "⚡", label: "Sports, Fitness & Performance" },
  { icon: "🎮", label: "Entertainment & Media" },
];

const SpecializationStep = ({
  formData,
  updateFormData,
}: SpecializationStepProps) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px 17px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {categories.map((item, index) => (
        <div
          key={index}
          onClick={() =>
            updateFormData({ ...formData, specialization: item.label })
          }
          style={{
            width: "100%",
            height: 56,
            background:
              formData.specialization === item.label
                ? "rgba(64, 201, 231, 0.2)"
                : "rgba(82.65, 119.42, 156.19, 0.10)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            border:
              formData.specialization === item.label
                ? "2px solid #40C9E7"
                : "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "black",
                fontSize: 20,
                fontWeight: 600,
                lineHeight: "14.81px",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "14.81px",
              }}
            >
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecializationStep;
