"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  LucideCalendar,
  LucidePaperclip,
  LucidePin,
  LucideSend,
  LucideShieldAlert,
  LucideTrash,
  Phone,
  Video,
} from "lucide-react";
import { ChatMessage, MessageProp } from "@/components/chat/messages";
import { Textarea } from "@/components/ui/textarea";

const messages: MessageProp[] = [
  {
    message: "Hello my friend",
    seen: false,
    sent: true,
    timeSent: new Date(),
    senderId: "test1",
  },
  {
    message: "Hello my friend",
    seen: true,
    sent: true,
    timeSent: new Date(),
    senderId: "test",
  },
];

export default function ChatPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center min-h-dvh">
      <div className="flex w-full items-center px-[10px] h-[100px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="size-[21px]" />
        </Button>
        <div className="grow flex items-center gap-[3px]  ">
          <Avatar className="w-[50px] h-[50px]">
            <AvatarImage src="https://s1.qwant.com/thumbr/474x511/a/f/56f2eb9895421058645d0cffab3791119c6dd2b67c8ffd15779bcf395d0251/OIP.wIu2o2wxupPn9Ts60O3eWwHaH_.jpg?u=https%3A%2F%2Ftse4.explicit.bing.net%2Fth%2Fid%2FOIP.wIu2o2wxupPn9Ts60O3eWwHaH_%3Fpid%3DApi&q=0&b=1&p=0&a=0" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold ">Andrei Ciok</p>
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
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>
      <div className="flex w-full px-[25px]">
        <Textarea
          className="grow resize-none overflow-y-scroll hide-scrollbar rounded-md"
          placeholder="Type your message"
          containerClassName="border-primary"
          icons={[
            <Button key={"send"} variant="ghost" size="icon">
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
