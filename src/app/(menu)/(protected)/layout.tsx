import { redirect } from "next/navigation";

import { getUser, checkOnboardingStatus } from "@/lib/auth/server-actions";

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

  // Check if user has completed onboarding
  const onboardingStatus = await checkOnboardingStatus();
  if (!onboardingStatus.hasSeenOnboarding) {
    redirect("/onboarding-flow");
  }

  return <>{children}</>;
}
