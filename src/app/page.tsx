import { redirect } from "next/navigation";
import { getRedirectDestination } from "@/lib/auth/server-actions";

export default async function Home() {
  // 1. Set a default destination (fallback)
  let destination = "/auth";

  try {
    // 2. Attempt to fetch the real destination
    // If this succeeds, we update the variable
    destination = await getRedirectDestination();
  } catch (error) {
    // 3. If the DB call fails, log it
    // The destination stays as "/auth"
    console.error("Error fetching destination, falling back to auth:", error);
  }

  // 4. Redirect happens HERE, outside the try/catch
  // This allows the NEXT_REDIRECT error to propagate correctly to Next.js
  redirect(destination);
}
