// PeerProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import { authClient } from "@/lib/auth/auth-client";

type PeerContextType = {
  peer: Peer | null;
};

const PeerContext = createContext<PeerContextType>({ peer: null });

export const PeerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);

  const { data } = authClient.useSession();
  const userId = data?.user?.id || null;
  useEffect(() => {
    if (!userId) return;

    const newPeer = new Peer(userId, { debug: 2, secure: true });
    setPeer(newPeer);

    newPeer.on("open", (id) => console.log("Peer connected:", id));
    newPeer.on("error", (err) => console.error("PeerJS error:", err));

    return () => newPeer.destroy();
  }, [userId]);

  if (!userId) return <>{children}</>;

  return (
    <PeerContext.Provider value={{ peer }}>{children}</PeerContext.Provider>
  );
};

export const usePeer = () => useContext(PeerContext).peer;
