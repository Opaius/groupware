"use client";
import { useCall } from "@/lib/client/useCall";

export default function ChatPage() {
  const { localVideoRef, remoteVideoRef, endCall, call } = useCall();

  return (
    <div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: 200, background: "#000" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: 200, background: "#000" }}
      />

      {call && <button onClick={endCall}>End Call</button>}
    </div>
  );
}
