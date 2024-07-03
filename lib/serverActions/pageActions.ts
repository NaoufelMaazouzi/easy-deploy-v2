"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { updatePageResult } from "../utils/types";
import { randomString } from "../utils";
import { withPostAuth, withSiteAuth } from "../utils/auth";
import { notFound } from "next/navigation";

export const updatePage = async (
  data: PagesWithSitesValues
): Promise<updatePageResult> => {
  const supabase = createClient();
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

export const updatePageMetadata = withPostAuth(
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
      const supabase = createClient();
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

export const createPage = withSiteAuth(async (_: FormData, site: Sites) => {
  const supabase = createClient();
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
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages_with_sites_values")
      .select("*")
      .eq("id", Number(id))
      .single();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!data || user?.id !== data.user_id || error) {
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
