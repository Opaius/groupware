"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials, getRandomColorBasedOnName } from "@/lib/utils";
import { LucideCheck, LucideCheckCheck, LucideClock } from "lucide-react";
import { useMemo } from "react";

export type MessageProp = {
  message: string;
  seen: boolean;
  currentUserHasSeen?: boolean;
  allOthersSeen?: boolean;
  seenByOtherUserNames?: string[];
  timeSent: Date | number;
  senderId: string;
  avatarUrl?: string;
  senderName?: string;
  isOwnMessage?: boolean;
  /** * If true, the message is currently sending (optimistic).
   * Displays a clock icon.
   */
  sent?: boolean;
};

export function ChatMessage({
  message,
  seen,
  currentUserHasSeen,
  allOthersSeen,
  seenByOtherUserNames,
  timeSent,
  senderId,
  avatarUrl,
  senderName,
  isOwnMessage = false,
  sent = false,
}: MessageProp) {
  const timestamp = useMemo(() => {
    return timeSent instanceof Date
      ? timeSent
      : new Date(timeSent ?? Date.now());
  }, [timeSent]);

  const timeString = useMemo(() => {
    return timestamp.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [timestamp]);

  const StatusIcon = useMemo(() => {
    if (sent) return <LucideClock className="size-3 opacity-70" />;

    if (isOwnMessage) {
      if (allOthersSeen)
        return <LucideCheckCheck className="size-3 text-blue-400" />;
      if (seen || currentUserHasSeen)
        return <LucideCheckCheck className="size-3 text-primary/60" />;
      return <LucideCheck className="size-3 text-muted-foreground" />;
    }
    return null;
  }, [sent, allOthersSeen, seen, currentUserHasSeen, isOwnMessage]);

  const avatarColor = getRandomColorBasedOnName(senderName ?? "");
  return (
    <div
      className={cn(
        "flex w-full gap-2 ",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Left Avatar (for others) */}
      {!isOwnMessage && (
        <Avatar className="size-8 shrink-0 mt-auto">
          <AvatarImage className="object-cover" src={avatarUrl ?? ""} />
          <AvatarFallback
            className="text-2xs"
            style={{ backgroundColor: avatarColor }}
          >
            {senderName
              ? getInitials(senderName)
              : senderId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "relative px-3 py-2 text-sm max-w-[75%] shadow-sm wrap-break-word",
          "rounded-2xl",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap pb-1">{message}</p>

        {/* Meta Footer */}
        <div
          className={cn(
            "flex items-center gap-1 text-2xs select-none opacity-80",
            isOwnMessage ? "justify-end" : "justify-start"
          )}
        >
          <span>{timeString}</span>

          {seenByOtherUserNames && seenByOtherUserNames.length > 0 && (
            <span className="max-w-[80px] truncate">
              • {seenByOtherUserNames.join(", ")}
            </span>
          )}

          {StatusIcon}
        </div>
      </div>

      {/* Right Avatar (for self) */}
      {isOwnMessage && (
        <Avatar className="size-8 shrink-0 mt-auto">
          <AvatarImage className="object-cover" src={avatarUrl ?? ""} />
          <AvatarFallback
            className="text-2xs"
            style={{ backgroundColor: avatarColor }}
          >
            {senderName ? getInitials(senderName) : "ME"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
