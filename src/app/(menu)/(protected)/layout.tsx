import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/convex/_generated/api";

export async function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = await fetchQuery(api.auth.getAuthUser);
  if (!currentUser) {
    toast.error("Please log in !");
    redirect("/auth");
  }
  return children;
}
