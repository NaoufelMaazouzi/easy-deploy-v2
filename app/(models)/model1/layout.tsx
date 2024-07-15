import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./styles/model1.css";
import { notFound } from "next/navigation";
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/Footer";
import { getSubdomainAndDomain, isValidDomain } from "@/lib/utils";
import { fetchPagesBySubdomain, getSiteData } from "@/lib/utils/fetchers";

export const revalidate = 5;

export default async function SiteLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  let siteData;
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
    siteData = await getSiteData(domain, isCustomDomain);
  }

  if (!siteData) {
    notFound();
  }
  return (
    <>
      <Navbar siteData={siteData} />
      {children}
      <Footer siteData={siteData} allPages={allPages} />
      <GoogleAnalytics gaId="G-XYZ" />
    </>
  );
}
