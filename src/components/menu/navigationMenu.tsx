"use client";
import {
  LucideFilter,
  LucideHome,
  LucideMessageCircle,
  LucideUser,
  LucideBell,
} from "lucide-react";
import { MenuDock, MenuDockItem } from "../ui/shadcn-io/menu-dock";
const menuItems: MenuDockItem[] = [
  { label: "Discover", icon: LucideHome, link: "/discover" },

  { label: "Chat", icon: LucideMessageCircle, link: "/chats" },
  { label: "Notify", icon: LucideBell, link: "/notifications" },
  { label: "Profile", icon: LucideUser, link: "/account/settings" },
];
const pathnameMaps: { [key: string]: string[] } = {
  "/": ["/", "/discover", "/home"],
  "/chats": ["/chat/*", "/chats"],
  "/account/settings": ["/account/*", "/account", "/privacy-and-security"],
};
export function NavigationMenu() {
  return (
    <MenuDock
      items={menuItems}
      pathnameMaps={pathnameMaps}
      variant="large"
      className="text-primary grid grid-cols-4 rounded-none w-full max-w-md border-x-0 bg-gray-100 bottom-0 "
    />
  );
}
