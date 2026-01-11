import { Doc } from "../../../convex/_generated/dataModel";
import {
  getInitials,
  getRandomColorBasedOnName,
  formatRelativeTime,
} from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

type Props = {
  conversation: Doc<"conversations">;
  otherUser: {
    name: string;
    avatar: string;
  };
  userId: string;
  notSeenMessagesCount: number | null;
};

export function ConvCardSkeleton() {
  return (
    <Skeleton className="w-full gap-2 items-center py-5 rounded-md px-4 border-2 h-18"></Skeleton>
  );
}

export function ConversationCard({
  conversation,
  otherUser,
  userId,
  notSeenMessagesCount,
}: Props) {
  const router = useRouter();
  const avatarColor = getRandomColorBasedOnName(otherUser.name);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${userId}`);
  };

  return (
    <div
      className="w-full gap-2 items-center py-5 flex rounded-md px-4 border-muted border-2 h-18 shadow-[4px_4px_4px_0px_var(--color-accent)] cursor-pointer hover:bg-muted transition-all"
      onClick={() => router.push(`/chat/${conversation._id}`)}
    >
      <Avatar
        className="size-12 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAvatarClick}
      >
        <AvatarFallback style={{ backgroundColor: avatarColor }}>
          {getInitials(otherUser.name)}
        </AvatarFallback>
        <AvatarImage src={otherUser.avatar || ""} />
      </Avatar>
      <div className="flex flex-col">
        <div className="font-semibold">{otherUser.name}</div>
        <div className="text-sm font-light text-muted-foreground">
          {conversation.lastMessageText}
        </div>
      </div>
      <div className="flex items-center ml-auto justify-center gap-4">
        {conversation.lastMessageAt && (
          <div className="text-xs text-muted-foreground">
            {formatRelativeTime(conversation.lastMessageAt)}
          </div>
        )}
        {notSeenMessagesCount && (
          <div className="rounded-full p-1 bg-muted-foreground text-primary">
            {notSeenMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
}
