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
import { authClient } from "@/lib/auth/auth-client";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
              <AlertDialog>
                {/* asChild allows the Trigger to pass behavior to your custom button
                        instead of rendering a button-inside-a-button */}
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer transition rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-100">
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
                </AlertDialogTrigger>

                <AlertDialogContent className="w-[90%] max-w-[400px] p-8 bg-[#ECF4FF] rounded-[30px] border-none shadow-xl">
                  <AlertDialogHeader className="flex flex-col items-center text-center gap-2">
                    <AlertDialogTitle
                      className="text-[20px] font-poppins font-semibold text-gray-900"
                      style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)" }}
                    >
                      Are you sure you want to log out?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[#1A76C3] text-[13px] font-poppins leading-relaxed max-w-[260px]">
                      You can always sign back in anytime. Your account will
                      remain secure.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 mt-6 w-full">
                    {/* Cancel Button */}
                    <AlertDialogCancel className="mt-0 w-full sm:w-auto min-w-[120px] h-[40px] bg-white border border-gray-400/50 rounded-lg shadow-sm text-[#1A76C3] font-normal hover:bg-gray-50 transition-colors">
                      Cancel
                    </AlertDialogCancel>

                    {/* Action Button */}
                    <AlertDialogAction
                      onClick={() => {
                        authClient.signOut();
                        router.push("/discover");
                      }}
                      className="w-full sm:w-auto min-w-[120px] h-[40px] bg-white border border-red-200 rounded-lg shadow-sm text-[#C3201A] font-normal hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      Log out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
