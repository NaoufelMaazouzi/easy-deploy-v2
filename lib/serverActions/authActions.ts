"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithOAuth = async (provider: "google" | "github") => {
  const supabase = createSupabaseServerClient();
  const origin = headers().get("origin");
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log("Error signInWithOAuth:", error);
  } else if (data.url) {
    return redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export const signInWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/sites");
};

export const signUpWithEmail = async (formData: FormData) => {
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/login?message=Check email to continue sign in process");
};
