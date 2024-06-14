"use client";
// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";
import PageCard from "./page-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default async function Pages({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const [allPages, setAllPages] = useState<any>([]);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: test, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: true });
    setAllPages(test);
  };

  useEffect(() => {
    fetchData();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages" },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();
  }, []);
  // const session = await getSession();
  // if (!session?.user) {
  //   redirect("/login");
  // }
  // const posts = await prisma.post.findMany({
  //   orderBy: {
  //     updatedAt: "desc",
  //   },
  //   include: {
  //     site: true,
  //   },
  //   ...(limit ? { take: limit } : {}),
  // });

  return allPages.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {allPages.map((page: any) => (
        <PageCard key={page.id} data={page} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing page"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any page yet. Create one to get started.
      </p>
    </div>
  );
}
