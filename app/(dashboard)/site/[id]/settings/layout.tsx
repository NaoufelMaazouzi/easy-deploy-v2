"use client";

import { ReactNode, useEffect, useState } from "react";
import SiteSettingsNav from "./nav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deleteSite, getSiteById } from "@/lib/serverActions/sitesActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UpdateSiteModal from "@/components/modal/update-site";

export default async function SiteAnalyticsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const [siteData, setSiteData] = useState<any>(null);
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSiteById(params.id);
        setSiteData(data);
        setUrl(
          `https://${data.subdomain ? `${data.subdomain}.` : ""}${data.customDomain ? `${data.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    };

    fetchData();
  }, [params.id]);

  const handleDeleteSite = async () => {
    const { status, text }: { status: "success" | "error"; text: string } =
      await deleteSite(Number(siteData.id));
    toast[status](text);
    return router.push("/sites");
  };

  if (!siteData) {
    return (
      <div className="flex flex-col space-y-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0">
        <div className="flex gap-10">
          <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
            Mon site {siteData.name}
          </h1>
          <Link
            href={url}
            replace
            className="truncate rounded-md bg-stone-100 px-2 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </Link>
          <Badge>{siteData.numberOfPages} pages</Badge>
          <UpdateSiteModal
            onclickFunc={handleDeleteSite}
            headerTitle="Attention"
            bodyText={"Êtes-vous sûr de vouloir supprimer ce site ?"}
            triggerComponent={
              <Button variant="destructive">Supprimer ce site</Button>
            }
          />
        </div>
      </div>
      <SiteSettingsNav />
      {children}
    </>
  );
}
