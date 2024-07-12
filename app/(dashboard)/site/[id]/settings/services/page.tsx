"use client";

import {
  defaultValues,
  formSchema,
} from "@/app/(dashboard)/createSite/siteSchema";
import Tag from "@/components/tags.";
import {
  fetchCitiesInRadius,
  getSiteById,
  updateSite,
} from "@/lib/serverActions/sitesActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "@/lib/utils/fr-zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { generateByIA, handleAppendInArray } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UpdateSiteModal from "@/components/modal/update-site";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Bot, Loader2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClipLoader from "react-spinners/ClipLoader";

export default function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingUpdateSite, setLoadingUpdateSite] = useState(false);
  const [inputServices, setInputServices] = useState({ name: "" });
  const [selectedServices, setSelectedServices] = useState([{ name: "" }]);
  const [loadingAI, setLoadingAI] = useState(false);
  const radiusChanged = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { watch, handleSubmit, control, setValue, register, getValues } = form;
  const mainActivityCity = watch("mainActivityCity");
  const radius = watch("radius");

  const {
    fields: services,
    append: appendServices,
    remove: removeServices,
  } = useFieldArray({
    control,
    name: "services",
  });

  const {
    fields: secondaryActivityCities,
    append: appendSecondaryActivityCities,
    remove: removeSecondaryActivityCities,
    replace: replaceSecondaryActivityCities,
  } = useFieldArray({
    control,
    name: "secondaryActivityCities",
  });

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
    if (
      radius !== 0 &&
      (radius !== siteData.radius || radiusChanged.current) &&
      mainActivityCity.uniqueId
    ) {
      fetchData().catch((error) => {
        console.error(error);
        setLoadingCities(false);
      });
    }
  }, [radius, mainActivityCity, replaceSecondaryActivityCities]);

  const selectTag = (value: Services) => {
    if (selectedServices.some((e) => e.name === value.name)) {
      return setSelectedServices(
        selectedServices.filter((e) => e.name !== value.name)
      );
    } else {
      return setSelectedServices([...selectedServices, value]);
    }
  };

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

  const checkServicesInput = () => {
    if (!inputServices.name) {
      return toast.error("Veuillez entrer un service");
    } else if (!services.some((e) => e.name === inputServices.name)) {
      appendServices(inputServices);
      return setInputServices({ name: "" });
    }
    return toast.error("Service déjà présent");
  };

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
              Services
            </h1>
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
                              onClick={() =>
                                generateByIA(
                                  services,
                                  selectedServices,
                                  appendServices,
                                  setLoadingAI
                                )
                              }
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
                            <p>Générer avec l'intelligence artificielle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            {services.length ? (
              <div className="container mx-auto p-4">
                <div className="flex flex-wrap gap-2">
                  {services.map((value, index) => (
                    <Tag
                      key={index}
                      text={value.name}
                      onRemove={() =>
                        removeTag(index, "services", value.name, removeServices)
                      }
                      onSelected={() => selectTag(value)}
                      isSelected={selectedServices.some(
                        (e) => e.name === value.name
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col space-y-6 mt-12 mb-6">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
              Villes
            </h1>
            <FormField
              control={control}
              {...register("mainActivityCity")}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <FormItem>
                    <FormLabel>Votre ville principale d'activité</FormLabel>
                    <SearchBar
                      nameOfProperty="mainActivityCity"
                      defaultValue={siteData.mainActivityCity.name}
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
                      onValueChange={(value) => {
                        radiusChanged.current = true;
                        field.onChange(parseInt(value));
                      }}
                      defaultValue={siteData.radius.toString()}
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
                          "uniqueId",
                          "Cette ville est déjà présente"
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
                        key={`${city.uniqueId}-${index}`}
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
