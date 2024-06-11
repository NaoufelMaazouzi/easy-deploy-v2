"use server";

// import { revalidateTag } from "next/cache";
// import { withPostAuth, withSiteAuth } from "../auth";
// import {
//   addDomainToVercel,
//   // getApexDomain,
//   removeDomainFromVercelProject,
//   // removeDomainFromVercelTeam,
//   validDomainRegex,
// } from "@/lib/utils/domains";
// import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { formatLocationAddress, getBlurDataURL } from "@/lib/utils";
import { z } from "@/lib/utils/fr-zod";
import axios from "axios";
import { createOpenAI } from "@ai-sdk/openai";
// import { formSchema } from "@/app/(dashboard)/createSite/siteSchema";
// import { Client } from "@upstash/qstash";
import { generateObject } from "ai";
import { formSchema } from "@/app/(protected)/(dashboard)/createSite/siteSchema";
import { SafeParseReturnType } from "zod";
import { createClient } from "@/utils/supabase/server";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export async function createSite(data: z.infer<typeof formSchema>) {
  // const formData = Object.fromEntries(data);
  const parsed: SafeParseReturnType<
    z.infer<typeof formSchema>,
    z.infer<typeof formSchema>
  > = formSchema.safeParse(data);
  const supabase = createClient();
  if (parsed.error) {
    console.log(parsed.error);
    throw new Error("Erreur lors de la création du site");
  } else if (parsed.success) {
    const { data, error } = await supabase.from("sites").insert(parsed.data);
    console.log("INSERTEEEED", data, error);
  }
}

export const getSiteFromPostId = async (postId: string) => {
  return "848";
};

export async function autocompleteSearch(queryObj: { query: string }) {
  console.log(queryObj.query);
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
      return result.result.map((name) => ({ name }));
    }
  } catch (error) {
    console.log(error);
    throw new Error("Erreur lors de la génération avec l'IA.");
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
