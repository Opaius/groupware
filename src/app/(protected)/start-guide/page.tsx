"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import GuideCarousel from "@/components/start-guide/GuideCarousel";

export default function StartGuidePage() {
  const router = useRouter();
  const markAccountCreationComplete = useMutation(
    api.auth.markAccountCreationComplete,
  );

  const onboardingStatus = useQuery(api.onboarding.getOnboardingStatus, {});

  useEffect(() => {
    if (onboardingStatus === undefined) return; // still loading

    if (onboardingStatus?.hasSeenOnboarding) {
      router.push("/discover");
      return;
    }

    // If user already has a profile, they've started onboarding - skip to onboarding flow
    if (onboardingStatus?.hasProfile) {
      router.push("/onboarding-flow");
      return;
    }
  }, [onboardingStatus, router]);

  const handleComplete = async () => {
    console.log("Guide completed, navigating to onboarding");
    try {
      await markAccountCreationComplete();
      router.push("/onboarding-flow");
    } catch (error) {
      console.error("Failed to mark account creation complete:", error);
      router.push("/onboarding-flow");
    }
  };

  const handleSkip = async () => {
    console.log("Guide skipped, navigating to onboarding");
    try {
      await markAccountCreationComplete();
      router.push("/onboarding-flow");
    } catch (error) {
      console.error("Failed to mark account creation complete:", error);
      router.push("/onboarding-flow");
    }
  };

  if (onboardingStatus === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // If we should redirect, return null (redirect will happen)
  if (onboardingStatus?.hasSeenOnboarding || onboardingStatus?.hasProfile) {
    return null;
  }

  return <GuideCarousel onComplete={handleComplete} onSkip={handleSkip} />;
}
