"use client";
import {
  ChevronRight,
  User,
  Trophy,
  Shield,
  Crown,
  Bell,
  BellRing,
  Mail,
  Moon,
  HelpCircle,
  AlertCircle,
  Info,
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    newMessages: true,
    pushNotifications: false,
    emailNotifications: true,
    darkMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const { data } = authClient.useSession();
  const router = useRouter();
  const user = data?.user;
  if (!user) return <Loader2 className="animate-spin mx-auto" />;
  return (
    <div className="w-full h-full ">
      {/* Header with Profile */}
      <div className="bg-[#BDC7DB] pt-6 pb-16 px-4">
        <BackButton />

        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-[#4A6B8A]">
            <AvatarImage src={user.image || ""} alt="Profile" />
            <AvatarFallback
              className="text-2xl"
              style={{
                backgroundColor: getRandomColorBasedOnName(user.name),
              }}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            {user.name}
          </h2>

          <div className="flex gap-2 mt-3">
            <Badge className="bg-[#748CBB] hover:bg-[#6A8AA3] text-white border-none px-4 py-1">
              Level 2
            </Badge>
            <Badge className="bg-[#748CBB] hover:bg-[#6A8AA3] text-white border-none px-4 py-1">
              Year One
            </Badge>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 -mt-5 relative z-10 ">
        <div className="bg-white rounded-t-3xl shadow-lg px-4 pt-5 pb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1 ">
            Settings
          </h1>
          <p className="font-size-10 font-bold h-5 text-gray-500">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Account
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Edit profile</p>
                  <p className="text-3 text-gray-500 mt-0.5">
                    Update your profile information
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>

              <Separator />

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Skills & History</p>
                  <p className="text-s text-gray-500 mt-0.5">
                    Manage your skills and tracking history
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>

              <Separator />

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    Privacy & Security
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage two-factor authentication
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Subscription
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    Premium Subscription
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Unlock premium features & pricing
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Notification
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New Messages</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Alert for new and unread messages
                  </p>
                </div>
                <Switch
                  checked={settings.newMessages}
                  onCheckedChange={() => toggleSetting("newMessages")}
                />
              </div>

              <Separator />

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Push Notifications
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive push notification
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={() => toggleSetting("pushNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Email notifications
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => toggleSetting("emailNotifications")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Preferences
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Enable dark theme
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={() => toggleSetting("darkMode")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Support
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Help Center</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Read FAQ and support articles
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>

              <Separator />

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Report a problem</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tell us about your problem
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>

              <Separator />

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">About SkillTrade</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    App info & version
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone Section */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Danger Zone
          </p>
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-0">
              <button
                onClick={() => {
                  authClient.signOut();
                  router.push("/discover");
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Log Out</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Sign out of your account
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>

              <Separator />

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permanently delete your account
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
