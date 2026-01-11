"use server";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "./auth-server";
import { api } from "../../../convex/_generated/api";

export async function getUser() {
  const token = await getToken();

  if (!token) return null;
  const user = await fetchQuery(api.auth.getAuthUser, {}, { token });
  return user;
}

export async function checkOnboardingStatus() {
  const token = await getToken();
  if (!token)
    return { hasSeenOnboarding: false, hasProfile: false, profile: null };
  const status = await fetchQuery(
    api.onboarding.getOnboardingStatus,
    {},
    { token },
  );
  return status;
}

export async function getRedirectDestination() {
  const user = await getUser();
  if (!user) {
    return "/auth";
  }

  // Check onboarding status
  const onboardingStatus = await checkOnboardingStatus();

  if (onboardingStatus.hasSeenOnboarding) {
    // User has completed onboarding, go to main app
    return "/discover";
  }

  // User hasn't completed onboarding
  // Check if they have a profile (partial onboarding)
  if (onboardingStatus.hasProfile) {
    // User has started onboarding but didn't complete, send to onboarding flow
    return "/onboarding-flow";
  }

  // No profile yet - check if it's a new account (just signed up)
  if (user.hasFinishedCreateAccount === false) {
    // New user - show start guide first
    return "/start-guide";
  }

  // Existing user who hasn't started onboarding
  return "/onboarding-flow";
}
