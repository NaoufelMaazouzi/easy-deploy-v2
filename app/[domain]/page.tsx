import { notFound } from "next/navigation";
import { getSiteData, fetchSitesWithFilter } from "@/lib/utils/fetchers";
import { isValidDomain } from "@/lib/utils";
import { parsePhoneNumber } from "libphonenumber-js";
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
  const domain = decodeURIComponent(params.domain);
  let siteData;
  if (
    domain !== "images" &&
    !domain.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    siteData = await getSiteData(domain);
  }
  if (!siteData) {
    notFound();
  }
  let phoneNumberParsed: string | undefined;
  if (siteData.contactPhone) {
    phoneNumberParsed =
      parsePhoneNumber(siteData.contactPhone)?.formatNational() ||
      siteData.contactPhone;
  }
  const PageComponent = dynamic(() => import("../(models)/model1/page"));

  return <PageComponent siteData={siteData} />;
}
