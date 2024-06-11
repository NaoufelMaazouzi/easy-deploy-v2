import { Suspense } from "react";
import Sites from "@/components/sites";
import PlaceholderCard from "@/components/placeholder-card";
import CreateSiteButton from "@/components/create-site-button";
import CreateSiteModal from "@/components/modal/create-site";
import { createClient } from "@/utils/supabase/server";

export default async function AllSites({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: test, error } = await supabase.from("test").select("*");

  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "test" },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            All Sites {test?.map((value) => <li>{value.name}</li>)}
          </h1>
          <CreateSiteButton />
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* @ts-expect-error Server Component */}
          <Sites siteId={decodeURIComponent(params.id)} />
        </Suspense>
      </div>
    </div>
  );
}
