"use client"

import React from "react";

// Definim categoriile într-un array pentru a păstra codul curat
const categories = [
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

interface SpecializationModalProps {
  onClose?: () => void;
  onSelect?: (category: string) => void;
}

export default function SpecializationModal({
  onClose,
  onSelect,
}: SpecializationModalProps) {
  return (
    <div
      style={{
        width: 450,
        height: 790,
        position: "relative",
        background: "white",
        overflow: "hidden",
        borderRadius: 10,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", // Adăugat o mică umbră pentru profunzime
        fontFamily: "Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 23px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            lineHeight: "14.81px",
          }}
        >
          Specialization
        </div>
        <div
          onClick={onClose}
          style={{ cursor: "pointer", padding: 5 }}
          role="button"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7495 9.99712L16.3775 4.36362C16.4768 4.26384 16.5325 4.12878 16.5324 3.98801C16.5323 3.84725 16.4765 3.71226 16.377 3.61262C16.178 3.41462 15.8275 3.41362 15.6265 3.61362L10 9.24712L4.37154 3.61212C4.17154 3.41462 3.82104 3.41562 3.62204 3.61312C3.57265 3.66231 3.53355 3.72086 3.50702 3.78533C3.48049 3.8498 3.46707 3.9189 3.46754 3.98862C3.46754 4.13062 3.52254 4.26362 3.62204 4.36212L9.25004 9.99662L3.62254 15.6316C3.52323 15.7316 3.46762 15.8668 3.4679 16.0077C3.46818 16.1486 3.52434 16.2836 3.62404 16.3831C3.72054 16.4786 3.85704 16.5336 3.99804 16.5336H4.00104C4.14254 16.5331 4.27904 16.4776 4.37354 16.3811L10 10.7476L15.6285 16.3826C15.728 16.4816 15.861 16.5366 16.002 16.5366C16.0717 16.5367 16.1407 16.523 16.2051 16.4964C16.2695 16.4697 16.328 16.4307 16.3773 16.3814C16.4266 16.3321 16.4657 16.2736 16.4923 16.2092C16.5189 16.1448 16.5326 16.0758 16.5325 16.0061C16.5325 15.8646 16.4775 15.7311 16.3775 15.6326L10.7495 9.99712Z"
              fill="#707070"
            />
          </svg>
        </div>
      </div>

      {/* LIST CONTAINER */}
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
            onClick={() => onSelect && onSelect(item.label)}
            style={{
              width: "100%",
              height: 56,
              background: "rgba(82.65, 119.42, 156.19, 0.10)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
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
    </div>
  );
}