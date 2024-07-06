import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { fetchPagesBySubdomain, getSiteData } from "@/lib/utils/fetchers";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../../styles/createdSites.css";
import Navbar from "../../components/Navbar/index";
import Footer from "../../components/Footer/Footer";
import { getSubdomainAndDomain, isValidDomain } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  let data;
  if (
    domain !== "images" &&
    !domain.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    data = await getSiteData(domain);
  }
  if (!data) {
    return null;
  }
  const {
    name,
    description,
    customDomain,
    // faviconName,
    // image,
    // logo,
  } = data as Sites;

  return {
    title: name,
    description,
    openGraph: {
      type: "website",
      url: domain,
      title: name || undefined,
      description,
      locale: "fr_FR",
      images: [
        "https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/sign/images/vtc.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdnRjLndlYnAiLCJpYXQiOjE3MTg4MTAyOTAsImV4cCI6NDg0MDg3NDI5MH0.Yf1zhryWeIB5Xl-DpyCKGyBNsiVTqyBsi0F8InTX3rA&t=2024-06-19T15%3A18%3A10.214Z",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name || undefined,
      description,
      images: [
        "https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/sign/images/vtc.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdnRjLndlYnAiLCJpYXQiOjE3MTg4MTAyOTAsImV4cCI6NDg0MDg3NDI5MH0.Yf1zhryWeIB5Xl-DpyCKGyBNsiVTqyBsi0F8InTX3rA&t=2024-06-19T15%3A18%3A10.214Z",
      ],
      creator: "@vercel",
    },
    icons: [
      "https://vuzmqspcbxiughghhmuo.supabase.co/storage/v1/object/sign/images/favicon-32x32.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmF2aWNvbi0zMngzMi5wbmciLCJpYXQiOjE3MTg4MDk5NTYsImV4cCI6NDg0MDg3Mzk1Nn0.SnhYmWXyr1SdBKjmfSsk51BT29VFWW2rX78iviGBwrQ&t=2024-06-19T15%3A12%3A36.708Z",
    ],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    alternates: {
      canonical: `https://${customDomain ? customDomain : domain}`,
    },
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  let data;
  const isCustomDomain =
    !domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true";
  const { domain: newDomain, subdomain: newSubdomain } =
    getSubdomainAndDomain(domain);
  const allPages = await fetchPagesBySubdomain(newSubdomain, newDomain, true);
  if (
    domain !== "images" &&
    !domain.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    data = await getSiteData(domain, isCustomDomain);
  }

  if (!data) {
    notFound();
  }

  return (
    <html lang="fr">
      <body>
        <Navbar siteData={data} />
        {children}
        <Footer siteData={data} allPages={allPages} />
      </body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  );
}
