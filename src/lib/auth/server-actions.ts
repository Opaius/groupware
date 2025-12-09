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
