import { notFound } from "next/navigation";
import { getSiteData, fetchSitesWithFilter } from "@/lib/utils/fetchers";

import Banner from "../../components/Banner/index";
import Features from "../../components/Work/index";
import Cook from "../../components/Cook/index";
import Expert from "../../components/Expert/index";
import Gallery from "../../components/Gallery/index";
import Newsletter from "../../components/Newsletter/Newsletter";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  let siteData;
  if (domain !== "images" && !domain.endsWith(".png")) {
    siteData = await getSiteData(domain);
  }
  if (!siteData) {
    return null;
  }

  const { description, name } = siteData;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   customDomain && {
    //     alternates: {
    //       canonical: `https://${customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

export async function generateStaticParams() {
  const allSites = await fetchSitesWithFilter("sites_without_users");
  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain &&
        !customDomain && {
          domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        },
      customDomain && {
        domain: `${subdomain}.${customDomain}`,
      },
    ])
    .filter(Boolean);
  console.log("AAAAAAAAAA", allPaths);
  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  let siteData;
  if (domain !== "images" && !domain.endsWith(".png")) {
    siteData = await getSiteData(domain);
  }
  if (!siteData) {
    notFound();
  }

  return (
    <main>
      <Banner />
      <Features />
      <Cook />
      <Expert />
      <Gallery />
      <Newsletter />
    </main>
  );
}
