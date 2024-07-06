import validator from "validator";
import { z } from "@/lib/utils/fr-zod";

const locationSchema = z.object({
  uniqueId: z.string().min(2),
  name: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
});

const headquartersCity = z.object({
  number: z.string().min(1),
  uniqueId: z.string().min(2),
  name: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
});

export const defaultValues = {
  name: "",
  subdomain: "",
  description: "",
  customDomain: "",
  corporateName: "",
  contactMail: "",
  contactPhone: "",
  radius: 0,
  headquartersCity: {
    number: "",
    uniqueId: "",
    name: "",
    lat: 0,
    lng: 0,
  },
  mainActivityCity: {
    uniqueId: "",
    name: "",
    lat: 0,
    lng: 0,
  },
  secondaryActivityCities: [],
  services: [],
};

export const formSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(2),
  subdomain: z.string({
    required_error: "Le sous-domaine est requis",
    invalid_type_error: "Le sous-domaine doit être une chaîne de caractères",
  }),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .min(2),
  customDomain: z.string().max(32),
  corporateName: z
    .string({
      required_error: "La raison sociale est requise",
      invalid_type_error:
        "La raison sociale doit être une chaîne de caractères",
    })
    .min(2),
  corporateStatus: z.string().min(2),
  contactMail: z.string().refine((value) => validator.isEmail(value), {
    message: "Adresse mail non valide",
  }),
  contactPhone: z
    .string()
    .refine(
      (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
      {
        message: "Téléphone non valide",
      }
    ),
  radius: z.number(),
  headquartersCity: headquartersCity
    .required()
    .refine((data) => data.name !== "", { message: "Entrez une adresse" }),
  mainActivityCity: locationSchema
    .required()
    .refine((data) => data.name !== "", { message: "Entrez une ville" }),
  secondaryActivityCities: z.array(locationSchema),
  services: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .nonempty({
      message: "Au moins 1 service est requis",
    }),
  favicon: z
    .instanceof(File, {
      message: "Le fichier doit être une image valide",
    })
    .optional(),
});

type FormSchemaArrayKeys = "secondaryActivityCities";
type FormSchemaObjectKeys = "headquartersCity";
export type AllFormSchemaKeys = keyof z.infer<typeof formSchema>;

export type FormSchemaKeys =
  | FormSchemaArrayKeys
  | FormSchemaObjectKeys
  | z.infer<typeof formSchema>;
