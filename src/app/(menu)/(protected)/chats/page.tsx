"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LucideSearch } from "lucide-react";
import { useQueryWithStatus } from "@/lib/utils";
import { api } from "~/convex/_generated/api";
import { ConversationCard } from "@/components/chat/conversation-card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AllUsersList } from "@/components/chat/testing/all-users-list";
import { useState } from "react";

export default function ConversationList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isPending } = useQueryWithStatus(
    api.chat.conversations.getConversationsWithMetadata,
    { paginationOpts: { numItems: 10, cursor: null } },
  );

  const { data: allUsers } = useQueryWithStatus(api.auth.allUsers);

  return (
    <div className="my-10 mx-5">
      <div className="flex gap-4 items-center justify-between">
        <Input
          placeholder="Search"
          icon={<LucideSearch className="size-4" />}
          iconPosition="right"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-xl text-primary">
              Chat +
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Chat With People(testing)</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pr-2 overflow-y-auto max-h-[calc(80vh-100px)]">
              {allUsers?.map((user) => (
                <AllUsersList
                  key={user._id}
                  user={{
                    id: user._id,
                    name: user.name,
                    avatarUrl: user.image || "",
                    email: user.email,
                  }}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!isPending ? (
        <div className="flex flex-col gap-4 my-5">
          {data?.page.map((dt) => {
            if (!dt?.conversation || !dt?.otherUser) {
              return null;
            }

            return (
              <ConversationCard
                key={dt.conversation._id}
                conversation={dt.conversation}
                otherUser={{
                  name: dt.otherUser.name,
                  avatar: dt.otherUser.avatarUrl || "",
                }}
                notSeenMessagesCount={dt.notSeenMessagesCount ?? null}
              />
            );
          })}
          {data && data.page.length === 0 && !isPending && (
            <div className="text-sm flex flex-col items-center justify-center py-4">
              No conversations found,{" "}
              <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                Start a new conversation
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center my-5">
          <Loader2 className="animate-spin size-10 " />
        </div>
      )}
    </div>
  );
}
