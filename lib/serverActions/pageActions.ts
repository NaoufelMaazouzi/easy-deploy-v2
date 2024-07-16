"use server";

import { revalidateTag } from "next/cache";
import { FilterType, updatePageResult } from "../utils/types";
import { randomString } from "../utils";
import { withPageAuth, withSiteAuth } from "../utils/auth";
import { notFound } from "next/navigation";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";

export const updatePage = async (
  data: PagesWithSitesValues
): Promise<updatePageResult> => {
  const supabase = createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      status: "error",
      text: "Utilisateur non authentifié",
    };
  }
  const { data: page, error } = await supabase
    .from("pages_with_sites_values")
    .select("*")
    .eq("id", data.id)
    .single();
  if (!page || error) {
    return {
      status: "error",
      text: "Page non trouvée",
    };
  }
  try {
    await supabase
      .from("pages")
      .update({
        title: data.title,
        description: data.description,
        firstContent: data.firstContent,
      })
      .eq("id", data.id);
    revalidateTag(
      `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
    );
    revalidateTag(
      `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${page.slug}`
    );
    // if the site has a custom domain, we need to revalidate those tags too
    page.customDomain &&
      (revalidateTag(`${page.customDomain}-pages`),
      revalidateTag(`${page.customDomain}-${page.slug}`));
    return {
      status: "success",
      text: "Page modifiée avec succès",
    };
  } catch (error: any) {
    return {
      status: "error",
      text: error.message as string,
    };
  }
};

export const updatePageMetadata = withPageAuth(
  async (
    formData: FormData,
    page: PagesWithSitesValues,
    key: string,
    successText: string
  ): Promise<updatePageResult> => {
    try {
      const value = formData.get(key) as string;
      // if (key === "image") {
      //   const file = formData.get("image") as File;
      //   const filename = `${customNanoid()}.${file.type.split("/")[1]}`;

      //   const { url } = await put(filename, file, {
      //     access: "public",
      //   });

      //   const blurhash = await getBlurDataURL(url);

      //   response = await prisma.post.update({
      //     where: {
      // id: post.id,
      //     },
      //     data: {
      // image: url,
      // imageBlurhash: blurhash,
      //     },
      //   });
      // } else {
      const supabase = createSupabaseServerComponentClient();
      const { error } = await supabase
        .from("pages")
        .update({
          [key]: key === "published" ? value === "true" : value,
        })
        .eq("id", page.id);
      if (error) {
        return {
          status: "error",
          text: "Erreur lors de la modification de la page",
        };
      }
      // }

      revalidateTag(
        `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
      );
      revalidateTag(
        `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${page.slug}`
      );

      // if the site has a custom domain, we need to revalidate those tags too
      page.customDomain &&
        (revalidateTag(`${page.customDomain}-pages`),
        revalidateTag(`${page.customDomain}-${page.slug}`));

      return {
        status: "success",
        text: successText,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          status: "error",
          text: "Ce nom est déjà utilisé",
        };
      } else {
        return {
          status: "error",
          text: error.message as string,
        };
      }
    }
  }
);

export const createPage = withSiteAuth(async (site: Sites) => {
  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("pages")
    .insert({
      title: "",
      description: "",
      content: "",
      h1: "",
      published: false,
      service: "",
      contentGenerated: false,
      city: "",
      site_id: Number(site.id),
      slug: randomString(),
    })
    .select()
    .single();

  if (error) {
    return {
      status: "error",
      title: "Erreur",
      text: "Erreur lors de la création de la page",
    };
  }

  revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
  );
  site.customDomain && revalidateTag(`${site.customDomain}-pages`);

  return data;
});

// export const createPage = async (siteId: string) => {
//   const { data, error } = await supabase.from("pages").insert({
//     title: "",
//     description: "",
//     content: "",
//     h1: "",
//     published: false,
//     service: "",
//     contentGenerated: false,
//     city: "",
//     site_id: Number(siteId),
//     slug: randomString(),
//   });

//   //   revalidateTag(
//   //     `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
//   //   );
//   //   site.customDomain && (revalidateTag(`${site.customDomain}-posts`));

//   return "okkk";
// };

export async function getPageById(id: number | string) {
  try {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
      .from("pages_with_sites_values")
      .select("*")
      .eq("id", Number(id))
      .single();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!data || user?.id !== data.site_user_id || error) {
      notFound();
    }
    return data;
  } catch (error: any) {
    return {
      status: "error",
      text: error.message as string,
    };
  }
}

export async function fetchPagesWithFilter(
  viewName: string,
  filters?: FilterType[],
  withAuth?: boolean,
  single?: boolean
): Promise<PagesWithSitesValues[] | []> {
  const supabase = createSupabaseServerComponentClient();
  let query = supabase.from(viewName).select("*");

  if (filters) {
    filters.forEach((filter) => {
      const { method, column, value } = filter;
      switch (method) {
        case "eq":
          if (typeof filter.value === "object" && filter.value !== null) {
            query = (query as any)[filter.method](filter.column, filter.value);
          } else {
            query = query.filter(
              filter.column,
              filter.method as any,
              filter.value
            );
          }
          query = query.filter(column, method as any, value);
          break;
        case "limit":
          query = query.limit(value);
          break;
        default:
          console.warn(`Unknown filter method: ${method}`);
      }
    });
  }
  let data, error;
  if (single) {
    ({ data, error } = await query.single());
  } else {
    ({ data, error } = await query);
  }

  if (error) {
    console.error("Error fetchPagesWithFilter:", error);
    return [];
  }

  if (withAuth) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const filteredData = data.filter(
      (site: SitesWithUsers) => site.user_id === user.id
    );

    if (filteredData.length === 0) {
      return [];
    }

    return filteredData as PagesWithSitesValues[];
  }

  if (data && data.length > 0) {
    return data as PagesWithSitesValues[];
  } else {
    return [];
  }
}

export const deletePage = withPageAuth(
  async (page: PagesWithSitesValues): Promise<updatePageResult> => {
    try {
      const supabase = createSupabaseServerComponentClient();
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", page.id)
        .select();

      if (error) {
        return {
          status: "error",
          text: "Erreur lors de la suppression de la page",
        };
      }

      revalidateTag(
        `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
      );
      revalidateTag(
        `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${page.slug}`
      );

      // if the site has a custom domain, we need to revalidate those tags too
      page.customDomain &&
        (revalidateTag(`${page.customDomain}-pages`),
        revalidateTag(`${page.customDomain}-${page.slug}`));

      return {
        status: "success",
        text: "Page supprimée avec succès",
      };
    } catch (error: any) {
      return {
        status: "error",
        text: error.message as string,
      };
    }
  }
);
