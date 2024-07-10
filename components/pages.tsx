"use client";

import { redirect } from "next/navigation";
import PageCard from "./page-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import throttle from "lodash/throttle";
import PlaceholderCard from "./placeholder-card"; // Assurez-vous que PlaceholderCard est importé
import { fetchPagesWithFilter } from "@/lib/serverActions/pageActions";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

export default function Pages({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const [allPages, setAllPages] = useState<PagesWithSitesValues[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createSupabaseBrowserClient();

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchPagesWithFilter("pages_with_sites_values", [
      {
        method: "eq",
        column: "site_id",
        value: siteId,
      },
    ]);
    setAllPages(data);
    setLoading(false);
  };

  const throttledFetchPageData = throttle(fetchData, 20000, {
    leading: false,
    trailing: true,
  });

  useEffect(() => {
    fetchData();
    const subscription = supabase
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <PlaceholderCard key={i} />
        ))}
      </div>
    );
  }

  return allPages.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {allPages.map((page: any) => (
        <PageCard key={page.id} data={page} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">Aucunes pages</h1>
      <Image
        alt="missing page"
        title="missing page"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Vous n'avez aucunes pages pour le moment
      </p>
    </div>
  );
}
