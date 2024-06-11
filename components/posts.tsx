// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";
import PostCard from "./post-card";
import Image from "next/image";

export default async function Posts({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
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

  return (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any posts yet. Create one to get started.
      </p>
    </div>
  );
}
