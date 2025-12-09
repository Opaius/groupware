// useCall.ts
"use client";

import { useState, useRef, useEffect } from "react";
import { usePeer } from "@/components/util/peerjs-provider";
import { MediaConnection } from "peerjs";

export function useCall() {
  const peer = usePeer();
  const [call, setCall] = useState<MediaConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Answer incoming calls
  useEffect(() => {
    if (!peer) return;

    const handleCall = async (incomingCall: MediaConnection) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      incomingCall.answer(stream);
      setCall(incomingCall);

      incomingCall.on("stream", (remoteStream: MediaStream) => {
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
      });
    };

    peer.on("call", handleCall);

    return () => {
      peer.off("call", handleCall);
    };
  }, [peer]);

  const startCall = async (remotePeerId: string) => {
    if (!peer) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const outgoingCall = peer.call(remotePeerId, stream);
    setCall(outgoingCall);

    outgoingCall.on("stream", (remoteStream: MediaStream) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = remoteStream;
    });
  };

  const endCall = () => {
    call?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setCall(null);
  };

  return { call, localVideoRef, remoteVideoRef, startCall, endCall };
}
