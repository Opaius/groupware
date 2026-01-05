"use client"

import React from "react";

// --- COMPONENTA LOGO ---
const BrandLogo = () => (
  <div style={{ width: 122, height: 66, position: "relative" }}>
    <img 
      src="/logo.png" 
      alt="Skill Trade Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }}
    />
  </div>
);

// --- ALTE COMPONENTE SVG (Extrase pentru curățenie) ---

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D324E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19L5 12L12 5" />
  </svg>
);

const StepsIcon = () => (
  <div style={{ width: '100%', height: 24, display: 'flex', justifyContent: 'center' }}>
    {/* Container interior cu lățime fixă pentru a ține pașii apropiați */}
    <div style={{ width: 300, position: 'relative' }}>
      
      {/* Linia de fundal */}
      <div style={{ position: 'absolute', top: 11, left: 3, right: 3, height: 1, background: '#2965B5' }} />
      
      {/* Punctele distribuite egal în interiorul containerului de 200px */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        
        {/* Step 1 */}
        <div style={{ marginTop: 0 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#2965B5"/>
          </svg>
        </div>

        {/* Step 2 */}
        <div style={{ marginTop: 0 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#2965B5"/>
          </svg>
        </div>
         

        {/* Step 4: Active Large Circle */}
        <div style={{ marginTop: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="#40C9E7"/>
            <circle cx="12" cy="12" r="6" fill="#94C6E7"/>
          </svg>
        </div>

      </div>
    </div>
  </div>
);


const PlusIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M18 4.5C18.4 4.5 18.8 4.7 19.1 4.9C19.3 5.2 19.5 5.6 19.5 6V30C19.5 30.4 19.3 30.8 19.1 31.1C18.8 31.3 18.4 31.5 18 31.5C17.6 31.5 17.2 31.3 16.9 31.1C16.7 30.8 16.5 30.4 16.5 30V6C16.5 5.6 16.7 5.2 16.9 4.9C17.2 4.7 17.6 4.5 18 4.5Z" fill="#1D324E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M31.5 18C31.5 18.4 31.3 18.8 31.1 19.1C30.8 19.3 30.4 19.5 30 19.5H6C5.6 19.5 5.2 19.3 4.9 19.1C4.7 18.8 4.5 18.4 4.5 18C4.5 17.6 4.7 17.2 4.9 16.9C5.2 16.7 5.6 16.5 6 16.5H30C30.4 16.5 30.8 16.7 31.1 16.9C31.3 17.2 31.5 17.6 31.5 18Z" fill="#1D324E"/>
  </svg>
);




// --- MAIN COMPONENT ---

export default function ProfileScreen() {
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
        paddingBottom: 40
      }}
    >
      {/* HEADER: Navigare + Logo */}
      <div style={{ padding: '20px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, position: 'relative' }}>
        <div style={{ cursor: 'pointer' }}>
          <BackArrowIcon />
        </div>
        
        {/* LOGO AICI */}
        <div style={{ transform: "scale(0.9)" }}>
            <BrandLogo />
        </div>

        {/* Meniu Hamburger (Linii) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
           <div style={{ width: 20, height: 2, background: "#333" }}></div>
           <div style={{ width: 30, height: 2, background: "#333" }}></div>
           <div style={{ width: 25, height: 2, background: "#333" }}></div>
        </div>
      </div>

      

      {/* TOP CARD: Intro & Progress */}
      <div
        style={{
          margin: "10px 25px 30px 25px",
          background: "rgba(139, 154, 183, 0.20)",
          borderRadius: 10,
          padding: "20px 17px",
          position: "relative",
          zIndex: 1
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <StepsIcon />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ color: "#1D324E", fontSize: 20, fontWeight: 700, margin: "0 0 8px 0" }}>
            Show Your Best Self
          </h2>
          <p style={{ color: "#2F2E41", fontSize: 14, fontWeight: 400, lineHeight: "1.4", margin: "0 0 12px 0" }}>
            Add a friendly, professional-looking photo to personalize your profile.
          </p>
          <p style={{ color: "#1D324E", fontSize: 14, fontWeight: 500, margin: 0 }}>
            Let us know you better!
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: 56,
            background: "rgba(148, 198, 231, 0.58)",
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: "#1D324E", fontSize: 20, fontWeight: 600 }}>View your profile</span>
        </div>
      </div>

      {/* MAIN PHOTO SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, padding: "0 25px" }}>
        <h3 style={{ color: "#1D324E", fontSize: 20, fontWeight: 600, marginBottom: 8, marginTop: 0 }}>
          Add a Main Photo
        </h3>
        <p style={{ color: "#496995", fontSize: 12, fontWeight: 400, textAlign: 'center', marginBottom: 15, maxWidth: 300 }}>
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
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}
        >
          <PlusIcon />
        </div>
      </div>

      {/* FEATURED IMAGE SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, padding: "0 25px" }}>
        <h3 style={{ color: "#1D324E", fontSize: 20, fontWeight: 600, marginBottom: 8, marginTop: 0 }}>
          Upload a Featured Image
        </h3>
        <p style={{ color: "#496995", fontSize: 12, fontWeight: 400, textAlign: 'center', marginBottom: 15, maxWidth: 300 }}>
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
            border: "1px dashed rgba(29, 50, 78, 0.2)"
          }}
        >
          <PlusIcon />
        </div>
      </div>

      {/* BIO SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "0 25px" }}>
        <h3 style={{ color: "#1D324E", fontSize: 20, fontWeight: 600, marginBottom: 8, marginTop: 0 }}>
          Add a Short Bio
        </h3>
        <p style={{ color: "#496995", fontSize: 12, fontWeight: 400, textAlign: 'center', marginBottom: 15, lineHeight: "1.5" }}>
          Tell us a bit about yourself — your background, passions, and what drives you. Write a short description of your key strengths, expertise, and experience.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 348,
            height: 127,
            background: "rgba(139, 154, 183, 0.20)",
            borderRadius: 10,
            padding: "24px",
            boxSizing: "border-box"
          }}
        >
          <textarea 
            placeholder="Your words..."
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#1D324E",
              fontSize: 14,
              fontFamily: "'Roboto', sans-serif"
            }}
          />
        </div>
      </div>

    </div>
  );
}