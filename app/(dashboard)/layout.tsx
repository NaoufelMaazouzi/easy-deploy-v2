import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60">{children}</div>
    </div>
  );
}
