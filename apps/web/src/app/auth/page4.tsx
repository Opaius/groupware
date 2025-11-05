"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const activeBackground = "#DCE9FB"; // culoarea fundalului activ

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        borderRadius: "40px",
        background: "#FFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "40px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Titlu cu gradient */}
      <h1
  style={{
    width: isLogin ? "auto" : "339px", // schimbă lățimea la Sign Up
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    fontSize: isLogin ? "26.163px" : "26.716px",
    fontWeight: isLogin ? 700 : 600,
    lineHeight: isLogin ? "148.687%" : "30px",
    letterSpacing: isLogin ? "0.785px" : "0.534px",
    background: "linear-gradient(180deg, #0C3057 0%, #31649A 60.1%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
  }}
>
  {isLogin ? "Welcome to Skill Trade" : "Create your account"}
</h1>


{isLogin ? (
  <p
    style={{
      width: "277.326px",
      color: "#000",
      textAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "15.698px",
      fontWeight: 400,
      lineHeight: "normal",
      marginBottom: "20px",
    }}
  >
    Login or Sign up to access your account
  </p>
) : (
  <div style={{ width: "277.326px", height: "20px", marginBottom: "20px" }} />
)}

      {/* Container pentru butoane Login/SignUp */}
      <div style={{ display: "flex", width: "100%" }}>
        <button
          onClick={() => setIsLogin(true)}
          style={{
            width: "50%",
            height: "48px",
            borderRadius: "0 8.721px 0 0",
            background: isLogin ? activeBackground : "#FFF",
            color: "#000",
            fontFamily: "Poppins, sans-serif",
            fontSize: "19.186px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={() => setIsLogin(false)}
          style={{
            width: "50%",
            height: "48px",
            borderRadius: "8.721px 0 0 0",
            background: !isLogin ? activeBackground : "#FFF",
            color: "#000",
            fontFamily: "Poppins, sans-serif",
            fontSize: "19.186px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Containerul formularului, ocupă tot restul */}
      <div
        style={{
          width: "100%",
          flex: 1,
          background: activeBackground,
          borderRadius: "0 0 40px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          marginTop: "0",
        }}
      >

        
        {isLogin ? (
          <>
           {/* Label Email Address */}
<div
  style={{
    width: "121px",
    height: "18.729px",
    color: "#000",
    textAlign: "center",
    fontFamily: "Work Sans, sans-serif",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    opacity: 0.5,
    marginBottom: "5px",
  }}
>
  
</div>

{/* Input Email Address */}
<input
  type="email"
  placeholder="Email Address"
  style={{
    width: "322.674px",
    height: "49px",
    borderRadius: "8.721px",
    border: "0.5px solid #6F6F6F",
    background: "#FFF",
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
    marginBottom: "10px",
    padding: "10px",
    fontSize: "1rem",
  }}
/>
   <div style={{ position: "relative", width: "322.674px", height: "51.558px", margin: "10px 0" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "8.721px",
      border: "0.5px solid #323232",
      background: "#FFF",        // fundal alb fix
      padding: "10px",
      fontFamily: "Work Sans, sans-serif",
      fontSize: "15px",
      color: "#000",
      boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      boxSizing: "border-box",
    }}
  />

  
  {/* Buton hide/show */}
  <div
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "21.802px",
      height: "14.322px",
      cursor: "pointer",
    }}
    dangerouslySetInnerHTML={{
      __html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
<path opacity="0.3" d="M10.9014 0.25C14.0035 0.250051 16.8198 1.41018 19.0527 3.61035C20.313 4.8521 21.0522 6.09177 21.3535 6.65723L21.5117 6.97363C21.5385 7.03298 21.5527 7.09743 21.5527 7.16211C21.5527 7.22661 21.5384 7.29042 21.5117 7.34961V7.35059C21.484 7.41205 20.7297 9.0595 19.0527 10.7119C16.8198 12.9112 14.0035 14.0712 10.9014 14.0713C7.7992 14.0713 4.98299 12.9112 2.75 10.7119C1.07431 9.0608 0.319851 7.41456 0.291016 7.35059V7.34961C0.264293 7.29038 0.250051 7.22666 0.25 7.16211C0.25 7.09743 0.264238 7.03298 0.291016 6.97363L0.293945 6.9668C0.293966 6.96677 0.296652 6.9596 0.303711 6.94434C0.310599 6.92945 0.320118 6.90834 0.333008 6.88184C0.358871 6.82867 0.397139 6.75336 0.447266 6.65918C0.547553 6.47077 0.697211 6.20736 0.898438 5.89355C1.3013 5.2653 1.91064 4.4374 2.75 3.61035C4.98296 1.41026 7.79927 0.25 10.9014 0.25ZM12.3857 3.62109C11.6768 3.33186 10.8969 3.25689 10.1445 3.4043C9.39187 3.55182 8.69963 3.91576 8.15625 4.45117C7.61287 4.98661 7.24193 5.66938 7.0918 6.41309C6.94173 7.15676 7.0191 7.92765 7.31348 8.62793C7.60788 9.32826 8.1065 9.92623 8.74512 10.3467C9.38366 10.767 10.1341 10.9912 10.9014 10.9912C11.9301 10.9912 12.9179 10.589 13.6465 9.87109C14.3752 9.15311 14.7851 8.17812 14.7852 7.16113C14.7852 6.40277 14.557 5.66122 14.1299 5.03125C13.7027 4.4013 13.095 3.91056 12.3857 3.62109Z" fill="black" stroke="#323232" stroke-width="0.5"/>
</svg>`,
    }}
  />
</div>


<div style={{ width: "323px", margin: "20px auto 0" }}>
  <a 
    href="/forgot-password" 
    style={{
      display: "block",
      color: "#000",
      fontFamily: "Poppins, sans-serif",
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: "normal",
      textDecoration: "none",
      marginBottom: "10px",
      textAlign: "left"
    }}
  >
    Forgot password?
  </a>
  
  <button
    style={{
      width: "100%",
      height: "50px",
      borderRadius: "8.721px",
      border: "0.5px solid #6F6F6F",
      background: "#6085B9",
      color: "#FFF",
      fontFamily: "Poppins, sans-serif",
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: "normal",
      textAlign: "center",
      boxShadow: "0 0 0 6.977px rgba(255, 255, 255, 0.15)",
      cursor: "pointer",
    }}
  >
    Login
  </button>
</div>

          </>
        ) : (
          <>
         <>
  <div style={{ width: "322px", marginTop: "20px" }}>
    {/* Name */}
    <div style={{ fontSize: "16px", fontFamily: "Poppins", color: "#6F6F6F", marginBottom: "5px" }}>
      Name
    </div>
    <input
      type="text"
      placeholder=""
      style={{
        width: "100%",
        height: "38.267px",
        padding: "0 176px 0 15px",
        borderRadius: "10px",
        border: "0.5px solid #6F6F6F",
        background: "#FFF",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    />

    {/* Email */}
    <div style={{ fontSize: "16px", fontFamily: "Poppins", color: "#6F6F6F", margin: "20px 0 5px 0" }}>
      Email
    </div>
    <input type="email" placeholder="" style={{ width: "100%", height: "38.267px", borderRadius: "10px", border: "0.5px solid #6F6F6F", background: "#FFF", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", padding: "0 15px" }} />

    {/* Password */}
    <div style={{ fontSize: "16px", fontFamily: "Poppins", color: "#6F6F6F", margin: "20px 0 5px 0" }}>
      Password
    </div>
    <input type="password" placeholder="" style={{ width: "100%", height: "38.267px", borderRadius: "10px", border: "0.5px solid #6F6F6F", background: "#FFF", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", padding: "0 15px" }} />

    {/* Confirm Password */}
    <div style={{ fontSize: "16px", fontFamily: "Poppins", color: "#6F6F6F", margin: "20px 0 5px 0" }}>
      Confirm Password
    </div>
    <input type="password" placeholder="" style={{ width: "100%", height: "38.267px", borderRadius: "10px", border: "0.5px solid #6F6F6F", background: "#FFF", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", padding: "0 15px" }} />

    {/* Sign Up Button */}
  <button
  style={{
    display: "flex",
    width: "288px",
    height: "46px",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: "10px",
    border: "0.5px solid #6F6F6F",
    background: "#6085B9",
    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
    color: "#FFF",
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    position: "absolute",   // păstrăm poziționarea absolută
    left: "50%",            // centru orizontal
    top: "600px",           // mută mai jos (poți ajusta după prototip)
    transform: "translateX(-50%)" // centrează perfect
  }}
>
  Sign Up
</button>

{/* Text Have an account + link Sign In */}
<div
  style={{
    position: "absolute",
    bottom: "20px",   // distanța de jos, ajustează după nevoie
    left: "48%",
    transform: "translateX(-50%)",
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "49.849px",
    letterSpacing: "0.25px",
    color: "#888",
  }}
>
  Have an account?
  <a
    href="#"
    onClick={() => setIsLogin(true)} // trece la login
    style={{
      color: "#6085B9",
      fontWeight: 600,
      textDecoration: "none",
      marginLeft: "5px",
      cursor: "pointer",
    }}
  >
    SIGN IN
  </a>
</div>
  </div>
</>
          </>
        )}
      </div>
    </div>
  );
}
