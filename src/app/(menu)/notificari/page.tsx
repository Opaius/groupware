"use client";

import { Handshake, MessageSquare, Hourglass, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";

// Tipuri de date pentru notificări ca să fie ușor de gestionat
const notifications = [
  {
    id: 1,
    type: "request",
    icon: <Handshake className="text-[#1d324e]" size={32} />,
    text: "Your skill is requested!",
    buttonText: "Accept trade",
  },
  {
    id: 2,
    type: "sent",
    icon: <Handshake className="text-[#1d324e]" size={32} />,
    text: "You requested a trade!",
    buttonText: null, // Unele pot să nu aibă buton conform designului
  },
  {
    id: 3,
    type: "active",
    icon: <Handshake className="text-[#1d324e]" size={32} />,
    text: "You are in a trade!",
    buttonText: "Start Chatting",
  },
  {
    id: 4,
    type: "meeting",
    icon: <Hourglass className="text-[#1d324e]" size={32} />,
    text: "You have meet in 00:30!",
    buttonText: "Start Chatting",
  },
  {
    id: 5,
    type: "received",
    icon: <Handshake className="text-[#1d324e]" size={32} />,
    text: "You receive a skill!",
    buttonText: "Skill is completed",
  },
];

export default function NotificationsPage() {
  return (
    <div className="w-full min-h-screen bg-[#DCE9FB]/50 sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] mx-auto pb-10">
      {/* Header Identic cu ContactSupport */}
      <div className="pt-6 px-6 pb-4 bg-[#DCE9FB]">
        <div className="flex items-center gap-2">
          <BackButton />
          <span className="text-primary font-medium text-lg">Notifications</span>
        </div>
      </div>

      {/* Lista de Notificări */}
      <div className="px-6 py-6 flex flex-col gap-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white rounded-[15px] p-6 flex flex-col items-center justify-center shadow-sm border border-black/5"
          >
            {/* Iconița */}
            <div className="mb-4">
              {notif.icon}
            </div>

            {/* Textul Notificării */}
            <p className="text-[#1d324e] font-semibold text-[1.1rem] mb-4 text-center">
              {notif.text}
            </p>

            {/* Butonul (dacă există) - Folosind shadcn Button stilizat ca în poza ta */}
            {notif.buttonText && (
              <Button
                variant="outline"
                className="w-full max-w-[200px] h-[40px] bg-white border border-[#6085b9] text-[#037ee6] hover:bg-[#f0f7ff] rounded-lg transition-colors"
              >
                {notif.buttonText}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}