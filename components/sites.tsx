"use client";

import SiteCard from "./site-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function Sites({ limit }: { limit?: number }) {
  const [allSites, setAllSites] = useState<any>([]);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: sites, error } = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit || 100);
    if (error) {
      toast.error("Erreur lors de la récupération des sites");
    }
    setAllSites(sites);
  };

  useEffect(() => {
    fetchData();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sites" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  return allSites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {allSites.map((site: Sites) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Sites Yet</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
