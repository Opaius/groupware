"use client";

import React from "react";
import { Plus } from "lucide-react";
import { ProfileStepProps } from "./types";

const ProfileStep = ({ formData, updateFormData }: ProfileStepProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "0 25px",
      }}
    >
      {/* MAIN PHOTO SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Add a Main Photo
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            maxWidth: 300,
          }}
        >
          This image will appear at the top of your profile — make it stand out!
        </p>

        <div
          style={{
            width: 100,
            height: 100,
            background: "rgba(147, 198, 231, 0.96)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
          onClick={() => {
            /* Handle photo upload */
          }}
        >
          <Plus size={36} color="#1D324E" strokeWidth={2} />
        </div>
      </div>

      {/* FEATURED IMAGE SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Upload a Featured Image
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            maxWidth: 300,
          }}
        >
          Choose a photo that represents your skills, work, or personality.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 348,
            height: 89,
            background: "rgba(147, 198, 231, 0.35)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px dashed rgba(29, 50, 78, 0.2)",
          }}
          onClick={() => {
            /* Handle featured image upload */
          }}
        >
          <Plus size={36} color="#1D324E" strokeWidth={2} />
        </div>
      </div>

      {/* BIO SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Add a Short Bio
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            lineHeight: "1.5",
          }}
        >
          Tell us a bit about yourself — your background, passions, and what
          drives you. Write a short description of your key strengths,
          expertise, and experience.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 348,
            height: 127,
            background: "rgba(139, 154, 183, 0.20)",
            borderRadius: 10,
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <textarea
            placeholder="Your words..."
            value={formData.bio || ""}
            onChange={(e) =>
              updateFormData({ ...formData, bio: e.target.value })
            }
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#1D324E",
              fontSize: 14,
              fontFamily: "'Roboto', sans-serif",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
