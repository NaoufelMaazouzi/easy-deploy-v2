import { notFound } from "next/navigation";
import CtaBanner from "./components/ctaBanner";
import Faq from "./components/Faq";
import { parsePhoneNumber } from "libphonenumber-js";
import Banner from "./components/Banner";
import Services from "./components/Services";
import Features from "./components/Features";
import { SiteDataModel, data } from "./data";

export const revalidate = 5;

export default async function SiteHomePage({
  siteData,
}: {
  siteData: SitesWithoutUsers;
}) {
  if (!siteData) {
    notFound();
  }
  let phoneNumberParsed: string | undefined;
  if (siteData.contactPhone) {
    phoneNumberParsed =
      parsePhoneNumber(siteData.contactPhone)?.formatNational() ||
      siteData.contactPhone;
  }
  const siteContent = data({
    phoneNumberParsed,
    model: (siteData.model || "plombier") as SiteDataModel,
  });

  return (
    <main>
      <Banner
        phoneNumberParsed={phoneNumberParsed}
        siteData={siteData}
        siteContent={siteContent}
      />
      <Features
        phoneNumberParsed={phoneNumberParsed}
        siteContent={siteContent}
      />
      <Services siteContent={siteContent} />
      <CtaBanner
        phoneNumberParsed={phoneNumberParsed}
        siteContent={siteContent}
      />
      <Faq siteContent={siteContent} />
    </main>
  );
}
