"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function CreateSiteButton({}) {
  return (
    <Link href={`/createSite`}>
      <Button>Créer un nouveau site</Button>
    </Link>
  );
}
