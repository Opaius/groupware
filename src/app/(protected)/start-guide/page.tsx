"use client";

import GuideCarousel from "@/components/start-guide/GuideCarousel";

export default function StartGuidePage() {
  const handleComplete = () => {
    // Navigate to main app after guide completion
    console.log("Guide completed, navigating to main app");
    // TODO: Implement navigation to main app
    // Example: router.push("/dashboard");
  };

  const handleSkip = () => {
    // Skip the guide and navigate
    console.log("Guide skipped");
    // TODO: Implement navigation to skip guide
    // Example: router.push("/dashboard");
  };

  return <GuideCarousel onComplete={handleComplete} onSkip={handleSkip} />;
}
