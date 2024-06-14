import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  let address = (city.properties.formatted || city.properties.name).replace(
    /, France/g,
    ""
  );
  const parts = address.split(" ");
  let formattedAddress;
  if (parts.length > 1 && /^\d+$/.test(parts[0])) {
    let postalCode: string = parts[0];
    let cityName: string = parts.slice(1).join(" ");
    formattedAddress = `${cityName} (${postalCode})`;
  } else {
    formattedAddress = address;
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
  siteId: number
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
        content: "",
        slug: slug,
        site_id: siteId,
        service: service,
        contentGenerated: false,
      };
    })
  );

  return serviceCityObjects;
};
