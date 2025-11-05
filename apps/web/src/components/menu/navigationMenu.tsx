"use client";
import {
  LucideFilter,
  LucideHome,
  LucideMessageCircle,
  LucideUser,
  LucideBell,
} from "lucide-react";
import { MenuDock } from "../ui/shadcn-io/menu-dock";

export function NavigationMenu() {
  const menuItems = [
    { label: "Discover", icon: LucideHome, href: "/" },
    { label: "Filter", icon: LucideFilter, href: "/filter" },
    { label: "Chat", icon: LucideMessageCircle, href: "/chats" },
    { label: "Notify", icon: LucideBell, href: "/notify" },
    { label: "Profile", icon: LucideUser, href: "/profile" },
  ];
  return (
    <MenuDock
      items={menuItems}
      variant="large"
      className="text-primary grid grid-cols-5 rounded-none border-x-0 bg-muted"
    />
  );
}
