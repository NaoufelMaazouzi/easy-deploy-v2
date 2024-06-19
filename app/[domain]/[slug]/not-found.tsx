import { isValidDomain } from "@/lib/utils";
import { getSiteData } from "@/lib/utils/fetchers";
import { headers } from "next/headers";
import Image from "next/image";

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList
    .get("host")
    ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  let data;
  if (
    domain &&
    domain !== "images" &&
    !domain?.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    data = await getSiteData(domain as string);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-cal text-4xl">{data ? `${data.name}: ` : ""}404</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/timed-out-error.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">Cette page n'existe pas !</p>
    </div>
  );
}
