"use client";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { ServiceData, data } from "../../data";

const Services = ({
  siteContent,
  dynamicStyle,
}: {
  siteContent: ServiceData;
  dynamicStyle: DynamicStyle;
}) => {
  const {
    firstServicesH2,
    firstServicesH3,
    firstServicesText,
    firstServicesImgSrc,
    secondServicesH2,
    secondServicesH3,
    secondServicesText,
    secondServicesImgSrc,
  } = siteContent;
  return (
    <section className="relative" id="services">
      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-10">
          <div className="col-span-6 flex justify-start">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <Image
                src={firstServicesImgSrc}
                alt="car image"
                title="car image"
                width={636}
                height={808}
              />
            </Fade>
          </div>

          <div className="col-span-6 flex flex-col justify-center">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h2
                className="text-lg font-normal mb-3 ls-51 uppercase text-start"
                style={dynamicStyle.linkStyle}
              >
                {firstServicesH2}
              </h2>
            </Fade>
            <Fade
              direction={"up"}
              delay={400}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
                {firstServicesH3}
              </h3>
            </Fade>
            <Fade
              direction={"up"}
              delay={500}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
                {firstServicesText}
              </p>
            </Fade>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-4">
          <div className="col-span-6 flex flex-col justify-center">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h2
                className="text-lightgrey text-lg font-normal mb-3 ls-51 uppercase text-start"
                style={dynamicStyle.linkStyle}
              >
                {secondServicesH2}
              </h2>
            </Fade>
            <Fade
              direction={"up"}
              delay={400}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
                {secondServicesH3}
              </h3>
            </Fade>
            <Fade
              direction={"up"}
              delay={500}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
                {secondServicesText}
              </p>
            </Fade>
          </div>

          <div className="col-span-6 flex justify-start">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <Image
                src={secondServicesImgSrc}
                alt="car image"
                title="car image"
                width={636}
                height={808}
              />
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
