"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LucideCalendar,
  LucidePaperclip,
  LucideSend,
  Phone,
  Video,
  Loader2,
  PhoneCall,
  PhoneOff,
} from "lucide-react";
import { ChatMessage } from "@/components/chat/messages";
import { Textarea } from "@/components/ui/textarea";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";
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
import { useMutation, useQuery, usePaginatedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCall } from "@/lib/client/useCall";
import { BackButton } from "@/components/back-button";
import { usePeer } from "@/components/util/peerjs-provider";

// --- Types ---

type MessageMetadata = {
  seen: boolean;
  seenByUserIds: string[];
  seenByOtherUserIds: string[];
  allOtherUsersSeen: boolean;
  currentUserHasSeen: boolean;
};

// Matches the "Enriched" message returned by the new backend
type EnrichedMessage = Doc<"messages"> & {
  metadata: MessageMetadata;
  sender?: { name?: string; image?: string | null };
  isOptimistic?: boolean; // We add this on the client side for pending messages
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

  const {
    startCall,
    acceptCall,
    declineCall,
    cancelCall,
    callStatus,
    incomingCall,
    outgoingCall,
    activeCall,
    cleanupCall,
  } = useCall();
  const router = useRouter();
  const peer = usePeer();

  // --- 1. Query Static Header Data (Conversation & Participants) ---
  const conversationData = useQuery(api.chat.messages.getConversationMetadata, {
    conversationId,
  });

  // --- 2. Query Paginated Messages ---
  const {
    results: historicalMessages,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.chat.messages.listEnrichedMessages, // The new list function
    { conversationId },
    { initialNumItems: 20 },
  );

  // --- 3. Local State for Instant "Optimistic" Updates ---
  // Since updating paginated caches is brittle, we store pending messages locally
  const [pendingMessages, setPendingMessages] = useState<EnrichedMessage[]>([]);

  // --- Scroll Management ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const suppressAutoScrollRef = useRef(false);
  const userNearBottomRef = useRef(true);

  // Combine server messages + local pending messages
  const allMessages = useMemo(() => {
    const server = (historicalMessages as EnrichedMessage[]) ?? [];
    // Sort server messages by time, then append pending messages
    return [...server.sort((a, b) => a.sentAt - b.sentAt), ...pendingMessages];
  }, [historicalMessages, pendingMessages]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      userNearBottomRef.current = distanceFromBottom < 120;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (suppressAutoScrollRef.current) return;
    if (!userNearBottomRef.current) return;
    if (allMessages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length, pendingMessages.length]);

  // --- Mutation ---
  const [messageBody, setMessageBody] = useState("");
  const sendMessageMutation = useMutation(api.chat.messages.sendMessage);

  const handleSend = async () => {
    if (!messageBody.trim() || !currentUserId) return;

    const tempId = `temp-${Date.now()}` as unknown as Id<"messages">;
    const now = Date.now();
    const textToSend = messageBody; // Capture current text

    // 1. Create Optimistic Message
    const optimisticMsg: EnrichedMessage = {
      _id: tempId,
      _creationTime: now,
      conversationId,
      senderId: currentUserId,
      body: textToSend,
      sentAt: now,
      isOptimistic: true,
      sender: {
        name: session?.user?.name ?? "You",
        image: session?.user?.image ?? null,
      },
      metadata: {
        seen: false,
        seenByUserIds: [currentUserId],
        seenByOtherUserIds: [],
        allOtherUsersSeen: false,
        currentUserHasSeen: true,
      },
    };

    // 2. Update UI Immediately
    setPendingMessages((prev) => [...prev, optimisticMsg]);
    setMessageBody("");

    // Scroll immediately
    setTimeout(
      () => scrollRef.current?.scrollIntoView({ behavior: "auto" }),
      0,
    );

    try {
      // 3. Send to Server
      await sendMessageMutation({
        conversationId,
        body: textToSend,
      });

      // 4. Remove from pending (Server data will take over via usePaginatedQuery subscription)
      setPendingMessages((prev) => prev.filter((m) => m._id !== tempId));
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Mark message as error in UI or restore text
      setPendingMessages((prev) => prev.filter((m) => m._id !== tempId));
      setMessageBody(textToSend);
    }
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleLoadMore = async () => {
    const container = scrollContainerRef.current;
    const previousScrollHeight = container?.scrollHeight ?? 0;
    const previousScrollTop = container?.scrollTop ?? 0;

    suppressAutoScrollRef.current = true;

    try {
      await loadMore(10);
    } catch (error) {
      console.error("Failed to load older messages", error);
    } finally {
      requestAnimationFrame(() => {
        if (container) {
          const heightDiff = container.scrollHeight - previousScrollHeight;
          container.scrollTop = previousScrollTop + heightDiff;
        }
        suppressAutoScrollRef.current = false;
      });
    }
  };

  // --- Header Logic (Derived from conversationData) ---
  const headerParticipant = conversationData?.participants?.find(
    (participant) => participant.userId !== conversationData.currentUserId,
  );
  // Note: conversationData now has usersById, we can use that if needed,
  // but for the main header, the participant list is usually enough.
  const headerProfile =
    headerParticipant && conversationData?.usersById
      ? conversationData.usersById[headerParticipant.userId]
      : undefined;

  const headerName =
    headerProfile?.name ?? conversationData?.conversation?.name ?? "Chat";
  const headerAvatar = headerProfile?.image;
  const avatarName = getInitials(headerName);
  const avatarColor = getRandomColorBasedOnName(headerName);

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* --- Header --- */}
      <div className="flex shrink-0 items-center px-4 h-16 border-b shadow-sm z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <BackButton />
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
              {conversationData ? "Active now" : "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
              console.log("Phone button clicked");
              console.log("Calling user:", headerParticipant?.userId);
              console.log("My peer ID:", peer?.id);

              const receiverId = headerParticipant?.userId ?? "";
              if (receiverId && peer) {
                console.log("Starting call to:", receiverId);
                console.log("My peer ID:", peer.id);
                console.log("Conversation ID:", conversationId);

                // Disable button immediately to prevent multiple clicks
                const button = event.currentTarget as HTMLButtonElement;
                button.disabled = true;

                try {
                  const success = await startCall(conversationId, receiverId);
                  if (success) {
                    // Navigate to call page immediately to show ringing UI
                    router.push(`/chat/${conversationId}/call`);
                  } else {
                    console.error("Failed to start call");
                    button.disabled = false;
                  }
                } catch (error) {
                  console.error("Error starting call:", error);
                  button.disabled = false;
                }
              } else {
                console.error("Cannot start call:", {
                  receiverId,
                  peerAvailable: !!peer,
                  peerId: peer?.id,
                });
              }
            }}
            variant="ghost"
            size="icon"
            disabled={
              callStatus !== "idle" || !headerParticipant?.userId || !peer
            }
          >
            <Phone className="size-5 " />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Video call button clicked - not implemented yet");
            }}
          >
            <Video className="size-5 " />
          </Button>

          {/* Debug button - manually navigate to call page */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("DEBUG: Manually navigating to call page");
              console.log("Conversation ID:", conversationId);
              console.log("Call status:", callStatus);
              console.log("Has incoming call:", !!incomingCall);
              console.log("Has outgoing call:", !!outgoingCall);
              console.log("Has active call:", !!activeCall);

              const targetPath = `/chat/${conversationId}/call`;
              console.log("Navigating to:", targetPath);

              // Try router first
              router.push(targetPath);

              // Fallback after 1 second
              setTimeout(() => {
                if (window.location.pathname !== targetPath) {
                  console.log("Router failed, using window.location");
                  window.location.href = targetPath;
                }
              }, 1000);
            }}
            title="Debug: Go to call page"
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <span className="text-xs font-bold">DEBUG</span>
          </Button>
        </div>
      </div>

      {/* --- Incoming Call Overlay --- */}
      {callStatus === "incoming" && incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="size-24 border-4 border-primary/20">
                    <AvatarImage src={incomingCall.caller?.image ?? ""} />
                    <AvatarFallback
                      style={{
                        backgroundColor: getRandomColorBasedOnName(
                          incomingCall.caller?.name ?? "Caller",
                        ),
                      }}
                    >
                      {getInitials(incomingCall.caller?.name ?? "Caller")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 animate-ping">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <PhoneCall className="size-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Incoming Call</h2>
                <p className="text-muted-foreground">
                  {incomingCall.caller?.name ?? "Unknown"} is calling you
                </p>
                <p className="text-xs text-muted-foreground">
                  Conversation:{" "}
                  {incomingCall.conversation?.name ?? "Direct chat"}
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={declineCall}
                  variant="destructive"
                  size="lg"
                  className="rounded-full size-16"
                >
                  <PhoneOff className="size-8" />
                </Button>
                <Button
                  onClick={async () => {
                    console.log("Accepting call from chat page");
                    const success = await acceptCall();
                    if (success) {
                      console.log(
                        "Call accepted successfully, global notification will handle navigation",
                      );
                      // Don't navigate here - let the global notification handle it
                      // This prevents race conditions and premature navigation
                    }
                  }}
                  variant="default"
                  size="lg"
                  className="rounded-full size-16 bg-green-600 hover:bg-green-700"
                >
                  <PhoneCall className="size-8" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Ringing... will auto-decline in 30 seconds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Outgoing Call Overlay --- */}
      {(callStatus === "ringing" || outgoingCall) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="size-24 border-4 border-primary/20">
                    <AvatarImage src={headerProfile?.image ?? ""} />
                    <AvatarFallback
                      style={{
                        backgroundColor: getRandomColorBasedOnName(headerName),
                      }}
                    >
                      {getInitials(headerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 animate-ping">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <PhoneCall className="size-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Calling...</h2>
                <p className="text-muted-foreground">Calling {headerName}</p>
                <p className="text-xs text-muted-foreground">
                  {outgoingCall?.receiver?.name || "Connecting..."}
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={cancelCall}
                  variant="destructive"
                  size="lg"
                  className="rounded-full size-16"
                >
                  <PhoneOff className="size-8" />
                </Button>
                <Button
                  onClick={() => {
                    // Navigate to call page to see call status
                    router.push("/chat/" + conversationId + "/call");
                  }}
                  variant="outline"
                  size="lg"
                  className="rounded-full size-16"
                >
                  View Call
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Waiting for answer... will auto-cancel in 30 seconds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Call Ended Overlay --- */}
      {callStatus === "ended" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="size-24 rounded-full bg-destructive/20 flex items-center justify-center">
                  <PhoneOff className="size-12 text-destructive" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Call Ended</h2>
                <p className="text-muted-foreground">
                  {incomingCall ? "Call declined" : "Call cancelled"}
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    cleanupCall();
                    router.push("/chat/" + conversationId);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Back to Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Messages Body --- */}
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col"
        ref={scrollContainerRef}
      >
        {/* Loading Spinner for initial fetch */}
        {isLoading && (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        {/* Load More Button / Spinner */}
        {!isLoading && status !== "Exhausted" && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleLoadMore()}
            >
              Load Older Messages
            </Button>
          </div>
        )}

        {!isLoading && allMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center opacity-50">
            <p className="text-sm">No messages yet. Say hi!</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          {allMessages.map((msg) => {
            // Sender info is now embedded directly in the message!
            const senderProfile = msg.sender;

            // Parse seen data
            const seenByOtherUserNames = msg.metadata.seenByOtherUserIds.map(
              (userId) =>
                conversationData?.usersById?.[userId]?.name ?? "Unknown",
            );

            return (
              <ChatMessage
                key={msg._id}
                message={msg.body}
                seen={msg.metadata.currentUserHasSeen}
                seenByOtherUserNames={seenByOtherUserNames}
                allOthersSeen={msg.metadata.allOtherUsersSeen}
                currentUserHasSeen={msg.metadata.currentUserHasSeen}
                currentUserId={currentUserId ?? ""}
                conversationId={conversationId}
                sent={msg.isOptimistic ?? false}
                timeSent={msg.sentAt}
                senderId={msg.senderId}
                messageId={msg._id}
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
          onChange={(e) => setMessageBody(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          value={messageBody}
          className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl"
          placeholder="Type your message..."
          containerClassName="border-input shadow-sm focus-within:ring-1 focus-within:ring-primary"
          icons={[
            <Button
              key="send"
              onClick={() => void handleSend()}
              disabled={!messageBody.trim()}
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
