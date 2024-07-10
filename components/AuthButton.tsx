import { signOut } from "@/lib/serverActions/authActions";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import Link from "next/link";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
