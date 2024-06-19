import { getSubdomainAndDomain } from "@/lib/utils";
import { fetchPagesBySubdomain } from "@/lib/utils/fetchers";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export const revalidate = 30;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get("host");
  let newSubdomain: string | null = null;
  if (host) {
    ({ subdomain: newSubdomain } = getSubdomainAndDomain(host));
  }
  const allPages = await fetchPagesBySubdomain(newSubdomain);
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
  return allPages.map(({ subdomain, customDomain, slug, updated_at }) => ({
    url: `https://${subdomain ? `${subdomain}.` : ""}${customDomain ? customDomain : process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${slug}`,
    lastModified: new Date(updated_at).toISOString(),
  }));
}
