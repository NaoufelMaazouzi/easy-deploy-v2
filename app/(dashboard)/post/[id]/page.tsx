// import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";

export default async function PostPage({ params }: { params: { id: string } }) {
  // const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }
  // const data = await prisma.post.findUnique({
  //   where: {
  //     id: decodeURIComponent(params.id),
  //   },
  //   include: {
  //     site: {
  //       select: {
  //         subdomain: true,
  //       },
  //     },
  //   },
  // });
  // if (!data || data.userId !== session.user.id) {
  //   notFound();
  // }

  return "ok";
}
