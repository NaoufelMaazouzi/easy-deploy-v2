"use client";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Image from "next/image";
import { parsePhoneNumber } from "libphonenumber-js";
import { useParams } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Accueil", href: "", current: false },
  { name: "Avantages", href: "#avantages", current: false },
  { name: "Services", href: "#services", current: false },
  { name: "Faq", href: "#faq", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({
  siteData,
  dynamicStyle,
}: {
  siteData: SitesWithoutUsers;
  dynamicStyle: DynamicStyle;
}) => {
  const { slug } = useParams() as { slug?: string };
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let phoneNumberParsed: string | undefined;
  if (siteData.contactPhone) {
    phoneNumberParsed = parsePhoneNumber(
      siteData.contactPhone
    )?.formatNational();
  }

  return (
    <Disclosure as="nav" className="navbar">
      <>
        <div className="mx-auto max-w-7xl p-3 md:p-6 lg:px-8">
          <div className="relative flex h-12 sm:h-20 items-center">
            <div className="flex flex-1 items-center sm:justify-between">
              <div className="flex sm:hidden flex-shrink-0 items-center border-right">
                <Image
                  src="/images/Logo/logo-taxi.svg"
                  alt="logo"
                  title="logo"
                  width={36}
                  height={36}
                />
                <Link
                  href="/"
                  className="text-2xl font-semibold text-black ml-4"
                >
                  {siteData.corporateName}
                </Link>
              </div>
              <div className="hidden sm:flex flex-shrink-0 items-center border-right">
                <Image
                  src="/images/Logo/logo-taxi.svg"
                  alt="logo"
                  title="logo"
                  width={56}
                  height={56}
                />
                <Link
                  href="/"
                  className="text-2xl font-semibold text-black ml-4"
                >
                  {siteData.corporateName}
                </Link>
              </div>
              <div className="hidden lg:flex items-center border-right ">
                <div className="flex justify-end space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={slug ? `/${item.href}` : item.href}
                      className={classNames(
                        item.current
                          ? "bg-black"
                          : "navlinks hover:opacity-100",
                        "px-3 py-4 rounded-md text-lg font-normal opacity-50 hover:text-black space-links"
                      )}
                      aria-current={item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="gap-6 hidden lg:flex">
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center border w-full md:w-auto mt-5 md:mt-0 justify-center rounded-full text-xl font-medium py-5 px-10 text-white hover:text-pink hover:bg-white space-x-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={
                      !isHovered
                        ? dynamicStyle.gradientStyle
                        : dynamicStyle.linkStyle
                    }
                  >
                    <a
                      href={`tel:${phoneNumberParsed}`}
                      className="flex items-center"
                    >
                      {phoneNumberParsed || siteData.contactPhone}
                    </a>
                  </button>
                </div>
              </div>
            </div>
            <div className="block lg:hidden">
              <Bars3Icon
                className="block h-6 w-6"
                aria-hidden="true"
                onClick={() => setIsOpen(true)}
              />
            </div>
            <Drawer isOpen={isOpen} setIsOpen={setIsOpen} siteData={siteData}>
              <Drawerdata phoneNumberParsed={phoneNumberParsed} />
            </Drawer>
          </div>
        </div>
      </>
    </Disclosure>
  );
};

export default Navbar;
