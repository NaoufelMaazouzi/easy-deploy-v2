"use client";

import { useTransition } from "react";
// import { createPost } from "@/lib/actions/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import LoadingDots from "@/components/icons/loading-dots";
import va from "@vercel/analytics";
import { Button } from "./ui/button";
import { createPage } from "@/lib/serverActions/pageActions";

export default function CreatePageButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          const page = await createPage(null, Number(id), null);
          va.track("Created Post");
          router.refresh();
          router.push(`/page/${page.id}`);
        })
      }
      disabled={isPending}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p>Créer une nouvelle page</p>
      )}
    </Button>
  );
}
