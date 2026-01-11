import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getInitials,
  getRandomColorBasedOnName,
  formatRelativeTime,
} from "@/lib/utils";
import { useMutation } from "convex/react";
import { LucideMessageCircle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

type Props = {
  chat: {
    conversationId: string;
    otherUser: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string;
    };
    conversation: {
      lastMessageAt: number | null;
      updatedAt: number;
      createdAt: number;
    };
    lastMessage: {
      text: string;
      time: number;
      senderId: string;
    } | null;
  };
};

export function AllUsersList({ chat }: Props) {
  const avatarColor = getRandomColorBasedOnName(chat.otherUser.name);

  const router = useRouter();

  const mutation = useMutation(
    api.chat.conversations.getOrCreateDirectConversation,
  );

  const hasMessages = chat.conversation.lastMessageAt !== null;

  return (
    <div
      className="w-full gap-2 bg-muted items-center py-5 flex rounded-md px-4 border-muted hover:bg-muted/80 cursor-pointer"
      onClick={async () => {
        const result = await mutation({
          userB: chat.otherUser.id,
        });
        if (result) router.push(`/chat/${result}`);
      }}
    >
      <Avatar
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/profile/${chat.otherUser.id}`);
        }}
      >
        <AvatarFallback
          style={{
            backgroundColor: avatarColor,
          }}
        >
          {getInitials(chat.otherUser.name)}
        </AvatarFallback>
        <AvatarImage src={chat.otherUser.avatarUrl || ""} />
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <div
          className="font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/profile/${chat.otherUser.id}`);
          }}
        >
          {chat.otherUser.name}
        </div>
        {hasMessages && chat.lastMessage ? (
          <div className="text-sm text-muted-foreground truncate">
            {chat.lastMessage.text}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No messages yet
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        {hasMessages && chat.conversation.lastMessageAt && (
          <div className="text-xs text-muted-foreground">
            {formatRelativeTime(chat.conversation.lastMessageAt)}
          </div>
        )}
        <Button
          size="icon-lg"
          variant="ghost"
          onClick={async (e) => {
            e.stopPropagation();
            const result = await mutation({
              userB: chat.otherUser.id,
            });
            if (result) router.push(`/chat/${result}`);
          }}
        >
          <LucideMessageCircle className="size-5" />
        </Button>
      </div>
    </div>
  );
}
