import { z } from "@/lib/utils/fr-zod";

export const defaultValuesDomains = {
  //   subdomain: "",
  customDomain: "",
};

export const domainSchema = z.object({
  //   subdomain: z.string().max(32),
  customDomain: z
    .string()
    .max(64)
    .regex(/^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$/),
});
