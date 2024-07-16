"use client";

import {
  defaultValues,
  formSchema,
} from "@/app/(dashboard)/createSite/siteSchema";
import { getSiteById, updateSite } from "@/lib/serverActions/sitesActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeParseReturnType } from "zod";
import { GradientPicker } from "@/components/colorPicker";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files![0];
  if (file && file.size > MAX_FILE_SIZE) {
    toast.error("La taille du fichier ne doit pas dépasser 1 Mo.");
    return { files: "", displayUrl: "" };
  }
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;

  const displayUrl = URL.createObjectURL(file);
  return { files, displayUrl };
}

export default function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loadingUpdateSite, setLoadingUpdateSite] = useState(false);
  const [preview, setPreview] = useState("");
  const [background, setBackground] = useState("");
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
        setBackground(data.siteColor);
        setPreview(
          `https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/public/images/${data.favicon}`
        );

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
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "favicon") {
          formData.append(key, value as File);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });
      const data: any = {};
      formData.forEach((value, key) => {
        if (key === "favicon") {
          data[key] = value;
        } else {
          data[key] = JSON.parse(value as string);
        }
      });
      const parsed: SafeParseReturnType<
        z.infer<typeof formSchema>,
        z.infer<typeof formSchema>
      > = formSchema.safeParse(data);
      if (!parsed.success) {
        setLoadingUpdateSite(false);
        return toast.error("Les données entrées ne sont pas correctes");
      }

      const { status, text }: { status: "success" | "error"; text: string } =
        await updateSite(Number(params.id), formData);
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

            <Avatar className="w-24 h-24">
              <AvatarImage src={preview} />
              <AvatarFallback>FAVICON</AvatarFallback>
            </Avatar>
            <FormField
              control={control}
              {...register("favicon")}
              render={({ field: { onChange, value, ...rest } }) => (
                <>
                  <FormItem>
                    <FormLabel>
                      L'icône de votre site (de taille 16x16 ou 32x32)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...rest}
                        onChange={(event) => {
                          const { files, displayUrl } = getImageData(event);
                          setPreview(displayUrl);
                          onChange(files[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={control}
              {...register("siteColor")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>
                      Couleur principale de votre site (sera utilisée pour les
                      boutons, les liens etc)
                    </FormLabel>
                    <FormControl>
                      <div
                        className="w-full h-full preview flex min-h-[150px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
                        style={{ background }}
                      >
                        <GradientPicker
                          background={background}
                          setBackground={(background) => {
                            setValue("siteColor", background);
                            return setBackground(background);
                          }}
                          withImages={false}
                        />
                      </div>
                    </FormControl>
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
