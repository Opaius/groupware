import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/server-actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the authentication token for server-side requests
  const currentUser = await getUser();
  if (!currentUser) {
    redirect("/auth");
  }

  return <>{children}</>;
}
