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
import { Id } from "../../../../convex/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";
import { KeyboardEvent, use, useMemo, useState } from "react";
import { useMutation } from "convex/react";

type OptimisticMessage = {
  _id: string;
  body: string;
  conversationId: Id<"conversations">;
  senderId: string;
  sentAt: number;
  metadata: { seen: boolean; sent: boolean };
  isOptimistic: true;
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
  const { data, isPending } = useQueryWithStatus(
    api.chat.messages.getMessagesWithMetadata,
    {
      conversationId,
      paginationOpts: { cursor: null, numItems: 20 },
    }
  );

  const headerParticipant = data?.otherParticipants?.[0];
  const headerProfile = headerParticipant
    ? data?.users?.[headerParticipant.userId]
    : undefined;
  const headerName = headerProfile?.name ?? "";
  const headerAvatar = headerProfile?.image;
  const serverMessages = useMemo(() => data?.messages ?? [], [data?.messages]);

  const [message, setMessage] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);
  const sendMessage = useMutation(api.chat.messages.sendMessage);

  const handleSend = async () => {
    if (!message.trim()) return;

    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      body: message,
      conversationId,
      senderId: currentUserId ?? "",
      sentAt: Date.now(),
      metadata: { seen: true, sent: true },
      isOptimistic: true,
    } satisfies OptimisticMessage;

    setOptimisticMessages((prev) => [...prev, optimisticMessage]);
    setMessage("");

    try {
      await sendMessage({
        conversationId,
        body: optimisticMessage.body,
      });
    } catch (error) {
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
      setMessage(optimisticMessage.body);
      console.error(error);
      return;
    }

    setOptimisticMessages((prev) =>
      prev.filter((msg) => msg._id !== optimisticMessage._id)
    );
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const avatarName = getInitials(headerName);
  const avatarColor = getRandomColorBasedOnName(headerName);
  const renderedMessages = useMemo(
    () =>
      [...serverMessages, ...optimisticMessages].sort(
        (a, b) => a.sentAt - b.sentAt
      ),
    [serverMessages, optimisticMessages]
  );

  return (
    <div className="flex flex-col items-center min-h-dvh">
      <div className="flex w-full items-center px-[10px] h-[100px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="size-[21px]" />
        </Button>
        <div className="grow flex items-center gap-[3px]  ">
          <Avatar className="w-[50px] h-[50px]">
            <AvatarImage src={headerAvatar ?? ""} />
            <AvatarFallback style={{ backgroundColor: avatarColor }}>
              {avatarName}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold ">{headerName}</p>
            <p className="text-xs text-muted-foreground">Active chat</p>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon">
            <Phone className="size-[21px]" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="size-[21px]" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col grow w-full p-[36px] gap-[10px]">
        {isPending && (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
        {!isPending && serverMessages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
        {!isPending &&
          renderedMessages.map((message) => {
            const profileFromUsers = data?.users?.[message.senderId];
            const fallbackProfile =
              !profileFromUsers && message.senderId === currentUserId
                ? {
                    name: session?.user?.name ?? undefined,
                    image: session?.user?.image ?? undefined,
                  }
                : undefined;
            const senderProfile = profileFromUsers ?? fallbackProfile;
            return (
              <ChatMessage
                key={message._id}
                message={message.body}
                seen={message.metadata?.seen ?? false}
                sent={message.metadata?.sent ?? false}
                timeSent={message.sentAt}
                senderId={message.senderId}
                avatarUrl={senderProfile?.image ?? undefined}
                senderName={senderProfile?.name ?? undefined}
                isOwnMessage={message.senderId === currentUserId}
              />
            );
          })}
      </div>
      <div className="flex w-full px-[25px]">
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          value={message}
          className="grow resize-none overflow-y-scroll hide-scrollbar rounded-md"
          placeholder="Type your message"
          containerClassName="border-primary"
          icons={[
            <Button
              key={"send"}
              onClick={() => void handleSend()}
              variant="ghost"
              size="icon"
            >
              <LucideSend />
            </Button>,
            <Button key={"paperclip"} variant="ghost" size="icon">
              <LucidePaperclip />
            </Button>,
            <Button key={"calendar"} variant="ghost" size="icon">
              <LucideCalendar />
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
