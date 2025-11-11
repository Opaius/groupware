"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideCheck, LucideCheckCheck, LucideClock } from "lucide-react";
import { useMemo } from "react";

export type MessageProp = {
  message: string;
  seen: boolean;
  sent: boolean;
  timeSent: Date;
  senderId: string;
};
const avatars = {
  test: "https://s2.qwant.com/thumbr/474x711/6/1/23d0e507a6e585bf9b6b6a798989efe0a98d06166f270ee8876c7c5de4f28d/OIP.kfM6gE5n_IxPxrdgZg7SigHaLH.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.kfM6gE5n_IxPxrdgZg7SigHaLH%3Fpid%3DApi&q=0&b=1&p=0&a=0",
  test2:
    "https://s2.qwant.com/thumbr/474x711/6/1/23d0e507a6e585bf9b6b6a798989efe0a98d06166f270ee8876c7c5de4f28d/OIP.kfM6gE5n_IxPxrdgZg7SigHaLH.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.kfM6gE5n_IxPxrdgZg7SigHaLH%3Fpid%3DApi&q=0&b=1&p=0&a=0",
};
export function ChatMessage({
  message,
  seen,
  sent,
  timeSent,
  senderId,
}: MessageProp) {
  //   const { data } = authClient.useSession();
  //   if (!data) return;
  //   const isUserSender = data.user.id === senderId;
  const isUserSender = senderId === "test";

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
        <AvatarImage
          className="object-cover"
          src={avatars[senderId as keyof typeof avatars]}
        />
        <AvatarFallback>AC</AvatarFallback>
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
          {timeSent.toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })}
          {iconToRender}
        </div>
      </div>
    </div>
  );
}
