import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  console.log("teeeest", requestUrl, origin, code);

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = createClient();

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${origin}/login`);
    }

    return NextResponse.redirect(`${origin}/sites`);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.redirect(`${origin}/login`);
  }
}
