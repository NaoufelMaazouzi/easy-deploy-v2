"use client";

import { useEffect, useState } from "react";
import {
  createSite,
  fetchCitiesInRadius,
  generateServices,
} from "@/lib/serverActions/sitesActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DomainConfiguration from "@/components/form/domain-configuration";
import { SearchBar } from "@/components/SearchBar/index";
import Tag from "@/components/tags.";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues, formSchema } from "./siteSchema";
import { z } from "@/lib/utils/fr-zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PhoneInput } from "@/components/phone-input";
import { CreateSiteResult } from "@/lib/utils/types";
import { showAlert } from "@/lib/utils";

export default function CreateSitePage() {
  const router = useRouter();
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCreateSite, setLoadingCreateSite] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [inputServices, setInputServices] = useState({ name: "" });
  const [selectedServices, setSelectedServices] = useState([{ name: "" }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { watch, handleSubmit, control, setValue, register } = form;
  const {
    fields: secondaryActivityCities,
    append: appendSecondaryActivityCities,
    remove: removeSecondaryActivityCities,
    replace: replaceSecondaryActivityCities,
  } = useFieldArray({
    control,
    name: "secondaryActivityCities",
  });

  const {
    fields: services,
    append: appendServices,
    remove: removeServices,
  } = useFieldArray({
    control,
    name: "services",
  });

  const handleAppendInArray = (
    arr: any[],
    func: Function,
    obj: any,
    key: string
  ) => {
    if (!arr.some((x) => x[key] === obj[key])) {
      return func(obj);
    } else {
      return toast.error("Cette ville est déjà présente");
    }
  };

  const mainActivityCity = watch("mainActivityCity");
  const customDomain = watch("customDomain");
  const radius = watch("radius");
  const name = watch("name");
  const contactPhone = watch("contactPhone");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingCreateSite(true);
    if (!formSchema.safeParse(values).success) {
      setLoadingCreateSite(false);
      return toast.error("Les données entrées ne sont pas correctes");
    }
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, JSON.stringify(value));
    }
    const { status, text, siteId }: CreateSiteResult = await createSite(values);
    showAlert(
      status,
      text,
      siteId ? () => router.push(`/site/${siteId}`) : null
    );
    setLoadingCreateSite(false);
  }

  useEffect(() => {
    setValue(
      "subdomain",
      name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-")
    );
  }, [name, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCities(true);
      const cities = await fetchCitiesInRadius(
        mainActivityCity.lat,
        mainActivityCity.lng,
        radius
      );
      replaceSecondaryActivityCities(
        cities.filter(
          (newCity: Location) => mainActivityCity.uniqueId !== newCity.uniqueId
        )
      );
      setLoadingCities(false);
    };
    if (radius !== 0 && mainActivityCity.uniqueId) {
      fetchData().catch((error) => {
        console.error(error);
        setLoadingCities(false);
      });
    } else {
      replaceSecondaryActivityCities([]);
    }
  }, [radius, mainActivityCity, replaceSecondaryActivityCities]);

  const removeTag = (
    index: number,
    property: string,
    value: string,
    removeFunc: Function
  ) => {
    removeFunc(index);
    if (property === "services") {
      const filteredServices = selectedServices.filter((e) => e.name !== value);
      setSelectedServices(filteredServices);
    }
  };

  const checkServicesInput = () => {
    if (!inputServices.name) {
      return toast.error("Veuillez entrer un service");
    } else if (!services.some((e) => e.name === inputServices.name)) {
      appendServices(inputServices);
      return setInputServices({ name: "" });
    }
    return toast.error("Service déjà présent");
  };

  const generateByIA = async () => {
    if (!services.length) {
      return toast.error("Veuillez ajouter un service d'abord");
    } else if (!selectedServices.some((e) => e.name !== "")) {
      return toast.error(
        "Veuillez d'abord séléctionner des services en cliquant dessus"
      );
    }
    try {
      setLoadingAI(true);
      const filteredServices = selectedServices
        .filter((service) => service.name.trim() !== "")
        .map((service) => service.name)
        .join(", ");
      const result = await generateServices(filteredServices);
      setLoadingAI(false);
      result?.forEach((e) => appendServices(e));
    } catch (error) {
      setLoadingAI(false);
      return toast.error((error as Error).message);
    }
  };

  const selectTag = (value: Services) => {
    if (selectedServices.some((e) => e.name === value.name)) {
      return setSelectedServices(
        selectedServices.filter((e) => e.name !== value.name)
      );
    } else {
      return setSelectedServices([...selectedServices, value]);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="font-cal text-3xl font-bold dark:text-white">
        Créer votre site web
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-7xl">
          <div className="relative flex flex-col space-y-4 p-5 md:p-10">
            <FormField
              control={control}
              {...register("name")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Nom de votre site</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon site web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("subdomain")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Sous-domaine</FormLabel>
                    <div className="flex w-full max-w-md">
                      <FormControl>
                        <Input
                          placeholder="Mon-sous-domaine"
                          {...field}
                          autoCapitalize="off"
                          pattern="[a-zA-Z0-9\-]+"
                        />
                      </FormControl>
                      <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                        .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                      </div>
                      <FormMessage />
                    </div>
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
                      <div className="flex w-full max-w-md">
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

            <FormField
              control={control}
              {...register("description")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de mon site"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Unirenov'" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Micro-entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("headquartersCity")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Adresse du siège social</FormLabel>
                    <SearchBar
                      nameOfProperty="headquartersCity"
                      placeHolder="Recherche d'une adresse"
                      setValue={setValue}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("mainActivityCity")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Votre ville principale d'activité</FormLabel>
                    <SearchBar
                      nameOfProperty="mainActivityCity"
                      placeHolder="Recherche d'une ville"
                      setValue={setValue}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              {...register("radius")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>
                      Vos villes secondaires d'activité (rayon autour de votre
                      ville principale d'activité)
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue="0"
                    >
                      <FormControl>
                        <SelectTrigger className="relative w-full">
                          <SelectValue placeholder="Choisissez un rayon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rayon</SelectLabel>
                          <SelectItem value="0">Non</SelectItem>
                          <SelectItem value="5">5km</SelectItem>
                          <SelectItem value="10">10km</SelectItem>
                          <SelectItem value="15">15km</SelectItem>
                          <SelectItem value="20">20km</SelectItem>
                          <SelectItem value="25">25km</SelectItem>
                          <SelectItem value="30">30km</SelectItem>
                          <SelectItem value="35">35km</SelectItem>
                          <SelectItem value="40">40km</SelectItem>
                          <SelectItem value="45">45km</SelectItem>
                          <SelectItem value="50">50km</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("secondaryActivityCities")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>
                      Ajouter manuellement une ville d'activité secondaire
                    </FormLabel>
                    <SearchBar
                      nameOfProperty="secondaryActivityCities"
                      placeHolder="Recherche d'une ville"
                      setValue={(e: any) =>
                        handleAppendInArray(
                          secondaryActivityCities,
                          appendSecondaryActivityCities,
                          e,
                          "uniqueId"
                        )
                      }
                      removeValue={removeSecondaryActivityCities}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            {loadingCities ? (
              <div className="flex items-center justify-center">
                <ClipLoader
                  color={"#3498db"}
                  loading={loadingCities}
                  size={30}
                />
              </div>
            ) : (
              secondaryActivityCities.length > 0 && (
                <div className="container mx-auto p-4">
                  <div className="flex flex-wrap gap-2">
                    {secondaryActivityCities.map((city, index) => (
                      <Tag
                        key={city.uniqueId}
                        text={city.name}
                        onRemove={() =>
                          removeTag(
                            index,
                            "secondaryActivityCities",
                            city.name,
                            removeSecondaryActivityCities
                          )
                        }
                        isSelected={false}
                      />
                    ))}
                  </div>
                </div>
              )
            )}

            <FormField
              control={control}
              {...register("services")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Vos services</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        value={inputServices.name}
                        placeholder="Peinture"
                        onChange={(e) =>
                          setInputServices({
                            name: e.target.value.toLowerCase(),
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => checkServicesInput()}
                      >
                        Ajouter
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => generateByIA()}
                              disabled={loadingAI}
                            >
                              <Bot className="mr-2.5 h-4 w-4" />
                              {loadingAI && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {loadingAI ? "Génération..." : "Générer"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add to library</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormMessage />
                    <div className="flex flex-wrap space-x-2">
                      {services.map((value, index) => (
                        <Tag
                          key={index}
                          text={value.name}
                          onRemove={() =>
                            removeTag(
                              index,
                              "serices",
                              value.name,
                              removeServices
                            )
                          }
                          onSelected={() => selectTag(value)}
                          isSelected={selectedServices.some(
                            (e) => e.name === value.name
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={control}
              {...register("contactPhone")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Votre téléphone de contact</FormLabel>
                    <PhoneInput international defaultCountry="FR" {...field} />
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
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={loadingCreateSite}>
            {loadingCreateSite && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loadingCreateSite ? "Création..." : "Créer"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
