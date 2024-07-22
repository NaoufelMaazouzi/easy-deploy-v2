import { ReactNode } from "react";
import { getSiteData } from "@/lib/utils/fetchers";
import { Metadata } from "next";
import { isValidDomain } from "@/lib/utils";
import dynamic from "next/dynamic";

export const revalidate = 5;

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
  const { name, description, customDomain, favicon } = data as Sites;

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
        `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/sign/images/vtc.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdnRjLndlYnAiLCJpYXQiOjE3MTg4MTAyOTAsImV4cCI6NDg0MDg3NDI5MH0.Yf1zhryWeIB5Xl-DpyCKGyBNsiVTqyBsi0F8InTX3rA&t=2024-06-19T15%3A18%3A10.214Z`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name || undefined,
      description,
      images: [
        `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/sign/images/vtc.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdnRjLndlYnAiLCJpYXQiOjE3MTg4MTAyOTAsImV4cCI6NDg0MDg3NDI5MH0.Yf1zhryWeIB5Xl-DpyCKGyBNsiVTqyBsi0F8InTX3rA&t=2024-06-19T15%3A18%3A10.214Z`,
      ],
      creator: "@vercel",
    },
    icons: [
      `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/images/${favicon}`,
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
  const LayoutComponent = dynamic(() => import("../(models)/model1/layout"));

  return <LayoutComponent children={children} params={params} />;
}
