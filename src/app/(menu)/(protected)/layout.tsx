import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { getToken } from "@/lib/auth/auth-server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the authentication token for server-side requests
  const token = await getToken();

  // Fetch the current user with the authentication token
  const currentUser = await fetchQuery(api.auth.getAuthUser, {}, { token });

  if (!currentUser) {
    // Redirect to auth page without using toast (server components can't use client APIs)
    redirect("/auth");
  }

  return <>{children}</>;
}
