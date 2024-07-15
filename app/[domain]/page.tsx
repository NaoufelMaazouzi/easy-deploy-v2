import { fetchSitesWithFilter } from "@/lib/utils/fetchers";
import dynamic from "next/dynamic";

export const revalidate = 5;

export async function generateStaticParams() {
  const allSites = await fetchSitesWithFilter("sites_without_users");
  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain &&
        !customDomain && {
          domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        },
      customDomain && {
        domain: `${subdomain ? `${subdomain}.${customDomain}` : customDomain}`,
      },
    ])
    .filter(Boolean);
  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const PageComponent = dynamic(() => import("../(models)/model1/page"));

  return <PageComponent params={params} />;
}
