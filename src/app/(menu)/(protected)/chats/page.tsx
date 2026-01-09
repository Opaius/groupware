"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LucideSearch } from "lucide-react";
import { useQueryWithStatus } from "@/lib/client-utils";
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
import { useState, useMemo } from "react";

export default function ConversationList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isPending } = useQueryWithStatus(
    api.chat.conversations.getConversationsWithMetadata,
    { paginationOpts: { numItems: 10, cursor: null } },
  );

  const { data: conversationUsers } = useQueryWithStatus(
    api.chat.conversations.getUsersWithDirectConversations,
  );

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!data?.page) return [];
    return data.page.filter((dt) => {
      if (!dt?.conversation || !dt?.otherUser || !dt.otherUser.name)
        return false;
      const userName = dt.otherUser.name.toLowerCase() || "";
      return userName.includes(searchQuery.toLowerCase());
    });
  }, [data?.page, searchQuery]);

  // Filter users in dialog based on search query
  const filteredDialogUsers = useMemo(() => {
    if (!conversationUsers) return [];
    // Filter out null chats and ensure otherUser exists
    const validChats = conversationUsers.filter(
      (chat): chat is NonNullable<typeof chat> =>
        chat !== null && chat.otherUser?.name !== undefined,
    );
    return validChats.filter((chat) => {
      const userName = chat.otherUser.name.toLowerCase() || "";
      const userEmail = chat.otherUser.email.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return userName.includes(query) || userEmail.includes(query);
    });
  }, [conversationUsers, searchQuery]);

  return (
    <div className="my-10 mx-5">
      <div className="flex gap-4 items-center justify-between">
        <Input
          placeholder="Search conversations"
          icon={<LucideSearch className="size-4" />}
          iconPosition="right"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-xl text-primary">
              Chat +
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Your Conversations</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pr-2 overflow-y-auto max-h-[calc(80vh-100px)]">
              {filteredDialogUsers.map((chat) => (
                <AllUsersList key={chat.otherUser.id} chat={chat} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!isPending ? (
        <div className="flex flex-col gap-4 my-5">
          {filteredConversations.map((dt) => {
            // dt.otherUser is guaranteed to exist after filtering
            const otherUser = dt.otherUser!;
            return (
              <ConversationCard
                key={dt.conversation._id}
                conversation={dt.conversation}
                otherUser={{
                  name: otherUser.name || "Unknown User",
                  avatar: otherUser.avatarUrl || "",
                }}
                notSeenMessagesCount={dt.notSeenMessagesCount ?? null}
              />
            );
          })}
          {filteredConversations.length === 0 && !isPending && (
            <div className="text-sm flex flex-col items-center justify-center py-4">
              {searchQuery ? (
                <>
                  No conversations match "{searchQuery}",{" "}
                  <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                    Start a new conversation
                  </Button>
                </>
              ) : (
                <>
                  No conversations found,{" "}
                  <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                    Start a new conversation
                  </Button>
                </>
              )}
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
