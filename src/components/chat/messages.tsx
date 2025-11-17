"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LucideCheck, LucideCheckCheck, LucideClock } from "lucide-react";
import { useMemo } from "react";

export type MessageProp = {
  message: string;
  seen: boolean;
  sent: boolean;
  timeSent: Date | number;
  senderId: string;
  avatarUrl?: string;
  senderName?: string;
  isOwnMessage?: boolean;
};

export function ChatMessage({
  message,
  seen,
  sent,
  timeSent,
  senderId,
  avatarUrl,
  senderName,
  isOwnMessage,
}: MessageProp) {
  const isUserSender = isOwnMessage ?? false;
  const timestamp =
    timeSent instanceof Date ? timeSent : new Date(timeSent ?? Date.now());

  const iconToRender = useMemo(() => {
    if (seen) return <LucideCheckCheck className="size-[10px]" />;
    if (sent) return <LucideCheck className="size-[10px]" />;
    return <LucideClock className="size-[10px]" />;
  }, [seen, sent]);
  return (
    <div
      className="flex items-center gap-[8px]"
      style={{ flexFlow: isUserSender ? "row-reverse" : "row" }}
    >
      <Avatar className="size-[36px]">
        <AvatarImage className="object-cover" src={avatarUrl ?? ""} />
        <AvatarFallback>
          {senderName
            ? getInitials(senderName)
            : senderId.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className="px-[8px] py-[15px] text-xs relative rounded-[10px]"
        style={{
          backgroundColor: isUserSender
            ? "var(--color-accent)"
            : "var(--color-muted)",
        }}
      >
        {message}
        <div
          className="absolute text-2xs items-center flex bottom-[3px]"
          style={{
            right: isUserSender ? "auto" : "10px",
            left: isUserSender ? "10px" : "auto",
          }}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })}
          {iconToRender}
        </div>
      </div>
    </div>
  );
}
