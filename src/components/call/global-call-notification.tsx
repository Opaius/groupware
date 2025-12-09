"use client";

import { useCall } from "@/lib/client/useCall";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, PhoneCall, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

export function GlobalCallNotification() {
  const {
    callStatus,
    incomingCall,
    outgoingCall,
    activeCall,
    acceptCall,
    declineCall,
    cancelCall,
    endCall,
  } = useCall();

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Show notification for incoming/outgoing calls
  useEffect(() => {
    console.log("=== GLOBAL NOTIFICATION VISIBILITY CHECK ===");
    console.log("Call status:", callStatus);
    console.log("Has incoming call:", !!incomingCall);
    console.log("Has outgoing call:", !!outgoingCall);
    console.log("Has active call:", !!activeCall);
    console.log("Current path:", window.location.pathname);
    console.log("Is on call page:", window.location.pathname.includes("/call"));

    const shouldShow =
      callStatus === "incoming" ||
      callStatus === "ringing" ||
      (callStatus === "active" && !window.location.pathname.includes("/call"));

    console.log("Should show notification:", shouldShow);
    console.log(
      "Reason:",
      callStatus === "incoming"
        ? "incoming call"
        : callStatus === "ringing"
          ? "ringing call"
          : callStatus === "active" &&
              !window.location.pathname.includes("/call")
            ? "active call but not on call page"
            : "should not show",
    );
    setIsVisible(shouldShow);
  }, [callStatus, incomingCall, outgoingCall, activeCall]);

  // Auto-navigate caller to call page when call is accepted or connecting
  useEffect(() => {
    console.log("=== GLOBAL NOTIFICATION AUTO-NAVIGATION CHECK ===");
    console.log("Active call:", !!activeCall);
    if (activeCall) {
      console.log("Active call role:", activeCall.role);
      console.log(
        "Active call conversation ID:",
        activeCall.call.conversationId,
      );
    }
    console.log("Call status:", callStatus);
    console.log("Current path:", window.location.pathname);
    console.log("Is on call page:", window.location.pathname.includes("/call"));

    if (
      activeCall &&
      (callStatus === "active" || callStatus === "connecting")
    ) {
      // If we're the caller and call is active or connecting, navigate to call page
      if (
        activeCall.role === "caller" &&
        !window.location.pathname.includes("/call")
      ) {
        console.log("Global notification: Auto-navigating caller to call page");
        const conversationId = activeCall.call.conversationId;
        console.log("Will navigate to:", `/chat/${conversationId}/call`);
        // Use setTimeout to ensure navigation happens after state updates
        setTimeout(() => {
          console.log("Executing navigation now...");
          const targetPath = `/chat/${conversationId}/call`;

          // Try router.push first
          try {
            router.push(targetPath);
            console.log(
              "Caller auto-navigation router.push called successfully",
            );

            // Fallback: if navigation doesn't happen in 2 seconds, use window.location
            setTimeout(() => {
              if (window.location.pathname !== targetPath) {
                console.log(
                  "Caller auto-navigation router.push may have failed, using window.location",
                );
                window.location.href = targetPath;
              }
            }, 2000);
          } catch (error) {
            console.error("Caller auto-navigation router.push failed:", error);
            console.log(
              "Caller auto-navigation falling back to window.location",
            );
            window.location.href = targetPath;
          }
        }, 500);
      } else if (activeCall.role === "caller") {
        console.log("Caller is already on call page, no navigation needed");
      } else if (activeCall.role === "receiver") {
        console.log("Receiver doesn't need auto-navigation");
      }
    } else {
      console.log(
        "No auto-navigation:",
        !activeCall
          ? "No active call"
          : callStatus !== "active" && callStatus !== "connecting"
            ? `Call status is ${callStatus}, not active or connecting`
            : "Unknown reason",
      );
    }
  }, [activeCall, callStatus, router]);

  if (!isVisible) return null;

  const getCallInfo = () => {
    if (incomingCall) {
      return {
        type: "incoming" as const,
        title: "Incoming Call",
        description: `${incomingCall.caller?.name || "Unknown"} is calling you`,
        avatar: incomingCall.caller?.image,
        name: incomingCall.caller?.name || "Caller",
        conversationName: incomingCall.conversation?.name || "Direct chat",
      };
    }

    if (outgoingCall) {
      return {
        type: "outgoing" as const,
        title: "Calling...",
        description: `Calling ${outgoingCall.receiver?.name || "Unknown"}`,
        avatar: outgoingCall.receiver?.image,
        name: outgoingCall.receiver?.name || "Receiver",
        conversationName: outgoingCall.conversation?.name || "Direct chat",
      };
    }

    if (activeCall && !window.location.pathname.includes("/call")) {
      return {
        type: "active" as const,
        title: "Active Call",
        description: `In call with ${activeCall.otherUser?.name || "Unknown"}`,
        avatar: activeCall.otherUser?.image,
        name: activeCall.otherUser?.name || "User",
        conversationName: activeCall.conversation?.name || "Direct chat",
      };
    }

    return null;
  };

  const callInfo = getCallInfo();
  if (!callInfo) return null;

  const getRandomColorBasedOnName = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#06D6A0",
      "#118AB2",
      "#EF476F",
      "#FFD166",
      "#06D6A0",
      "#118AB2",
      "#073B4C",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <div className="bg-background rounded-xl shadow-2xl border p-4 animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Avatar className="size-12 border-2 border-primary/20">
              <AvatarImage src={callInfo.avatar ?? ""} />
              <AvatarFallback
                style={{
                  backgroundColor: getRandomColorBasedOnName(callInfo.name),
                }}
              >
                {getInitials(callInfo.name)}
              </AvatarFallback>
            </Avatar>
            {(callInfo.type === "incoming" || callInfo.type === "outgoing") && (
              <div className="absolute -top-1 -right-1 animate-ping">
                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <PhoneCall className="size-3 text-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{callInfo.title}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {callInfo.description}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {callInfo.conversationName}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {callInfo.type === "incoming" && (
            <>
              <Button
                onClick={declineCall}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <PhoneOff className="size-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={async (event) => {
                  console.log(
                    "=== GLOBAL NOTIFICATION: ACCEPT BUTTON CLICKED ===",
                  );
                  console.log("Incoming call data:", incomingCall);
                  console.log(
                    "Conversation ID:",
                    incomingCall?.invitation.conversationId,
                  );

                  // Prevent multiple clicks
                  const button = event.currentTarget as HTMLButtonElement;
                  button.disabled = true;

                  const success = await acceptCall();
                  console.log(
                    "Global notification: acceptCall result:",
                    success,
                  );

                  if (success) {
                    // Wait a moment for the call to establish before navigating
                    setTimeout(() => {
                      if (incomingCall?.invitation.conversationId) {
                        const targetPath = `/chat/${incomingCall.invitation.conversationId}/call`;
                        console.log(
                          "Global notification: Navigating to call page:",
                          targetPath,
                        );

                        // Check if we're already on the call page
                        if (window.location.pathname === targetPath) {
                          console.log(
                            "Already on call page, skipping navigation",
                          );
                          return;
                        }

                        // Try router.push first
                        try {
                          router.push(targetPath);
                          console.log("Router.push called successfully");

                          // Fallback: if navigation doesn't happen in 2 seconds, use window.location
                          setTimeout(() => {
                            if (window.location.pathname !== targetPath) {
                              console.log(
                                "Router.push may have failed, using window.location",
                              );
                              window.location.href = targetPath;
                            }
                          }, 2000);
                        } catch (error) {
                          console.error("Router.push failed:", error);
                          console.log("Falling back to window.location");
                          window.location.href = targetPath;
                        }
                      } else {
                        console.error(
                          "Global notification: No conversation ID for navigation",
                        );
                      }
                    }, 1000);
                  } else {
                    console.error("Global notification: acceptCall failed");
                    // Re-enable button on failure
                    button.disabled = false;
                  }
                }}
                variant="default"
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Phone className="size-4 mr-2" />
                Accept
              </Button>
            </>
          )}

          {callInfo.type === "outgoing" && (
            <>
              <Button
                onClick={cancelCall}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <PhoneOff className="size-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={(event) => {
                  console.log(
                    "=== GLOBAL NOTIFICATION: VIEW CALL BUTTON CLICKED ===",
                  );
                  console.log("Outgoing call data:", outgoingCall);

                  // Prevent multiple clicks
                  const button = event.currentTarget as HTMLButtonElement;
                  button.disabled = true;

                  if (outgoingCall?.invitation.conversationId) {
                    const targetPath = `/chat/${outgoingCall.invitation.conversationId}/call`;
                    console.log("Navigating to:", targetPath);

                    // Check if we're already on the call page
                    if (window.location.pathname === targetPath) {
                      console.log("Already on call page, skipping navigation");
                      button.disabled = false;
                      return;
                    }

                    // Try router.push first
                    try {
                      router.push(targetPath);
                      console.log("View call router.push called successfully");

                      // Fallback: if navigation doesn't happen in 2 seconds, use window.location
                      setTimeout(() => {
                        if (window.location.pathname !== targetPath) {
                          console.log(
                            "View call router.push may have failed, using window.location",
                          );
                          window.location.href = targetPath;
                        }
                      }, 2000);
                    } catch (error) {
                      console.error("View call router.push failed:", error);
                      console.log("View call falling back to window.location");
                      window.location.href = targetPath;
                    }
                  } else {
                    console.error("No conversation ID for navigation");
                    button.disabled = false;
                  }
                }}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <PhoneCall className="size-4 mr-2" />
                View Call
              </Button>
            </>
          )}

          {callInfo.type === "active" && (
            <>
              <Button
                onClick={endCall}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <PhoneOff className="size-4 mr-2" />
                End Call
              </Button>
              <Button
                onClick={(event) => {
                  // Prevent multiple clicks
                  const button = event.currentTarget as HTMLButtonElement;
                  button.disabled = true;

                  if (activeCall?.call.conversationId) {
                    const targetPath = `/chat/${activeCall.call.conversationId}/call`;
                    console.log("Join call navigating to:", targetPath);

                    // Check if we're already on the call page
                    if (window.location.pathname === targetPath) {
                      console.log("Already on call page, skipping navigation");
                      button.disabled = false;
                      return;
                    }

                    // Try router.push first
                    try {
                      router.push(targetPath);
                      console.log("Join call router.push called successfully");

                      // Fallback: if navigation doesn't happen in 2 seconds, use window.location
                      setTimeout(() => {
                        if (window.location.pathname !== targetPath) {
                          console.log(
                            "Join call router.push may have failed, using window.location",
                          );
                          window.location.href = targetPath;
                        }
                      }, 2000);
                    } catch (error) {
                      console.error("Join call router.push failed:", error);
                      console.log("Join call falling back to window.location");
                      window.location.href = targetPath;
                    }
                  } else {
                    button.disabled = false;
                  }
                }}
                variant="default"
                size="sm"
                className="flex-1"
              >
                <Video className="size-4 mr-2" />
                Join Call
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
