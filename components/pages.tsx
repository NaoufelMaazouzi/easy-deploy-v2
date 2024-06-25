"use client";
// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";
import PageCard from "./page-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import throttle from "lodash/throttle";

export default async function Pages({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const [allPages, setAllPages] = useState<PagesWithSitesValues[]>([]);
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("pages_with_sites_values")
      .select("*")
      .eq("site_id", siteId);
    if (error) {
      return toast.error("Erreur lors de la récupération des pages");
    }
    setAllPages(data);
  };

  const throttledFetchPageData = throttle(fetchData, 20000, {
    leading: false,
    trailing: true,
  });

  useEffect(() => {
    fetchData();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pages",
          // filter: `id=eq.${pageData.id}`,
        },
        (payload) => {
          throttledFetchPageData();
        }
      )
      .subscribe();
  }, []);

  return allPages.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {allPages.map((page: PagesWithSitesValues) => (
        <PageCard key={page.id} data={page} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing page"
        title="missing page"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any page yet. Create one to get started.
      </p>
    </div>
  );
}
