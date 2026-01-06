"use client";

import React from "react";
import { Send, Paperclip } from "lucide-react";
import { SkillAttributionStepProps } from "./types";

const SkillAttributionStep = ({
  formData,
  updateFormData,
}: SkillAttributionStepProps) => {
  const handleAddSkill = () => {
    if (formData.skillName.trim()) {
      updateFormData({
        ...formData,
        skills: [...formData.skills, formData.skillName],
        skillName: "",
        description: "",
        link: "",
      });
    }
  };

  return (
    <div
      style={{
        padding: "0 25px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* SKILLS SECTION */}
      <div
        style={{
          backgroundColor: "#C6CDD9",
          borderRadius: "15px",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "black",
            fontWeight: 600,
            fontSize: 14,
            marginRight: 5,
          }}
        >
          Skills:
        </span>
        {formData.skills.map((skill: string, index: number) => (
          <div
            key={index}
            style={{
              backgroundColor: "#2B4B75",
              color: "white",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {skill}
          </div>
        ))}
      </div>

      {/* FORM SECTION */}
      <div
        style={{
          border: "1px solid #DCE5F2",
          borderRadius: "15px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* Input: Skill Name */}
        <input
          type="text"
          placeholder="Your Skill Name"
          value={formData.skillName || ""}
          onChange={(e) =>
            updateFormData({ ...formData, skillName: e.target.value })
          }
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#D6DCE5",
            color: "#1D324E",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Textarea: Description */}
        <textarea
          placeholder="Describe your Skill"
          value={formData.description || ""}
          onChange={(e) =>
            updateFormData({ ...formData, description: e.target.value })
          }
          style={{
            width: "100%",
            height: "140px",
            padding: "15px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#D6DCE5",
            color: "#1D324E",
            fontSize: 14,
            outline: "none",
            resize: "none",
            fontFamily: "'Inter', sans-serif",
            boxSizing: "border-box",
          }}
        />

        {/* Link Input & Attachment Button Row */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            style={{
              flex: 1,
              backgroundColor: "#D6DCE5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              paddingRight: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Link your Skill"
              value={formData.link || ""}
              onChange={(e) =>
                updateFormData({ ...formData, link: e.target.value })
              }
              style={{
                flex: 1,
                padding: "15px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#1D324E",
                fontSize: 14,
              }}
            />
            <Send size={20} color="#5A6B89" strokeWidth={2} />
          </div>

          {/* Attachment Button */}
          <div
            style={{
              width: 50,
              backgroundColor: "#D6DCE5",
              borderRadius: "8px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <Paperclip size={20} color="#5A6B89" strokeWidth={2} />
          </div>
        </div>

        {/* Add Skill Button */}
        <button
          onClick={handleAddSkill}
          style={{
            width: "100%",
            backgroundColor: "#93C6E7",
            color: "#24507F",
            border: "none",
            borderRadius: "8px",
            padding: "15px 0",
            fontSize: 18,
            fontWeight: 500,
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Add Your Skill
        </button>
      </div>
    </div>
  );
};

export default SkillAttributionStep;
