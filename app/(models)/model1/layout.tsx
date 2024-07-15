import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./styles/model1.css";
import { notFound } from "next/navigation";
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/Footer";

export const revalidate = 5;

export default async function SiteLayout({
  children,
  siteData,
  allPages,
}: {
  children: ReactNode;
  siteData: SitesWithoutUsers;
  allPages: PagesWithSitesValues[];
}) {
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
