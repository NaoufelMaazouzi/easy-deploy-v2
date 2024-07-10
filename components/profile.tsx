import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./logout-button";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";

export default async function Profile() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/settings"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        <Image
          src={user?.user_metadata.avatar_url || ""}
          width={40}
          height={40}
          alt={"User avatar"}
          className="h-6 w-6 rounded-full"
        />
        <span className="truncate text-sm font-medium">
          {user?.user_metadata.name}
        </span>
      </Link>
      <LogoutButton />
    </div>
  );
}
