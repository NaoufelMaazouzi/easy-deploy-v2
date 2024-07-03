import { ReactNode } from "react";
import SiteSettingsNav from "./nav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getSiteById } from "@/lib/serverActions/sitesActions";

export default async function SiteAnalyticsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const siteData = await getSiteById(params.id);

  const url = `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? `${siteData.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;
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
        </div>
      </div>
      <SiteSettingsNav />
      {children}
    </>
  );
}
