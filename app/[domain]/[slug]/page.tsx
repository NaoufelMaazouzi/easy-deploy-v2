import { notFound } from "next/navigation";
import { fetchPagesBySubdomain, getPageData } from "@/lib/utils/fetchers";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const pageData = await getPageData(domain, slug);
  if (!pageData) {
    return null;
  }

  const { title, description, customDomain } = pageData;

  return {
    title,
    description,
    openGraph: {
      title,
      locale: "fr_FR",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vtc_dreux",
    },
    // Optional: Set canonical URL to custom domain if it exists
    ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      customDomain && {
        alternates: {
          canonical: `https://${customDomain}/${params.slug}`,
        },
      }),
  };
}

export async function generateStaticParams() {
  const allPages = await fetchPagesBySubdomain();
  const allPaths = allPages
    .map(({ subdomain, slug }) => {
      return {
        domain: subdomain,
        slug,
      };
    })
    .filter(Boolean);
  return allPaths;
}

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const pageData = await getPageData(domain, slug);

  if (!pageData) {
    notFound();
  }

  const { h1, title, description, customDomain, content } = pageData;

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {h1}
          </h1>
          <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
            {content}
          </p>
        </div>
        {/* <div className="my-8">
          <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
            {site?.user?.image ? (
              <BlurImage
                alt={site?.user?.name ?? "User Avatar"}
                height={80}
                src={site.user.image}
                width={80}
              />
            ) : (
              <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                ?
              </div>
            )}
          </div>
          <div className="text-md ml-3 inline-block align-middle dark:text-white md:text-lg">
            by <span className="font-semibold">{site?.user?.name}</span>
          </div>
        </div> */}
      </div>
      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
        <BlurImage
          alt={title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          src={"/placeholder.png"}
        />
      </div>

      {/* <MDX source={data.mdxSource} /> */}

      {/* {data.adjacentPages.length > 0 && (
        <div className="relative mb-20 mt-10 sm:mt-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-stone-300 dark:border-stone-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-stone-500 dark:bg-black dark:text-stone-400">
              Continue Reading
            </span>
          </div>
        </div>
      )} */}
      {/* {data.adjacentPages && (
        <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
          {data.adjacentPages.map((data: any, index: number) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )} */}
    </>
  );
}
