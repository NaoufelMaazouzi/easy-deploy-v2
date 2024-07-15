import React from "react";
import Link from "next/link";
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

const Data = ({
  phoneNumberParsed,
}: {
  phoneNumberParsed: string | undefined;
}) => {
  const { slug } = useParams() as { slug?: string };

  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={slug ? `/${item.href}` : item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-purple"
                    : "text-black hover:bg-gray-700 hover:text-purple",
                  "block  py-2 rounded-md text-base font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4"></div>
            <button className="gradient-45 flex mx-auto border w-full md:w-auto justify-center rounded-full text-xl font-medium items-center py-5 px-10 text-white bg-pink hover:text-pink hover:bg-white">
              <a href={`tel:${phoneNumberParsed}`}>{phoneNumberParsed}</a>
            </button>

            {/* <Contactusform /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
