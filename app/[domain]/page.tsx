import { notFound } from "next/navigation";
import { getSiteData, fetchSitesWithFilter } from "@/lib/utils/fetchers";

import Banner from "../../components/Banner/index";
import Features from "../../components/Features/index";
import Services from "../../components/Services/index";
import CtaBanner from "@/components/ctaBanner";
import { isValidDomain } from "@/lib/utils";
import Faq from "@/components/Faq";
import { parsePhoneNumber } from "libphonenumber-js";

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

  return (
    <main>
      <Banner phoneNumberParsed={phoneNumberParsed} siteData={siteData} />
      <Features phoneNumberParsed={phoneNumberParsed} />
      <Services />
      <CtaBanner phoneNumberParsed={phoneNumberParsed} />
      <Faq phoneNumberParsed={phoneNumberParsed} />
    </main>
  );
}
