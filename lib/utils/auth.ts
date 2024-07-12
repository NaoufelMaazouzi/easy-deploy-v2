import {
  AllFormSchemaKeys,
  formSchema,
} from "@/app/(dashboard)/createSite/siteSchema";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import z from "zod";

export function withSiteAuth(action: any) {
  return async (
    siteId: number,
    data?: z.infer<typeof formSchema> | FormData,
    key?: AllFormSchemaKeys | null,
    successText?: string | null
  ) => {
    const supabase = createSupabaseServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: site, error } = await supabase
      .from("sites_with_users")
      .select("*")
      .eq("id", siteId)
      .single();
    if (!user || site.user_id !== user?.id) {
      return {
        status: "error",
        title: "Erreur",
        text: "Utilisateur non authentifié",
      };
    }

    if (!site || error) {
      return {
        status: "error",
        title: "Erreur",
        text: "Non authorisé",
      };
    }

    return action(site, data, key, successText);
  };
}

export function withPageAuth(action: any) {
  return async (
    pageId: number | null,
    formData?: z.infer<typeof formSchema> | FormData,
    key?: AllFormSchemaKeys | null,
    successText?: string | null
  ) => {
    const supabase = createSupabaseServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: page, error } = await supabase
      .from("pages_with_sites_values")
      .select("*")
      .eq("id", pageId)
      .single();
    if (!user || page.user_id !== user?.id) {
      return {
        status: "error",
        title: "Erreur",
        text: "Utilisateur non authentifié",
      };
    }

    if (!page || error) {
      return {
        status: "error",
        title: "Erreur",
        text: "Pas introuvable",
      };
    }

    return action(page, formData, key, successText);
  };
}
