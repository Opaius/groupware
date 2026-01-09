"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "~/convex/_generated/dataModel";

// Map notification types to toast configurations
const NOTIFICATION_TOAST_CONFIG = {
  like: {
    title: "New Like!",
    description: (name: string) => `${name} liked you!`,
    icon: "❤️",
    actionText: "View Profile",
    color: "bg-pink-100 border-pink-300 text-pink-700",
  },
  match: {
    title: "It's a Match!",
    description: (name: string) => `You matched with ${name}!`,
    icon: "🤝",
    actionText: "Start Chatting",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  message: {
    title: "New Message",
    description: (name: string) => `${name} sent you a message`,
    icon: "💬",
    actionText: "Reply",
    color: "bg-green-100 border-green-300 text-green-700",
  },
  accept: {
    title: "Request Accepted",
    description: (name: string) => `${name} accepted your request`,
    icon: "✅",
    actionText: "Continue",
    color: "bg-emerald-100 border-emerald-300 text-emerald-700",
  },
  reject: {
    title: "Request Declined",
    description: (name: string) => `${name} declined your request`,
    icon: "❌",
    actionText: "Find Others",
    color: "bg-red-100 border-red-300 text-red-700",
  },
} as const;

type NotificationType = keyof typeof NOTIFICATION_TOAST_CONFIG;

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

export function useNotificationListener() {
  const router = useRouter();
  const notificationsData = useQuery(api.discover.getUserNotifications);
  // Conversation mutation for direct messaging
  const getOrCreateDirectConversation = useMutation(
    api.chat.conversations.getOrCreateDirectConversation,
  );
  // Swipe mutation for recording interactions
  const createSwipe = useMutation(api.discover.createSwipe);
  const [processedNotifications, setProcessedNotifications] = useState<
    Set<string>
  >(new Set());
  const initializedRef = useRef(false);
  const lastCheckRef = useRef<number>(Date.now());

  const handleNotificationAction = useCallback(
    async (notification: EnrichedNotification) => {
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

              try {
                // Record a message swipe action
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
          // Could navigate to user's profile
          if (notification.fromUser) {
            router.push(`/profile/${notification.fromUser.id}`);
          }
          break;

        case "accept":
        case "reject":
          router.push("/discover");
          break;
      }
    },
    [router, getOrCreateDirectConversation, createSwipe],
  );

  useEffect(() => {
    // Skip initial mount or when no data
    if (!notificationsData || !Array.isArray(notificationsData)) {
      return;
    }

    // Initialize on first load
    if (!initializedRef.current) {
      // Mark all existing notifications as processed
      const initialIds = new Set(notificationsData.map((n) => n.id));
      setProcessedNotifications(initialIds);
      initializedRef.current = true;
      lastCheckRef.current = Date.now();
      return;
    }

    // Find new notifications (not in processed set and unread)
    const newNotifications = notificationsData.filter(
      (notification) =>
        !processedNotifications.has(notification.id) &&
        !notification.read &&
        notification.createdAt > lastCheckRef.current - 5000, // Only show notifications from last 5 seconds (to avoid showing old ones on refresh)
    );

    if (newNotifications.length === 0) {
      return;
    }

    // Update processed set
    const newProcessed = new Set(processedNotifications);

    // Show toasts for new notifications
    newNotifications.forEach((notification) => {
      const config = NOTIFICATION_TOAST_CONFIG[notification.type];
      const fromUserName = notification.fromUser?.name || "Someone";

      toast.custom(
        (t) => (
          <div
            className={`rounded-lg border p-4 shadow-lg ${config.color} max-w-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{config.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{config.title}</h3>
                <p className="text-sm mt-1">
                  {config.description(fromUserName)}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      handleNotificationAction(notification);
                      toast.dismiss(t);
                    }}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-white/80 hover:bg-white border border-gray-300 transition-colors"
                  >
                    {config.actionText}
                  </button>
                  <button
                    onClick={() => toast.dismiss(t)}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-transparent hover:bg-white/50 border border-transparent transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        ),
        {
          duration: 8000,
          position: "bottom-right",
        },
      );

      newProcessed.add(notification.id);
    });

    setProcessedNotifications(newProcessed);
    lastCheckRef.current = Date.now();
  }, [
    notificationsData,
    processedNotifications,
    router,
    handleNotificationAction,
  ]);

  return null;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotificationListener();
  return <>{children}</>;
}

export default NotificationProvider;
