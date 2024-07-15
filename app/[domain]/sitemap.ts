import { getSubdomainAndDomain } from "@/lib/utils";
import { fetchPagesBySubdomain, getSiteData } from "@/lib/utils/fetchers";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export const revalidate = 5;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get("host");
  let newSubdomain: string | null = null;
  let domain: string | null = null;
  let siteData;
  if (host) {
    ({ domain, subdomain: newSubdomain } = getSubdomainAndDomain(host));
    siteData = await getSiteData(host);
  }
  const allPages = await fetchPagesBySubdomain(newSubdomain, domain, true);
  allPages
    .map(({ subdomain, customDomain, slug, updated_at }) => {
      return {
        subdomain,
        customDomain,
        slug,
        updated_at,
      };
    })
    .filter(Boolean);
  let sitemapArray = allPages.map(
    ({ subdomain, customDomain, slug, updated_at }) => ({
      url: `https://${subdomain ? `${subdomain}.` : ""}${customDomain ? customDomain : process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${slug}`,
      lastModified: updated_at
        ? new Date(updated_at).toISOString()
        : new Date().toISOString(),
    })
  );

  if (siteData) {
    sitemapArray.unshift({
      url: `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? siteData.customDomain : process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      lastModified: new Date(siteData.updated_at).toISOString(),
    });
    sitemapArray.push({
      url: `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? siteData.customDomain : process.env.NEXT_PUBLIC_ROOT_DOMAIN}/mentions-légales`,
      lastModified: new Date(siteData.created_at).toISOString(),
    });
  }
  return sitemapArray;
}
