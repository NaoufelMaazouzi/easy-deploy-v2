"use client";

import Link from "next/link";

export default function CreateSiteButton({}) {
  return (
    <Link href={`/createSite`}>
      <button className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800">
        Créer un nouveau site
      </button>
    </Link>
  );
}
