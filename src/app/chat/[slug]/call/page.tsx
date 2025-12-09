"use client";
import { useCall } from "@/lib/client/useCall";
import { Button } from "@/components/ui/button";
import { PhoneOff, PhoneCall, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CallPage() {
  const {
    localVideoRef,
    remoteVideoRef,
    endCall,
    callStatus,
    incomingCall,
    outgoingCall,
    activeCall,
    call,
    localStream,
    remoteStream,
  } = useCall();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add logging for debugging
  useEffect(() => {
    console.log("=== CALL PAGE DEBUG ===");
    console.log("Current call status:", callStatus);
    console.log("Has incoming call:", !!incomingCall);
    console.log("Has outgoing call:", !!outgoingCall);
    console.log("Has active call:", !!activeCall);
    console.log("Has call object:", !!call);
    console.log("Has local stream:", !!localStream);
    console.log("Has remote stream:", !!remoteStream);
    console.log("Current path:", window.location.pathname);
    console.log("Is initial load:", isInitialLoad);
  }, [
    callStatus,
    incomingCall,
    outgoingCall,
    activeCall,
    call,
    localStream,
    remoteStream,
    isInitialLoad,
  ]);

  // Reset initial load flag after first render
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        console.log("Resetting initial load flag");
        setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Navigate back to chat if call ends
  useEffect(() => {
    console.log("Checking if should navigate back...");
    console.log("Call status:", callStatus);

    // Only navigate back if call is truly ended
    if (callStatus === "ended") {
      console.log("Call ended, navigating back to chat in 2 seconds");
      const timer = setTimeout(() => {
        console.log("Navigating back to chat now");
        router.back();
      }, 2000);
      return () => {
        console.log("Clearing navigation timeout");
        clearTimeout(timer);
      };
    }
  }, [callStatus, router]);

  // Get call information
  const callInfo = activeCall || incomingCall || outgoingCall;
  const otherUserName =
    activeCall?.otherUser?.name ||
    incomingCall?.caller?.name ||
    outgoingCall?.receiver?.name ||
    "Unknown";
  const conversationName = callInfo?.conversation?.name || "Direct chat";

  console.log("Call info:", {
    hasCallInfo: !!callInfo,
    otherUserName,
    conversationName,
    callInfoType: activeCall
      ? "active"
      : incomingCall
        ? "incoming"
        : outgoingCall
          ? "outgoing"
          : "none",
  });

  // Show ringing screen for outgoing calls
  if (outgoingCall) {
    console.log("Rendering outgoing call screen");
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <PhoneCall className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Ringing...</h1>
            <p className="text-muted-foreground">
              Calling {outgoingCall.receiver?.name || "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              {outgoingCall.conversation?.name || "Direct chat"}
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <Button
            onClick={endCall}
            variant="destructive"
            className="mt-8"
            size="lg"
          >
            <PhoneOff className="mr-2 size-5" />
            Cancel Call
          </Button>
        </div>
      </div>
    );
  }

  // Show loading screen while determining call status
  if (
    (callStatus === "idle" && !incomingCall && !outgoingCall && !activeCall) ||
    isInitialLoad
  ) {
    console.log("Rendering loading screen - no call data yet or initial load");
    console.log("Is initial load:", isInitialLoad);
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="size-32 rounded-full bg-muted flex items-center justify-center">
            <PhoneCall className="size-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Setting up call...</h1>
            <p className="text-muted-foreground">Please wait a moment</p>
            {isInitialLoad && (
              <p className="text-xs text-muted-foreground">
                Loading call data...
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mt-8"
          >
            Back to Chat
          </Button>
        </div>
      </div>
    );
  }

  // Show ringing screen
  // Also show ringing if we have an outgoing call in Convex
  if (callStatus === "ringing" || (callStatus === "idle" && outgoingCall)) {
    console.log("Rendering ringing screen");
    console.log(
      "Call status:",
      callStatus,
      "Has outgoing call:",
      !!outgoingCall,
    );
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <PhoneCall className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Ringing...</h1>
            <p className="text-muted-foreground">Calling {otherUserName}</p>
            <p className="text-sm text-muted-foreground">{conversationName}</p>
            {outgoingCall && !call && (
              <p className="text-xs text-muted-foreground">
                Waiting for connection...
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <Button
            onClick={endCall}
            variant="destructive"
            className="mt-8"
            size="lg"
          >
            <PhoneOff className="mr-2 size-5" />
            Cancel Call
          </Button>
        </div>
      </div>
    );
  }

  // Show connecting screen
  if (callStatus === "connecting" && !call) {
    console.log("Rendering connecting screen - no call object yet");
    console.log(
      "Call status:",
      callStatus,
      "Has active call:",
      !!activeCall,
      "Has call object:",
      !!call,
      "Role:",
      activeCall?.role,
    );

    // Different messages based on role
    const connectingMessage =
      activeCall?.role === "caller"
        ? "Calling " + otherUserName + "..."
        : "Waiting for " + otherUserName + " to connect...";

    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <PhoneCall className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Connecting...</h1>
            <p className="text-muted-foreground">{connectingMessage}</p>
            {activeCall?.role === "caller" && (
              <p className="text-xs text-muted-foreground">
                Initiating media connection...
              </p>
            )}
            {activeCall?.role === "receiver" && (
              <p className="text-xs text-muted-foreground">
                Waiting for caller to connect...
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <Button
            onClick={endCall}
            variant="destructive"
            className="mt-8"
            size="lg"
          >
            <PhoneOff className="mr-2 size-5" />
            Cancel Call
          </Button>
        </div>
      </div>
    );
  }

  // Show active call screen
  if (
    (callStatus === "active" && call) ||
    (callStatus === "connecting" && call)
  ) {
    console.log("Rendering active call screen - CALL IS ACTIVE!");
    console.log("Call status:", callStatus, "Has call object:", !!call);
    console.log("Has remote stream:", !!remoteVideoRef.current?.srcObject);
    console.log("Has local stream:", !!localVideoRef.current?.srcObject);

    // Check if we have media streams
    const hasLocalVideo = !!localVideoRef.current?.srcObject;
    const hasRemoteVideo = !!remoteVideoRef.current?.srcObject;

    return (
      <div className="flex flex-col h-dvh bg-black">
        {/* Remote video (main) */}
        <div className="flex-1 relative">
          {hasRemoteVideo ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="size-16 text-primary" />
                </div>
                <p className="text-white text-lg">Waiting for video...</p>
                <p className="text-white/70 text-sm">
                  {activeCall?.role === "caller"
                    ? "Calling " + otherUserName
                    : "Connected to " + otherUserName}
                </p>
              </div>
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          {hasLocalVideo && (
            <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/30 shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Call controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="rounded-full size-14"
              >
                <PhoneOff className="size-7" />
              </Button>
            </div>
          </div>

          {/* Call info */}
          <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2">
            <p className="text-white font-medium">
              {callStatus === "active" ? "Active Call" : "Connecting..."}
            </p>
            <p className="text-white/70 text-sm">
              {activeCall?.role === "receiver"
                ? "Incoming call"
                : "Outgoing call"}
            </p>
            <p className="text-white/70 text-xs">{otherUserName}</p>
            {!hasRemoteVideo && (
              <p className="text-white/50 text-xs mt-1">
                {activeCall?.role === "caller"
                  ? "Waiting for receiver to answer..."
                  : "Waiting for caller's video..."}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show call ended screen
  if (callStatus === "ended") {
    console.log("Rendering call ended screen");
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="size-32 rounded-full bg-destructive/10 flex items-center justify-center">
            <PhoneOff className="size-16 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Call Ended</h1>
            <p className="text-muted-foreground">
              {incomingCall ? "Call was declined" : "Call was cancelled"}
            </p>
            <p className="text-sm text-muted-foreground">{otherUserName}</p>
          </div>
          <p className="text-sm text-muted-foreground">Returning to chat...</p>
        </div>
      </div>
    );
  }

  // Show incoming call screen (in case user navigates directly)
  if (callStatus === "incoming" || (callStatus === "idle" && incomingCall)) {
    console.log("Rendering incoming call screen in call page");
    console.log(
      "Call status:",
      callStatus,
      "Has incoming call:",
      !!incomingCall,
    );
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <PhoneCall className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Incoming Call</h1>
            <p className="text-muted-foreground">From: {otherUserName}</p>
            <p className="text-sm text-muted-foreground">{conversationName}</p>
            {incomingCall && !call && (
              <p className="text-xs text-muted-foreground">
                Please accept or decline in the chat
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Please go back to chat to answer the call
          </p>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mt-8"
          >
            Back to Chat
          </Button>
        </div>
      </div>
    );
  }

  // Default/fallback view
  console.log("Rendering fallback view - unexpected state!");
  console.log("Call status:", callStatus);
  console.log(
    "Has incoming:",
    !!incomingCall,
    "Has outgoing:",
    !!outgoingCall,
    "Has active:",
    !!activeCall,
  );

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-background">
      <div className="text-center space-y-6">
        <div className="size-32 rounded-full bg-muted flex items-center justify-center">
          <PhoneCall className="size-16 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Call Status: {callStatus}</h1>
          <p className="text-muted-foreground">
            {callStatus === "idle" && "No active call"}
            {callStatus === "active" && "Active call"}
            {(callStatus as string) === "connecting" && "Connecting..."}
            {(callStatus as string) === "ringing" && "Ringing..."}
            {(callStatus as string) === "incoming" && "Incoming call..."}
            {(callStatus as string) === "ended" && "Call ended"}
            {!callStatus && "Unknown status"}
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-8"
        >
          Back to Chat
        </Button>
      </div>
    </div>
  );
}
