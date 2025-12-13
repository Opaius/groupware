"use client";

import { CallScreen } from "@/lib/call/components/CallScreen";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CallPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.slug as string;
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add logging for debugging
  useEffect(() => {
    console.log("=== NEW CALL PAGE DEBUG ===");
    console.log("Conversation ID:", conversationId);
    console.log("Current path:", window.location.pathname);
    console.log("Is initial load:", isInitialLoad);
  }, [conversationId, isInitialLoad]);

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

  return (
    <div className="fixed inset-0 bg-background z-50">
      <CallScreen
        showLocalVideo={true}
        showRemoteVideo={true}
        showControls={true}
        showDuration={true}
        showParticipantInfo={true}
        compactMode={false}
        onMinimize={() => {
          console.log("Minimize requested");
          router.back();
        }}
      />

      {/* Debug info panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs p-2 rounded-md z-50">
          <div>Conversation: {conversationId}</div>
          <div>Path: {window.location.pathname}</div>
          <div>Initial Load: {isInitialLoad ? "Yes" : "No"}</div>
          <button
            onClick={() => router.back()}
            className="mt-2 px-2 py-1 bg-red-500 rounded text-xs"
          >
            Force Back
          </button>
        </div>
      )}
    </div>
  );
}
