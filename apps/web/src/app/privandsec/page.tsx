"use client";

import { useState } from "react";
import { ChevronLeft, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function PrivacySecurityPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px]">
        
        {/* Header cu fundal bleu */}
        <div className="pt-6 px-6 pb-4 bg-[#DCE9FB] rounded-t-[24px]">
          <button className="flex items-center gap-2 text-[#1d324e] font-semibold text-[1.1rem]">
            <ChevronLeft size={24} />
            <span>Privacy & Security</span>
          </button>
        </div>

        {/* Card Principal cu albastru deschis - fără spațiu între ele */}
        <div className="bg-[#DCE9FB] rounded-b-[24px] px-6 py-6 shadow-lg">
            
            {/* Shield Icon & Text */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-[#1d324e] rounded-full flex items-center justify-center mb-3">
                <Shield className="text-white" size={28} />
              </div>
              <p className="text-[0.9rem] text-gray-600 leading-relaxed px-2">
                Your password and data are securely encrypted.<br />
                Only you can access your personal information.
              </p>
            </div>

            {/* Sign-in Email */}
            <div className="mb-4">
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Sign-in Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="h-[50px] sm:h-[55px] bg-white border border-gray-400 shadow-sm rounded-lg text-[1rem]"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[50px] sm:h-[55px] bg-white border border-gray-400 shadow-sm rounded-lg text-[1rem]"
              />
            </div>

            {/* Change Password Link */}
            <div className="text-right mb-6">
              <a href="#" className="text-sm font-semibold text-[#24507f] hover:underline">
                Change Password
              </a>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Phone Number
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+07*********"
                className="h-[50px] sm:h-[55px] bg-white border border-gray-400 shadow-sm rounded-lg text-[1rem]"
              />
            </div>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="text-[0.95rem] font-semibold text-black">
                2FA-autentification
              </span>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-[#24507f]"
              />
            </div>

            {/* 2FA Description */}
            <p className="text-[0.8rem] text-gray-500 mb-6 leading-relaxed">
              Enable 2FA to add an extra layer of protection. You'll confirm your login with a code sent to your phone or email.
            </p>

            {/* Control your privacy */}
            <h3 className="font-semibold text-[0.95rem] text-black mb-3">
              Control your privacy
            </h3>

            {/* Last sign-in */}
            <div className="mb-4">
              <p className="font-semibold text-[0.9rem] text-black mb-1">
                Last sign-in
              </p>
              <p className="text-[0.85rem] text-gray-700 mb-2">
                today at 19:45, Safari 192.168.1.101, iPhone 13 Pro
              </p>
              <p className="text-[0.8rem] text-gray-500 leading-relaxed">
                Manage what others can see from your profile and review active sessions anytime.
              </p>
            </div>

            {/* Total active sessions */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[0.9rem] text-black">
                Total active sessions ( 3 )
              </p>
              <a href="#" className="text-[0.9rem] font-semibold text-[#24507f] hover:underline">
                All
              </a>
            </div>

            {/* Session list */}
            <div className="space-y-2 mb-4">
              <div className="text-[0.85rem] text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
                DESKTOP--6T1G6EC • Iași, Romania
              </div>
              <div className="text-[0.85rem] text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
                iPhone 13 Pro• Iași, Romania
              </div>
            </div>
          </div>

          {/* Footer cu Lock Icon */}
          <div className="bg-[#fdd5d5] rounded-[16px] p-4 flex items-start gap-3 mt-4">
            <div className="w-8 h-8 bg-[#1d324e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="text-white" size={16} />
            </div>
            <p className="text-[0.8rem] text-gray-800 leading-relaxed">
              We keep your data private and never share it with third-parties.
            </p>
          </div>
        </div>
      </div>
    
  );
}