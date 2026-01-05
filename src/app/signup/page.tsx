"use client"


import React, { useState } from "react";

export default function SignUpScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accepted: false,
  });

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrează cu backend/auth
    console.log("Sign up payload:", form);
  };

  return (
    <div
      style={{
        width: 390,
        height: 844,
        position: "relative",
        background: "white",
        overflow: "hidden",
        borderRadius: 40,
        fontFamily:
          "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        margin: "0 auto", // Centrat pentru vizualizare în browser
      }}
    >
      {/* BACKGROUND SHAPE */}
      <div style={{ left: -1, top: 220, position: "absolute" }}>
        <svg
          width="390"
          height="624"
          viewBox="0 0 390 624"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-1 0H410V651H-1V0Z" fill="#DCE9FB" />
        </svg>
      </div>

      {/* HEADER TEXT */}
      <div
        style={{
          width: 339,
          left: 51,
          top: 110,
          position: "absolute",
          color: "#0C3057",
          fontSize: 26.72,
          fontWeight: 600,
          lineHeight: "30px",
          letterSpacing: 0.53,
          wordWrap: "break-word",
        }}
      >
        Create your account
      </div>

      {/* TABS (Login / Signup) */}
      <div
        style={{
          width: 128,
          height: 31,
          left: 55,
          top: 181,
          position: "absolute",
          color: "black",
          fontSize: 19.19,
          fontWeight: 600,
          wordWrap: "break-word",
          cursor: "pointer",
          opacity: 0.5, // Login e inactiv vizual aici
        }}
      >
        Login
      </div>

      {/* Active Tab Background Indicator */}
      <div
        style={{
          width: 188,
          height: 48,
          left: 393.61,
          top: 222,
          position: "absolute",
          transform: "rotate(179deg)",
          transformOrigin: "top left",
          background: "#DCE9FB",
          borderBottomRightRadius: 8.72,
        }}
      />

      <div
        style={{
          left: 252,
          top: 183,
          position: "absolute",
          color: "black",
          fontSize: 19.19,
          fontWeight: 600,
          wordWrap: "break-word",
          cursor: "pointer",
        }}
      >
        Sign Up
      </div>

      <form onSubmit={onSubmit}>
        {/* NAME INPUT */}
        <div
          style={{
            width: 50,
            height: 10.02,
            left: 51,
            top: 242,
            position: "absolute",
            color: "#6F6F6F",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "49.85px",
            letterSpacing: 0.32,
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          Name
        </div>

        <div
          style={{
            width: 288,
            height: 38.27,
            left: 51,
            top: 263.87,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            borderRadius: 10,
            outline: "0.50px #6F6F6F solid",
            outlineOffset: "-0.50px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
          }}
        >
          <input
            value={form.name}
            onChange={onChange("name")}
            placeholder="ex: jon smith"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 400,
              color: "#0C3057",
            }}
          />
        </div>

        {/* EMAIL INPUT */}
        <div
          style={{
            width: 45,
            height: 10.02,
            left: 51,
            top: 317.62,
            position: "absolute",
            color: "#6F6F6F",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "49.85px",
            letterSpacing: 0.32,
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          Email
        </div>

        <div
          style={{
            width: 288,
            height: 38.27,
            left: 51,
            top: 339.49,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            borderRadius: 10,
            outline: "0.50px #6F6F6F solid",
            outlineOffset: "-0.50px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
          }}
        >
          <input
            type="email"
            value={form.email}
            onChange={onChange("email")}
            placeholder="ex: jon.smith@email.com"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 400,
              color: "#0C3057",
            }}
          />
        </div>

        {/* PASSWORD INPUT */}
        <div
          style={{
            width: 80,
            height: 10.02,
            left: 51,
            top: 393.24,
            position: "absolute",
            color: "#6F6F6F",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "49.85px",
            letterSpacing: 0.32,
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          Password
        </div>

        <div
          style={{
            width: 288,
            height: 38.27,
            left: 51,
            top: 415.11,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            borderRadius: 10,
            outline: "0.50px #6F6F6F solid",
            outlineOffset: "-0.50px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
          }}
        >
          <input
            type="password"
            value={form.password}
            onChange={onChange("password")}
            placeholder="*********"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 400,
              color: "#0C3057",
            }}
          />
        </div>

        {/* CONFIRM PASSWORD INPUT */}
        <div
          style={{
            width: 153,
            height: 10.02,
            left: 51,
            top: 468.87,
            position: "absolute",
            color: "#6F6F6F",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "49.85px",
            letterSpacing: 0.32,
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          Confirm password
        </div>

        <div
          style={{
            width: 288,
            height: 38.27,
            left: 51,
            top: 490.73,
            position: "absolute",
            background: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            borderRadius: 10,
            outline: "0.50px #6F6F6F solid",
            outlineOffset: "-0.50px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
          }}
        >
          <input
            type="password"
            value={form.confirmPassword}
            onChange={onChange("confirmPassword")}
            placeholder="*********"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 400,
              color: "#0C3057",
            }}
          />
        </div>

        {/* TERMS & POLICY */}
        <label
          style={{
            left: 53,
            top: 548,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            fontWeight: 400,
            userSelect: "none",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.accepted}
            onChange={onChange("accepted")}
            style={{ width: 16, height: 16, accentColor: "#0C3057" }}
          />
          <div>
            <span style={{ color: "black" }}>I understood the </span>
            <a href="#" style={{ color: "#0C3057", textDecoration: "none" }}>
              Terms & Policy
            </a>
            <span style={{ color: "black" }}>.</span>
          </div>
        </label>

        {/* SIGN UP BUTTON */}
        <button
          type="submit"
          style={{
            width: 288,
            height: 46,
            left: 53,
            top: 580,
            position: "absolute",
            background: "#6085B9",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            borderRadius: 10,
            outline: "0.50px #6F6F6F solid",
            outlineOffset: "-0.50px",
            border: "none",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.32,
            }}
          >
            Sign up
          </div>
        </button>
      </form>

      {/* OR DIVIDER */}
      <div
        style={{
          width: "100%",
          top: 646,
          position: "absolute",
          textAlign: "center",
          color: "#888888",
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: 0.32,
        }}
      >
        or sign up with
      </div>

      {/* GOOGLE BUTTON */}
      <div
        style={{
          width: 86,
          height: 42,
          left: 85,
          top: 678,
          position: "absolute",
          background: "white",
          overflow: "hidden",
          borderRadius: 10,
          outline: "0.50px black solid",
          outlineOffset: "-0.50px",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
        role="button"
        tabIndex={0}
        aria-label="Sign up with Google"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </div>

      {/* FACEBOOK BUTTON (Adăugat pentru simetrie, opțional) */}
      <div
        style={{
          width: 86,
          height: 42,
          left: 219, // Poziționat simetric față de Google (390 - 85 - 86 = 219)
          top: 678,
          position: "absolute",
          background: "white",
          overflow: "hidden",
          borderRadius: 10,
          outline: "0.50px black solid",
          outlineOffset: "-0.50px",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
        role="button"
        tabIndex={0}
        aria-label="Sign up with Facebook"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 12.06C22 6.53 17.5 2.04 12 2.04S2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06Z"
            fill="#1877F2"
          />
        </svg>
      </div>
    </div>
  );
}