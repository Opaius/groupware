"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { LoginFormData, SignupFormData } from "@/lib/zod/auth";
import { success } from "zod";

export async function login({
  formData,
  callBackURL,
}: {
  formData: LoginFormData;
  callBackURL: string;
}) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return error.message;
  } else {
    revalidatePath(callBackURL, "layout");
    redirect(callBackURL);
  }
}

export async function signup({
  formData,
  callBackURL,
}: {
  formData: SignupFormData;
  callBackURL: string;
}) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });
  if (error) {
    return error.message;
  } else {
    revalidatePath(callBackURL, "layout");
    redirect(callBackURL);
  }
}
