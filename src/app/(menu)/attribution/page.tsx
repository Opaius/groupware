"use client"

import React, { useState } from "react";

// --- COMPONENTE SVG (Iconițe) ---

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D324E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19L5 12L12 5" />
  </svg>
);

const PaperClipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A6B89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendPlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A6B89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// --- COMPONENTA PRINCIPALĂ ---

export default function SkillAttributionScreen() {
  const [form, setForm] = useState({
    skillName: "",
    description: "",
    link: ""
  });

  const [skills, setSkills] = useState([
    "Wireframing", "Figma", "User Flows", "UX Research"
  ]);

  return (
    <div style={{
      width: "100%",
      maxWidth: "390px",
      minHeight: "844px",
      margin: "0 auto",
      backgroundColor: "white",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      paddingBottom: "40px"
    }}>
      
      {/* 1. HEADER & LOGO */}
      <div style={{ padding: "20px 25px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", height: 100 }}>
        <div style={{ cursor: "pointer", marginTop: 10 }}>
          <BackIcon />
        </div>
        
        {/* Logo poziționat să se suprapună peste cardul de jos */}
        <div style={{ position: "relative", zIndex: 10, marginTop: 0 }}>
           <img 
             src="logo.png" 
             alt="Skill Trade" 
             style={{ width: 100, height: "auto", objectFit: "contain" }}
           />
        </div>
        
        {/* Spacer pentru aliniere */}
        <div style={{ width: 24 }}></div>
      </div>

      {/* 2. HERO CARD (Gri deschis) */}
      <div style={{
        backgroundColor: "#EBEFF5", 
        margin: "0 20px",
        borderRadius: "20px",
        padding: "30px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        top: -20 
      }}>
        
        {/* Progress Bar */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ flex: 1, height: 2, background: "#3F6495" }}></div>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3F6495", margin: "0 -6px" }}></div>
          <div style={{ flex: 1, height: 2, background: "#3F6495" }}></div>
          {/* Active Dot */}
          <div style={{ 
            width: 16, height: 16, 
            borderRadius: "50%", 
            border: "2px solid #40C9E7", 
            background: "white", 
            display: "grid", 
            placeItems: "center",
            margin: "0 -8px",
            zIndex: 2
          }}>
            <div style={{ width: 8, height: 8, background: "#40C9E7", borderRadius: "50%" }}></div>
          </div>
          <div style={{ flex: 1, height: 2, background: "#3F6495" }}></div>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3F6495", margin: "0 -6px" }}></div>
          <div style={{ flex: 1, height: 2, background: "#3F6495" }}></div>
        </div>

        <h2 style={{ color: "#1D324E", fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
          Bring Your Skills to Life
        </h2>
        <p style={{ color: "#4A5568", fontSize: 13, textAlign: "center", lineHeight: 1.5, marginBottom: 10 }}>
          Upload what you know and start growing from here.
        </p>
        <p style={{ color: "#1D324E", fontSize: 13, fontWeight: 600, textAlign: "center", marginBottom: 20 }}>
          Let us know what you’re great at!
        </p>

        <button style={{
          backgroundColor: "#BDD5EA",
          border: "none",
          borderRadius: "10px",
          padding: "12px 0",
          width: "80%",
          color: "#1D324E",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}>
          Continue
        </button>
      </div>

      {/* 3. SKILLS SECTION (Gri Mediu) */}
      <div style={{
        backgroundColor: "#C6CDD9", // Culoarea containerului de skills
        margin: "0 20px 20px 20px",
        borderRadius: "15px",
        padding: "15px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <span style={{ color: "black", fontWeight: 600, fontSize: 14, marginRight: 5 }}>Skills:</span>
        {skills.map((skill, index) => (
          <div key={index} style={{
            backgroundColor: "#2B4B75", // Albastru închis
            color: "white",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: 13,
            fontWeight: 500
          }}>
            {skill}
          </div>
        ))}
      </div>

      {/* 4. FORM SECTION (Contur) */}
      <div style={{
        border: "1px solid #DCE5F2",
        margin: "0 20px",
        borderRadius: "15px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        
        {/* Input: Skill Name */}
        <input 
          type="text" 
          placeholder="Your Skill Name"
          value={form.skillName}
          onChange={(e) => setForm({...form, skillName: e.target.value})}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#D6DCE5", // Gri fundal input
            color: "#1D324E",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box"
          }}
        />

        {/* Textarea: Description */}
        <textarea 
          placeholder="Describe your Skill"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          style={{
            width: "100%",
            height: "140px",
            padding: "15px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#D6DCE5", // Gri fundal textarea
            color: "#1D324E",
            fontSize: 14,
            outline: "none",
            resize: "none",
            fontFamily: "'Inter', sans-serif",
            boxSizing: "border-box"
          }}
        />

        {/* Link Input & Attachment Button Row */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ 
            flex: 1, 
            backgroundColor: "#D6DCE5", 
            borderRadius: "8px", 
            display: "flex", 
            alignItems: "center",
            paddingRight: "15px"
          }}>
            <input 
              type="text" 
              placeholder="Link your Skill"
              value={form.link}
              onChange={(e) => setForm({...form, link: e.target.value})}
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
            {/* Send Icon inside Input */}
            <SendPlaneIcon />
          </div>

          {/* Attachment Button */}
          <div style={{
            width: 50,
            backgroundColor: "#D6DCE5",
            borderRadius: "8px",
            display: "grid",
            placeItems: "center",
            cursor: "pointer"
          }}>
            <PaperClipIcon />
          </div>
        </div>

        {/* Add Skill Button */}
        <button style={{
          width: "100%",
          backgroundColor: "#93C6E7", // Albastru deschis
          color: "#24507F",
          border: "none",
          borderRadius: "8px",
          padding: "15px 0",
          fontSize: 18,
          fontWeight: 500,
          cursor: "pointer",
          marginTop: "10px"
        }}>
          Add Your Skill
        </button>

      </div>
    </div>
  );
}