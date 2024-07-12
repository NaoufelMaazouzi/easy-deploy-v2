"use server";

// import { revalidateTag } from "next/cache";
// import { withPageAuth, withSiteAuth } from "../auth";
// import {
//   addDomainToVercel,
//   // getApexDomain,
//   removeDomainFromVercelProject,
//   // removeDomainFromVercelTeam,
//   validDomainRegex,
// } from "@/lib/utils/domains";
// import { put } from "@vercel/blob";
import { Client } from "@upstash/qstash";
import { createServiceCityObjects, formatLocationAddress } from "@/lib/utils";
import { z } from "@/lib/utils/fr-zod";
import axios from "axios";
import { createOpenAI } from "@ai-sdk/openai";
// import { formSchema } from "@/app/(dashboard)/createSite/siteSchema";
// import { Client } from "@upstash/qstash";
import { generateObject } from "ai";
import {
  AllFormSchemaKeys,
  formSchema,
} from "@/app/(dashboard)/createSite/siteSchema";
import { SafeParseReturnType } from "zod";
import { CreateSiteResult, FilterType } from "../utils/types";
import { addDomainToVercel, validDomainRegex } from "../utils/domains";
import { notFound } from "next/navigation";
import { withSiteAuth } from "../utils/auth";
import { revalidateTag } from "next/cache";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";

export async function createSite(
  data: z.infer<typeof formSchema>
): Promise<CreateSiteResult> {
  try {
    const parsed: SafeParseReturnType<
      z.infer<typeof formSchema>,
      z.infer<typeof formSchema>
    > = formSchema.safeParse(data);

    if (!parsed.success) {
      return {
        siteId: null,
        status: "error",
        text: "Les données ne sont pas bien formatées",
      };
    }

    const supabase = createSupabaseServerComponentClient();
    const { data: createdSite, error: createdSiteError } = await supabase
      .from("sites")
      .insert(parsed.data)
      .select();

    if (createdSiteError || !createdSite?.length) {
      return {
        siteId: null,
        status: "error",
        text: "Impossible de créer le site",
      };
    }

    const typedCreatedSite = createdSite as Sites[];
    const siteId = typedCreatedSite[0].id;
    const siteCustomDomain = typedCreatedSite[0].customDomain;
    if (siteCustomDomain && validDomainRegex.test(siteCustomDomain)) {
      await Promise.all([
        addDomainToVercel(siteCustomDomain),
        // Optional: add www subdomain as well and redirect to apex domain
        addDomainToVercel(`www.${siteCustomDomain}`),
      ]);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const generatedPages = createServiceCityObjects(
      parsed.data,
      siteId,
      user?.id
    );

    const { error: createdPagesError } = await supabase
      .from("pages")
      .insert(generatedPages);

    const { error: updatedNumbersOfPageError } = await supabase
      .from("sites")
      .update({
        numberOfPages: generatedPages.length,
      })
      .eq("id", siteId);

    if (createdPagesError || updatedNumbersOfPageError) {
      return {
        siteId: null,
        status: "error",
        text: "Impossible de créer les pages",
      };
    }

    generatedServicesContent(data.services);
    return {
      siteId,
      status: "success",
      text: "Site créé avec succès",
    };
  } catch (error) {
    console.log(error);
    return {
      siteId: null,
      status: "error",
      text: "Erreur lors de la création du site",
    };
  }
}

export const getSiteFromPostId = async (postId: string) => {
  return "848";
};

export async function autocompleteSearch(queryObj: { query: string }) {
  if (!process.env.GEOAPIFY_API_KEY) {
    return new Response(
      "Missing GEOAPIFY_API_KEY. Don't forget to add that to your .env file.",
      {
        status: 401,
      }
    );
  }
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete`,
      {
        params: {
          text: queryObj.query,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );
    const result = response.data.features
      .filter((e: any) => e.properties.formatted || e.properties.name)
      .map((city: any) => {
        const formattedAddress = formatLocationAddress(city);
        return {
          uniqueId: `${city.properties.lat}-${city.properties.lon}`,
          name: formattedAddress,
          lat: city.properties.lat,
          lng: city.properties.lon,
        };
      });
    return result;
  } catch (error) {
    throw new Error("Erreur lors de la recherche des villes autocomplete");
  }
}

export async function fetchCitiesInRadius(
  lat: Number,
  lng: Number,
  radius: Number
) {
  if (!process.env.GEOAPIFY_API_KEY) {
    throw new Error(
      "Missing GEOAPIFY_API_KEY. Don't forget to add that to your .env file."
    );
  }
  const radiusNumber = typeof radius === "string" ? parseFloat(radius) : radius;
  if (typeof radiusNumber !== "number" || isNaN(radiusNumber)) {
    throw new Error("Missing or invalid 'radius' parameter.");
  }
  try {
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories:
          "populated_place.city,populated_place.town,populated_place.village",
        filter: `circle:${lng},${lat},${radiusNumber * 1000}`,
        limit: 100,
        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    });
    const cities = response.data.features.filter(
      (place: any) =>
        [
          "populated_place.city",
          "populated_place.town",
          "populated_place.village",
        ].some((i: any) => place.properties.categories.includes(i)) &&
        (place.properties.formatted || place.properties.name)
    );
    const result = cities.map((city: any) => {
      const formattedAddress = formatLocationAddress(city);
      return {
        uniqueId: `${city.properties.lat}-${city.properties.lon}`,
        name: formattedAddress,
        lat: city.properties.lat,
        lng: city.properties.lon,
      };
    });
    return result;
  } catch (error) {
    throw new Error("Erreur lors de la recherche des villes dans le rayon.");
  }
}

const perplexityModel = createOpenAI({
  baseURL: "https://api.perplexity.ai",
  apiKey: process.env.PERPLEXITY_API_KEY,
});

export async function generateServices(input: string) {
  try {
    const { object: result } = await generateObject({
      model: perplexityModel("mixtral-8x7b-instruct"),
      system:
        "Tu es un expert des domaines artisanaux tels que la sérrurerie, la plomberie, la peinture etc.",
      prompt: `Génère en français des services qui sont dans les même domaines que je te donne. Par exemple si je te donne comme domaine "plomberie", tu me réponds "réparation canalisation". Voici les domaines qui sont séparés par des virgules: ${input}. Il me faut 10 services par domaine`,
      schema: z.object({
        result: z.array(z.string().describe("Nom du service")),
      }),
      mode: "json",
    });
    if (result?.result) {
      return result.result.map((name) => ({ name: name.toLowerCase() }));
    }
  } catch (error) {
    console.log(error);
    throw new Error("Erreur lors de la génération avec l'IA.");
  }
}

export async function generatedServicesContent(services: Services[]) {
  try {
    const client = new Client({
      token: process.env.QSTASH_TOKEN || "",
    });
    services.map((service: Services) => {
      client.publishJSON({
        url: "https://api.perplexity.ai/chat/completions",
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: {
          model: "mixtral-8x7b-instruct",
          messages: [
            {
              role: "system",
              content:
                'Tu es un expert dans le SEO et dans le copywriting pour bien se classer dans les moteurs de recheche. Tu dois toujours me répondre seulement un objet au format JSON, voici sa structure: {"service": "Peinture", "firstContent": "Nous somme des experts en peinture à $ville", "secondContent": "Nous réalisons toute sorte de peintures à $ville"}.',
            },
            {
              role: "user",
              content: `Génère en français un texte pour le service: ${service.name}. Je veux que tu mettes beaucoup de détails dans le texte pour dire que nous sommes des experts dans ce service. Tu dois toujours place la variable '$ville' dans le texte au moins 2 fois pour que je puisse la modifier plus tard, chaque texte (firstContent et secondContent) doit contenir au moins 200 mots. Voici un exemple de l'objet que j'attends pour le service 'plomberie': {"service": "Plomberie", "firstContent": "Nous somme des experts en plomberie à $ville", "secondContent": "Nous réalisons toute sorte de plomberie à $ville"} `,
            },
          ],
        },
        callback: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/qstashWebhook`,
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error("Erreur lors de la génération de services avec l'IA.");
  }
}

// export async function generateServices(input: string) {
//   try {
//     const client = new Client({
//       token: process.env.QSTASH_TOKEN || "",
//     });
//     const res = await client.publishJSON({
//       url: "https://api.perplexity.ai/chat/completions",
//       headers: {
//         Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
//       },
//       body: {
//         model: "mixtral-8x7b-instruct",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Tu es un expert des domaines artisanaux tels que la sérrurerie, la plomberie, la peinture etc. Tu dois toujours me répondre seulement avec des mots clés séparés par des virgules comme cette phrase 'texte1,texte2,texte3'",
//           },
//           {
//             role: "user",
//             content: `Génère en français des services qui sont dans les même domaines que je te donne. Par exemple si je te donne comme domaine "plomberie", tu me réponds "réparation canalisation". Voici les domaines qui sont séparés par des virgules: ${input}. Il me faut 10 services par domaine`,
//           },
//         ],
//       },
//       callback: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/qstashWebhook`,
//     });
//   } catch (error) {
//     console.log(error);
//     throw new Error("Erreur lors de la génération de services avec l'IA.");
//   }
// }

export const updateSite = withSiteAuth(
  async (site: Sites, data: FormData, key?: AllFormSchemaKeys) => {
    try {
      const object: any = {};
      data.forEach((value, key) => {
        if (key === "favicon") {
          object[key] = value;
        } else {
          object[key] = JSON.parse(value as string);
        }
      });
      const parsed = formSchema.safeParse(object);
      if (!parsed.success) {
        return {
          siteId: null,
          status: "error",
          text: "Les données ne sont pas bien formatées",
        };
      }
      let updatedData, updatedDataError;
      const supabase = createSupabaseServerComponentClient();

      if (parsed.data.favicon) {
        const { error } = await supabase.storage
          .from("images")
          .upload(
            `${site.id}/${parsed.data.favicon.name}`,
            parsed.data.favicon,
            {
              upsert: true,
            }
          );
        if (error) {
          return {
            siteId: null,
            status: "error",
            text: "Impossible de télécharger l'image",
          };
        }
      }

      //   // if (key === "customDomain") {
      //   //   if (value.includes("vercel.pub")) {
      //   //     return {
      //   //       error: "Cannot use vercel.pub subdomain as your custom domain",
      //   //     };

      //   //     // if the custom domain is valid, we need to add it to Vercel
      //   //   } else if (validDomainRegex.test(value)) {
      //   //     response = await db
      //   //       .update(sites)
      //   //       .set({
      //   //         customDomain: value,
      //   //       })
      //   //       .where(eq(sites.id, site.id))
      //   //       .returning()
      //   //       .then((res) => res[0]);

      //   //     await Promise.all([
      //   //       addDomainToVercel(value),
      //   //       // Optional: add www subdomain as well and redirect to apex domain
      //   //       addDomainToVercel(`www.${value}`),
      //   //     ]);

      //   // empty value means the user wants to remove the custom domain
      //   // } else if (value === "") {
      //   //   response = await db
      //   //     .update(sites)
      //   //     .set({
      //   //       customDomain: null,
      //   //     })
      //   //     .where(eq(sites.id, site.id))
      //   //     .returning()
      //   //     .then((res) => res[0]);
      //   // }

      //   // if the site had a different customDomain before, we need to remove it from Vercel
      //   // if (site.customDomain && site.customDomain !== value) {
      //   //   response = await removeDomainFromVercelProject(site.customDomain);

      //   //   /* Optional: remove domain from Vercel team

      //   //   first, we need to check if the apex domain is being used by other sites
      //   //   const apexDomain = getApexDomain(`https://${site.customDomain}`);
      //   //   const domainCount = await db.select({ count: count() }).from(sites).where(or(eq(sites.customDomain, apexDomain), ilike(sites.customDomain, `%.${apexDomain}`))).then((res) => res[0].count);

      //   //   if the apex domain is being used by other sites
      //   //   we should only remove it from our Vercel project
      //   //   if (domainCount >= 1) {
      //   //     await removeDomainFromVercelProject(site.customDomain);
      //   //   } else {
      //   //     this is the only site using this apex domain
      //   //     so we can remove it entirely from our Vercel team
      //   //     await removeDomainFromVercelTeam(
      //   //       site.customDomain
      //   //     );
      //   //   }

      //   //   */
      //   // }
      //   // } else if (key === "image" || key === "logo") {
      //   //   if (!process.env.BLOB_READ_WRITE_TOKEN) {
      //   //     return {
      //   //       error:
      //   //         "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
      //   //     };
      //   //   }

      //   //   const file = formData.get(key) as File;
      //   //   const filename = `${nanoid()}.${file.type.split("/")[1]}`;

      //   //   const { url } = await put(filename, file, {
      //   //     access: "public",
      //   //   });

      //   //   const blurhash = key === "image" ? await getBlurDataURL(url) : null;

      //   //   response = await db
      //   //     .update(sites)
      //   //     .set({
      //   //       [key]: url,
      //   //       ...(blurhash && { imageBlurhash: blurhash }),
      //   //     })
      //   //     .where(eq(sites.id, site.id))
      //   //     .returning()
      //   //     .then((res) => res[0]);
      //   // } else {
      ({ data: updatedData, error: updatedDataError } = await supabase
        .from("sites")
        .update({
          ...parsed.data,
          favicon: parsed.data.favicon
            ? `${site.id}/${parsed.data.favicon.name}`
            : "",
        })
        .eq("id", site.id)
        .select());
      // }

      if (updatedDataError) {
        return {
          error: updatedDataError.message,
        };
      }

      // console.log(
      //   "Updated site data! Revalidating tags: ",
      //   `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      //   `${site.customDomain}-metadata`
      // );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
      );
      site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

      return {
        status: "success",
        text: "Site modifié avec succès !",
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        console.error(`Error updateSite: The key ${key} is already taken`);
      } else {
        console.error(`Error updateSite: ${error.message}`);
      }
      return {
        status: "error",
        text: "Impossbile de modifer le site",
      };
    }
  }
);

export async function getSiteById(id: number | string) {
  try {
    const supabase = createSupabaseServerComponentClient();
    const { data: site } = await supabase
      .from("sites_with_users")
      .select("*")
      .eq("id", Number(id))
      .single();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!site || user?.id !== site.user_id) {
      return notFound();
    }
    return site;
  } catch (error: any) {
    return {
      status: "error",
      text: error.message as string,
    };
  }
}

export async function fetchSitesWithFilterFromServer(
  viewName: string,
  filters?: FilterType[],
  withAuth?: boolean
): Promise<Sites[] | []> {
  const supabase = createSupabaseServerComponentClient();
  let query = supabase.from(viewName).select("*");

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

  if (withAuth) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const filteredData = data.filter((site) => site.user_id === user.id);

    if (filteredData.length === 0) {
      return [];
    }

    return filteredData as Sites[];
  }

  if (data && data.length > 0) {
    return data as Sites[];
  } else {
    return [];
  }
}

export const deleteSite = withSiteAuth(async (site: Sites) => {
  try {
    const supabase = createSupabaseServerComponentClient();
    const { error } = await supabase
      .from("sites")
      .delete()
      .eq("id", site.id)
      .select();

    if (error) {
      return {
        status: "error",
        text: "Erreur lors de la suppression du site",
      };
    }

    return {
      status: "success",
      text: "Site supprimé avec succès",
    };
  } catch (error: any) {
    return {
      status: "error",
      text: error.message as string,
    };
  }
});
