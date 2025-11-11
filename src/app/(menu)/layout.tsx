import { NavigationMenu } from "@/components/menu/navigationMenu";
export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex-1">{children}</div>
      <NavigationMenu />
    </div>
  );
}
