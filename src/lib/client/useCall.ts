// useCall.ts
"use client";

import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { usePeer, usePeerConnection } from "@/components/util/peerjs-provider";
import { MediaConnection } from "peerjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type CallStatus =
  | "idle"
  | "ringing"
  | "incoming"
  | "connecting"
  | "active"
  | "ended";

export function useCall() {
  const peer = usePeer();

  // Convex mutations
  const startCallMutation = useMutation(api.chat.calls.startCall);
  const acceptCallMutation = useMutation(api.chat.calls.acceptCall);
  const declineCallMutation = useMutation(api.chat.calls.declineCall);
  const cancelCallMutation = useMutation(api.chat.calls.cancelCall);
  const endCallMutation = useMutation(api.chat.calls.endCall);
  const endAllCallsForUserMutation = useMutation(
    api.chat.calls.endAllCallsForUser,
  );

  // Convex queries
  const incomingCallData = useQuery(api.chat.calls.getIncomingCall);
  const outgoingCallData = useQuery(api.chat.calls.getOutgoingCall);
  const activeCallData = useQuery(api.chat.calls.getActiveCall);

  // State
  const [call, setCall] = useState<MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentCallInvitationId, setCurrentCallInvitationId] =
    useState<Id<"callInvitations"> | null>(null);
  const [currentActiveCallId, setCurrentActiveCallId] =
    useState<Id<"activeCalls"> | null>(null);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callStatusRef = useRef<CallStatus>("idle");
  const currentCallInvitationIdRef = useRef<Id<"callInvitations"> | null>(null);
  const disconnectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPreparingMediaRef = useRef(false);
  const peerConnectionContext = usePeerConnection();

  // Update refs when state changes
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  useEffect(() => {
    currentCallInvitationIdRef.current = currentCallInvitationId;
  }, [currentCallInvitationId]);

  // Cleanup function
  const cleanupCall = useCallback(() => {
    console.log("=== CLEANUP CALL ===");
    console.log("Previous call status:", callStatusRef.current);
    console.log("Has call object:", !!call);
    console.log("Has local stream:", !!localStream);
    console.log("Has remote stream:", !!remoteStream);
    console.log(
      "Current call invitation ID:",
      currentCallInvitationIdRef.current,
    );
    console.log("Current active call ID:", currentActiveCallId);

    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    // Reset preparation flag
    isPreparingMediaRef.current = false;

    // Log stack trace to see what's calling cleanup
    console.log("Cleanup called from:", new Error().stack);

    // Don't cleanup if call is successfully active
    if (callStatusRef.current === "active" && call && remoteStream) {
      console.log("Call is active with remote stream, skipping cleanup");
      return;
    }

    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    if (call) {
      console.log("Closing PeerJS call connection");
      call.close();
    }

    if (localStream) {
      console.log(
        "Stopping local stream tracks:",
        localStream.getTracks().length,
      );
      localStream.getTracks().forEach((t) => t.stop());
    }

    setCall(null);
    setCallStatus("idle");
    setLocalStream(null);
    setRemoteStream(null);
    setCurrentCallInvitationId(null);
    setCurrentActiveCallId(null);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Update refs
    callStatusRef.current = "idle";
    currentCallInvitationIdRef.current = null;

    console.log("Cleanup completed, call status set to 'idle'");
  }, [call, localStream, remoteStream]);

  // Enhanced cleanup with disconnection handling
  const cleanupCallWithDisconnection = useCallback(async () => {
    console.log("Cleaning up call with disconnection handling");

    // Clear any disconnection timeout
    if (disconnectionTimeoutRef.current) {
      clearTimeout(disconnectionTimeoutRef.current);
      disconnectionTimeoutRef.current = null;
    }

    // If we have an active call invitation, cancel it
    if (
      currentCallInvitationIdRef.current &&
      callStatusRef.current === "ringing"
    ) {
      try {
        console.log(
          "Cancelling call due to disconnection:",
          currentCallInvitationIdRef.current,
        );
        await cancelCallMutation({
          callInvitationId: currentCallInvitationIdRef.current,
        });
      } catch (error) {
        console.error("Error cancelling call on disconnection:", error);
      }
    }

    // If we have an active call, end it
    if (
      currentActiveCallId &&
      (callStatusRef.current === "active" ||
        callStatusRef.current === "connecting")
    ) {
      try {
        console.log(
          "Ending active call due to disconnection:",
          currentActiveCallId,
        );
        await endCallMutation({ activeCallId: currentActiveCallId });
      } catch (error) {
        console.error("Error ending call on disconnection:", error);
      }
    }

    // Perform regular cleanup
    cleanupCall();
  }, [cleanupCall, cancelCallMutation, endCallMutation, currentActiveCallId]);

  // Handle incoming call from Convex
  useEffect(() => {
    if (incomingCallData && callStatusRef.current === "idle") {
      console.log("Incoming call detected:", incomingCallData);
      setCallStatus("incoming");
      setCurrentCallInvitationId(incomingCallData.invitation._id);

      // Auto-decline after 30 seconds
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = setTimeout(async () => {
        const invitationId = currentCallInvitationIdRef.current;
        if (callStatusRef.current === "incoming" && invitationId) {
          try {
            console.log("Auto-declining call:", invitationId);
            await declineCallMutation({
              callInvitationId: invitationId,
            });
            setCallStatus("ended");
            setTimeout(() => cleanupCall(), 2000);
          } catch (error) {
            console.error("Error auto-declining call:", error);
          }
        }
      }, 30000);
    }
  }, [incomingCallData, declineCallMutation, cleanupCall]);

  // Handle peer disconnection
  useEffect(() => {
    if (!peer) return;

    const handleDisconnected = () => {
      console.log("Peer disconnected, checking if we need to clean up calls");

      // Only cleanup if we're in a call state
      if (
        callStatusRef.current !== "idle" &&
        callStatusRef.current !== "ended"
      ) {
        console.log("Cleaning up call due to peer disconnection");

        // Set a timeout to wait for reconnection
        if (disconnectionTimeoutRef.current) {
          clearTimeout(disconnectionTimeoutRef.current);
        }

        disconnectionTimeoutRef.current = setTimeout(async () => {
          // If still disconnected after 5 seconds, cleanup the call
          if (!peerConnectionContext.isConnected) {
            await cleanupCallWithDisconnection();
          }
        }, 5000);
      }
    };

    const handleError = (error: any) => {
      console.error("Peer error:", error);
      // If it's a network error, handle disconnection
      if (error.type === "network" || error.type === "disconnected") {
        handleDisconnected();
      }
    };

    peer.on("disconnected", handleDisconnected);
    peer.on("error", handleError);

    return () => {
      peer.off("disconnected", handleDisconnected);
      peer.off("error", handleError);
    };
  }, [peer, cleanupCallWithDisconnection]);

  // Handle call interruption - if new call comes in, end current call
  useEffect(() => {
    if (!incomingCallData) return;

    console.log("Checking for call interruption...");
    console.log("Incoming call ID:", incomingCallData.invitation._id);
    console.log("Current invitation ID:", currentCallInvitationIdRef.current);
    console.log("Current call status:", callStatusRef.current);

    // Check if this is the SAME call we're already handling
    const isSameCall =
      currentCallInvitationIdRef.current === incomingCallData.invitation._id;

    // Only interrupt if:
    // 1. It's a different call (not the one we're currently handling)
    // 2. AND we're already in a call state (active, connecting, or ringing)
    if (
      !isSameCall &&
      (callStatusRef.current === "active" ||
        callStatusRef.current === "connecting" ||
        callStatusRef.current === "ringing")
    ) {
      console.log(
        "New incoming call detected while in another call, ending current call",
      );

      // Use the new function to end all calls for user
      const endCurrentCall = async () => {
        try {
          await endAllCallsForUserMutation({});
          cleanupCall();
        } catch (error) {
          console.error("Error ending all calls for interruption:", error);
          // Fallback to individual cleanup
          if (currentActiveCallId) {
            await endCallMutation({ activeCallId: currentActiveCallId });
          } else if (currentCallInvitationIdRef.current) {
            await cancelCallMutation({
              callInvitationId: currentCallInvitationIdRef.current,
            });
          }
          cleanupCall();
        }
      };

      endCurrentCall();
    } else if (isSameCall) {
      console.log("Same call, not interrupting");
    } else {
      console.log("No interruption needed");
    }
  }, [
    incomingCallData,
    currentActiveCallId,
    endCallMutation,
    cancelCallMutation,
    endAllCallsForUserMutation,
    cleanupCall,
  ]);

  // Prepare media connection for caller (get stream and call receiver)
  const prepareMediaConnection = useCallback(
    async (callData: NonNullable<typeof activeCallData>) => {
      if (!peer) {
        console.error("Peer not available");
        return;
      }

      // Prevent multiple calls
      if (call) {
        console.log("Caller: Already have a call object, skipping");
        return;
      }

      // Also check ref to handle race conditions
      if (callStatusRef.current === "active") {
        console.log("Caller: Already active, skipping");
        return;
      }

      // Prevent multiple preparation attempts
      if (isPreparingMediaRef.current) {
        console.log("Caller: Already preparing media connection, skipping");
        return;
      }

      // Mark that we're preparing media
      isPreparingMediaRef.current = true;

      try {
        console.log("Caller: Preparing media connection");
        // Get media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        console.log(
          "Caller: Media stream obtained, calling receiver:",
          callData.call.receiverPeerId,
        );

        // Caller initiates the media connection to receiver
        if (!callData.call.receiverPeerId) {
          console.error("Caller: No receiver peer ID available");
          cleanupCall();
          return;
        }

        const outgoingCall = peer.call(callData.call.receiverPeerId, stream);
        console.log("Caller: Call object created:", outgoingCall);
        console.log("Caller: Call peer ID:", outgoingCall.peer);
        console.log("Caller: Setting call object in state");
        setCall(outgoingCall);
        console.log("Caller: Call initiated to receiver");

        // Set connection timeout (30 seconds)
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        connectionTimeoutRef.current = setTimeout(() => {
          if (callStatusRef.current === "connecting" && !remoteStream) {
            console.error(
              "Caller: Connection timeout - no response from receiver after 30 seconds",
            );
            cleanupCall();
          }
        }, 30000);

        // Set up call handlers
        outgoingCall.on("stream", (remoteStream: MediaStream) => {
          console.log("Caller: SUCCESS: Received remote stream!");
          console.log("Remote stream tracks:", remoteStream.getTracks().length);
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current)
            remoteVideoRef.current.srcObject = remoteStream;
          // Only set to active when we actually have the remote stream
          setCallStatus("active");

          // Clear connection timeout since we're connected
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
        });

        outgoingCall.on("close", () => {
          console.log("Caller: Call closed event received");
          console.log(
            "Close event - current call status:",
            callStatusRef.current,
          );
          // Only cleanup if call wasn't already cleaned up
          if (callStatusRef.current !== "idle") {
            console.log("Call close event triggering cleanup");
            cleanupCall();
          } else {
            console.log("Call already idle, ignoring close event");
          }
        });

        outgoingCall.on("error", (error) => {
          console.error("Caller: Call error:", error);
          console.error("Error type:", error.type);
          console.error("Error message:", error.message);
          console.log(
            "Error event - current call status:",
            callStatusRef.current,
          );
          // Only cleanup on critical errors, not all errors
          if (
            (error.type as string) === "peer-unavailable" ||
            (error.type as string) === "network" ||
            (error.type as string) === "connection-closed"
          ) {
            console.log("Critical error, triggering cleanup");
            cleanupCall();
          } else {
            console.log("Non-critical error, not cleaning up call");
          }
        });

        // Store the stream so it can be used when receiver calls
        // The receiver will call us, and we'll handle it in the peer.on('call') listener
      } catch (error) {
        console.error("Error preparing media connection:", error);
        cleanupCall();
      } finally {
        // Reset preparation flag
        isPreparingMediaRef.current = false;
      }
    },
    [peer, cleanupCall],
  );

  // Handle active call from Convex
  useEffect(() => {
    console.log("=== ACTIVE CALL EFFECT ===");
    console.log("Active call data:", !!activeCallData);
    console.log("Current call object:", !!call);
    console.log("Current call status:", callStatusRef.current);
    console.log("Is preparing media:", isPreparingMediaRef.current);

    if (activeCallData && !call && callStatusRef.current !== "active") {
      console.log("Active call detected:", activeCallData);
      console.log("Caller ID:", activeCallData.call.callerId);
      console.log("Receiver ID:", activeCallData.call.receiverId);
      console.log("Receiver Peer ID:", activeCallData.call.receiverPeerId);
      setCurrentActiveCallId(activeCallData.call._id);

      // If we're the caller, prepare media connection (get stream and call receiver)
      // If we're the receiver, we already initiated the call in acceptCall
      if (activeCallData.role === "caller") {
        console.log("Caller: Active call detected, preparing media connection");
        setCallStatus("connecting");
        prepareMediaConnection(activeCallData);
      } else {
        console.log("Receiver: Already initiated call in acceptCall");
        // Receiver is waiting for caller to call them
        setCallStatus("connecting");
      }
    } else {
      console.log("Skipping active call processing:", {
        hasActiveCallData: !!activeCallData,
        hasCall: !!call,
        callStatus: callStatusRef.current,
        isPreparingMedia: isPreparingMediaRef.current,
      });
    }
  }, [activeCallData, call, prepareMediaConnection]);

  // Handle incoming media calls from PeerJS
  useEffect(() => {
    if (!peer) return;

    const handleCall = async (incomingCall: MediaConnection) => {
      console.log("=== INCOMING MEDIA CALL ===");
      console.log("From peer:", incomingCall.peer);
      console.log("Current call status:", callStatusRef.current);
      console.log("Has local stream:", !!localStream);
      console.log("Active call data role:", activeCallData?.role);
      console.log("Has call object:", !!call);

      // Only handle incoming calls if we're the receiver
      // Caller should not receive incoming calls since they initiate the call
      if (activeCallData?.role === "caller") {
        console.log(
          "Caller received incoming call, ignoring - caller initiates calls",
        );
        incomingCall.close();
        return;
      }

      // Only handle incoming calls if we're in a call state
      // But allow "connecting" state since that's when caller is trying to connect to us
      if (
        callStatusRef.current !== "connecting" &&
        callStatusRef.current !== "incoming"
      ) {
        console.log(
          "Not expecting a call (status: " +
            callStatusRef.current +
            "), ignoring incoming call",
        );
        incomingCall.close();
        return;
      }

      // If we already have a call object, ignore duplicate incoming calls
      if (call) {
        console.log(
          "Already have a call object, ignoring duplicate incoming call",
        );
        incomingCall.close();
        return;
      }

      // If we're the receiver and connecting, we should answer this call
      if (
        activeCallData?.role === "receiver" &&
        callStatusRef.current === "connecting"
      ) {
        console.log(
          "Receiver: This is the expected call from caller, answering...",
        );
        // Don't return - continue to answer the call
      }

      // If we're connecting, we should answer the call (this is the caller connecting to us)
      if (callStatusRef.current === "connecting") {
        console.log(
          "Receiver: In connecting state, answering incoming call from caller",
        );
        // Don't close the call - answer it instead
      } else if (callStatusRef.current === "active") {
        console.log("Already in active call, ignoring duplicate incoming call");
        incomingCall.close();
        return;
      }

      // Set call object immediately so we don't process duplicate calls
      console.log("Setting call object from incoming call");
      setCall(incomingCall);

      // Answer the call with our local stream
      console.log("Receiver: Answering incoming call from caller");
      try {
        // Get media stream if we don't have one
        let streamToUse = localStream;
        if (!streamToUse) {
          console.log("Getting media permissions for answering call");
          streamToUse = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(streamToUse);
          if (localVideoRef.current)
            localVideoRef.current.srcObject = streamToUse;
        }

        console.log("Answering call with stream");
        incomingCall.answer(streamToUse);
      } catch (error) {
        console.error("Failed to get media for answering call:", error);
        incomingCall.close();
        return;
      }

      console.log("Receiver: Call answered, waiting for remote stream");

      // Clear connection timeout since we have a call object
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      // Set up call handlers
      incomingCall.on("stream", (remoteStream: MediaStream) => {
        console.log("Receiver: SUCCESS: Received remote stream from caller!");
        console.log("Remote stream tracks:", remoteStream.getTracks().length);
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
        // Only set to active when we actually have the remote stream
        setCallStatus("active");
        console.log("Receiver: Call is now fully active!");
      });

      incomingCall.on("close", () => {
        console.log("Call closed");
        console.log(
          "Close event - current call status:",
          callStatusRef.current,
        );
        // Only cleanup if call wasn't already cleaned up
        if (callStatusRef.current !== "idle") {
          console.log("Call close event triggering cleanup");
          cleanupCall();
        } else {
          console.log("Call already idle, ignoring close event");
        }
      });

      incomingCall.on("error", (error) => {
        console.error("Call error:", error);
        console.error("Error type:", error.type);
        console.error("Error message:", error.message);
        console.log(
          "Error event - current call status:",
          callStatusRef.current,
        );
        // Only cleanup on critical errors, not all errors
        if (
          (error.type as string) === "peer-unavailable" ||
          (error.type as string) === "network" ||
          (error.type as string) === "connection-closed"
        ) {
          console.log("Critical error, triggering cleanup");
          cleanupCall();
        } else {
          console.log("Non-critical error, not cleaning up call");
        }
      });

      console.log("Call answered successfully");
    };

    // Only set up the call handler once
    if (peer) {
      peer.on("call", handleCall);
    }

    return () => {
      peer.off("call", handleCall);
    };
  }, [peer, activeCallData, call, localStream, cleanupCall]);

  // Start a call
  const startCall = useCallback(
    async (conversationId: Id<"conversations">, receiverId: string) => {
      if (!peer || callStatusRef.current !== "idle") {
        console.error("Cannot start call:", {
          peer: !!peer,
          callStatus: callStatusRef.current,
        });
        return false;
      }

      try {
        console.log("Starting call to:", receiverId);
        setCallStatus("ringing");

        // Create call invitation in Convex
        const result = await startCallMutation({
          conversationId,
          receiverId,
          callerPeerId: peer.id,
        });

        setCurrentCallInvitationId(result.callInvitationId);

        // Auto-cancel after 30 seconds
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = setTimeout(async () => {
          if (callStatusRef.current === "ringing" && result.callInvitationId) {
            try {
              console.log("Auto-cancelling call:", result.callInvitationId);
              await cancelCallMutation({
                callInvitationId: result.callInvitationId,
              });
              setCallStatus("ended");
              setTimeout(() => cleanupCall(), 2000);
            } catch (error) {
              console.error("Error auto-cancelling call:", error);
            }
          }
        }, 30000);

        return true;
      } catch (error) {
        console.error("Error starting call:", error);
        setCallStatus("idle");
        return false;
      }
    },
    [peer, startCallMutation, cancelCallMutation, cleanupCall],
  );

  // Force end current call (for call interruption)
  const forceEndCurrentCall = useCallback(async () => {
    try {
      await endAllCallsForUserMutation({});
      cleanupCall();
      return true;
    } catch (error) {
      console.error("Error ending all calls:", error);
      // Fallback to individual cleanup
      if (currentActiveCallId) {
        await endCallMutation({ activeCallId: currentActiveCallId });
      } else if (currentCallInvitationIdRef.current) {
        await cancelCallMutation({
          callInvitationId: currentCallInvitationIdRef.current,
        });
      }
      cleanupCall();
      return true;
    }
  }, [
    currentActiveCallId,
    endCallMutation,
    cancelCallMutation,
    endAllCallsForUserMutation,
    cleanupCall,
  ]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    console.log("=== ACCEPT CALL STARTED ===");
    console.log("Current call status:", callStatusRef.current);
    console.log("Has invitation ID:", !!currentCallInvitationIdRef.current);
    console.log("Peer available:", !!peer);
    console.log("Incoming call data:", !!incomingCallData);

    if (
      callStatusRef.current !== "incoming" ||
      !currentCallInvitationIdRef.current ||
      !peer ||
      !incomingCallData
    ) {
      console.error("Cannot accept call - preconditions failed:", {
        callStatus: callStatusRef.current,
        hasInvitation: !!currentCallInvitationIdRef.current,
        peer: !!peer,
        hasIncomingCallData: !!incomingCallData,
      });
      return false;
    }

    try {
      console.log("1. Starting call acceptance process");
      console.log("Call invitation ID:", currentCallInvitationIdRef.current);
      setCallStatus("connecting");
      console.log("2. Call status set to 'connecting'");

      // Get media stream
      console.log("3. Requesting media permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("4. Media permissions granted, stream obtained");

      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // Update call invitation in Convex
      console.log("5. Updating call invitation in Convex...");
      const result = await acceptCallMutation({
        callInvitationId: currentCallInvitationIdRef.current,
        receiverPeerId: peer.id,
      });
      console.log("6. Convex updated, active call ID:", result.activeCallId);

      setCurrentActiveCallId(result.activeCallId);

      // Receiver doesn't call the caller - instead waits for caller to call them
      // The caller will initiate the media connection in prepareMediaConnection
      console.log(
        "7. Receiver: Waiting for caller to initiate media connection",
      );
      console.log(
        "My peer ID:",
        peer.id,
        "Caller peer ID:",
        incomingCallData.invitation.callerPeerId,
      );

      // Set connection timeout (30 seconds)
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      connectionTimeoutRef.current = setTimeout(() => {
        if (callStatusRef.current === "connecting" && !call) {
          console.error(
            "Receiver: Connection timeout - no call from caller after 30 seconds",
          );
          cleanupCall();
        }
      }, 30000);

      console.log("9. ACCEPT CALL COMPLETED SUCCESSFULLY - waiting for caller");
      return true;
    } catch (error) {
      console.error("10. ERROR in acceptCall:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
      }
      cleanupCall();
      return false;
    }
  }, [peer, incomingCallData, acceptCallMutation, cleanupCall]);

  // Decline incoming call
  const declineCall = useCallback(async () => {
    if (
      callStatusRef.current !== "incoming" ||
      !currentCallInvitationIdRef.current
    ) {
      return false;
    }

    try {
      console.log("Declining call:", currentCallInvitationIdRef.current);
      await declineCallMutation({
        callInvitationId: currentCallInvitationIdRef.current,
      });
      setCallStatus("ended");
      setTimeout(() => cleanupCall(), 2000);
      return true;
    } catch (error) {
      console.error("Error declining call:", error);
      return false;
    }
  }, [declineCallMutation, cleanupCall]);

  // Cancel outgoing call
  const cancelCall = useCallback(async () => {
    if (
      callStatusRef.current !== "ringing" ||
      !currentCallInvitationIdRef.current
    ) {
      return false;
    }

    try {
      console.log("Cancelling call:", currentCallInvitationIdRef.current);
      await cancelCallMutation({
        callInvitationId: currentCallInvitationIdRef.current,
      });
      setCallStatus("ended");
      setTimeout(() => cleanupCall(), 2000);
      return true;
    } catch (error) {
      console.error("Error cancelling call:", error);
      return false;
    }
  }, [cancelCallMutation, cleanupCall]);

  // End active call
  const endCall = useCallback(async () => {
    console.log("=== END CALL STARTED ===");
    console.log("Current call status:", callStatusRef.current);
    console.log("Current active call ID:", currentActiveCallId);

    if (
      (callStatusRef.current !== "active" &&
        callStatusRef.current !== "connecting") ||
      !currentActiveCallId
    ) {
      console.log("Cannot end call - invalid state or no active call ID");
      return false;
    }

    try {
      console.log("Ending call with ID:", currentActiveCallId);
      await endCallMutation({ activeCallId: currentActiveCallId });
      console.log("Call ended successfully in Convex");
      cleanupCall();
      return true;
    } catch (error) {
      console.error("Error ending call:", error);
      return false;
    }
  }, [currentActiveCallId, endCallMutation, cleanupCall]);

  return {
    // State
    call,
    callStatus,
    localStream,
    remoteStream,
    incomingCall: incomingCallData,
    outgoingCall: outgoingCallData,
    activeCall: activeCallData,

    // Refs
    localVideoRef,
    remoteVideoRef,

    // Functions
    startCall,
    acceptCall,
    declineCall,
    cancelCall,
    endCall,
    cleanupCall,
    forceEndCurrentCall,
  };
}
