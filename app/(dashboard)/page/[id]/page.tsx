import { notFound } from "next/navigation";
import Editor from "@/components/editor";
import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pages_with_sites_values")
    .select("*")
    .eq("id", Number(params.id))
    .single();
  if (error) {
    notFound();
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!data || user?.id !== data.user_id) {
    notFound();
  }

  return <Editor pageData={data} />;
}
