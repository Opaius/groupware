"use client";
import {
  LucideFilter,
  LucideHome,
  LucideMessageCircle,
  LucideUser,
  LucideBell,
} from "lucide-react";
import { MenuDock, MenuDockItem } from "../ui/shadcn-io/menu-dock";

export function NavigationMenu() {
  const menuItems: MenuDockItem[] = [
    {
      label: "Discover",
      icon: LucideHome,
      onClick: () => {
        window.location.href = "/discover";
      },
    },
    {
      label: "Filter",
      icon: LucideFilter,
      onClick: () => {
        window.location.href = "/filter";
      },
    },
    {
      label: "Chat",
      icon: LucideMessageCircle,
      onClick: () => {
        window.location.href = "/chats";
      },
    },
    {
      label: "Notify",
      icon: LucideBell,
      onClick: () => {
        window.location.href = "/notify";
      },
    },
    {
      label: "Profile",
      icon: LucideUser,
      onClick: () => {
        window.location.href = "/profile";
      },
    },
  ];
  return (
    <MenuDock
      items={menuItems}
      variant="large"
      className="text-primary grid grid-cols-5 rounded-none w-full max-w-md border-x-0 bg-gray-100 bottom-0"
    />
  );
}
