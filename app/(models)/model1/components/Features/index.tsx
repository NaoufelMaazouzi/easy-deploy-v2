"use client";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Fade } from "react-awesome-reveal";
import { ServiceData, data } from "../../data";

const Work = ({
  phoneNumberParsed,
  siteContent,
}: {
  phoneNumberParsed: string | undefined;
  siteContent: ServiceData;
}) => {
  const { featuresTitle, featuresData } = siteContent;
  return (
    <section>
      <div className="mx-auto max-w-7xl py-40 px-6" id="avantages">
        <div className="text-center mb-14">
          <Fade
            direction={"up"}
            delay={200}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <p className="text-pink text-lg font-normal mb-3 ls-51 uppercase">
              Nos avantages
            </p>
          </Fade>
          <Fade
            direction={"up"}
            delay={400}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <p className="text-3xl lg:text-5xl font-semibold text-lightgrey">
              {featuresTitle}
            </p>
          </Fade>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5 mt-32">
          <Fade
            direction={"up"}
            delay={500}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            {featuresData.map((items, i) => (
              <div className="card-b p-8 relative rounded-3xl" key={i}>
                <div className="work-img-bg rounded-full flex justify-center absolute top-[-16%] sm:top-[-17%] md:top-[-18%] lg:top-[-15%] lg:left-[33%] md:left-[39%] sm:left-[34%] left-[37%]">
                  <Image
                    src={items.imgSrc}
                    alt={items.imgSrc}
                    title={items.imgSrc}
                    width={100}
                    height={10}
                  />
                </div>
                <h3 className="text-lightgrey text-2xl text-black font-semibold text-center mt-16">
                  {items.heading}
                </h3>
                <p className="text-lg font-normal text-black text-center text-opacity-50 mt-2">
                  {items.subheading}
                </p>
                <div className="flex items-center justify-center">
                  <a href={`tel:${phoneNumberParsed}`}>
                    <p className="text-center text-lg font-medium text-pink mt-2 hover-underline">
                      {items.link}
                      <ChevronRightIcon width={20} height={20} />
                    </p>
                  </a>
                </div>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default Work;
