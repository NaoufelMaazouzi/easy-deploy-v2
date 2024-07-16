"use client";
import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { ServiceData } from "../../data";

export default function CtaBanner({
  phoneNumberParsed,
  siteContent,
  dynamicStyle,
}: {
  phoneNumberParsed: string | undefined;
  siteContent: ServiceData;
  dynamicStyle: DynamicStyle;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { ctaBannerH3, ctaBannerH4 } = siteContent;
  return (
    <section
      className="w-full py-10 px-6 sm:py-20"
      style={dynamicStyle.backgroundColor}
    >
      <div className="mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8">
        <div className="text-center">
          <Fade
            direction={"up"}
            delay={400}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <h3
              className="text-lg font-normal mb-3 tracking-widest uppercase ls-51"
              style={dynamicStyle.linkStyle}
            >
              {ctaBannerH3}
            </h3>
          </Fade>
          <Fade
            direction={"up"}
            delay={800}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <h4 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black mb-6">
              {ctaBannerH4}
            </h4>
            <button
              className="flex mx-auto border w-full md:w-auto justify-center rounded-full text-xl font-medium py-5 px-10 text-white hover:text-pink hover:bg-white space-x-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={
                !isHovered ? dynamicStyle.gradientStyle : dynamicStyle.linkStyle
              }
            >
              <a href={`tel:${phoneNumberParsed}`}>{phoneNumberParsed}</a>
            </button>
          </Fade>
        </div>
      </div>
    </section>
  );
}
