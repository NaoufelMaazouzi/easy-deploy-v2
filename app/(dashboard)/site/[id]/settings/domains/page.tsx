"use client";

import {
  defaultValues,
  formSchema,
} from "@/app/(dashboard)/createSite/siteSchema";
import { getSiteById, updateSite } from "@/lib/serverActions/sitesActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "@/lib/utils/fr-zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UpdateSiteModal from "@/components/modal/update-site";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import DomainConfiguration from "@/components/form/domain-configuration";

export default function SiteSettingsDomains({
  params,
}: {
  params: { id: string };
}) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loadingUpdateSite, setLoadingUpdateSite] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { watch, handleSubmit, control, setValue, register } = form;
  const customDomain = watch("customDomain");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSiteById(params.id);
        setSiteData(data);

        if (data) {
          for (const [key, value] of Object.entries(data)) {
            setValue(
              key as keyof z.infer<typeof formSchema>,
              value as FormSchema
            );
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    };

    fetchData();
  }, [params.id, setValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoadingUpdateSite(true);
      if (!formSchema.safeParse(values).success) {
        setLoadingUpdateSite(false);
        return toast.error("Les données entrées ne sont pas correctes");
      }
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, JSON.stringify(value));
      }
      const { status, text }: { status: "success" | "error"; text: string } =
        await updateSite(Number(params.id), values);
      toast[status](text);
    } catch (error) {
      toast.error("Impossible de mettre à jour le site");
    }
    setLoadingUpdateSite(false);
  }

  if (!siteData) {
    return (
      <div className="flex flex-col space-y-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-7xl">
          <div className="flex flex-col space-y-6 mb-6">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
              Domaine et sous-domaine
            </h1>

            <FormField
              control={control}
              {...register("subdomain")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Sous-domaine</FormLabel>
                    <div className="flex w-full">
                      <FormControl>
                        <Input
                          placeholder="Mon-sous-domaine"
                          {...field}
                          autoCapitalize="off"
                          pattern="[a-zA-Z0-9\-]+"
                        />
                      </FormControl>
                      <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                        {customDomain
                          ? customDomain
                          : `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("customDomain")}
              render={({ field }) => (
                <>
                  <div className="flex flex-col space-y-2">
                    <FormItem>
                      <FormLabel>Domaine personnalisé</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="domainePerso.com"
                            {...field}
                            autoCapitalize="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  </div>
                  {customDomain && (
                    <DomainConfiguration domain={customDomain} />
                  )}
                </>
              )}
            />
          </div>

          <UpdateSiteModal
            onclickFunc={handleSubmit(onSubmit)}
            headerTitle="Attention"
            bodyText={"Êtes-vous sûr de vos modifications ?"}
            loadingState={loadingUpdateSite}
          />
        </form>
      </Form>
    </>
  );
}
