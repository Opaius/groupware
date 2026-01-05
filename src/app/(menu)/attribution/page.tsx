"use client" 
import React, { useState } from "react";


const BrandLogo = () => (
  // Dimensiuni ajustate pentru a se potrivi în antet
  <div style={{ width: 100, height: 54, position: 'relative' }}>
    <img
      src="logo.png" // Sursa imaginii furnizate
      alt="Skill Trade Logo"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </div>
);



const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1D324E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19L5 12L12 5" />
  </svg>
);

const LinkIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 22 18"
    fill="none"
    style={{ opacity: 0.7 }}
  >
    <path
      d="M1.58 16.88L21.27 9.40C21.48 9.32 21.65 9.19 21.77 9.03C21.89 8.87 21.96 8.68 21.96 8.48C21.96 8.28 21.89 8.09 21.77 7.93C21.65 7.76 21.48 7.64 21.27 7.56L1.58 0.08C1.41 0.01 1.22 -0.01 1.03 0.00C0.85 0.01 0.67 0.07 0.51 0.16C0.36 0.25 0.23 0.37 0.14 0.52C0.05 0.66 0.01 0.82 0.01 0.99L0 5.60C0 6.10 0.41 6.53 0.98 6.59L16.93 8.48L0.98 10.36C0.41 10.43 0 10.86 0 11.36L0.01 15.97C0.01 16.68 0.83 17.17 1.58 16.88Z"
      fill="#496995"
    />
  </svg>
);




// --- MAIN COMPONENT ---

export default function AddSkillScreen() {
  const [form, setForm] = useState({
    skillName: "",
    description: "",
    link: "",
  });
  
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        minHeight: 844,
        position: "relative",
        background: "white",
        overflow: "hidden",
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        display: "flex",          // 1. Ne asigurăm că containerul principal este flex
        flexDirection: "column",  // 2. Elementele curg de sus în jos
        paddingBottom: 40         // 3. Puțin spațiu jos de tot
      }}
    >
      {/* ... (HEADER, ILLUSTRATION, TOP CARD, EXISTING SKILLS - rămân la fel) ... */}
      
      {/* ... (FORMULARUL DE INPUT - skill name, description, link) ... */}

      {/* --- AICI ESTE BUTONUL TĂU, POZIȚIONAT JOS --- */}
      <div
        data-property-1="Default"
        // onClick={handleAddSkill} // Poți decomenta asta pentru a-l face funcțional
        style={{
          width: 302,
          height: 48,
          background: '#93C6E7',
          borderRadius: 10,
          display: 'flex',           // Folosim flex pentru a centra textul în buton
          justifyContent: 'center',  // Centrare orizontală
          alignItems: 'center',      // Centrare verticală
          cursor: 'pointer',
          
          // Magia pentru poziționare jos:
          marginTop: 'auto',         // Împinge butonul la baza paginii
          alignSelf: 'center',       // Centrează butonul pe orizontală în pagină
          marginBottom: 20           // Puțin spațiu sub buton
        }}
      >
        <span
          style={{
            color: '#24507F',
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: '400',
            wordWrap: 'break-word'
          }}
        >
          Add Your Skill
        </span>
      </div>

    </div>
  );
}

  const [existingSkills, setExistingSkills] = useState([
    "Figma",
    "Wireframing",
    "User Flows",
    "UX Research",
  ]);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (form.skillName) {
      setExistingSkills([...existingSkills, form.skillName]);
      setForm({ skillName: "", description: "", link: "" });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        minHeight: 844,
        position: "relative",
        background: "white",
        overflow: "hidden",
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER: Back Button */}
      <div
        style={{
          position: "absolute",
          left: 25,
          top: 40,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <BackArrowIcon />
      </div>

      {/* HEADER: Centered Logo (ADĂUGAT) */}
      <div
        style={{
            position: "absolute",
            top: 30, // Ajustat pentru aliniere verticală cu săgeata
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
        }}
      >
        <BrandLogo />
      </div>

      

      {/* TOP CARD: Intro & Progress */}
      <div
        style={{
          width: 348,
          height: 316,
          left: 21,
          top: 79,
          position: "absolute",
          background: "rgba(139, 154, 183, 0.20)",
          overflow: "hidden",
          borderRadius: 10,
          zIndex: 1,
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            width: 315,
            height: 24,
            left: 17,
            top: 36,
            position: "absolute",
          }}
        >
          {/* Gray Line */}
          <div
            style={{
              width: 298,
              height: 1,
              left: 12,
              top: 11,
              position: "absolute",
              background: "#E0E0E0",
            }}
          />
          {/* Blue Active Line (Partial) */}
          <div
            style={{
              width: 140,
              height: 1,
              left: 12,
              top: 11,
              position: "absolute",
              background: "#2965B5",
            }}
          />

          {/* Step 1: Done */}
          <div style={{ left: 5, top: 7, position: "absolute" }}>
            <svg width="10" height="10">
              <circle cx="5" cy="5" r="5" fill="#2965B5" />
            </svg>
          </div>

          {/* Step 2: Active (Large Circle) */}
          <div style={{ left: 149, top: 0, position: "absolute" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" fill="#40C9E7" />
              <circle cx="12" cy="12" r="6" fill="#94C6E7" />
            </svg>
          </div>

          {/* Step 3: Pending */}
          <div style={{ left: 290, top: 7, position: "absolute" }}>
            <svg width="10" height="10">
              <circle cx="5" cy="5" r="4.5" fill="white" stroke="#2965B5" />
            </svg>
          </div>
        </div>

        <div
          style={{
            left: 55,
            top: 86,
            position: "absolute",
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Bring Your Skills to Life
        </div>
        <div
          style={{
            width: 303,
            left: 23,
            top: 134,
            position: "absolute",
            textAlign: "center",
            color: "#2F2E41",
            fontSize: 14,
            fontWeight: 400,
          }}
        >
          Upload what you know and start growing from here.
        </div>
        <div
          style={{
            left: 63,
            top: 192,
            position: "absolute",
            color: "#1D324E",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Let us know what you’re great at!
        </div>

        {/* Continue Button (Top Card) */}
        <div
          style={{
            width: 256,
            height: 56,
            left: 46,
            top: 235,
            position: "absolute",
            background: "rgba(148, 198, 231, 0.58)",
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ color: "#1D324E", fontSize: 20, fontWeight: 600 }}>
            Continue
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Existing Skills */}
      <div
        style={{
          width: 348,
          minHeight: 80,
          left: 21,
          top: 419,
          position: "absolute",
          background: "rgba(139, 154, 183, 0.55)",
          borderRadius: 10,
          padding: "13px 12px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            color: "#050315",
            fontSize: 16,
            fontWeight: 500,
            marginRight: 5,
          }}
        >
          Skills:
        </span>

        {existingSkills.map((skill, index) => (
          <div
            key={index}
            style={{
              background: "#24507F",
              borderRadius: 10,
              padding: "4px 12px",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
            }}
          >
            {skill}
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: Add Skill Form */}
      <div
        style={{
          width: 348,
          height: 448,
          left: 21,
          top: 522,
          position: "absolute",
          background: "white",
          borderRadius: 10,
          outline: "1px solid rgba(147, 198, 231, 0.35)",
          padding: 23,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        {/* Input: Skill Name */}
        <div
          style={{
            width: "100%",
            height: 48,
            background: "rgba(139, 154, 183, 0.45)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            placeholder="Your Skill Name"
            value={form.skillName}
            onChange={(e) => handleInputChange("skillName", e.target.value)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#1D324E",
              fontSize: 14,
            }}
          />
        </div>

        {/* Textarea: Description */}
        <div
          style={{
            width: "100%",
            height: 169,
            background: "rgba(139, 154, 183, 0.45)",
            borderRadius: 10,
            padding: "12px 15px",
            boxSizing: "border-box",
          }}
        >
          <textarea
            placeholder="Describe your Skill"
            value={form.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#1D324E",
              fontSize: 14,
              resize: "none",
              fontFamily: "Inter",
            }}
          />
        </div>

        {/* Input: Link */}
        <div
          style={{
            width: "100%",
            height: 48,
            background: "rgba(139, 154, 183, 0.45)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="Link your Skill"
            value={form.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#1D324E",
              fontSize: 14,
            }}
          />
          <div style={{ position: "absolute", right: 15, cursor: "pointer" }}>
            <LinkIcon />
          </div>
        </div>

        {/* Button: Add Skill */}
        <div
          onClick={handleAddSkill}
          style={{
            width: "100%",
            height: 48,
            background: "#93C6E7",
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginTop: "auto",
          }}
        >
          <span style={{ color: "#24507F", fontSize: 18, fontWeight: 600 }}>
            Add Your Skill
          </span>
        </div>
      </div>
    </div>
  );
}