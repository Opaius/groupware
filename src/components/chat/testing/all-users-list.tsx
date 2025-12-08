import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";
import { useMutation } from "convex/react";
import { LucideMessageCircle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

type Props = {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
  };
};

export function AllUsersList({ user }: Props) {
  const avatarColor = getRandomColorBasedOnName(user.name);

  const router = useRouter();

  const mutation = useMutation(
    api.chat.conversations.getOrCreateDirectConversation
  );
  return (
    <div className="w-full gap-2 bg-muted items-center py-5 flex rounded-md px-4 border-muted">
      <Avatar>
        <AvatarFallback
          style={{
            backgroundColor: avatarColor,
          }}
        >
          {getInitials(user.name)}
        </AvatarFallback>
        <AvatarImage src={user.avatarUrl || ""} />
      </Avatar>
      <div className="flex flex-col">
        <div>{user.name}</div>
        <div>{user.email}</div>
      </div>
      <Button
        size="icon-lg"
        className="ml-auto"
        onClick={async () => {
          const result = await mutation({
            userB: user.id,
          });
          if (result) router.push(`/chat/${result}`);
        }}
      >
        <LucideMessageCircle />
      </Button>
    </div>
  );
}
