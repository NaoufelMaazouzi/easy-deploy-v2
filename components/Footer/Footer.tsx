"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";

interface LinkType {
  id: number;
  text: string;
  href: string;
}

interface socialLinks {
  imgSrc: string;
  link: string;
  width: number;
}

const socialLinks: socialLinks[] = [
  {
    imgSrc: "/images/Footer/facebook.svg",
    link: "https://facebook.com",
    width: 10,
  },
  {
    imgSrc: "/images/Footer/insta.svg",
    link: "https://instagram.com",
    width: 14,
  },
  {
    imgSrc: "/images/Footer/twitter.svg",
    link: "https://twitter.com",
    width: 14,
  },
];

const footerLinks: LinkType[] = [
  { id: 0, text: "Accueil", href: "/" },
  { id: 1, text: "Avantages", href: "#avantages" },
  { id: 2, text: "Services", href: "#services" },
  { id: 3, text: "Faq", href: "#faq" },
];

const Footer = ({
  siteData,
  allPages,
}: {
  siteData: SitesWithoutUsers;
  allPages: PagesWithSitesValues[] | [];
}) => {
  const { slug } = useParams() as { slug?: string };

  return (
    <div className="mx-auto max-w-2xl pt-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="my-12 grid grid-cols-1 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
        <div className="sm:col-span-6 lg:col-span-5">
          <div className="flex flex-shrink-0 items-center justify-center border-b lg:border-none lg:justify-start">
            <Image
              src="/images/Logo/logo-taxi.svg"
              title="logo"
              alt="logo"
              width={56}
              height={56}
            />
            <Link href="/" className="text-2xl font-semibold text-black ml-4">
              {siteData.corporateName}
            </Link>
          </div>
          <h3 className="text-textbl text-xs font-medium mt-5 mb-4 lg:mb-16 text-center lg:text-left">
            Faites appel à nous pour tous vos services !
          </h3>
          <div className="flex gap-4 justify-center lg:justify-start mb-6 lg:mb-0">
            {socialLinks.map((items, i) => (
              <Link href={items.link} key={i}>
                <div className="bg-white h-10 w-10 shadow-xl text-base rounded-full flex items-center justify-center footer-icons hover:bg-pink">
                  <Image
                    src={items.imgSrc}
                    alt={items.imgSrc}
                    title={items.imgSrc}
                    width={items.width}
                    height={2}
                    className="sepiaa"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="sm:col-span-6 lg:col-span-7">
          <p className="text-black text-xl font-semibold mb-9 text-center lg:text-left">
            Nos liens
          </p>
          <ul className="flex flex-nowrap gap-5 justify-center lg:justify-start">
            {footerLinks.map((link) => (
              <li key={link.id} className="mb-5">
                <Link
                  href={slug ? `/${link.href}` : link.href}
                  className="text-footerlinks text-base font-normal mb-6 space-links"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sm:col-span-6 lg:col-span-12">
        <ScrollArea className="h-40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:justify-start sm:text-left justify-center text-center">
            {allPages.map((page, index) => (
              <Link key={index} href={`/${page.slug}`}>
                {page.slug}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="py-10 md:flex items-center justify-center md:justify-between border-t border-t-bordertop">
        <h4 className="text-darkgrey text-sm text-center md:text-start font-normal">
          @2024 - {siteData.corporateName} Tous droits réservés
        </h4>
        <div className="flex gap-5 mt-5 md:mt-0 justify-center md:justify-start">
          <h4 className="text-darkgrey text-sm font-normal">
            <Link href="/mentions-légales" rel="noreferrer">
              Mentions légales
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Footer;
