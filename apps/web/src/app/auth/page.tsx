"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons"; // presupunem că ai Icons.Google și Icons.Apple

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#DCE9FB] p-4">
      <div className="w-full sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] rounded-[40px] bg-white flex flex-col items-center shadow-2xl overflow-hidden transition-all duration-300">
        {/* Titlu */}
        <div className="pt-8 px-6 text-center">
          <h1 className="font-poppins font-bold text-[1.8rem] sm:text-[2rem] leading-snug bg-gradient-to-b from-[#0C3057] to-[#31649A] bg-clip-text text-transparent">
            {isLogin ? "Welcome to Skill Trade" : "Create your account"}
          </h1>
          {isLogin ? (
            <p className="text-[1rem] text-black/70 mt-2">
              Login or Sign up to access your account
            </p>
          ) : (
            <div className="h-5 mt-2" />
          )}
        </div>

        {/* Butoane Login / SignUp */}
        <div className="flex w-full mt-6 text-[1.1rem] sm:text-[1.2rem] font-semibold">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 sm:py-4 ${isLogin ? "bg-[#DCE9FB]" : "bg-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 sm:py-4 ${!isLogin ? "bg-[#DCE9FB]" : "bg-white"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Formular */}
        <div className="flex-1 w-full bg-[#DCE9FB] flex flex-col items-center px-6 py-8 rounded-b-[40px]">
          {isLogin ? (
            <>
              {/* Email */}
              <div className="relative w-full max-w-[350px] mb-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="h-[50px] sm:h-[55px] bg-white border border-gray-400 shadow-sm rounded-lg pl-10 text-[1rem]"
                />
                <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Password */}
              <div className="relative w-full max-w-[350px] mb-4">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-[50px] sm:h-[55px] bg-white border border-gray-400 shadow-sm rounded-lg pl-10 pr-10 text-[1rem]"
                />
                <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </div>
              </div>

              {/* Forgot password */}
              <div className="w-full max-w-[350px] mt-2">
                <a href="#" className="block text-sm font-semibold text-[#6085B9] text-right mb-4">
                  Forgot password?
                </a>
                <Button className="w-full h-[50px] sm:h-[55px] bg-secondary text-[1rem] font-bold rounded-lg shadow-md mb-2">
                  Login
                </Button>
              </div>

              {/* Or continue with social */}
              <p className="text-center text-sm text-gray-700 my-4">Or continue with social</p>

              {/* Social buttons */}
             <div className="flex flex-col gap-2 w-full max-w-[350px]">
  <Button
    className="w-full h-[45px] flex items-center justify-center gap-2 rounded-[8.721px] border border-[#6F6F6F] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-black font-work-sans text-[15px] font-medium normal-case"
  >
    <Icons.Google size={20} /> Login with Google
  </Button>
  <Button
    className="w-full h-[45px] flex items-center justify-center gap-2 rounded-[8.721px] border border-[#6F6F6F] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-black font-work-sans text-[15px] font-medium normal-case"
  >
    <Icons.Apple size={20} /> Login with Apple
  </Button>
</div>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500 mt-6 px-4">
                By signing in with an account, you agree to SO's Terms of Service and Privacy Policy.
              </p>
            </>
          ) : (
            <>
              {/* Sign Up */}
              <div className="w-full max-w-[350px] space-y-4">
                {/* Name */}
                <label className="text-sm font-medium">Name</label>
                <Input type="text" className="bg-white border border-gray-400 shadow-sm h-[45px] sm:h-[50px] rounded-lg text-[1rem]" />

                {/* Email */}
                <label className="text-sm font-medium">Email</label>
                <Input type="email" className="bg-white border border-gray-400 shadow-sm h-[45px] sm:h-[50px] rounded-lg text-[1rem]" />

                {/* Password */}
                <label className="text-sm font-medium">Password</label>
                <Input type="password" className="bg-white border border-gray-400 shadow-sm h-[45px] sm:h-[50px] rounded-lg text-[1rem]" />

                {/* Confirm Password */}
                <label className="text-sm font-medium">Confirm Password</label>
                <Input type="password" className="bg-white border border-gray-400 shadow-sm h-[45px] sm:h-[50px] rounded-lg text-[1rem]" />

                {/* Checkbox */}
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm">
                    I understood the Terms & Policy
                  </label>
                </div>

                {/* Sign Up Button */}
                <Button className="w-full h-[50px] sm:h-[55px] bg-[#6085B9] text-white font-bold rounded-lg shadow-md mt-2">
                  Sign Up
                </Button>

                {/* Or sign up with */}
                <p className="text-center text-sm text-gray-700 my-2">Or sign up with</p>

                {/* Social buttons */}
               <div className="flex flex-col gap-2">
  <Button
    className="w-full h-[45px] flex items-center justify-center gap-2 rounded-[8.721px] border border-[#6F6F6F] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-black font-work-sans text-[15px] font-medium normal-case"
  >
    <Icons.Google size={20} /> Sign up with Google
  </Button>
  <Button
    className="w-full h-[45px] flex items-center justify-center gap-2 rounded-[8.721px] border border-[#6F6F6F] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-black font-work-sans text-[15px] font-medium normal-case"
  >
    <Icons.Apple size={20} /> Sign up with Apple
  </Button>
</div>
              </div>

              {/* Footer */}
              <p className="text-center text-sm sm:text-base text-gray-700 mt-6">
                Have an account?{" "}
                <span onClick={() => setIsLogin(true)} className="font-semibold text-[#6085B9] cursor-pointer hover:underline">
                  SIGN IN
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
