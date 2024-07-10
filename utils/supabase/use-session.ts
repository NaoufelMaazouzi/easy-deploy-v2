"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./browser-client";

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    };

    getSession();
  }, []);

  return session;
}
