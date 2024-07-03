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
import { Textarea } from "@/components/ui/textarea";
import UpdateSiteModal from "@/components/modal/update-site";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { SearchBar } from "@/components/SearchBar";

export default function SiteSettingsIndex({
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
  const headquartersCityNumber = watch("headquartersCity.number");

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
        await updateSite(values, Number(params.id));
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
              Informations
            </h1>
            <FormField
              control={control}
              {...register("name")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Nom de votre site</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("description")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Textarea
                          placeholder="Description de mon site"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("corporateName")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Raison sociale</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input placeholder="Unirenov'" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("corporateStatus")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Statut de l'entreprise</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input placeholder="Micro-entreprise" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="flex w-full gap-1">
              <div className="flex-grow-0 basis-1/5">
                <FormField
                  control={control}
                  {...register("headquartersCity.number")}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-2">
                      <FormItem>
                        <FormLabel>Numéro de rue</FormLabel>
                        <FormControl>
                          <Input placeholder="32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>
              <div className="flex-grow basis-4/5">
                <FormField
                  control={control}
                  {...register("headquartersCity.name")}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-2">
                      <FormItem>
                        <FormLabel>Adresse du siège social</FormLabel>
                        <SearchBar
                          nameOfProperty="headquartersCity"
                          placeHolder="Recherche d'une adresse"
                          setValue={(name: any, value: any, options: any) => {
                            setValue(name, value, options);
                            setValue(
                              "headquartersCity.number",
                              headquartersCityNumber
                            );
                          }}
                          defaultValue={siteData.headquartersCity.name}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>
            </div>
            <FormField
              control={control}
              {...register("contactPhone")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Votre téléphone de contact</FormLabel>
                    <div className="flex items-center space-x-2">
                      <PhoneInput
                        className="w-full"
                        international
                        defaultCountry="FR"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("contactMail")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Votre email de contact</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Input {...field} />
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
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
