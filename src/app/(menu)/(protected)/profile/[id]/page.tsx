"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  ArrowLeft,
  User,
  BookOpen,
  Sparkles,
  Loader2,
  Briefcase,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";
import { toast } from "sonner";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

type SkillItem = {
  id: string;
  name: string;
};

type UserProfileData = {
  id: string;
  name: string;
  email: string;
  image: string;
  featuredImage: string;
  bio: string;
  skills: SkillItem[];
  lookingToLearn: SkillItem[];
  hasSwiped: boolean;
  swipeAction: "like" | "reject" | "message" | null;
  mutualSwipe: boolean;
  mutualSwipeAction: "like" | "reject" | "message" | null;
  isMatch: boolean;
  conversationId: string | null;
  matchCreatedAt: number | null;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Unwrap params for Next.js 15
  const { id } = use(params);

  // Fetch user profile data
  const profileData = useQuery(api.discover.getUserProfile, {
    userId: id,
  }) as UserProfileData | undefined;

  // Fetch current user data
  const currentUser = useQuery(api.auth.getAuthUser);

  // Check if viewing own profile
  const isOwnProfile =
    currentUser && profileData && currentUser._id.toString() === profileData.id;

  // Swipe mutation for like/chat actions
  const createSwipe = useMutation(api.discover.createSwipe);
  // Conversation mutation for direct messaging
  const getOrCreateDirectConversation = useMutation(
    api.chat.conversations.getOrCreateDirectConversation,
  );

  const handleAction = async (action: "like") => {
    if (!profileData || isOwnProfile) return;

    setIsProcessing(action);
    try {
      await createSwipe({
        targetUserId: id,
        action,
      });

      toast.success(`You liked ${profileData.name}!`);

      // If it's a match, show special toast
      if (profileData.mutualSwipeAction === "like") {
        setTimeout(() => {
          toast.success(`It's a match with ${profileData.name}!`, {
            duration: 5000,
          });
        }, 500);
      }

      // Refresh the page to update status
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Action failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChatNavigation = async () => {
    if (!profileData || isOwnProfile) return;

    setIsProcessing("message");
    try {
      // Get or create conversation first
      const conversationId = await getOrCreateDirectConversation({
        userB: id,
      });

      try {
        // Try to record the swipe action for messaging
        await createSwipe({
          targetUserId: id,
          action: "message",
        });

        toast.success(`Message sent to ${profileData.name}!`);
      } catch (swipeError) {
        // Check if it's "already swiped" error
        const errorMessage =
          swipeError instanceof Error
            ? swipeError.message
            : "Something went wrong";

        if (
          errorMessage.includes("Already swiped on this user") ||
          errorMessage.includes("Already swiped")
        ) {
          // User already swiped (like or message), that's okay - we can still chat
          toast.info(`Continuing conversation with ${profileData.name}`);
        } else {
          // Some other error - show it
          console.error("Swipe recording failed:", swipeError);
          toast.error(errorMessage);
          // Still continue to chat since we have conversation
        }
      }

      // Navigate to the chat (we have conversationId from getOrCreateDirectConversation)
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Chat navigation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(null);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (profileData === undefined) {
    return (
      <div className="w-full min-h-svh bg-[#DCE9FB]/50 sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1d324e] mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full min-h-svh bg-[#DCE9FB]/50 sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] mx-auto flex items-center justify-center">
        <div className="text-center px-6">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            User not found
          </h3>
          <p className="text-gray-500 mb-6">
            The user you&#39;re looking for doesn&#39;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/discover")}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const userInitials = getInitials(profileData.name);
  const userColor = getRandomColorBasedOnName(profileData.name);

  return (
    <div className="w-full min-h-svh bg-[#DCE9FB]/50 sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] mx-auto pb-10">
      {/* Header */}
      <div className="pt-6 px-6 pb-4 bg-[#DCE9FB] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <span className="text-primary font-medium text-lg">Profile</span>
          </div>
          {profileData.isMatch && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Match
            </Badge>
          )}
        </div>
      </div>

      {/* Banner */}
      <div
        className="h-64 w-full bg-cover bg-center bg-no-repeat relative bg-[#1d324e]"
        style={{
          backgroundImage: profileData.featuredImage
            ? `url(${profileData.featuredImage})`
            : `url('https://placehold.co/390x256/1d324e/ffffff?text=Banner+Image')`,
        }}
      />

      {/* Profile Content */}
      <div className="relative px-6 -mt-20">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-40 h-40 mb-4 border-4 border-white shadow-lg relative z-10">
              <AvatarImage
                src={profileData.image}
                alt={profileData.name}
                className="object-cover"
              />
              <AvatarFallback
                className="text-4xl"
                style={{ backgroundColor: userColor }}
              >
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-[#1d324e] mb-1">
              {profileData.name}
            </h1>
            <p className="text-gray-500 mb-4">{profileData.email}</p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {profileData.hasSwiped && (
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-300"
                >
                  {profileData.swipeAction === "like"
                    ? "You liked"
                    : "You messaged"}
                </Badge>
              )}
              {profileData.mutualSwipe && (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-300"
                >
                  {profileData.mutualSwipeAction === "like"
                    ? "They liked you"
                    : "They messaged you"}
                </Badge>
              )}
              {profileData.isMatch && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Matched on {formatDate(profileData.matchCreatedAt)}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full max-w-md">
              {isOwnProfile ? (
                <div className="flex-1 flex flex-col items-center justify-center h-12 bg-gray-100 rounded-lg border border-gray-300">
                  <UserCog className="w-5 h-5 text-gray-500 mb-1" />
                  <span className="text-sm text-gray-600">Your Profile</span>
                </div>
              ) : (
                <>
                  {!profileData.hasSwiped ||
                  profileData.swipeAction !== "like" ? (
                    <Button
                      onClick={() => handleAction("like")}
                      disabled={isProcessing !== null || profileData.hasSwiped}
                      className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      {isProcessing === "like" ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Heart className="w-5 h-5 mr-2" />
                      )}
                      {profileData.hasSwiped &&
                      profileData.swipeAction === "like"
                        ? "You Liked"
                        : "Like"}
                    </Button>
                  ) : null}

                  <Button
                    onClick={handleChatNavigation}
                    disabled={isProcessing !== null}
                    variant={profileData.isMatch ? "default" : "outline"}
                    className={`flex-1 h-12 ${
                      profileData.isMatch
                        ? "bg-[#1d324e] hover:bg-[#2a4568] text-white"
                        : "border-primary text-primary hover:bg-primary/5"
                    }`}
                  >
                    {isProcessing === "message" ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <MessageSquare className="w-5 h-5 mr-2" />
                    )}
                    {profileData.conversationId ? "Chat" : "Message"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {profileData.bio && profileData.bio !== "No bio yet" && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                About
              </h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                {profileData.bio}
              </p>
            </div>
          )}

          {/* Current Skills */}
          {profileData.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skills to Learn */}
          {profileData.lookingToLearn.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Looking to Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.lookingToLearn.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="text-purple-700 border-purple-300 bg-purple-50 hover:bg-purple-100"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Connection Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Connection Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Your Action</span>
              <span className="font-medium">
                {profileData.hasSwiped
                  ? profileData.swipeAction === "like"
                    ? "Liked ❤️"
                    : "Messaged 💬"
                  : "Not interacted yet"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Their Action</span>
              <span className="font-medium">
                {profileData.mutualSwipe
                  ? profileData.mutualSwipeAction === "like"
                    ? "Liked you ❤️"
                    : "Messaged you 💬"
                  : "Not interacted yet"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Match Status</span>
              <span className="font-medium">
                {profileData.isMatch ? "✅ Matched" : "❌ Not matched"}
              </span>
            </div>
            {profileData.conversationId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversation</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    router.push(`/chat/${profileData.conversationId}`)
                  }
                  className="text-[#037ee6]"
                >
                  Open Chat
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Discover Button */}
        <div className="mt-6">
          <Button
            onClick={() => router.push("/discover")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discover
          </Button>
        </div>
      </div>
    </div>
  );
}
