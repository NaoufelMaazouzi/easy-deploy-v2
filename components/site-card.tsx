import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { BarChart } from "lucide-react";
import Link from "next/link";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./ui/credenza";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { deleteSite } from "@/lib/serverActions/sitesActions";
export default function SiteCard({ data }: { data: Sites }) {
  const url = `https://${data.subdomain ? `${data.subdomain}.` : ""}${data.customDomain ? `${data.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

  const handleDeleteSite = async () => {
    const { status, text }: { status: "success" | "error"; text: string } =
      await deleteSite(Number(data.id));
    toast[status](text);
  };

  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Credenza>
        <Link
          href={`/site/${data.id}`}
          className="flex flex-col overflow-hidden rounded-t-lg"
        >
          <BlurImage
            alt={data.name ?? "Card thumbnail"}
            title={data.name ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-44 object-cover"
            src={"/images/placeholder.png"}
            placeholder="blur"
            blurDataURL={placeholderBlurhash}
          />
        </Link>
        <CredenzaTrigger asChild>
          <XMarkIcon className="h-5 w-5 absolute top-2 right-2 cursor-pointer text-black dark:hover:text-red-600" />
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Attention</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            Êtes-vous sûr de vouloir supprimer ce site ?
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button>Non</Button>
            </CredenzaClose>
            <CredenzaClose asChild>
              <Button onClick={handleDeleteSite}>Oui</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
      <Link
        href={`/site/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-stone-500 dark:text-stone-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <Link
          href={url}
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </Link>
        <Link
          href={`/site/${data.id}/analytics`}
          className="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400 dark:hover:bg-green-800 dark:hover:bg-opacity-50"
        >
          <BarChart height={16} />
          <p>{random(10, 40)}%</p>
        </Link>
      </div>
    </div>
  );
}
