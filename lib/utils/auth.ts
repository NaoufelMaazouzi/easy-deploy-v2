import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: number,
    key: string | null,
    successText?: string | null
  ) => {
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

    return action(formData, site, key, successText);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    pageId: number | null,
    key: string | null,
    successText: string
  ) => {
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

    return action(formData, page, key, successText);
  };
}
