"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import {
  Handshake,
  MessageSquare,
  Heart,
  XCircle,
  Loader2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "~/convex/_generated/dataModel";

// Map notification types to icons and display text
const NOTIFICATION_CONFIG = {
  like: {
    icon: Heart,
    text: (name: string) => `${name} liked you!`,
    actionText: "View Profile",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  match: {
    icon: Handshake,
    text: (name: string) => `It's a match with ${name}!`,
    actionText: "Start Chatting",
    color: "text-[#1d324e]",
    bgColor: "bg-[#DCE9FB]",
  },
  message: {
    icon: MessageSquare,
    text: (name: string) => `${name} sent you a message`,
    actionText: "Reply",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  accept: {
    icon: UserCheck,
    text: (name: string) => `${name} accepted your request`,
    actionText: "Continue",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  reject: {
    icon: XCircle,
    text: (name: string) => `${name} declined your request`,
    actionText: "Find Others",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
} as const;

type NotificationType = keyof typeof NOTIFICATION_CONFIG;

interface EnrichedNotification {
  id: Id<"notifications">;
  type: NotificationType;
  read: boolean;
  createdAt: number;
  fromUser: {
    id: string;
    name: string;
    image: string;
  } | null;
  conversationId: Id<"conversations"> | null;
  matchInfo: {
    matchId: Id<"matches">;
    conversationId: Id<"conversations"> | null;
  } | null;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isMarkingRead, setIsMarkingRead] = useState<string | null>(null);

  // Fetch notifications
  const notificationsData = useQuery(api.discover.getUserNotifications);
  const markNotificationRead = useMutation(api.discover.markNotificationRead);
  // Conversation mutation for direct messaging
  const getOrCreateDirectConversation = useMutation(
    api.chat.conversations.getOrCreateDirectConversation,
  );
  // Swipe mutation for recording interactions
  const createSwipe = useMutation(api.discover.createSwipe);

  // Get matches for additional context
  const matchesData = useQuery(api.discover.getMatches);

  // Loading state
  const isLoading = notificationsData === undefined;

  // Mark notification as read and handle action
  const handleNotificationAction = async (
    notification: EnrichedNotification,
  ) => {
    if (!notification.read) {
      setIsMarkingRead(notification.id);
      try {
        await markNotificationRead({
          notificationId: notification.id as Id<"notifications">,
        });
        toast.success("Notification marked as read");
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        toast.error("Failed to update notification");
      } finally {
        setIsMarkingRead(null);
      }
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "match":
      case "message":
        if (notification.conversationId) {
          router.push(`/chat/${notification.conversationId}`);
        } else if (notification.matchInfo?.conversationId) {
          router.push(`/chat/${notification.matchInfo.conversationId}`);
        } else if (notification.fromUser) {
          // Create conversation and navigate to chat
          try {
            const conversationId = await getOrCreateDirectConversation({
              userB: notification.fromUser.id,
            });

            // Record a message swipe action
            try {
              await createSwipe({
                targetUserId: notification.fromUser.id,
                action: "message",
              });
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
                // User already swiped (like or message), that's okay
                toast.info(
                  `Continuing conversation with ${notification.fromUser.name}`,
                );
              } else {
                // Some other error - log it but continue
                console.error("Swipe recording failed:", swipeError);
              }
            }

            router.push(`/chat/${conversationId}`);
          } catch (error) {
            console.error("Failed to create conversation:", error);
            toast.error("Failed to start conversation");
            // Fallback to profile view
            router.push(`/profile/${notification.fromUser.id}`);
          }
        }
        break;

      case "like":
        // Navigate to user's profile or discover page
        if (notification.fromUser) {
          router.push(`/profile/${notification.fromUser.id}`);
        }
        break;

      case "accept":
      case "reject":
        // Navigate to discover or matches page
        router.push("/discover");
        break;
    }
  };

  // Format date to relative time
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Group notifications by date
  const groupNotifications = (notifications: EnrichedNotification[]) => {
    const groups: Record<string, EnrichedNotification[]> = {};
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.createdAt);
      const notificationTime = notificationDate.getTime();

      let groupKey;
      if (now - notificationTime < oneDay) {
        groupKey = "Today";
      } else if (now - notificationTime < 2 * oneDay) {
        groupKey = "Yesterday";
      } else {
        groupKey = notificationDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  };

  // Sort notifications by date (newest first)
  const sortedNotifications = Array.isArray(notificationsData)
    ? [...notificationsData].sort((a, b) => b.createdAt - a.createdAt)
    : [];

  const groupedNotifications = groupNotifications(sortedNotifications);

  // Calculate unread count
  const unreadCount = sortedNotifications.filter((n) => !n.read).length;

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!notificationsData || sortedNotifications.length === 0) return;

    const unreadNotifications = sortedNotifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) return;

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markNotificationRead({ notificationId: notification.id }),
        ),
      );
      toast.success(
        `Marked ${unreadNotifications.length} notifications as read`,
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  return (
    <div className="w-full min-h-svh bg-[#DCE9FB]/50 sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] mx-auto pb-10">
      {/* Header */}
      <div className="pt-6 px-6 pb-4 bg-[#DCE9FB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton />
            <span className="text-primary font-medium text-lg">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#037ee6] hover:text-[#0366c4]"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#1d324e] mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 mb-6">
              When you receive likes, matches, or messages, they&#39;ll appear
              here.
            </p>
            <Button
              onClick={() => router.push("/discover")}
              className="bg-[#1d324e] hover:bg-[#2a4568]"
            >
              Discover People
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedNotifications).map(
              ([date, notifications]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                    {date}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {notifications.map((notification) => {
                      const config = NOTIFICATION_CONFIG[notification.type];
                      const Icon = config.icon;
                      const fromUserName =
                        notification.fromUser?.name || "Someone";

                      return (
                        <div
                          key={notification.id}
                          className={`bg-white rounded-[15px] p-4 flex items-start gap-3 shadow-sm border ${
                            notification.read
                              ? "border-gray-200"
                              : "border-[#037ee6] border-2"
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-[#1d324e] font-semibold text-[1rem]">
                                  {config.text(fromUserName)}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#037ee6] rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleNotificationAction(notification)
                                }
                                disabled={isMarkingRead === notification.id}
                                className={`w-full max-w-[200px] h-[36px] bg-white border ${
                                  notification.type === "reject"
                                    ? "border-red-300 text-red-600 hover:bg-red-50"
                                    : notification.type === "like"
                                      ? "border-pink-300 text-pink-600 hover:bg-pink-50"
                                      : "border-primary text-[#037ee6] hover:bg-[#f0f7ff]"
                                } rounded-lg transition-colors`}
                              >
                                {isMarkingRead === notification.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {config.actionText}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* Matches Section */}
        {matchesData && matchesData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#1d324e] mb-4">
              Your Matches ({matchesData.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {matchesData.map((match) => (
                <div
                  key={match?.matchId}
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden">
                    {match?.image ? (
                      <img
                        src={match?.image}
                        alt={match?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1d324e] text-white font-bold">
                        {match?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 truncate">
                    {match?.name}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {match?.bio || "No bio"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (match?.conversationId) {
                          router.push(`/chat/${match.conversationId}`);
                        } else if (match?.userId) {
                          try {
                            // Create conversation first
                            const conversationId =
                              await getOrCreateDirectConversation({
                                userB: match.userId,
                              });

                            try {
                              // Try to record message swipe
                              await createSwipe({
                                targetUserId: match.userId,
                                action: "message",
                              });
                              toast.success(`Message sent to ${match?.name}!`);
                            } catch (swipeError) {
                              // Check if it's "already swiped" error
                              const errorMessage =
                                swipeError instanceof Error
                                  ? swipeError.message
                                  : "Something went wrong";

                              if (
                                errorMessage.includes(
                                  "Already swiped on this user",
                                ) ||
                                errorMessage.includes("Already swiped")
                              ) {
                                // User already swiped (like or message), that's okay
                                toast.info(
                                  `Continuing conversation with ${match?.name}`,
                                );
                              } else {
                                // Some other error - show it
                                console.error(
                                  "Swipe recording failed:",
                                  swipeError,
                                );
                                toast.error(errorMessage);
                              }
                            }

                            // Navigate to the chat
                            router.push(`/chat/${conversationId}`);
                          } catch (error) {
                            console.error(
                              "Failed to create conversation:",
                              error,
                            );
                            toast.error("Failed to start conversation");
                            // Fallback to profile view
                            if (match?.userId) {
                              router.push(`/profile/${match.userId}`);
                            }
                          }
                        } else {
                          toast.info("No conversation started yet");
                        }
                      }}
                      className="flex-1 border-primary text-[#037ee6] hover:bg-[#f0f7ff]"
                    >
                      Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (match?.userId) {
                          router.push(`/profile/${match.userId}`);
                        }
                      }}
                      className="flex-1 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
