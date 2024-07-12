import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { XMarkIcon } from "@heroicons/react/20/solid";
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
import { Button } from "./ui/button";
import { deletePage } from "@/lib/serverActions/pageActions";
import { toast } from "sonner";

export default function PageCard({ data }: { data: PagesWithSitesValues }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  const handleDeletePage = async () => {
    const { status, text }: { status: "success" | "error"; text: string } =
      await deletePage(Number(data.id));
    toast[status](text);
  };

  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <div className="relative h-44 overflow-hidden">
        {!data.contentGenerated ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderWithText />
          </div>
        ) : (
          <Credenza>
            <Link
              href={`/page/${data.id}`}
              className="flex flex-col overflow-hidden rounded-lg"
            >
              <BlurImage
                alt={data.title ?? "Card thumbnail"}
                title={data.title ?? "Card thumbnail"}
                width={500}
                height={400}
                className="h-full object-cover"
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
                Êtes-vous sûr de vouloir supprimer cette page ?
              </CredenzaBody>
              <CredenzaFooter>
                <CredenzaClose asChild>
                  <Button>Non</Button>
                </CredenzaClose>
                <CredenzaClose asChild>
                  <Button onClick={handleDeletePage}>Oui</Button>
                </CredenzaClose>
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>
        )}
        {!data.published && (
          <span className="absolute bottom-2 right-2 rounded-md border border-stone-200 bg-white px-3 py-0.5 text-sm font-medium text-stone-600 shadow-md">
            Brouillon
          </span>
        )}
      </div>

      <Link
        href={`/page/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-stone-500 dark:text-stone-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000/${data.slug}`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );

  function LoaderWithText() {
    return (
      <div className="flex flex-col items-center text-center">
        <ClipLoader
          color={"#3498db"}
          loading={!data.contentGenerated}
          size={30}
        />
        <p className="text-sm text-white mt-2">En cours de génération</p>
      </div>
    );
  }
}
