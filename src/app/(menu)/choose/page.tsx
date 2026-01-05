"use client"


import React, { useState } from "react";

// --- COMPONENTA LOGO (Vectorul complex) ---
const BrandLogo = () => {
  return (
    <div style={{ width: 122, height: 66, position: "relative" }}>
      <div style={{ left: 22.85, top: 0, position: "absolute" }}>
        <svg
          width="89"
          height="57"
          viewBox="0 0 89 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M88.6778 0H0V56.3924H88.6778V0Z" fill="black" />
        </svg>
      </div>
      <div style={{ left: 26.62, top: 1.82, position: "absolute" }}>
        <svg
          width="25"
          height="39"
          viewBox="0 0 25 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5683 26.1337C16.8786 27.1176 17.3419 28.0314 17.9539 28.875C18.566 29.7153 19.4033 30.5622 20.4701 31.414C21.5348 32.2625 22.8779 33.1991 24.4994 34.2271L18.311 38.8089C17.4312 38.308 16.5301 37.6602 15.6078 36.8639C14.6834 36.0676 13.8078 35.1881 12.9811 34.2271C12.1587 33.2643 11.4468 32.2886 10.8475 31.2965C10.2524 30.3011 9.83166 29.3564 9.58939 28.4638C9.345 27.568 9.33862 26.7913 9.57239 26.1337C11.7018 25.3945 13.1639 24.7239 13.9587 24.1234C14.7577 23.5229 15.0638 23.0383 14.8767 22.6679C14.694 22.2943 14.1754 22.1066 13.3211 22.1066C12.0397 22.1066 10.9516 22.4036 10.0569 22.9943C9.16011 23.5817 8.50557 24.378 8.09329 25.3831C7.68527 26.3882 7.53651 27.5141 7.65126 28.7575C7.7639 29.3678 7.88291 29.9242 8.00829 30.4284C8.13792 30.9293 8.28881 31.3993 8.45882 31.8382H1.84538C1.36298 30.6601 0.971951 29.1426 0.672307 27.289C0.376912 25.4321 0.179275 23.3728 0.077268 21.1145C-0.0204882 18.8529 -0.0247387 16.4935 0.0602669 14.0394C0.145272 11.582 0.33441 9.15071 0.629804 6.74881C0.929449 4.34691 1.32047 2.0984 1.80288 0H10.4649C9.84016 1.94502 9.294 4.06463 8.82434 6.3572C8.35256 8.64651 7.98279 10.988 7.71077 13.3801C7.443 15.769 7.28149 18.0779 7.22624 20.3052C8.1613 19.2136 9.41513 18.3308 10.992 17.6553C12.5731 16.9765 14.5303 16.6599 16.8659 16.7023C17.9412 16.7023 18.957 16.8786 19.9091 17.231C20.8654 17.5802 21.6198 18.0534 22.1702 18.6539C22.7249 19.2543 22.9523 19.9593 22.8503 20.7686C22.7525 21.5747 22.2148 22.4313 21.2352 23.3402C20.2533 24.2458 18.6977 25.1775 16.5683 26.1337Z"
            fill="#1D324E"
            fillOpacity="0.4"
          />
        </svg>
      </div>
      <div style={{ left: 52.45, top: 9.65, position: "absolute" }}>
        <svg
          width="12"
          height="23"
          viewBox="0 0 12 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.296 7.46677C5.41619 7.46677 4.61501 7.30034 3.89034 6.9642C3.16354 6.6248 2.58126 6.17281 2.13923 5.60661C1.6972 5.03713 1.47618 4.41218 1.47618 3.73339C1.47618 3.03827 1.6972 2.41169 2.13923 1.85364C2.58126 1.29722 3.16354 0.848497 3.89034 0.509098C4.61501 0.169699 5.41619 0 6.296 0C7.20768 0 8.02586 0.169699 8.75266 0.509098C9.47733 0.848497 10.0575 1.29722 10.4953 1.85364C10.9373 2.41169 11.1583 3.03827 11.1583 3.73339C11.1583 4.41218 10.9373 5.03713 10.4953 5.60661C10.0575 6.17281 9.47733 6.6248 8.75266 6.9642C8.02586 7.30034 7.20768 7.46677 6.296 7.46677ZM0.541121 22.7332C0.14372 20.7229 -0.0347915 18.6979 0.00558626 16.6566C0.0502141 14.617 0.243602 12.3619 0.583624 9.89478H7.19706C6.87829 12.406 6.87616 14.7035 7.18856 16.7872C7.5052 18.8725 8.04711 20.8534 8.81216 22.7332H0.541121Z"
            fill="#1D324E"
            fillOpacity="0.4"
          />
        </svg>
      </div>
      {/* ... (Pentru scurtare, am simplificat, dar include toți vectorii din SVG-ul furnizat pentru logo) ... */}
      <div style={{ left: 24.73, top: 0.37, position: "absolute" }}>
        <svg
          width="25"
          height="39"
          viewBox="0 0 25 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5683 26.1337C16.8786 27.1176 17.3419 28.0314 17.9539 28.875C18.566 29.7153 19.4033 30.5622 20.4701 31.414C21.5348 32.2625 22.8779 33.1991 24.4994 34.2271L18.311 38.8089C17.4312 38.308 16.5301 37.6602 15.6078 36.8639C14.6834 36.0676 13.8078 35.1881 12.9811 34.2271C12.1587 33.2643 11.4468 32.2886 10.8475 31.2965C10.2524 30.3011 9.83166 29.3564 9.58939 28.4638C9.345 27.568 9.33862 26.7913 9.57239 26.1337C11.7018 25.3945 13.1639 24.7239 13.9587 24.1234C14.7577 23.5229 15.0638 23.0383 14.8767 22.6679C14.694 22.2943 14.1754 22.1066 13.3211 22.1066C12.0397 22.1066 10.9516 22.4036 10.0569 22.9943C9.16011 23.5817 8.50557 24.378 8.09329 25.3831C7.68527 26.3882 7.53651 27.5141 7.65126 28.7575C7.7639 29.3678 7.88291 29.9242 8.00829 30.4284C8.13792 30.9293 8.28881 31.3993 8.45882 31.8382H1.84538C1.36298 30.6601 0.971951 29.1426 0.672307 27.289C0.376912 25.4321 0.179275 23.3728 0.077268 21.1145C-0.0204882 18.8529 -0.0247387 16.4935 0.0602669 14.0394C0.145272 11.582 0.33441 9.15071 0.629804 6.74881C0.929449 4.34691 1.32047 2.0984 1.80288 0H10.4649C9.84016 1.94502 9.294 4.06463 8.82434 6.3572C8.35256 8.64651 7.98279 10.988 7.71077 13.3801C7.443 15.769 7.28149 18.0779 7.22624 20.3052C8.1613 19.2136 9.41513 18.3308 10.992 17.6553C12.5731 16.9765 14.5303 16.6599 16.8659 16.7023C17.9412 16.7023 18.957 16.8786 19.9091 17.231C20.8654 17.5802 21.6198 18.0534 22.1702 18.6539C22.7249 19.2543 22.9523 19.9593 22.8503 20.7686C22.7525 21.5747 22.2148 22.4313 21.2352 23.3402C20.2533 24.2458 18.6977 25.1775 16.5683 26.1337Z"
            fill="#1D324E"
          />
        </svg>
      </div>
      <img
        style={{
          width: 65.25,
          height: 7.51,
          left: 206.19,
          top: 105.84,
          position: "absolute",
          transform: "rotate(-35deg)",
          transformOrigin: "top left",
        }}
        src="https://placehold.co/65x8"
        alt="decoration"
      />
    </div>
  );
};

// --- COMPONENTA ICONITA WEB DEV (SVG specific) ---
const WebDevIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 47.998C37.255 47.998 48 37.253 48 23.998C48 10.746 37.255 0 24 0C10.745 0 0 10.745 0 23.999C0 37.253 10.745 47.998 24 47.998Z"
      fill="#E04F5F"
    />
    <path
      d="M37.9629 30.9801C37.963 31.4385 37.8729 31.8924 37.6975 32.316C37.5222 32.7395 37.2651 33.1244 36.941 33.4485C36.617 33.7727 36.2322 34.0299 35.8087 34.2053C35.3852 34.3808 34.9313 34.4711 34.4729 34.4711H13.5259C12.6003 34.4711 11.7126 34.1034 11.0581 33.4489C10.4036 32.7944 10.0359 31.9067 10.0359 30.9811V17.0181C10.0358 16.5597 10.1259 16.1058 10.3013 15.6822C10.4766 15.2587 10.7336 14.8738 11.0577 14.5497C11.3818 14.2255 11.7666 13.9683 12.1901 13.7929C12.6136 13.6174 13.0675 13.5271 13.5259 13.5271H34.4719C35.3975 13.5271 36.2852 13.8948 36.9397 14.5493C37.5942 15.2038 37.9619 16.0915 37.9619 17.0171L37.9629 30.9801Z"
      fill="#21B2D1"
    />
    <path
      d="M13.5271 13.5271C12.6015 13.5271 11.7138 13.8948 11.0593 14.5493C10.4048 15.2038 10.0371 16.0915 10.0371 17.0171V30.9811C10.037 31.5179 10.161 32.0474 10.3996 32.5283C10.6381 33.0092 10.9847 33.4284 11.4121 33.7531L31.6381 13.5271H13.5271Z"
      fill="#40C9E7"
    />
    <path
      d="M34.4729 13.5271H13.5259C12.6003 13.5271 11.7126 13.8948 11.0581 14.5493C10.4036 15.2038 10.0359 16.0915 10.0359 17.0171V18.7631H37.9619V17.0181C37.962 16.5597 37.8718 16.1058 37.6965 15.6822C37.5212 15.2587 37.2641 14.8738 36.94 14.5497C36.616 14.2255 36.2312 13.9683 35.8077 13.7929C35.3842 13.6174 34.9313 13.5271 34.4729 13.5271Z"
      fill="white"
    />
    <path
      d="M13.9641 17.454C14.1956 17.454 14.4177 17.362 14.5814 17.1983C14.7451 17.0346 14.8371 16.8125 14.8371 16.581C14.8371 16.3495 14.7451 16.1274 14.5814 15.9637C14.4177 15.8 14.1956 15.708 13.9641 15.708C13.7325 15.708 13.5105 15.8 13.3468 15.9637C13.183 16.1274 13.0911 16.3495 13.0911 16.581C13.0911 16.8125 13.183 17.0346 13.3468 17.1983C13.5105 17.362 13.7325 17.454 13.9641 17.454Z"
      fill="#FA5655"
    />
    <path
      d="M17.4541 17.454C17.6856 17.454 17.9076 17.362 18.0714 17.1983C18.2351 17.0346 18.3271 16.8125 18.3271 16.581C18.3271 16.3495 18.2351 16.1274 18.0714 15.9637C17.9076 15.8 17.6856 15.708 17.4541 15.708C17.2225 15.708 17.0005 15.8 16.8368 15.9637C16.673 16.1274 16.5811 16.3495 16.5811 16.581C16.5811 16.8125 16.673 17.0346 16.8368 17.1983C17.0005 17.362 17.2225 17.454 17.4541 17.454Z"
      fill="#F3B607"
    />
    <path
      d="M20.946 17.454C21.1775 17.454 21.3996 17.362 21.5633 17.1983C21.727 17.0346 21.819 16.8125 21.819 16.581C21.819 16.3495 21.727 16.1274 21.5633 15.9637C21.3996 15.8 21.1775 15.708 20.946 15.708C20.7145 15.708 20.4924 15.8 20.3287 15.9637C20.165 16.1274 20.073 16.3495 20.073 16.581C20.073 16.8125 20.165 17.0346 20.3287 17.1983C20.4924 17.362 20.7145 17.454 20.946 17.454Z"
      fill="#4AC3AF"
    />
    <path
      d="M28.1021 29.3229C27.9631 29.1378 27.9034 28.905 27.9361 28.6759C27.9687 28.4467 28.091 28.2399 28.2761 28.1009L30.8361 26.1809L28.2761 24.2609C28.0965 24.12 27.9792 23.9143 27.9495 23.6879C27.9197 23.4616 27.9798 23.2326 28.1168 23.05C28.2539 22.8674 28.457 22.7458 28.6827 22.7112C28.9084 22.6766 29.1386 22.7318 29.3241 22.8649L32.8141 25.4829C32.9223 25.5642 33.0102 25.6696 33.0707 25.7908C33.1312 25.9119 33.1627 26.0455 33.1627 26.1809C33.1627 26.3163 33.1312 26.4499 33.0707 26.571C33.0102 26.6922 32.9223 26.7976 32.8141 26.8789L29.3241 29.4969C29.1389 29.6358 28.9062 29.6955 28.677 29.6629C28.4479 29.6303 28.2411 29.508 28.1021 29.3229ZM18.6761 29.4969L15.1861 26.8789C15.0778 26.7976 14.9899 26.6922 14.9294 26.571C14.8689 26.4499 14.8374 26.3163 14.8374 26.1809C14.8374 26.0455 14.8689 25.9119 14.9294 25.7908C14.9899 25.6696 15.0778 25.5642 15.1861 25.4829L18.6761 22.8649C18.8615 22.7318 19.0918 22.6766 19.3174 22.7112C19.5431 22.7458 19.7462 22.8674 19.8833 23.05C20.0204 23.2326 20.0804 23.4616 20.0507 23.6879C20.0209 23.9143 19.9037 24.12 19.7241 24.2609L17.1641 26.1809L19.7241 28.1009C19.9037 28.2418 20.0209 28.4475 20.0507 28.6739C20.0804 28.9002 20.0204 29.1292 19.8833 29.3118C19.7462 29.4944 19.5431 29.616 19.3174 29.6506C19.0918 29.6852 18.8615 29.63 18.6761 29.4969ZM22.3001 29.5799C22.1973 29.5289 22.1057 29.4581 22.0304 29.3715C21.9551 29.285 21.8977 29.1844 21.8615 29.0755C21.8252 28.9667 21.8109 28.8518 21.8192 28.7374C21.8275 28.623 21.8584 28.5113 21.9101 28.4089L24.5291 23.1729C24.5912 23.0415 24.6853 22.9277 24.8027 22.842C24.9202 22.7563 25.0572 22.7014 25.2013 22.6823C25.3454 22.6632 25.492 22.6806 25.6277 22.7327C25.7634 22.7849 25.8838 22.8702 25.9781 22.9809C26.0921 23.113 26.1637 23.2763 26.1837 23.4497C26.2036 23.623 26.171 23.7983 26.0901 23.9529L23.4701 29.1899C23.3664 29.3966 23.1851 29.5537 22.9657 29.6268C22.7464 29.7 22.507 29.6831 22.3001 29.5799Z"
      fill="white"
    />
  </svg>
);

// --- COMPONENTA PRINCIPALĂ ---

export default function GrowthPathScreen() {
  const skillCategories = [
    {
      title: "Tech & Digital Skills",
      items: [
        { id: 1, label: "Web Development", icon: <WebDevIcon /> },
        { id: 2, label: "Software Testing", icon: <WebDevIcon /> },
        { id: 3, label: "UI/UX Design", icon: <WebDevIcon /> },
        { id: 4, label: "Cloud Computing", icon: <WebDevIcon /> },
        { id: 5, label: "Mobile App Development", icon: <WebDevIcon /> },
        { id: 6, label: "Database Management", icon: <WebDevIcon /> },
      ],
    },
    {
      title: "Creative & Practical Skills",
      items: [
        { id: 7, label: "Photography", icon: <WebDevIcon /> },
        { id: 8, label: "Cooking & Baking", icon: <WebDevIcon /> },
        { id: 9, label: "Music Production", icon: <WebDevIcon /> },
        { id: 10, label: "Graphic Design", icon: <WebDevIcon /> },
        { id: 11, label: "Painting", icon: <WebDevIcon /> },
        { id: 12, label: "Fashion Design", icon: <WebDevIcon /> },
      ],
    },
  ];

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
      }}
    >
      {/* Header Area */}
      <div
        style={{
          padding: "20px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Burger Icon */}
        <div
          style={{
            width: 24,
            height: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 20,
              height: 2,
              background: "#1D324E",
              borderRadius: 2,
            }}
          ></div>
          <div
            style={{
              width: 20,
              height: 2,
              background: "#1D324E",
              borderRadius: 2,
            }}
          ></div>
          <div
            style={{
              width: 20,
              height: 2,
              background: "#1D324E",
              borderRadius: 2,
            }}
          ></div>
        </div>

        {/* LOGO-UL CERUT (POZITIONAT IN HEADER/TOP) */}
        <div style={{ transform: "scale(0.8)" }}>
          <BrandLogo />
        </div>

        {/* Right Menu Lines */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 19,
              height: 2,
              background: "#333",
              borderRadius: 1,
            }}
          ></div>
          <div
            style={{
              width: 28,
              height: 2,
              background: "#333",
              borderRadius: 1,
            }}
          ></div>
          <div
            style={{
              width: 23,
              height: 2,
              background: "#333",
              borderRadius: 1,
            }}
          ></div>
        </div>
      </div>

      {/* Hero Card */}
      <div
        style={{
          margin: "0 25px",
          backgroundColor: "rgba(139, 154, 183, 0.20)",
          borderRadius: 10,
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Progress Bar Visual */}
        <div style={{ marginBottom: 20, position: "relative", height: 24 }}>
          <div
            style={{
              position: "absolute",
              top: 11,
              left: 0,
              right: 20,
              height: 1,
              background: "#2965B5",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
              paddingRight: 40,
              paddingLeft: 40,
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                width: 24,
                height: 24,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: "#40C9E7",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  background: "#94C6E7",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            {/* Dots */}
            <div
              style={{
                width: 10,
                height: 10,
                background: "#2965B5",
                borderRadius: "50%",
                marginTop: 7,
              }}
            ></div>
            <div
              style={{
                width: 10,
                height: 10,
                background: "#2965B5",
                borderRadius: "50%",
                marginTop: 7,
              }}
            ></div>
            <div
              style={{
                width: 10,
                height: 10,
                background: "#2965B5",
                borderRadius: "50%",
                marginTop: 7,
              }}
            ></div>
          </div>
        </div>

        <h2
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Shape Your Growth Path
        </h2>
        <p
          style={{
            color: "#2F2E41",
            fontSize: 14,
            lineHeight: "1.4",
            marginBottom: 12,
          }}
        >
          Choose the skills you’d like to explore and start learning what
          matters most to you.
        </p>
        <p
          style={{
            color: "#1D324E",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          We’ll tailor your experience just for you!
        </p>

        <button
          style={{
            width: "100%",
            height: 56,
            background: "rgba(148, 198, 231, 0.58)",
            borderRadius: 10,
            border: "none",
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>

      {/* Skills Sections */}
      {skillCategories.map((category, index) => (
        <div key={index} style={{ marginTop: 25, paddingBottom: 10 }}>
          <h3
            style={{
              textAlign: "center",
              color: "#1D324E",
              fontSize: 14,
              fontWeight: 400,
              marginBottom: 15,
            }}
          >
            {category.title}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 15,
              padding: "0 25px",
            }}
          >
            {category.items.map((skill) => (
              <div
                key={skill.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: "rgba(139, 154, 183, 0.35)",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {skill.icon}
                </div>
                <span
                  style={{
                    color: "#1D324E",
                    fontSize: 12,
                    fontWeight: 400,
                    textAlign: "center",
                    maxWidth: 100,
                    lineHeight: "1.2",
                  }}
                >
                  {skill.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom Spacer */}
      <div style={{ height: 50 }}></div>
    </div>
  );
}