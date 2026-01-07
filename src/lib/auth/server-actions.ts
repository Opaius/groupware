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
