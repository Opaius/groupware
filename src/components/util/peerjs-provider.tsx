// PeerProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import { authClient } from "@/lib/auth/auth-client";

type PeerContextType = {
  peer: Peer | null;
  isConnected: boolean;
  peerId: string | null;
};

const PeerContext = createContext<PeerContextType>({
  peer: null,
  isConnected: false,
  peerId: null,
});

export const PeerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);

  const { data } = authClient.useSession();
  const userId = data?.user?.id || null;

  useEffect(() => {
    if (!userId) {
      console.log("No user ID available for PeerJS");
      return;
    }

    console.log("Initializing PeerJS for user:", userId);

    // Configure PeerJS with explicit options
    const newPeer = new Peer(userId, {
      debug: 3, // Increased debug level
      secure: true,
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      // Use custom PeerServer for better reliability
      // host: "localhost",
      // port: 9000,
      // path: "/myapp",
      config: {
        iceServers: [
          // Free STUN servers
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
          // Free TURN servers (may not be reliable)
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
        iceCandidatePoolSize: 10,
      },
    });

    console.log("PeerJS instance created with ID:", userId);
    console.log("PeerJS configuration:", {
      host: "0.peerjs.com",
      port: 443,
      secure: true,
      iceServersCount: newPeer.options.config?.iceServers?.length || 0,
    });

    setPeer(newPeer);

    newPeer.on("open", (id) => {
      console.log("✅ Peer connected successfully with ID:", id);
      console.log("Peer connection details:", {
        id,
        destroyed: newPeer.destroyed,
        disconnected: newPeer.disconnected,
      });
      setIsConnected(true);
      setPeerId(id);
    });

    newPeer.on("error", (err) => {
      console.error("❌ PeerJS error:", err);
      console.error("Error type:", err.type);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Current peer state:", {
        id: newPeer.id,
        destroyed: newPeer.destroyed,
        disconnected: newPeer.disconnected,
      });
      setIsConnected(false);
    });

    newPeer.on("disconnected", () => {
      console.log("Peer disconnected");
      console.log("Current peer state:", {
        id: newPeer.id,
        destroyed: newPeer.destroyed,
        disconnected: newPeer.disconnected,
      });
      setIsConnected(false);

      // Try to reconnect after 1 second
      setTimeout(() => {
        if (!newPeer.destroyed) {
          console.log("Attempting to reconnect PeerJS...");
          newPeer.reconnect();
        }
      }, 1000);
    });

    newPeer.on("close", () => {
      console.log("Peer closed");
      console.log("Current peer state:", {
        id: newPeer.id,
        destroyed: newPeer.destroyed,
        disconnected: newPeer.disconnected,
      });
      setIsConnected(false);
      setPeerId(null);
    });

    return () => {
      console.log("Cleaning up PeerJS instance");
      console.log("Peer state before cleanup:", {
        id: newPeer.id,
        destroyed: newPeer.destroyed,
        disconnected: newPeer.disconnected,
        connections: newPeer.connections
          ? Object.keys(newPeer.connections).length
          : 0,
      });

      if (newPeer && !newPeer.destroyed) {
        // Close all connections first
        if (newPeer.connections) {
          Object.values(newPeer.connections).forEach((conns: any) => {
            if (Array.isArray(conns)) {
              conns.forEach((conn: any) => {
                if (conn && typeof conn.close === "function") {
                  console.log("Closing connection to:", conn.peer);
                  conn.close();
                }
              });
            }
          });
        }

        // Destroy the peer
        newPeer.destroy();
        console.log("PeerJS instance destroyed");
      }
    };
  }, [userId]);

  // Don't render children until peer is ready if we have a user
  if (userId && !isConnected) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <PeerContext.Provider value={{ peer, isConnected, peerId }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  const context = useContext(PeerContext);
  console.log("usePeer hook returning:", {
    peer: context.peer ? "available" : "null",
    isConnected: context.isConnected,
    peerId: context.peerId,
    connections: context.peer?.connections
      ? Object.keys(context.peer.connections).length
      : 0,
  });

  // Log peer state for debugging
  if (context.peer) {
    console.log("Peer instance details:", {
      id: context.peer.id,
      destroyed: context.peer.destroyed,
      disconnected: context.peer.disconnected,
      options: context.peer.options,
    });
  }

  return context.peer;
};

export const usePeerConnection = () => useContext(PeerContext);
