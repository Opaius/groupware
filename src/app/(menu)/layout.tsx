import { NavigationMenu } from "@/components/menu/navigationMenu";
export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">{children}</div>
      <NavigationMenu />
    </div>
  );
}
