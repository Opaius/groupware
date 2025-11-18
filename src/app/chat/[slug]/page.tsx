"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  LucideCalendar,
  LucidePaperclip,
  LucideSend,
  Phone,
  Video,
  Loader2,
} from "lucide-react";
import { ChatMessage } from "@/components/chat/messages";
import { Textarea } from "@/components/ui/textarea";
import {
  getInitials,
  getRandomColorBasedOnName,
  useQueryWithStatus,
} from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";
import {
  KeyboardEvent,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

// --- Types ---

type MessageMetadata = {
  seen: boolean;
  seenByUserIds: string[];
  seenByOtherUserIds: string[];
  allOtherUsersSeen: boolean;
  currentUserHasSeen: boolean;
};

// Extend the DB document with UI-specific fields
type UIMessage = Doc<"messages"> & {
  metadata: MessageMetadata;
  isOptimistic?: boolean;
};

// Mimic the return type of getMessagesWithMetadata
type ChatQueryResponse = {
  messages: UIMessage[];
  users: Record<string, { name: string; image: string | null }>;
  conversation: Doc<"conversations">;
  participants: Doc<"conversationParticipants">[];
  otherParticipants: Doc<"conversationParticipants">[];
  pagination: { continueCursor: string; isDone: boolean };
};

export default function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const conversationId = slug as Id<"conversations">;
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? null;

  const router = useRouter();
  // --- Query Data ---
  const messagesQueryArgs = useMemo(
    () => ({
      conversationId,
      paginationOpts: { cursor: null, numItems: 20 },
    }),
    [conversationId]
  );

  // We cast the result to ChatQueryResponse | undefined to inform TS about `isOptimistic`
  const { data: rawData, isPending } = useQueryWithStatus(
    api.chat.messages.getMessagesWithMetadata,
    messagesQueryArgs
  );

  const data = rawData as ChatQueryResponse | undefined;

  // --- Scroll Management ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const serverMessages = useMemo(() => data?.messages ?? [], [data?.messages]);

  useEffect(() => {
    if (serverMessages.length > 0 || isPending) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [serverMessages.length, isPending]);

  // --- Mutation & Optimistic Updates ---
  const [message, setMessage] = useState("");

  const sendMessage = useMutation(
    api.chat.messages.sendMessage
  ).withOptimisticUpdate((localStore, args) => {
    if (!currentUserId) return;

    // Retrieve current state from the cache
    const existing = localStore.getQuery(
      api.chat.messages.getMessagesWithMetadata,
      messagesQueryArgs
    );

    if (!existing) return;

    // Apply typed optimistic update
    const optimisticUpdate = createOptimisticUpdate(
      existing as ChatQueryResponse,
      args.body,
      args.conversationId,
      currentUserId,
      session?.user
    );

    localStore.setQuery(
      api.chat.messages.getMessagesWithMetadata,
      messagesQueryArgs,
      optimisticUpdate
    );
  });

  const handleSend = async () => {
    if (!message.trim()) return;
    const bodyToSend = message;
    setMessage("");

    try {
      await sendMessage({
        conversationId,
        body: bodyToSend,
      });
      scrollRef.current?.scrollIntoView({ behavior: "auto" });
    } catch (error) {
      setMessage(bodyToSend);
      console.error("Failed to send message:", error);
    }
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  // --- Header Data ---
  const headerParticipant = data?.otherParticipants?.[0];
  const headerProfile = headerParticipant
    ? data?.users?.[headerParticipant.userId]
    : undefined;
  const headerName = headerProfile?.name ?? "Chat";
  const headerAvatar = headerProfile?.image;
  const avatarName = getInitials(headerName);
  const avatarColor = getRandomColorBasedOnName(headerName);

  const renderedMessages = useMemo(
    () => [...serverMessages].sort((a, b) => a.sentAt - b.sentAt),
    [serverMessages]
  );

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* --- Header --- */}
      <div className="flex shrink-0 items-center px-4 h-16 border-b shadow-sm z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div className="grow flex items-center gap-3 overflow-hidden">
          <Avatar className="size-10 border">
            <AvatarImage src={headerAvatar ?? ""} />
            <AvatarFallback style={{ backgroundColor: avatarColor }}>
              {avatarName}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="font-semibold text-sm truncate">{headerName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {data?.otherParticipants?.length ? "Active now" : "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="size-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* --- Messages Body --- */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {isPending && (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        {!isPending && serverMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center opacity-50">
            <p className="text-sm">No messages yet. Say hi!</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          {renderedMessages.map((msg) => {
            const profileFromUsers = data?.users?.[msg.senderId];
            const fallbackProfile =
              !profileFromUsers && msg.senderId === currentUserId
                ? {
                    name: session?.user?.name ?? "You",
                    image: session?.user?.image ?? null,
                  }
                : undefined;

            const senderProfile = profileFromUsers ?? fallbackProfile;

            // Safe default metadata
            const metadata = msg.metadata ?? {
              seen: msg.senderId === currentUserId,
              seenByUserIds: [msg.senderId],
              seenByOtherUserIds: [],
              allOtherUsersSeen: false,
              currentUserHasSeen: msg.senderId === currentUserId,
            };

            const seenByOtherUserNames = metadata.seenByOtherUserIds.map(
              (userId) => data?.users?.[userId]?.name ?? "Unknown"
            );

            return (
              <ChatMessage
                key={msg._id}
                message={msg.body}
                seen={metadata.currentUserHasSeen}
                seenByOtherUserNames={seenByOtherUserNames}
                allOthersSeen={metadata.allOtherUsersSeen}
                currentUserHasSeen={metadata.currentUserHasSeen}
                // We can now access isOptimistic safely without `as any`
                sent={msg.isOptimistic ?? false}
                timeSent={msg.sentAt}
                senderId={msg.senderId}
                avatarUrl={senderProfile?.image ?? undefined}
                senderName={senderProfile?.name ?? undefined}
                isOwnMessage={msg.senderId === currentUserId}
              />
            );
          })}
          <div ref={scrollRef} className="h-px w-full" />
        </div>
      </div>

      {/* --- Input Area --- */}
      <div className="shrink-0 px-4 py-3 bg-background border-t">
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          value={message}
          className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl"
          placeholder="Type your message..."
          containerClassName="border-input shadow-sm focus-within:ring-1 focus-within:ring-primary"
          icons={[
            <Button
              key="send"
              onClick={() => void handleSend()}
              disabled={!message.trim()}
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80"
            >
              <LucideSend className="size-5" />
            </Button>,
            <Button key="attach" variant="ghost" size="icon">
              <LucidePaperclip className="size-5" />
            </Button>,
            <Button key="calendar" variant="ghost" size="icon">
              <LucideCalendar className="size-5" />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Creates the optimistic update payload with proper typing.
 */
function createOptimisticUpdate(
  existing: ChatQueryResponse,
  body: string,
  conversationId: Id<"conversations">,
  currentUserId: string,
  sessionUser: { name?: string; image?: string | null } | undefined | null
): ChatQueryResponse {
  const now = Date.now();

  // Construct the optimistic message with explicit type
  const optimisticMessage: UIMessage = {
    _id: `optimistic-${now}` as unknown as Id<"messages">,
    _creationTime: now,
    conversationId,
    senderId: currentUserId,
    body,
    sentAt: now,
    metadata: {
      seen: false,
      seenByUserIds: [currentUserId],
      seenByOtherUserIds: [],
      allOtherUsersSeen: false,
      currentUserHasSeen: true,
    },
    isOptimistic: true,
  };

  // Update Users map if necessary
  const updatedUsers = existing.users[currentUserId]
    ? existing.users
    : {
        ...existing.users,
        [currentUserId]: {
          name: sessionUser?.name ?? "You",
          image: sessionUser?.image ?? null,
        },
      };

  // Update Conversation stats
  const updatedConversation = existing.conversation
    ? {
        ...existing.conversation,
        updatedAt: now,
        lastMessageAt: now,
        lastMessageText: body,
        lastMessageSenderId: currentUserId,
      }
    : existing.conversation;

  return {
    ...existing,
    users: updatedUsers,
    conversation: updatedConversation,
    messages: [...existing.messages, optimisticMessage],
  };
}
