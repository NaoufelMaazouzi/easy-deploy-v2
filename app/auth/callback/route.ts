import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/sites`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
