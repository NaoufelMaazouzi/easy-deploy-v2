import { notFound } from "next/navigation";
import CtaBanner from "./components/ctaBanner";
import Faq from "./components/Faq";
import { parsePhoneNumber } from "libphonenumber-js";
import Banner from "./components/Banner";
import Services from "./components/Services";
import Features from "./components/Features";
import { SiteDataModel, data } from "./data";
import {
  calculateIntermediateColor,
  extractCityName,
  extractColorsFromGradient,
  hexToRgba,
  isObjectWithProperty,
  isValidDomain,
} from "@/lib/utils";
import { getSiteData } from "@/lib/utils/fetchers";

export const revalidate = 5;

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  let siteData;
  if (
    domain !== "images" &&
    !domain.endsWith(".png") &&
    isValidDomain(domain)
  ) {
    siteData = await getSiteData(domain);
  }
  if (!siteData) {
    notFound();
  }
  let phoneNumberParsed: string | undefined;
  if (siteData.contactPhone) {
    phoneNumberParsed =
      parsePhoneNumber(siteData.contactPhone)?.formatNational() ||
      siteData.contactPhone;
  }

  if (!siteData) {
    notFound();
  }

  const siteContent = data({
    phoneNumberParsed,
    model: (siteData.model || "plombier") as SiteDataModel,
    city: isObjectWithProperty(siteData.mainActivityCity, "name")
      ? extractCityName(siteData.mainActivityCity.name)
      : "",
    corporateName: siteData.corporateName,
  });

  let dynamicStyle: DynamicStyle = {
    gradientStyle: {
      backgroundColor: "",
    },
    linkStyle: {
      color: "",
    },
    backgroundColor: {
      backgroundColor: "",
    },
  };
  if (siteData.siteColor && siteData.siteColor.startsWith("linear-gradient")) {
    const extractedColors = extractColorsFromGradient(siteData.siteColor);
    const intermediateColor = calculateIntermediateColor(
      extractedColors[0],
      extractedColors[1],
      0.5
    );
    dynamicStyle = {
      gradientStyle: {
        backgroundImage: siteData.siteColor,
      },
      linkStyle: {
        color: intermediateColor,
      },
      backgroundColor: {
        backgroundColor: hexToRgba(intermediateColor, 0.2),
      },
    };
  } else if (siteData.siteColor) {
    dynamicStyle = {
      gradientStyle: {
        backgroundColor: siteData.siteColor,
      },
      linkStyle: {
        color: siteData.siteColor,
      },
      backgroundColor: {
        backgroundColor: hexToRgba(siteData.siteColor, 0.2),
      },
    };
  }

  return (
    <main>
      <Banner
        phoneNumberParsed={phoneNumberParsed}
        siteData={siteData}
        siteContent={siteContent}
        dynamicStyle={dynamicStyle}
      />
      <Features
        phoneNumberParsed={phoneNumberParsed}
        siteContent={siteContent}
        dynamicStyle={dynamicStyle}
      />
      <Services siteContent={siteContent} dynamicStyle={dynamicStyle} />
      <CtaBanner
        phoneNumberParsed={phoneNumberParsed}
        siteContent={siteContent}
        dynamicStyle={dynamicStyle}
      />
      <Faq siteContent={siteContent} />
    </main>
  );
}
