"use client";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { ServiceData, data } from "../../data";
import { useState } from "react";

const Banner = ({
  siteData,
  phoneNumberParsed,
  siteContent,
  dynamicStyle,
}: {
  siteData: SitesWithoutUsers;
  phoneNumberParsed: string | undefined;
  siteContent: ServiceData;
  dynamicStyle: DynamicStyle;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { bannerH1, bannerImgSrc } = siteContent;

  return (
    <section id="home-section" className="bg-lightpink">
      <div className="mx-auto max-w-7xl pt-20 sm:pb-24 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 space-x-1">
          <div className="col-span-6 flex flex-col justify-center order-last lg:order-first">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h1 className="text-4xl lg:text-7xl font-semibold mb-5 text-lightgrey md:4px lg:text-start text-center">
                {bannerH1}
              </h1>
            </Fade>
            <Fade
              direction={"up"}
              delay={400}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h2 className="text-grey lg:text-lg font-normal mb-10 lg:text-start text-center">
                {siteData.description}
              </h2>
            </Fade>
            <Fade
              direction={"up"}
              delay={500}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <div className="md:flex align-middle justify-center lg:justify-start">
                <button
                  className="flex items-center border w-full md:w-auto mt-5 md:mt-0 justify-center rounded-full text-xl font-medium py-5 px-10 text-white hover:bg-white space-x-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={
                    !isHovered
                      ? dynamicStyle.gradientStyle
                      : dynamicStyle.linkStyle
                  }
                >
                  <a href={`tel:${phoneNumberParsed}`}>{phoneNumberParsed}</a>
                </button>
              </div>
            </Fade>
          </div>
          <div className="col-span-6 flex justify-center relative order-first lg:order-last">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <Image
                id="img-car-1"
                src={bannerImgSrc}
                alt="car image"
                title="car image"
                className="w-full h-auto"
                width={1600}
                height={1300}
              />
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
