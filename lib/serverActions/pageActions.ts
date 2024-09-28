"use server";

import { revalidateTag } from "next/cache";
import { FilterType, updatePageResult } from "../utils/types";
import { randomString } from "../utils";
import { withPageAuth, withSiteAuth } from "../utils/auth";
import { notFound } from "next/navigation";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

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

interface FolderContent {
  [folderPath: string]: MediaItem[];
}

export async function getAllFilesInFolder(
  bucketName: string,
  folderPath: string
): Promise<FolderContent> {
  const allFiles: FolderContent = {};
  const publicPathSet = new Set<string>();

  async function listFilesInPath(path: string): Promise<void> {
    const supabase = createSupabaseServerComponentClient();
    const { data: items, error } = await supabase.storage
      .from(bucketName)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Error listing files:", error);
      return;
    }

    if (items) {
      for (const item of items) {
        const itemPath = `${path}/${item.name}`.replace("//", "/");
        if (!item.id) {
          allFiles[itemPath] = [];
          await listFilesInPath(itemPath);
        } else {
          if (!allFiles[path]) {
            allFiles[path] = [];
          }
          if (!item.name.startsWith(".")) {
            const isVideo = item.metadata.mimetype === "video/mp4";
            const publicPath = `https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/public/images/${path}/${item.name}`;
            const videoThumbnail = `https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/public/images/${path}/thumbnail-${removeFileExtension(item.name) + ".jpg"}`;
            if (!publicPathSet.has(item.name)) {
              publicPathSet.add(item.name);
              const newItem = {
                id: `${path}/${item.name}`,
                title: item.name,
                url: publicPath,
                thumbnail: isVideo ? videoThumbnail : publicPath,
                width: 1581,
                height: 2370,
                mimeType: item.metadata.mimetype,
                isVideo,
              };
              allFiles[path].push(newItem);
            }
          }
        }
      }
    }
  }

  await listFilesInPath(folderPath);
  return allFiles;
}

// export const uploadPageMedia = withPageAuth(
//   async (
//     page: PagesWithSitesValues,
//     formData: FormData,
//     key: string,
//     successText: string
//   ): Promise<updatePageResult> => {
//     try {
//       let file;
//       if (key === "file") {
//         file = formData.get("file") as File;
//       }
//       if (page.id) {
//         const data = await getPageById(page.id);
//         const supabase = createSupabaseServerComponentClient();
//         if (file) {
//           console.log("EEE", file);
//           const { error } = await supabase.storage
//             .from("images")
//             .upload(`${data.site_id}/${page.id}/${file.name}`, file, {
//               upsert: true,
//             });
//           if (error) {
//             return {
//               status: "error",
//               text: "Impossible de télécharger l'image",
//             };
//           }

//           revalidateTag(
//             `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
//           );
//           revalidateTag(
//             `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${page.slug}`
//           );

//           // if the site has a custom domain, we need to revalidate those tags too
//           page.customDomain &&
//             (revalidateTag(`${page.customDomain}-pages`),
//             revalidateTag(`${page.customDomain}-${page.slug}`));

//           return {
//             status: "success",
//             text: successText,
//           };
//         }
//       }
//       return {
//         status: "error",
//         text: "error",
//       };
//     } catch (error: any) {
//       return {
//         status: "error",
//         text: error.message as string,
//       };
//     }
//   }
// );

function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
  }
  return ""; // No file extension found
}

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

export async function convert(ffmpeg: FFmpeg, action: any): Promise<any> {
  const { file, to, file_name, file_type } = action;
  const input = getFileExtension(file_name);
  const output = removeFileExtension(file_name) + "." + to;
  ffmpeg.writeFile(input, await fetchFile(file));

  // FFMEG COMMANDS
  let ffmpeg_cmd: any = [];
  // 3gp video
  if (to === "3gp")
    ffmpeg_cmd = [
      "-i",
      input,
      "-r",
      "20",
      "-s",
      "352x288",
      "-vb",
      "400k",
      "-acodec",
      "aac",
      "-strict",
      "experimental",
      "-ac",
      "1",
      "-ar",
      "8000",
      "-ab",
      "24k",
      output,
    ];
  else ffmpeg_cmd = ["-i", input, output];

  // execute cmd
  await ffmpeg.exec(ffmpeg_cmd);

  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: file_type.split("/")[0] });
  const url = URL.createObjectURL(blob);
  return { url, output };
}

export const uploadPageMedia = withPageAuth(
  async (
    page: PagesWithSitesValues,
    formData: FormData,
    key: string,
    successText: string
  ): Promise<updatePageResult> => {
    try {
      let file: File | null = null;
      console.log("MMMM", page.id);
      if (key === "file") {
        file = formData.get("file") as File;
      }

      if (page.id && file) {
        const data = await getPageById(page.id);
        const supabase = createSupabaseServerComponentClient();

        // Téléchargement du fichier dans Supabase
        const { error } = await supabase.storage
          .from("images")
          .upload(`${data.site_id}/${page.id}/${file.name}`, file, {
            upsert: true,
          });

        if (error) {
          return {
            status: "error",
            text: "Impossible de télécharger l'image",
          };
        }

        // Nettoyage du fichier local après l'avoir uploadé dans Supabase
        // fs.unlinkSync(filePath);

        revalidateTag(
          `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-pages`
        );
        revalidateTag(
          `${page.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${page.slug}`
        );

        // Si le site a un domaine personnalisé, il faut également revalider ces tags
        page.customDomain &&
          (revalidateTag(`${page.customDomain}-pages`),
          revalidateTag(`${page.customDomain}-${page.slug}`));

        return {
          status: "success",
          text: successText,
        };
      }

      return {
        status: "error",
        text: "error",
      };
    } catch (error: any) {
      return {
        status: "error",
        text: error.message as string,
      };
    }
  }
);
export const deletePageImage = withPageAuth(
  async (
    page: PagesWithSitesValues,
    formData: string,
    successText: string
  ): Promise<updatePageResult> => {
    try {
      if (page.id) {
        const data = await getPageById(page.id);
        const supabase = createSupabaseServerComponentClient();
        const { error } = await supabase.storage
          .from("images")
          .remove([`${data.site_id}/${page.id}/${formData}`]);
        if (error) {
          return {
            status: "error",
            text: "Impossible de supprimer l'image",
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
          text: successText,
        };
      }
      return {
        status: "error",
        text: "error",
      };
    } catch (error: any) {
      return {
        status: "error",
        text: error.message as string,
      };
    }
  }
);
