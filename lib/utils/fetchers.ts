"use server";

import { unstable_cache } from "next/cache";
// import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";
import { createClient } from "@/utils/supabase/client";

import { getSubdomainAndDomain } from ".";
import { FilterType } from "./types";

// export async function getAllSites() {
//   let query = supabase.from("sites_without_users").select("*");

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error getAllSites site:", error);
//     return [];
//   }

//   return data;
// }

// const fetchSite = async (subdomain: string | null, domain?: string | null) => {
// const supabase = createClient();
//   let query = supabase.from("sites_without_users").select("*");
//   if (subdomain) {
//     query = query.eq("subdomain", subdomain);
//   } else if (domain) {
//     query = query.eq("customDomain", domain);
//   }

//   const { data, error } = await query.single();

//   if (error) {
//     console.error("Error fetching site:", error);
//     return null;
//   }

//   return data;
// };

export async function getSiteData(domain: string, isCustomDomain?: boolean) {
  const { subdomain, domain: domainWithoutSub } = getSubdomainAndDomain(domain);
  // const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  //   ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
  //   : null;
  return await unstable_cache(
    async () => {
      return await fetchSingleSiteWithFilter("sites_without_users", [
        {
          method: "eq",
          column: subdomain && !isCustomDomain ? "subdomain" : "customDomain",
          value: subdomain && !isCustomDomain ? subdomain : domainWithoutSub,
        },
      ]);
    },
    [`${domain}-metadata`],
    {
      revalidate: 60,
      tags: [`${domain}-metadata`],
    }
  )();
}

// const fetchPagesForSite = async (subdomain: string | null, domain: string) => {
//   let query = supabase
//     .from("pages")
//     .select(
//       `
//         title,
//         description,
//         slug,
//         created_at,
//         site:site_id(
//           subdomain,
//           customDomain
//         )
//       `
//     )
//     .eq("published", true)
//     .order("created_at", { ascending: false });

//   if (subdomain) {
//     query = query.eq("site.subdomain", subdomain);
//   } else {
//     query = query.eq("site.customDomain", domain);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetchPagesForSite pages:", error);
//     return [];
//   }

//   return data;
// };

// export async function getPagesForSite(domain: string) {
//   const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
//     ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
//     : null;

//   return await unstable_cache(
//     async () => {
//       return await fetchPagesForSite(subdomain, domain);
//     },
//     [`${domain}-pages`],
//     {
//       revalidate: 900,
//       tags: [`${domain}-pages`],
//     }
//   )();
// }

// const fetchAdjacentPages = async (
//   subdomain: string | null,
//   domain: string,
//   currentPostId: string
// ) => {
//   let query = supabase
//     .from("pages")
//     .select(
//       `
//         slug,
//         title,
//         created_at,
//         description,
//         site:site_id(
//           subdomain,
//           customDomain
//         )
//       `
//     )
//     .eq("published", true)
//     .neq("id", currentPostId);

//   if (subdomain) {
//     query = query.eq("site.subdomain", subdomain);
//   } else {
//     query = query.eq("site.customDomain", domain);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching adjacent pages:", error);
//     return [];
//   }

//   return data;
// };

export async function getPageData(
  domain: string,
  slug: string,
  customDomain?: string
) {
  const { subdomain } = getSubdomainAndDomain(domain);

  return await unstable_cache(
    async () => {
      const supabase = createClient();
      let query = supabase
        .from("pages_with_sites_values")
        .select("*")
        .eq("slug", slug)
        .eq("published", true);
      if (subdomain) {
        query.eq("subdomain", subdomain);
      }
      if (customDomain) {
        query.eq("customDomain", customDomain);
      }
      const { data, error } = await query.single();
      if (data && !error) {
        return data;
      }
    },
    [`${domain}-${slug}`],
    {
      revalidate: 60, //1 minute
      tags: [`${domain}-${slug}`],
    }
  )();
}

export const fetchPagesBySubdomain = async (
  subdomain?: string | null,
  domain?: string | null,
  published?: boolean | null,
  valuesToSelect?: string | null
): Promise<PagesWithSitesValues[] | []> => {
  try {
    const supabase = createClient();
    let query = supabase
      .from("pages_with_sites_values")
      .select(valuesToSelect ? valuesToSelect : "*")
      .range(0, 9999999999);
    const isCustomDomain =
      domain &&
      !domain.endsWith(`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true";
    if (subdomain) {
      query = query.eq("subdomain", subdomain);
    }
    if (isCustomDomain) {
      query = query.eq("customDomain", domain);
    }
    if (published) {
      query = query.eq("published", published);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetchPagesBySubdomain:", error);
      return [];
    }
    if (data && data.length > 0) {
      return data as unknown as PagesWithSitesValues[];
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Catch Error fetchPagesBySubdomain:", error);
    return [];
  }
};

// export async function fetchSiteById(id: string): Promise<Sites | null> {
//   const supabase = createClient();
//   let query = supabase.from("sites_without_users").select("*").eq("id", id);

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetchSiteById:", error);
//     return null;
//   }

//   if (data && data.length > 0) {
//     // Convertir le premier élément de data en Sites
//     return data[0] as Sites;
//   } else {
//     return null;
//   }
// }

export async function fetchSitesWithFilter(
  viewName: string,
  filters?: FilterType[]
): Promise<Sites[] | []> {
  const supabase = createClient();
  let query = supabase.from(viewName).select("*").range(0, 9999999999);

  if (filters) {
    filters.forEach((filter) => {
      if (typeof filter.value === "object" && filter.value !== null) {
        query = (query as any)[filter.method](filter.column, filter.value);
      } else {
        query = query.filter(filter.column, filter.method as any, filter.value);
      }
    });
  }
  const { data, error } = await query;

  if (error) {
    console.error("Error fetchSitesWithFilter:", error);
    return [];
  }

  if (data && data.length > 0) {
    return data as Sites[];
  } else {
    return [];
  }
}

export async function fetchSingleSiteWithFilter(
  viewName: string,
  filters?: FilterType[]
): Promise<Sites | null> {
  const supabase = createClient();
  let query = supabase.from(viewName).select("*");

  if (filters) {
    filters.forEach((filter) => {
      query = query.filter(filter.column, filter.method as any, filter.value);
    });
  }
  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetchSingleSiteWithFilter:", error);
    return null;
  }

  if (data) {
    return data as Sites;
  } else {
    return null;
  }
}

export async function fetchSinglePageWithFilter(
  viewName: string,
  filters?: FilterType[]
): Promise<PagesWithSitesValues | null> {
  const supabase = createClient();
  let query = supabase.from(viewName).select("*");

  if (filters) {
    filters.forEach((filter) => {
      query = query.filter(filter.column, filter.method as any, filter.value);
    });
  }
  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetchSinglePageWithFilter:", error);
    return null;
  }

  if (data) {
    return data as PagesWithSitesValues;
  } else {
    return null;
  }
}
