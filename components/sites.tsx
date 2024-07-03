"use client";

import SiteCard from "./site-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PlaceholderCard from "./placeholder-card";
import { fetchSitesWithFilterFromServer } from "@/lib/serverActions/sitesActions";

export default function Sites({ limit }: { limit?: number }) {
  const [allSites, setAllSites] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const sites = await fetchSitesWithFilterFromServer(
      "sites_with_users",
      [{ method: "order", column: "created_at", value: { ascending: true } }],
      true
    );
    setAllSites(sites);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sites" },
        (payload) => {
          fetchData();
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
        {Array.from({ length: 8 }).map((_, i) => (
          <PlaceholderCard key={i} />
        ))}
      </div>
    );
  }

  return allSites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {allSites.map((site: any) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">Aucun sites</h1>
      <Image
        alt="missing site"
        title="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Vous n'avez aucun sites pour le moment
      </p>
    </div>
  );
}
