import { notFound } from "next/navigation";
import {
  fetchPagesBySubdomain,
  getPageData,
  getSiteData,
} from "@/lib/utils/fetchers";
import { isValidDomain } from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";
const MentionsLegales = dynamic(() => import("@/components/MentionsLegales"));

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
      type: "website",
      url: domain,
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
    alternates: {
      canonical: `https://${customDomain ? customDomain : domain}`,
    },
  };
}

export async function generateStaticParams() {
  const allPages = await fetchPagesBySubdomain(
    null,
    null,
    null,
    "subdomain, customDomain, slug"
  );
  const allPaths = allPages
    .map(({ subdomain, customDomain, slug }) => {
      return {
        domain: customDomain
          ? `${subdomain ? `${subdomain}.${customDomain}` : customDomain}`
          : `${subdomain ? `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      };
    })
    .filter(Boolean);
  console.log("BBBBBBBBBB", allPages);
  return allPaths;
}

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const isCustomDomain =
    !domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true";
  if (
    slug &&
    slug === "mentions-légales" &&
    domain !== "images" &&
    !domain.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    const siteData = await getSiteData(domain, isCustomDomain);
    return <MentionsLegales domain={domain} siteData={siteData} />;
  }
  const pageData = await getPageData(domain, slug);

  if (!pageData) {
    notFound();
  }

  const { h1, firstContent, secondContent } = pageData;

  return (
    <section className="relative text-center" id="page-service-section">
      <h1 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-center mt-20">
        Découvrez notre service de {h1}
      </h1>
      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-10">
          <div className="col-span-6 flex justify-start md:justify-center">
            <Image
              src="/images/pages/image1.jpg"
              alt="car image"
              title="car image"
              width={436}
              height={808}
            />
          </div>

          <div className="col-span-6 flex flex-col justify-center">
            <h2 className="text-pink text-lg font-normal mb-3 ls-51 uppercase text-start">
              Un service personnalisé
            </h2>
            <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
              Faites appel à nous
            </h3>
            <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
              {firstContent}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-4">
          <div className="col-span-6 flex flex-col justify-center">
            <h2 className="text-lightgrey text-pink text-lg font-normal mb-3 ls-51 uppercase text-start">
              Un service haut de gamme
            </h2>
            <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
              Satisfaction totale
            </h3>
            <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
              {secondContent}
            </p>
          </div>
          <div className="col-span-6 flex justify-start md:justify-center">
            <Image
              src="/images/pages/image2.jpg"
              alt="car image"
              title="car image"
              width={436}
              height={808}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
