import { unstable_cache } from "next/cache";
import { serialize } from "next-mdx-remote/serialize";
// import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";
import { createClient } from "@/utils/supabase/client";
import { getSubdomainAndDomain } from ".";

const supabase = createClient();

export async function getAllSites() {
  let query = supabase.from("sites_without_users").select("*");

  const { data, error } = await query;

  if (error) {
    console.error("Error getAllSites site:", error);
    return [];
  }

  return data;
}

const fetchSite = async (subdomain: string | null, domain?: string | null) => {
  let query = supabase.from("sites_without_users").select("*");
  if (subdomain) {
    query = query.eq("subdomain", subdomain);
  } else if (domain) {
    query = query.eq("customDomain", domain);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching site:", error);
    return null;
  }

  return data;
};

export async function getSiteData(domain: string) {
  let { subdomain, domain: newDomain } = getSubdomainAndDomain(domain);
  console.log(
    "TEEEEEST",
    subdomain,
    newDomain !== process.env.NEXT_PUBLIC_ROOT_DOMAIN ? newDomain : null
  );
  return await unstable_cache(
    async () => {
      return await fetchSite(
        subdomain,
        newDomain !== process.env.NEXT_PUBLIC_ROOT_DOMAIN ? newDomain : null
      );
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
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

const fetchPages = async (
  subdomain: string | null,
  slug: string,
  customDomain?: string | null
) => {
  let query = supabase
    .from("pages_with_sites_values")
    .select("*")
    .eq("slug", slug)
    .eq("published", true);

  if (subdomain) {
    query = query.eq("subdomain", subdomain);
  } else if (customDomain) {
    query = query.eq("customDomain", customDomain);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching pages:", error);
    return [];
  }

  return data;
};

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
      return await fetchPages(subdomain, slug, customDomain);
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, //15 minutes
      tags: [`${domain}-${slug}`],
    }
  )();
}

export const fetchPagesBySubdomain = async (subdomain?: string | null) => {
  const supabase = createClient();
  let query = supabase.from("pages_with_sites_values").select("*");

  if (subdomain) {
    query = query.eq("subdomain", subdomain);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetchPagesBySubdomain:", error);
    return [];
  }

  return data;
};
