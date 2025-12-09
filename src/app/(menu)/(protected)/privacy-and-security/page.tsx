"use client";

import { useState } from "react";
import { ChevronLeft, Shield, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth/auth-client";
import { useQueryWithStatus } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BackButton } from "@/components/back-button";

export default function PrivacySecurityPage() {
  const { data } = authClient.useSession();
  const user = data?.user;

  const { status, data: sessions } = useQueryWithStatus(
    api.auth.getAllUserSessions,
  );
  const lastSession = sessions?.[sessions.length - 1];
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  if (!data) return null;

  return (
    <div className="w-full sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px]">
      {/* Header cu fundal bleu */}
      <div className="pt-6 px-6 pb-4 bg-[#DCE9FB] flex items-center gap-2 ">
        <BackButton />
        <span>Privacy & Security</span>
      </div>

      {/* Card Principal cu albastru deschis - fără spațiu între ele */}
      <div className="bg-[#DCE9FB] rounded-b-[24px] px-6 py-6 shadow-lg">
        {/* Shield Icon & Text */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-[#1d324e] rounded-full flex items-center justify-center mb-3">
            <Shield className="text-white" size={28} />
          </div>
          <p className="text-[0.9rem] text-gray-600 leading-relaxed px-2">
            Your password and data are securely encrypted.
            <br />
            Only you can access your personal information.
          </p>
        </div>

        {/* Sign-in Email */}
        <div className="mb-4">
          <label className="text-[0.9rem] font-medium text-black mb-2 block">
            Sign-in Email
          </label>
          <Input disabled type="email" value={data.user.email} />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="text-[0.9rem] font-medium text-black mb-2 block">
            Previous Password
          </label>
          <Input
            type="password"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            className="h-[50px]"
          />
        </div>
        <div className="mb-2">
          <label className="text-[0.9rem] font-medium text-black mb-2 block">
            New Password
          </label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-[50px]"
          />
        </div>

        {/* Change Password Link */}
        <div className="text-right mb-6">
          <Button
            onClick={async () => {
              const data = await authClient.changePassword({
                currentPassword: previousPassword,
                newPassword,
              });
              if (data.error) {
                toast.error("Error changing password: " + data.error.message);
              } else {
                toast.success("Password changed successfully!");
              }
            }}
            variant="link"
            className="text-sm font-semibold text-[#24507f] hover:underline"
          >
            Change Password
          </Button>
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
            className="h-[50px]"
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
          Enable 2FA to add an extra layer of protection. You'll confirm your
          login with a code sent to your phone or email.
        </p>

        {/* Control your privacy */}
        <h3 className="font-semibold text-[0.95rem] text-black mb-3">
          Control your privacy
        </h3>

        {/* Last sign-in */}
        <div className="mb-8">
          {/* Header/Title */}
          <p className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-4">
            Last Sign-in Session
          </p>

          {/* Data Card Container */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Key/Value Grid for Session Details */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {/* 1. Date/Time */}
              <div className="col-span-2 sm:col-span-1">
                <p className="text-gray-500 mb-0.5">Time</p>
                <p className="font-medium text-gray-900 break-all">
                  {/* Ensure date is handled safely for display */}
                  {new Date(
                    lastSession?.createdAt || Date.now(),
                  ).toLocaleString()}
                </p>
              </div>

              {/* 2. IP Address / Location */}
              <div className="col-span-2 sm:col-span-1">
                <p className="text-gray-500 mb-0.5">IP Address</p>
                <p className="font-medium text-gray-900 break-all">
                  {lastSession?.ipAddress || "N/A"}
                </p>
              </div>

              {/* 3. Device/User Agent - Spanning the full width for complex data */}
              <div className="col-span-2 pt-2 border-t border-gray-100">
                <p className="text-gray-500 mb-0.5">Device / User Agent</p>
                <p className="font-medium text-gray-900 break-all">
                  {lastSession?.userAgent || "Unknown Device"}
                </p>
              </div>
            </div>
          </div>

          {/* Description with Action Link */}
          <p className="text-sm text-gray-500 mt-4">
            Manage what others can see from your profile and{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              review active sessions
            </a>{" "}
            anytime.
          </p>
        </div>

        {/* Total active sessions */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[0.9rem] text-black">
            Total active sessions ( {sessions?.length || 0} )
          </p>
        </div>

        {/* Session list */}
        <div className="space-y-3 ">
          <p className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-4">
            Active Sessions
          </p>

          {sessions &&
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition hover:border-red-300"
              >
                {/* Session Details (Left Side) */}
                <div className="flex flex-col flex-grow min-w-0 mr-4">
                  {/* Device/User Agent */}
                  <p className="font-medium text-gray-900 text-base truncate">
                    {session.userAgent}
                  </p>

                  {/* Location/Time */}
                  <p className="text-sm text-gray-500 mt-1">
                    Last used: at {new Date(session.createdAt).toLocaleString()}{" "}
                    <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                      {session.ipAddress}
                    </span>
                  </p>
                </div>

                {/* Revoke Button (Right Side) */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      if (session._id === data.session.id) {
                        // Handle current session revocation
                      } else {
                        authClient.revokeSession(session);
                      }
                    }}
                    className="text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
                    // Disable if it's the current session to prevent accidental lockout
                    disabled={session._id === data.session.id}
                  >
                    {session._id === data.session.id ? "Active" : "Revoke"}
                  </button>
                </div>
              </div>
            ))}

          {!sessions ||
            (sessions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>No other active sessions found.</p>
              </div>
            ))}
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
  );
}
