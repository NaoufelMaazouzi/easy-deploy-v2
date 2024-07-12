import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { toast } from "sonner";
import { generateServices } from "../serverActions/sitesActions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
};

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formatLocationAddress = (city: any) => {
  let address;
  if (typeof city === "string") {
    address = city;
  } else {
    address = (city.properties.name || city.properties.formatted).replace(
      /, France/g,
      ""
    );
  }

  const parts = address.split(", ");

  if (parts.length > 1) {
    const cityName = parts[0];
    const postalCode = parts[1].match(/\d+/)?.[0]; // Extrait le code postal
    if (postalCode) {
      return `${cityName} (${postalCode})`;
    }
  }

  const subParts = parts[0].split(" ");
  let formattedAddress;
  if (subParts.length > 1 && /^\d+$/.test(subParts[0])) {
    let postalCode: string = subParts[0];
    let cityName: string = subParts.slice(1).join(" ");
    formattedAddress = `${cityName} (${postalCode})`;
  } else {
    formattedAddress = parts[0];
  }

  return formattedAddress;
};

export const getSubdomainAndDomain = (url: string) => {
  // Remove "http://", "https://" and everything after the first "/" (if present)
  let domain = url.replace(/^https?:\/\//, "").split("/")[0];

  // Remove the port if present
  domain = domain.split(":")[0];

  // Split by dots
  const parts = domain.split(".");

  // Special case for "localhost"
  if (parts[0] === "localhost" || parts.slice(-1)[0] === "localhost") {
    if (parts.length > 1) {
      return { subdomain: parts.slice(0, -1).join("."), domain: "localhost" };
    } else {
      return { subdomain: null, domain: "localhost" }; // no subdomain for localhost without a prefix
    }
  }

  // Get the dynamic root domain
  const rootDomain = parts.slice(-2).join(".");

  // Check if we have a subdomain
  if (parts.length > 2) {
    return {
      subdomain: parts.slice(0, parts.length - 2).join("."),
      domain: rootDomain,
    };
  }

  // If no subdomain is found or the string does not end with a valid domain, return null for subdomain
  return { subdomain: null, domain: rootDomain };
};
// type Location = z.infer<typeof locationSchema>;
// type Service = { name: string };

export const createServiceCityObjects = (
  data: FormSchema,
  siteId: number,
  userId?: string
): Pages[] => {
  const { services, mainActivityCity, secondaryActivityCities } = data;
  const allCities = [mainActivityCity, ...secondaryActivityCities];

  const serviceCityObjects: Pages[] = services.flatMap((service: any) =>
    allCities.map((city) => {
      // Remove parentheses and their content from city name
      const cleanedCityName = city.name.replace(/\s*\(.*?\)\s*/g, "").trim();
      const serviceNameWithCity = `${service.name} ${cleanedCityName}`;

      // Create slug by replacing spaces with hyphens and converting to lowercase
      const slug = serviceNameWithCity.replace(/\s+/g, "-").toLowerCase();

      return {
        title: serviceNameWithCity,
        h1: serviceNameWithCity,
        published: false,
        description: serviceNameWithCity,
        firstContent: "",
        secondContent: "",
        slug: slug,
        site_id: siteId,
        service: service.name,
        contentGenerated: false,
        city: cleanedCityName,
        user_id: userId,
      };
    })
  );

  return serviceCityObjects;
};

export const showAlert = (
  status: "success" | "error",
  text: string,
  callback: (() => void) | null
) => {
  if (status === "success") {
    toast.success(text);
  } else {
    toast.error(text);
  }
  if (callback) {
    callback();
  }
};

export const customNanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export const randomString = (length = 10) => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
  return domainRegex.test(domain);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getSlugFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");
    const slug = parts[parts.length - 1];
    return slug;
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'URL:", error);
    return null;
  }
};

export const isObjectWithProperty = <T extends string>(
  obj: any,
  prop: T
): obj is { [K in T]: any } => {
  return typeof obj === "object" && obj !== null && prop in obj;
};

export const generateByIA = async (
  services: Services[],
  selectedServices: Services[],
  appendServices: Function,
  loadingFunc: Function
) => {
  if (!services.length) {
    return toast.error("Veuillez ajouter un service d'abord");
  } else if (!selectedServices.some((e) => e.name !== "")) {
    return toast.error(
      "Veuillez d'abord séléctionner des services en cliquant dessus"
    );
  }
  try {
    loadingFunc(true);
    const filteredServices = selectedServices
      .filter((service) => service.name.trim() !== "")
      .map((service) => service.name)
      .join(", ");
    const result = await generateServices(filteredServices);
    loadingFunc(false);
    result?.forEach((e) => appendServices(e));
  } catch (error) {
    loadingFunc(false);
    return toast.error((error as Error).message);
  }
};

export const handleAppendInArray = (
  arr: any[],
  func: Function,
  obj: any,
  key: string,
  errorText: string
) => {
  if (!arr.some((x) => x[key] === obj[key])) {
    return func(obj);
  } else {
    return toast.error(errorText);
  }
};

export const flattenObject = (obj: any, formData: FormData, prefix = "") => {
  Object.entries(obj).forEach(([key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (value instanceof File) {
      formData.append(prefixedKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof Object && !(item instanceof File)) {
          flattenObject(item, formData, `${prefixedKey}[${index}]`);
        } else {
          formData.append(`${prefixedKey}[${index}]`, item as any);
        }
      });
    } else if (value instanceof Object && !(value instanceof Date)) {
      flattenObject(value, formData, prefixedKey);
    } else {
      formData.append(prefixedKey, value as any);
    }
  });
};

export const unflattenObject = (data: any): any => {
  const result: any = {};

  Object.entries(data).forEach(([key, value]) => {
    const keys = key.split(/[.[\]]+/).filter(Boolean); // Split keys by dots and brackets

    let currentObj = result;
    keys.forEach((subKey, index) => {
      if (index === keys.length - 1) {
        // Last key, assign value
        if (subKey === "radius") {
          currentObj[subKey] = parseInt(value as string); // Parse value as integer for 'radius'
        } else {
          currentObj[subKey] = value; // Keep other values as they are
        }
      } else {
        // Create nested objects as needed
        if (!currentObj[subKey]) {
          // Check if current key is a number, create an array if necessary
          const nextKey = keys[index + 1];
          if (!isNaN(parseInt(nextKey))) {
            currentObj[subKey] = [];
          } else {
            currentObj[subKey] = {};
          }
        }
        currentObj = currentObj[subKey]; // Move to next level
      }
    });
  });

  return result;
};
